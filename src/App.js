// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar'; 
import NavBarP from './components/NavBarP'; 
import Login from './components/login';
import Profil from './components/profil';
import BooksDisplay from './components/BooksDisplay';
import Inscription from './components/Inscription';
import Home from './components/HomePage';
import ContactUs from './components/contact';
import BookDetails from './components/BookDetails'
import RecommendedBooks from './components/recommendedBooks'
import AboutUs from './components/about';
const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  let location = useLocation();

  return (
    <>
      {(location.pathname === '/profil' || location.pathname === '/books' || location.pathname === '/bookDetails' || location.pathname === '/recommendation') ? <NavBarP /> : <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<BooksDisplay />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/bookDetails" element={<BookDetails />} />
        <Route path="/recommendation" element={<RecommendedBooks/>} />
        <Route path="/about" element={<AboutUs/>} />
      </Routes>
    </>
  );
};

export default AppWrapper;

