// Register.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';




function Inscription() {
    
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState({
    email: '',
    password: '',
    nom: '',
    location: '', 
    age: '' 

  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { nom, email, password, location, age } = user; 

    const response = await fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nom: nom,  
      email: email,
      password: password,
      location: location,
      age: age
    }),
    
    
  });

  if (response.ok) {
    const data = await response.json();
    navigate('/login');
  } else {
    const errorData = await response.json(); 
    setErrorMessage(errorData.message); 
    console.error('Échec de lincription');
  }
};

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nom"
            label="Name"
            name="nom"
            autoFocus
            value={user.nom}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={user.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={user.password}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="age"
            label="Age"
            name="age"
            value={user.age}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="location"
            label="Location"
            name="location"
            value={user.location}
            onChange={handleChange}
          />
          
          {errorMessage && (
            <Typography color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
        <Link href="/login" variant="body2">
           {"Already have an account? Log in here"}
        </Link>
      </Box>
    </Container>
  );
}

export default Inscription;
