import React from 'react';
import { Container, Typography, Box, Grid, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

const InfoPaper = styled(Paper)({
    padding: '20px',
    color: '#333',
    backgroundColor: '#f7f7f7',
    borderRadius: '15px',
    border: '1px solid #ddd'
});

function ContactUsPage() {
    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8, pt: 4, pb: 4, backgroundColor: '#fff', borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom component="div" sx={{ fontWeight: 'bold', mb: 3, color: '#2e1534' }}>
                Contact Us
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <InfoPaper elevation={3}>
                        <Typography variant="h5" component="div" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'medium' }}>
                            Our Contact Details
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                            <strong>Email:</strong> library_contact@gmail.com
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                            <strong>Phone:</strong> +1 438 783 9856
                        </Typography>
                        <Typography variant="body1" component="p">
                            <strong>Address:</strong> 123 Avenue de la République, 75011 Montréal, Canada
                        </Typography>
                    </InfoPaper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <InfoPaper elevation={3}>
                        <Typography variant="h5" component="div" sx={{ mb: 2, color: '#3f51b5', fontWeight: 'medium' }}>
                            Opening Hours
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ mb: 2 }}>
                            Monday to Friday: 9 AM - 6 PM
                        </Typography>
                        <Typography variant="body1" component="p">
                            Saturday: 10 AM - 5 PM
                        </Typography>
                    </InfoPaper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ContactUsPage;
