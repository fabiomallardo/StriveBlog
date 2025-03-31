import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import '../styles/Navbar.css'

const NavbarComponent = () => {
  // Verifica se l'utente è autenticato
  const isAuthenticated = !!localStorage.getItem("token");

  // Verifica se l'utente è un admin, decodificando il token
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica del token
    if (decodedToken.role === "admin") {
      isAdmin = true; // Imposta isAdmin a true se l'utente è admin
    }
  }

  // Funzione di logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    window.location.reload(); // Ricarica la pagina dopo il logout
  };

  return (
<Navbar expand="lg" className="bg-dark text-white">
      <Container>
        <Navbar.Brand className="text-white"> Strive-Blog</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto text-white">
            {/* Link Home visibile solo se l'utente è autenticato */}
            {isAuthenticated && <Nav.Link as={Link} to="/" className="text-white">Home</Nav.Link>}

            {/* Link Autori visibile solo se l'utente è un admin */}
            {isAdmin && isAuthenticated && <Nav.Link as={Link} to="/authors" className="text-white">Autori</Nav.Link>}

            {/* Link Nuovo Post visibile solo se l'utente è autenticato */}
            {isAuthenticated && <Nav.Link as={Link} to="/new-post" className="text-white">Nuovo Post</Nav.Link>}
          </Nav>

          {/* Dropdown per il profilo e logout visibile solo se l'utente è autenticato */}
          {isAuthenticated && (
            <NavDropdown title="Account" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profilo</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;