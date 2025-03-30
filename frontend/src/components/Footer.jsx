import React from "react";
import { Link } from "react-router-dom";
import '../styles/Footer.css'

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white">
      <div className="container text-center">
        <p>&copy; 2025 Strive Blog. Tutti i diritti riservati.</p>
        <div>
          <Link to="/" className="text-white mx-2">
            Home
          </Link>
          <Link to="/about" className="text-white mx-2">
            Chi siamo
          </Link>
          <Link to="/contact" className="text-white mx-2">
            Contatti
          </Link>
        </div>
        <p className="mt-2">Seguici su:</p>
        <div>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            Facebook
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            Twitter
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white mx-2">
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
