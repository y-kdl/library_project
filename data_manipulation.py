# data_manipulation.py
from flask import Flask, jsonify, request, session
import pandas as pd
import numpy as np
from flask_cors import CORS
from flask_paginate import Pagination, get_page_args
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
import os
import datetime
import snowflake_manipulation as sfm
from recommendation import recommendation_bp

app = Flask(__name__)
app.register_blueprint(recommendation_bp, url_prefix='/recommendation')  # Register the blueprint with a URL prefix
CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'Content-Type'
app.secret_key = 'une_cle_secrete_tres_secrete'

login_manager = LoginManager()
login_manager.init_app(app)

# La classe utilisateur
class User(UserMixin):
    def __init__(self, id):
        self.id = id

# charger l'utilisateur actuel
@login_manager.user_loader
def load_user(user_id):
    return User(user_id)

# Charger les datasets
books_df = pd.read_csv('data/Books.csv', dtype={'Year-Of-Publication': str}, low_memory=False)
ratings_df = pd.read_csv('data/Ratings.csv')

def add_new_user_to_csv(file_path, user_id, location, age):
    file_path= 'data/Users.csv'
    users_df= pd.read_csv(file_path)
    # Append the new user data
    #new_user = {'User-ID': user_id, 'Location': location, 'Age': age}
    new_user_df = pd.DataFrame({
        'User-ID': [user_id], 
        'Location': [location], 
        'Age': [age]
    })
    updated_users_df = pd.concat([users_df, new_user_df], ignore_index=True)
    #updated_users_df = users_df.append(new_user, ignore_index=True)
    
    # Save the updated DataFrame back to the CSV file
    updated_users_df.to_csv(file_path, index=False)
    print("New user added successfully to the CSV file.")







@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('nom')
    email = data.get('email')
    password = data.get('password')
    location= data.get('location')
    age= data.get('age')
    
    if sfm.retrieve_user_id(email):
        return jsonify({"message": "Email already used"}), 401
    else:
        try:
            new_user_id = sfm.insert_user_data(name, email, password, location, age)
            if new_user_id:
                
                file_path= 'data/Users.csv'
                add_new_user_to_csv(file_path, new_user_id, location, age)
                return jsonify({"message": "Registration successful", "redirect": "/login"}), 200
            else:
                raise Exception("Failed to generate or insert new user data")
        except Exception as e:
            print(e)  # For debugging
            return jsonify({"message": "Registration failed"}), 401


@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']
    
    
    user_id, name = sfm.check_user_login(email, password)
    if user_id and name: 
        user = User(user_id)  
        login_user(user)
        session['user_id'] = user_id  # store user ID in session 
        session['user_name']= name
        return jsonify({"message": "Connexion réussie", "user_id": user_id, "user_name":name}), 200
    else:
        return jsonify({"message": "Échec de la connexion"}), 401


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Déconnexion réussie"})



@app.route('/books/search', methods=['GET'])
def search_books():
    search_query = request.args.get('query', '')
    page, per_page, offset = get_page_args(page_parameter='page', per_page_parameter='per_page')
    per_page = 50
    offset = (page - 1) * per_page
    
    filtered_books = books_df[
        (books_df['Book-Title'].str.contains(search_query, case=False, na=False)) |
        (books_df['Book-Author'].str.contains(search_query, case=False, na=False)) |
        (books_df['Year-Of-Publication'].astype(str).str.contains(search_query, case=False, na=False))
    ]
    
    paginated_books = filtered_books.iloc[offset: offset + per_page]
    total = filtered_books.shape[0]
    
    return jsonify({
        "books": paginated_books[['ISBN','Book-Title', 'Book-Author', 'Year-Of-Publication', 'Publisher', 'Image-URL-S', 'Image-URL-M','Image-URL-L']].to_dict(orient='records'),
        "total": total,
        "page": page,
        "per_page": per_page
    })


@app.route('/book/details/<isbn>', methods=['GET'])
def book_details(isbn):
    book_info = books_df.loc[books_df['ISBN'] == isbn].to_dict('records')
    if book_info:
        book_info = book_info[0]
        ratings = ratings_df.loc[ratings_df['ISBN'] == isbn, 'Book-Rating'].mean()
        book_info['Average-Rating'] = ratings
        return jsonify(book_info), 200
    else:
        return jsonify({"error": "Book not found"}), 404



@app.route('/purchase', methods=['POST'])
def handle_purchase():
    if not session.get('user_id'):
        return jsonify({'message': 'Utilisateur non connecté'}), 401

    data = request.json
    isbn = data['isbn']
    user_id = session['user_id']
    
    # Récupérer l'email de l'utilisateur
    email = sfm.get_user_email(user_id)
    book_title = sfm.get_book_title(isbn)

    # Enregistrer l'achat dans la base de données Snowflake
    purchase_date = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sfm.record_purchase(user_id, book_title, isbn, purchase_date)

    return jsonify({'email': email, 'message': 'Achat enregistré avec succès'}), 200
 
    
@app.route('/user/<int:user_id>/purchases', methods=['GET'])
@login_required
def get_user_purchases_route(user_id):
    if str(user_id) != str(session.get('user_id')):
        return jsonify({'message': 'Unauthorized'}), 403
    purchases = sfm.get_user_purchases(user_id)
    return jsonify({'purchases': purchases}), 200


@app.route('/review', methods=['POST'])
@login_required
def submit_review():
    data = request.json
    user_id = session.get('user_id')
    isbn = data.get('isbn')
    review = data.get('review')
    if not isbn or not review:
        return jsonify({'message': 'ISBN and review are required'}), 400

    
    try:
        sfm.insert_review(user_id, isbn, review)
        return jsonify({'message': 'Review submitted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500





if __name__ == '__main__':
    app.run(debug=True, port=5000)
