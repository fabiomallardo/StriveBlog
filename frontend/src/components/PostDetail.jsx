import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container, Card, Form, Button, Alert } from "react-bootstrap";

const PostDetail = () => {
  const { id } = useParams(); // Otteniamo l'ID del post dalla URL
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState(""); // Stato per il nuovo commento
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupera i dati utente da localStorage
  const userEmail = localStorage.getItem("userEmail");
  const userNome = localStorage.getItem("userNome");
  const userCognome = localStorage.getItem("userCognome");
  const fullName = userNome && userCognome ? `${userNome} ${userCognome}` : "Anonimo";

  // Recupera il post completo
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}`);
        if (!response.ok) {
          throw new Error("Errore nel recupero del post");
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        setError("Errore nel recupero del post.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
  
    // Assicurati che il commento non sia vuoto
    if (!newComment.trim()) return;
  
    // Aggiungi il controllo dei dati
    const author = userNome && userCognome ? `${userNome} ${userCognome}` : "Anonimo";
    
    const commentData = { author : fullName, text: newComment, postId : id };
    console.log("Dati che invio:", commentData);
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Errore risposta API:", errorData); // Mostra i dettagli dell'errore
        throw new Error("Errore invio commento");
      }
  
      const data = await res.json();
      setPost((prevPost) => ({ ...prevPost, comments: data.comments }));
      setNewComment(""); // Reset del campo del commento
    } catch (err) {
      console.error("Errore nel recupero dei commenti:", err);
      setError("Errore nel recupero dei commenti.");
    }
  };
  
  
  
  // Funzione per eliminare un commento
  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${id}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) throw new Error("Errore eliminazione commento");

      const data = await res.json();

      // Aggiorna il post rimuovendo il commento eliminato
      setPost((prevPost) => ({
        ...prevPost,
        comments: prevPost.comments.filter((comment) => comment._id !== commentId),
      }));
    } catch (err) {
      console.error("❌ Errore eliminazione commento:", err);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Caricamento post...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <p>{error}</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">{post.title}</h1>
      <Card className="shadow-sm p-4">
        <Card.Img variant="top" src={post.cover} />
        <Card.Body>
          <Card.Text>{post.content}</Card.Text>
          <small className="text-muted">Categoria: {post.category}</small><br />
          <small className="text-muted">Tempo di lettura: {post.readTime.value} {post.readTime.unit}</small><br />
          <small className="text-muted">Autore: {post.author}</small>

          <hr />
          <h6>Commenti</h6>
          {Array.isArray(post.comments) && post.comments.length > 0 ? (
            <ul className="list-unstyled">
              {post.comments.map((comment) => (
                <li key={comment._id} className="mb-2">
                  <strong>{comment.author}</strong>: {comment.text}
                  {comment.email === userEmail && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteComment(comment._id)} // Passa commentId
                    >
                      🗑
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <Alert variant="light" className="py-1">
              Nessun commento ancora.
            </Alert>
          )}

          <Form onSubmit={handleAddComment} className="d-flex gap-2 mt-3">
            <Form.Control
              type="text"
              placeholder="Scrivi un commento..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button type="submit" variant="primary">
              Invia
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
