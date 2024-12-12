import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, CardActions, TextField, Button, Grid, Box, Slider, Paper } from '@mui/material';

function Profile() {
    const navigate = useNavigate();
    const [purchases, setPurchases] = useState([]);
    const [reviews, setReviews] = useState({});
    const [userName, setUserName] = useState(localStorage.getItem('userName') || '');

    useEffect(() => {
        if (!localStorage.getItem('isLoggedIn')) {
            navigate('/login');
            return;
        }

        const userId = localStorage.getItem('userId');
        if (userId) {
            const fetchPurchases = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/user/${userId}/purchases`, { credentials: 'include' });
                    if (response.ok) {
                        const data = await response.json();
                        setPurchases(data.purchases);
                    } else {
                        throw new Error('Failed to fetch purchases');
                    }
                } catch (error) {
                    console.error('Error fetching purchases:', error);
                }
            };

            fetchPurchases();
        }
    }, [navigate]);

    const handleReviewChange = (isbn, value) => {
        setReviews({ ...reviews, [isbn]: value });
    };

    const submitReview = async (isbn) => {
        const review = reviews[isbn];
        if (!review) return;

        try {
            const response = await fetch(`http://localhost:5000/review`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isbn, review }),
                credentials: 'include',
            });
            if (response.ok) {
                alert('Review submitted successfully');
                // clear the review input after submission
                setReviews({ ...reviews, [isbn]: '' });
            } else {
                throw new Error('Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={6} sx={{ p: 2, marginBottom: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Hi, {userName}
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Your Purchases
                </Typography>
            </Paper>
            <Grid container spacing={4}>
                {purchases.map((purchase, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card raised>
                            <CardMedia
                                component="img"
                                height="140"
                                image={purchase['Image-URL-L']}
                                alt={`Cover of ${purchase.BOOKTITLE}`}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {purchase.BOOKTITLE}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    ISBN: {purchase.ISBN}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Purchase Date: {purchase.PDATE}
                                </Typography>
                            </CardContent>
                            <Box sx={{ p: 2 }}>
                                <Slider
                                    value={reviews[purchase.ISBN] || 5}
                                    onChange={(e, newValue) => handleReviewChange(purchase.ISBN, newValue)}
                                    aria-labelledby="continuous-slider"
                                    min={1}
                                    max={10}
                                    marks
                                    step={1}
                                    valueLabelDisplay="auto"
                                />
                            </Box>
                            <CardActions>
                                <Button size="small" onClick={() => submitReview(purchase.ISBN)}>Submit Review</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Profile;
