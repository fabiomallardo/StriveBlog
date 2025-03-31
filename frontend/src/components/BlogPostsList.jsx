import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col, Alert, Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // Importa Link

const BlogPostsList = () => {
  const [posts, setPosts] = useState([]);

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

  return (
    <Container className="py-4">
      <Row className="g-4">
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
              </Card.Body>

              <Card.Footer className="text-muted small d-flex justify-content-between align-items-center">
                <span>{post.author}</span>
                {/* Bottone per leggere l'articolo per intero */}
                <Button as={Link} to={`/blogPosts/${post._id}`} variant="outline-primary" size="sm">
                  Leggi Articolo
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BlogPostsList;
