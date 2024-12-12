//login.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('isLoggedIn', 'true');
      // Store user ID in localStorage 
      
      localStorage.setItem('userId', data.user_id);
      localStorage.setItem('userName',data.user_name);
      //console.log(data.user_id);
      navigate('/books');
    } else {
      const errorData = await response.json();
      setErrorMessage(errorData.message || 'Échec de la connexion. Veuillez vérifier votre email et mot de passe et réessayer.');
    }
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
          Log in 
        </Typography>
        
        {errorMessage && (
          <Typography color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log in
          </Button>
          <Link href="/inscription" variant="body2">
            {"You do not have an account yet? Register here "}
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
