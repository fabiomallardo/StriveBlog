import React, { useEffect, useState } from "react";
import { Spinner, Button, Alert, Container } from "react-bootstrap";
import EditProfileModal from "../components/editProfileModal.jsx"; // Modal per modifica profilo
import { useNavigate } from "react-router-dom";
import { Row, Col, Card } from "react-bootstrap";


const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [blogPosts, setBlogPosts] = useState([]); // Imposta blogPosts come array vuoto inizialmente

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  // Funzione per effettuare il logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login"); // Reindirizza alla pagina di login
  };

  
  
  // dentro Profile
  const fetchUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error("Errore nel recupero dati");
      
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setError("Errore nel recupero dei dati.");
    } finally {
      setLoading(false);
    }
  };
  
  
  // Funzione per recuperare i dati dell'utente
  useEffect(() => {
    if (!userId || !token) {
      setError("Token mancante. Assicurati di essere loggato.");
      setLoading(false);
      return;
    }
fetchUser();
}, [userId, token]);

  // Funzioni di amministrazione solo per admin
  const isAdmin = user && user.role === "admin"; // Verifica se l'utente è admin

  // Ottieni autori
  useEffect(() => {
    if (!isAdmin) return;

    const fetchAuthors = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/authors`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setAuthors(data.authors);
    };

    fetchAuthors();
  }, [isAdmin, token]);

  useEffect(() => {
    if (!isAdmin) return;
  
    const fetchBlogPosts = async () => {
      try {
        console.log("Iniziando a recuperare i post...");
  
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Errore nel recupero dei post");
        }
  
        const data = await response.json();
        console.log("Dati ricevuti dal server:", data);
  
        if (Array.isArray(data.posts)) {
          setBlogPosts(data.posts); // Imposta lo stato con i post ricevuti
        } else {
          setBlogPosts([]); // Imposta un array vuoto se la risposta non è un array
        }
      } catch (error) {
        console.error("Errore durante il recupero dei post:", error);
        setError("Impossibile caricare i post.");
      }
    };
  
    fetchBlogPosts();
  }, [isAdmin, token]); // Assicurati che questo useEffect venga eseguito solo quando `isAdmin` o `token` cambiano
  

  // Funzione per eliminare un autore
  const handleDeleteAuthor = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/authors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setAuthors(authors.filter((author) => author._id !== id));
    }
  };

  // Funzione per eliminare un post del blog
  const handleDeletePost = async (id) => {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setBlogPosts(blogPosts.filter((post) => post._id !== id));
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Caricamento profilo...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4 text-center">👤 Il tuo profilo</h1>
      <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: 600 }}>
        <div className="d-flex align-items-center gap-4">
          <img
            src={user.avatar || "https://via.placeholder.com/100"}
            alt="Avatar"
            className="rounded-circle"
            width={100}
            height={100}
          />
          <div>
            <h3>{user.nome} {user.cognome}</h3>
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="mb-1"><strong>Bio:</strong> {user.bio || "Nessuna biografia disponibile."}</p>
          </div>
        </div>

        <div className="text-end mt-4">
          <Button variant="outline-primary" onClick={() => setShowModal(true)}>
            Modifica Profilo
          </Button>
        </div>
      </div>

      {/* Modale modifica profilo */}
      <EditProfileModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        user={user}
        onSave={() => {
          fetchUser();
          setShowModal(false);
          // Ricarica i dati aggiornati
        }}
      />

{isAdmin && (
  <Container className="mt-5">
    {/* Gestione Autori */}
    <h2 className="mb-4">Gestione Autori</h2>
    <Row>
      {authors.map((author) => (
        <Col key={author._id} xs={12} md={6} lg={4} className="mb-4">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>{author.nome} {author.cognome}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{author.email}</Card.Subtitle>
              <Button
                variant="danger"
                onClick={() => handleDeleteAuthor(author._id)}
                className="w-100 mt-3"
              >
                Elimina
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>

    {/* Gestione Post */}
    <h2 className="mt-5 mb-4">Gestione Post</h2>
    <Row>
      {Array.isArray(blogPosts) && blogPosts.length > 0 ? (
        blogPosts.map((post) => (
          <Col key={post._id} xs={12} md={6} lg={4} className="mb-4">
            <Card className="shadow-sm h-100">
              {post.cover && (
                <Card.Img variant="top" src={post.cover} alt={post.title} />
              )}
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {post.category}
                </Card.Subtitle>
                <Card.Text>
                  {post.content?.slice(0, 100)}...
                </Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDeletePost(post._id)}
                  className="w-100 mt-2"
                >
                  Elimina
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))
      ) : (
        <Col>
          <Alert variant="info">Nessun post disponibile.</Alert>
        </Col>
      )}
    </Row>
  </Container>
)}
</Container>
  );
};

export default Profile;
