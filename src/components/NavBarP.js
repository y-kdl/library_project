// NavBarProfil.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';
import logo from '../../src/navlogo.png'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: '16px',
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  appBar: {
    backgroundColor: '#C25A44', 
  },
}));

export default function NavBarP() {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Request to backend to clear the server session
    await fetch('http://localhost:5000/logout', {
        method: 'POST',
        credentials: 'include', // Include credentials to ensure cookies are sent
    }).then(response => {
        if(response.ok) {
            console.log("Logged out successfully");
        } else {
            console.error("Logout failed");
        }
    }).catch(error => {
        console.error("Error logging out:", error);
    });

    // Clear local storage or any other client-side storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId'); // Also remove userId if stored

    
    navigate('/login');
};


  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          
          <Link to="/books" className={classes.link}>
            <img src={logo} alt="The Library Logo" className={classes.logo} />
          </Link>
          <Link to="/recommendation" className={classes.link}>
            <Button color="inherit">Library</Button>
          </Link>
          <Link to="/profil" className={classes.link}>
            <Button color="inherit">Profil</Button>
          </Link>
          
          <Button color="inherit" onClick={handleLogout}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
