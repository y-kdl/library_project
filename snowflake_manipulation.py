#snowflake_manipulation.py
import pandas as pd
import snowflake.connector
import os



snowflake_config = {
    'user': 'akramdz',
    'password': 'Akram12345678',
    'account': 'ymbkgwu-ck50310',
    'database': 'LIBRARY_PROJECT'
}




def connect_to_snowflake():
    conn = snowflake.connector.connect(
        user=snowflake_config['user'],
        password=snowflake_config['password'],
        account=snowflake_config['account'],
        database=snowflake_config['database']
    )
    return conn

def insert_user_data(name, email, password, location, age):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        # Fetch the next value from the sequence
        cursor.execute("SELECT \"LIBRARY_PROJECT\".\"PUBLIC\".\"user_id_seq\".NEXTVAL")
        new_user_id = cursor.fetchone()[0]

        insert_query = """
        INSERT INTO "LIBRARY_PROJECT"."PUBLIC"."USER" (USERID, NAME, EMAIL, PASSWORD, LOCATION, AGE)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        # Insert the new user data using the fetched USERID
        cursor.execute(insert_query, (new_user_id, name, email, password, location, age))
        conn.commit()
        print("User data inserted successfully with USERID:", new_user_id)
        return new_user_id
    except Exception as e:
        print(f"Error inserting user data: {e}")
        return None
    finally:
        cursor.close()
        conn.close()



def check_user_login(email, password):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        
        query = """
        SELECT USERID, PASSWORD, NAME FROM "LIBRARY_PROJECT"."PUBLIC"."USER" WHERE EMAIL = %s;
        """
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        
        if result:
            user_id, stored_password, name = result  
            
            if password == stored_password:
                return user_id, name  
        return None, None 
    except Exception as e:
        print(f"Error checking user login: {e}")
        return None, None  
    finally:
        cursor.close()
        conn.close()


    


# retrieve user ID based on email
def retrieve_user_id(email):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        query = "SELECT USERID FROM USER WHERE EMAIL = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()
        conn.close()

def get_user_email(user_id):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        query = "SELECT EMAIL FROM USER WHERE USERID = %s"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        return result[0] if result else None
    finally:
        cursor.close()
        conn.close()



def get_book_title(isbn):
    books_df = pd.read_csv('data/Books.csv')
    book_row = books_df.loc[books_df['ISBN'] == isbn]
    if not book_row.empty:
        return book_row.iloc[0]['Book-Title']
    else:
        return None


def record_purchase(user_id, book_title, isbn, purchase_date):
    conn = connect_to_snowflake()
    try:
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO LIBRARY_PROJECT.PUBLIC.PURCHASES (USERID, ISBN, BOOKTITLE, PDATE)
            VALUES(%s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (user_id, isbn, book_title, purchase_date))
        
        conn.commit()
        print("Purchase recorded successfully")
    except Exception as e:
        print(f"Error recording purchase: {e}")
    finally:
        if cursor is not None:
            cursor.close()
        if conn is not None:
            conn.close()


def get_user_purchases(user_id):
    conn = connect_to_snowflake()
    cursor = conn.cursor()
    try:
        query = """
        SELECT USERID, ISBN, BOOKTITLE, PDATE FROM LIBRARY_PROJECT.PUBLIC.PURCHASES WHERE USERID = %s;
        """
        cursor.execute(query, (user_id,))
        # Fetch all purchases
        purchases = cursor.fetchall()
        
        # Load book details
        books_df = pd.read_csv('data/Books.csv', usecols=['ISBN', 'Image-URL-L'], dtype={'ISBN': str})
        books_df.set_index('ISBN', inplace=True)
        
        # purchases with image URLs
        enriched_purchases = []
        for purchase in purchases:
            isbn = purchase[1]
            image_url = books_df.loc[isbn, 'Image-URL-L'] if isbn in books_df.index else '/no-image-available.png'
            enriched_purchases.append({
                "USERID": purchase[0],
                "ISBN": isbn,
                "BOOKTITLE": purchase[2],
                "PDATE": purchase[3],
                "Image-URL-L": image_url
            })

        return enriched_purchases
    except Exception as e:
        print(f"Error fetching user purchases: {e}")
        return []
    finally:
        cursor.close()
        conn.close()



def insert_review(user_id, isbn, review):
    file_path = 'data/Ratings.csv' 
    try:
        # Check if the file exists
        if not os.path.isfile(file_path):
            df = pd.DataFrame(columns=['User-ID', 'ISBN', 'Book-Rating'])
            df.to_csv(file_path, index=False)
        
        # Load existing data
        df = pd.read_csv(file_path)

        # Create a new dataframe with the new review data
        new_data = pd.DataFrame({
            'User-ID': [user_id],
            'ISBN': [isbn],
            'Book-Rating': [review]
        })

        # Append new data
        df = pd.concat([df, new_data], ignore_index=True)

        # Save back to CSV
        df.to_csv(file_path, index=False)
        print("Review inserted successfully into CSV.")
    except Exception as e:
        print(f"Error inserting review into CSV: {e}")
        raise Exception("Failed to insert review into CSV.")
