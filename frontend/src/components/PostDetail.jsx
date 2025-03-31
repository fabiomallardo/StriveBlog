import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner, Container, Card } from "react-bootstrap";

const PostDetail = () => {
  const { id } = useParams();  // Otteniamo l'ID del post dalla URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fullName = userNome && userCognome ? `${userNome} ${userCognome}` : "Anonimo";

  const handleAddComment = async (e, postId) => {
    const text = newComments[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: fullName, email: userEmail, text }),
      });

      if (!res.ok) throw new Error("Errore invio commento");

      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );
      setNewComments({ ...newComments, [postId]: "" });
    } catch (err) {
      console.error("❌ Errore commento:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts/${postId}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });

      if (!res.ok) throw new Error("Errore eliminazione");

      const data = await res.json();
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, comments: data.comments } : post
        )
      );
    } catch (err) {
      console.error("❌ Errore eliminazione commento:", err);
    }
  };    e.preventDefault();


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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PostDetail;
