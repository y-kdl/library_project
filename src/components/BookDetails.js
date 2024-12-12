//BookDetails.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Grid, CardMedia, CircularProgress, Box, Button } from '@mui/material';

function BookDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const isbn = location.state?.isbn;
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!isbn) {
        setError('Aucun ISBN fourni.');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/book/details/${isbn}`);
        if (!response.ok) throw new Error('La récupération des détails du livre a échoué.');
        const data = await response.json();
        setBookDetails(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [isbn]);

  const handlePurchase = async () => {
    const confirmPurchase = window.confirm("Voulez-vous vraiment acheter ce livre ?");
    if (confirmPurchase) {
      try {
        const response = await fetch('http://localhost:5000/purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isbn }),
          credentials: 'include', // Important pour les cookies de session
        });
        if (!response.ok) throw new Error('Problème lors de l’achat du livre');
        const data = await response.json();
        alert(`Merci pour votre achat. Un lien a été envoyé à votre adresse e-mail ${data.email} pour le paiement. Le livre sera envoyé à votre adresse dans les 24 heures suivant le paiement.`);
        navigate('/books');
      } catch (error) {
        console.error(error);
        alert('Une erreur est survenue lors de la tentative d’achat.');
      }
    }
  };
  

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }
  if (error) {
    return <Container><Typography color="error">{error}</Typography></Container>;
  }
  if (!bookDetails) {
    return <Container><Typography>Livre introuvable.</Typography></Container>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card raised sx={{ mb: 2, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <CardMedia
              component="img"
              image={bookDetails['Image-URL-L'] || '/no-image-available.png'}
              alt={`Couverture du livre: ${bookDetails['Book-Title']}`}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <CardContent>
              <Typography gutterBottom variant="h4" component="div">{bookDetails['Book-Title']}</Typography>
              <Typography variant="body1" color="text.secondary">Auteur: {bookDetails['Book-Author']}</Typography>
              <Typography variant="body1" color="text.secondary">ISBN: {isbn}</Typography>
              <Typography variant="body1" color="text.secondary">Année de publication: {bookDetails['Year-Of-Publication']}</Typography>
              <Typography variant="body1" color="text.secondary">Éditeur: {bookDetails['Publisher']}</Typography>
              <Typography variant="body1" color="text.secondary">Note moyenne: {bookDetails['Average-Rating'] ? bookDetails['Average-Rating'].toFixed(2) : 'Non noté'}</Typography>
              <Button variant="contained" onClick={handlePurchase}>Acheter ce livre</Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}

export default BookDetails;
