//BooksDisplay.js
import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, CardMedia, Typography, TextField, Button, Box, Pagination } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BooksDisplay() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBooks();
  }, [currentPage, searchQuery]);

  const fetchBooks = async () => {
    const response = await fetch(`http://localhost:5000/books/search?query=${searchQuery}&page=${currentPage}&per_page=50`);
    const data = await response.json();
    setBooks(data.books);
    setTotalPages(Math.ceil(data.total / 50));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page for new search
    fetchBooks();
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  return (
    
    <Container sx={{ mt: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        <TextField
          sx={{ mr: 1, flexGrow: 1 }}
          label="Search by Title, Author, or Year"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
      </Box>
      <Grid container spacing={4}>
        {books.map((book, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardMedia component="img" image={book['Image-URL-L']} alt={book['Book-Title']} height="250" />
              <CardContent>
                <Typography gutterBottom variant="h5">{book['Book-Title']}</Typography>
                <Typography variant="body2" color="text.secondary">{book['Book-Author']} ({book['Year-Of-Publication']})</Typography>
                
                <Button 
                      size="small" 
                      onClick={() => {
                        console.log("Book object:", book);
                        console.log("Navigating to BookDetails with ISBN:", book['ISBN']);
                        navigate('/bookDetails', { state: { isbn: book['ISBN'] } });
                      }}
                    >
                      View
                 </Button>


              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Pagination
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
          count={totalPages}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
      )}
    </Container>
  );
}

export default BooksDisplay;

