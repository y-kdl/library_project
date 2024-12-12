import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Button } from '@mui/material';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const RecommendedBooks = () => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 4,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const [popularBooks, setPopularBooks] = useState([]);
    const [userFavorites, setUserFavorites] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const fetchPopularBooks = useCallback(async () => {
        const response = await fetch('http://localhost:5000/recommendation/popular-books');
        const data = await response.json();
        setPopularBooks(data);
    }, []);

    const fetchUserFavorites = useCallback(async () => {
        const response = await fetch(`http://localhost:5000/recommendation/user/${userId}/favorites`);
        const data = await response.json();
        setUserFavorites(Array.isArray(data) ? data : []);
    }, [userId]);

    const fetchRecommendations = useCallback(async () => {
        const response = await fetch(`http://localhost:5000/recommendation/user/${userId}/recommendations`);
        const data = await response.json();
        setRecommendations(Array.isArray(data) ? data : []);
    }, [userId]);

    useEffect(() => {
        if (userId) {
            fetchPopularBooks();
            fetchUserFavorites();
            fetchRecommendations();
        }
    }, [userId, fetchPopularBooks, fetchUserFavorites, fetchRecommendations]);

    const BookCard = ({ book }) => (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card raised>
                <CardActionArea onClick={() => navigate('/bookDetails', { state: { isbn: book.ISBN } })}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={book['Image-URL-L'] || '/no-image-available.png'}
                        alt={book['Book-Title']}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {book['Book-Title']}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {book['Book-Author']} ({book['Year-Of-Publication']})
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <Button size="small" color="primary" onClick={() => navigate('/bookDetails', { state: { isbn: book.ISBN } })}>
                    View
                </Button>
            </Card>
        </Grid>
    );

    return (
        <div>
            <div>
            <Typography variant="h4" gutterBottom component="div" style={{ textAlign: 'center' }}>
                Popular Books
            </Typography>
            <Slider {...settings}>
                {popularBooks.map((book, index) => (
                    <div key={index}>
                        <Card raised sx={{ maxWidth: 345 }}>
                            <CardActionArea onClick={() => navigate('/bookDetails', { state: { isbn: book.ISBN } })}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={book['Image-URL-L'] || '/no-image-available.png'}
                                    alt={book['Book-Title']}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {book['Book-Title']}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {book['Book-Author']} ({book['Year-Of-Publication']})
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </div>
                ))}
            </Slider>
        </div>

            <Typography variant="h4" gutterBottom component="div" style={{ marginTop: '20px' }}>
                <center>Your Favorites</center>
            </Typography>
            <Grid container spacing={4}>
                {userFavorites.map((book, index) => (
                    <BookCard key={index} book={book} />
                ))}
            </Grid>

            <Typography variant="h4" gutterBottom component="div" style={{ marginTop: '20px' }}>
                <center>You may like</center>
            </Typography>
            <Grid container spacing={4}>
                {recommendations.map((book, index) => (
                    <BookCard key={index} book={book} />
                ))}
            </Grid>
        </div>
    );
};

export default RecommendedBooks;
