import React from 'react';
import { Container, Typography, Box, Grid, Avatar, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const CustomPaper = styled(Paper)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    color: 'white',
    marginBottom: 20,
    padding: '30px 20px'
});

const teamMembers = [
    { 
        name: "Alice Johnson", 
        role: "Founder & CEO", 
        imageUrl: "https://i.imgur.com/jONHmE5.jpg",  // Changed URL to a more professional image suitable for a CEO
        bio: "Alice founded Bibliophile's Haven in 2010 with the vision of creating a community hub for book lovers. She has a Master's in Literature from XYZ University."
    },
    { 
        name: "Bob Smith", 
        role: "Curator", 
        imageUrl: "https://i.postimg.cc/qqyYvVbq/book-Curator.jpg",  // Changed URL to reflect a curator's role in a library or bookstore
        bio: "Bob curates our extensive collection, handpicking books that inspire and enlighten our customers. He's also a published author and a regular speaker at literary events."
    },
    { 
        name: "Cindy Wu", 
        role: "Head of Customer Relations", 
        imageUrl: "https://i.postimg.cc/J7JN1WVF/customer-Relations.jpg",  // Changed URL to a customer service oriented image
        bio: "Cindy's love for books is matched only by her dedication to customer service. She ensures every visitor finds their next great read."
    },
];


const AboutUs = () => {
    return (
        <Container maxWidth="lg">
            <CustomPaper>
                <Typography variant="h3" component="h1" gutterBottom>
                    About Us
                </Typography>
                <Typography variant="h6" paragraph>
                    Welcome to The Library, your local bookstore with a vast array of titles ranging from timeless classics to modern masterpieces. We pride ourselves on creating a welcoming space for the community to discover new books and old favorites.
                </Typography>
                <Typography variant="h6" component="h2" gutterBottom>
                    Meet Our Team
                </Typography>
                <Grid container spacing={4}>
                    {teamMembers.map((member, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Avatar alt={member.name} src={member.imageUrl} sx={{ width: 128, height: 128, mb: 2 }} />
                            <Typography variant="h5">{member.name}</Typography>
                            <Typography variant="subtitle1" color="common.white">{member.role}</Typography>
                            <Typography variant="body1" paragraph>{member.bio}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </CustomPaper>
        </Container>
    );
};

export default AboutUs;
