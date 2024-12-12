// NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

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
}));

export default function NavBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            The Library
          </Typography>
          <Link to="/" className={classes.link}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to="/contact" className={classes.link}>
            <Button color="inherit">Contact us</Button>
          </Link>
          <Link to="/about" className={classes.link}>
            <Button color="inherit">About us</Button>
          </Link>
          <Link to="/login" className={classes.link}>
            <Button color="inherit">Log in</Button>
          </Link>
         
        </Toolbar>
      </AppBar>
    </div>
  );
}
