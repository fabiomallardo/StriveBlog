import React, { useEffect, useState } from "react";
import { Card, Button, Form, Row, Col, Alert, Container } from "react-bootstrap";

const BlogPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [newComments, setNewComments] = useState({});

  const userEmail = localStorage.getItem("userEmail");
  const userNome = localStorage.getItem("userNome");
  const userCognome = localStorage.getItem("userCognome");
  const fullName = userNome && userCognome ? `${userNome} ${userCognome}` : "Anonimo";

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/blogPosts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(Array.isArray(data.posts) ? data.posts : []);
      })
      .catch((err) => console.error("❌ Errore nel fetch dei post:", err));
  }, []);

  const handleAddComment = async (e, postId) => {
    e.preventDefault();
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
  };

  return (
    <Container className="py-4 mb-5">
      <Row className="g-4 mb-5">
        {posts.map((post) => (
          <Col key={post._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm d-flex flex-column">
              <Card.Img
                variant="top"
                src={post.cover}
                alt={post.title}
                style={{ height: 180, objectFit: "cover" }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {post.category} • {post.readTime?.value} {post.readTime?.unit}
                </Card.Subtitle>
                <Card.Text className="flex-grow-1">
                  {post.content.slice(0, 100)}...
                </Card.Text>

                <hr />
                <h6>Commenti</h6>
                {Array.isArray(post.comments) && post.comments.length > 0 ? (
                  <ul className="list-unstyled">
                    {post.comments.map((comment) => (
                      <li
                        key={comment._id}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <div>
                          <strong>{comment.author}</strong>: {comment.text}
                        </div>
                        {comment.email === userEmail && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteComment(post._id, comment._id)}
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

                {userEmail && (
                  <Form
                    onSubmit={(e) => handleAddComment(e, post._id)}
                    className="d-flex gap-2 mt-3"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Scrivi un commento..."
                      value={newComments[post._id] || ""}
                      onChange={(e) =>
                        setNewComments({ ...newComments, [post._id]: e.target.value })
                      }
                    />
                    <Button type="submit" variant="primary">
                      Invia
                    </Button>
                  </Form>
                )}
              </Card.Body>
              <Card.Footer className="text-muted small text-end">
                {post.author}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogPostsList;
