import warnings
from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS  
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import re
import numpy as np

warnings.filterwarnings("ignore")

recommendation_bp = Blueprint('recommendation_bp', __name__, url_prefix='/recommendation')

def load_and_preprocess_data():
    books = pd.read_csv('data/Books.csv')
    ratings = pd.read_csv('data/Ratings.csv')
    users = pd.read_csv('data/Users.csv')

    books_data = books.merge(ratings, on="ISBN")
    books_data.dropna(inplace=True)
    books_data = books_data[books_data['Book-Rating'] > 0]
    books_data['Book-Title'] = books_data['Book-Title'].apply(lambda x: re.sub("[\W_]+", " ", x).strip())
    
    
    return books_data

@recommendation_bp.route('/popular-books', methods=['GET'])
def get_popular_books():
    df = load_and_preprocess_data()
    result = popular_books(df)
    return jsonify(result), 200

def popular_books(df, n=50):
    grouped = df.groupby('Book-Title').agg({
        'Book-Rating': ['count', 'mean'],
        'ISBN': 'first',  
        'Image-URL-L': 'first' 
    })
    grouped.columns = ['NumberOfVotes', 'AverageRatings', 'ISBN', 'Image-URL-L']  # Simplifying column names
    grouped['Popularity'] = grouped.apply(lambda x: (x['NumberOfVotes'] * x['AverageRatings']) / (x['NumberOfVotes'] + 100), axis=1)
    return grouped.nlargest(n, 'Popularity')[['ISBN', 'NumberOfVotes', 'AverageRatings', 'Popularity', 'Image-URL-L']].to_dict(orient='records')



@recommendation_bp.route('/user/<int:user_id>/favorites', methods=['GET'])
def get_user_favorites_route(user_id):
    df = load_and_preprocess_data()
    result = users_choice(df, user_id)
    return jsonify(result), 200

def users_choice(df, user_id):
    user_data = df[df['User-ID'] == user_id]
    top_books = user_data.nlargest(5, 'Book-Rating')
    return top_books[['ISBN', 'Book-Title', 'Book-Rating', 'Image-URL-L']].to_dict(orient='records')

@recommendation_bp.route('/user/<int:user_id>/recommendations', methods=['GET'])
def get_user_recommendations_route(user_id):
    df = load_and_preprocess_data()
    result = user_based_recommendations(df, user_id)
    return jsonify(result), 200

def user_based_recommendations(df, user_id):
    vote_counts = df['User-ID'].value_counts()
    df = df[df['User-ID'].isin(vote_counts[vote_counts >= 200].index)]
    pivot_table = df.pivot_table(index='User-ID', columns='Book-Title', values='Book-Rating', fill_value=0)
    if user_id not in pivot_table.index:
        return {'error': 'User not found'}
    
    similarities = cosine_similarity(pivot_table)
    user_index = list(pivot_table.index).index(user_id)
    similar_indices = np.argsort(similarities[user_index])[::-1][1:6]
    similar_users = pivot_table.index[similar_indices]
    rec_books = df[df['User-ID'].isin(similar_users)].nlargest(5, 'Book-Rating')
    return rec_books[['ISBN', 'Book-Title', 'Book-Rating', 'Image-URL-L']].to_dict(orient='records')




if __name__ == '__main__':
    app = Flask(__name__)
    CORS(app)  # This applies CORS to all routes
    app.register_blueprint(recommendation_bp)
    app.run(debug=True)
