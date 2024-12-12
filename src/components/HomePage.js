import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  
  const headerBackgroundImageUrl = process.env.PUBLIC_URL + "/images/bg.jpg";
  const headerBackgroundImageUrl2 = process.env.PUBLIC_URL + "/images/bg2.jpg";

  const navigate = useNavigate();

  const handleDiscover = () => {
    navigate('/login');
  };

  return (
    <Box>
      
      <Box 
      sx={{
        backgroundImage: `url(${headerBackgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh', 
        
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centrer le contenu verticalement
        alignItems: 'center', // Centrer le contenu horizontalement
      }}
      >
        <Typography variant="h2" gutterBottom>Welcome to our Library</Typography>
        <Button variant="contained" sx={{ bgcolor: 'secondary.main' }} onClick={handleDiscover}>Discover our collections </Button>
      </Box>
      
      
      <Container /*sx={{ py: 8 }}*/
      sx={{
        marginTop:'5px' ,
        backgroundImage: `url(${headerBackgroundImageUrl2})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh', 
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
      }}>
        <Card raised sx={{ p: 2 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>Who are we </Typography>
            <Typography>We are a library offering a large collection of books in various genres. Discover, learn and broaden your horizons with us.</Typography>
          </CardContent>
        </Card>
      </Container>
      
      
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>Our Services</Typography>
        <Grid container spacing={4}>
          {["Vaste Collection", "Espace de Lecture Confortable", "Événements et Ateliers"].map((feature, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Card raised sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h6">{feature}</Typography>
                  <Typography>Explore a wide range of genres and titles.</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      
      {/* Pied de page */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 3,
        textAlign: 'center',
      }}>
        <Typography>&copy; {new Date().getFullYear()} Votre Bibliothèque. Tous droits réservés.</Typography>
      </Box>
    </Box>
  );
}

export default Home;
