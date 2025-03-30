import React, { useEffect, useState } from "react";
import { Button, Container, Row, Col, Card, Alert } from "react-bootstrap"; // Importiamo i componenti di Bootstrap
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


const AdminDashboard = () => {
  const [authors, setAuthors] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]);
  const [error, setError] = useState(null); // Gestione degli errori
  const navigate = useNavigate();

  // Funzione per effettuare il logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login"); // Reindirizza al login
  };

  // Ottieni gli autori
  useEffect(() => {
    const fetchAuthors = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authors`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Errore nel recupero degli autori");

        const data = await response.json();
        setAuthors(data.authors);
      } catch (err) {
        setError("Errore nel recupero degli autori");
        console.error(err);
      }
    };

    fetchAuthors();
  }, []);

  // Ottieni i post del blog
  useEffect(() => {
    const fetchBlogPosts = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Errore nel recupero dei post");

        const data = await response.json();
        setBlogPosts(data.posts);
      } catch (err) {
        setError("Errore nel recupero dei post");
        console.error(err);
      }
    };

    fetchBlogPosts();
  }, []);

  // Funzione per eliminare un autore
  const handleDeleteAuthor = async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setAuthors(authors.filter((author) => author._id !== id));
    }
  };

  // Funzione per eliminare un post del blog
  const handleDeletePost = async (id) => {
    const token = localStorage.getItem("token");
    console.log(`Eliminazione post con ID: ${id}`); // Log di debug

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Errore durante l'eliminazione del post");
      }

      setBlogPosts(blogPosts.filter((post) => post._id !== id)); // Aggiorna lo stato
      console.log("Post eliminato con successo!");
    } catch (error) {
      setError("Errore nell'eliminazione del post");
      console.error("Errore nell'eliminazione del post:", error);
    }
  };

  // Mostra errori
  const renderError = () => {
    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }
  };

  return (
    <Container className="my-5">
      <h1 className="text-center mb-4">Admin Dashboard</h1>

      {/* Logout Button */}
      <Button variant="danger" className="mb-4" onClick={handleLogout}>
        Logout
      </Button>

      {/* Gestione degli errori */}
      {renderError()}

      {/* Gestione Autori */}
      <h2 className="text-center mb-4">Gestione Autori</h2>
      <Row>
        {authors.map((author) => (
          <Col key={author._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm border-light">
              <Card.Body>
                <Card.Title>{author.nome} {author.cognome}</Card.Title>
                <Card.Text>
                  <small>{author.email}</small>
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteAuthor(author._id)}
                  className="w-100"
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Gestione Post */}
      <h2 className="text-center mt-5 mb-4">Gestione Post </h2>
      <Row>
        {blogPosts.map((post) => (
          <Col key={post._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Img variant="top" src={post.cover} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
                <Card.Text>{post.content.slice(0, 100)}...</Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePost(post._id)}
                  className="w-100"
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AdminDashboard;
