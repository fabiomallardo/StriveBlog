import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap"; // Per lo spinner di caricamento

const NewPostForm = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    cover: "",
    readTime: 1,
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // Gestione degli errori
  const [success, setSuccess] = useState(""); // Gestione del successo
  const [posts, setPosts] = useState([]); // Elenco dei post creati

  // Caricamento dei post esistenti all'avvio del componente
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:3001/blogPosts", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPosts(data.blogPosts || []); // Salviamo i post esistenti
          } else {
            throw new Error("Errore nel recupero dei post.");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchPosts();
  }, []); // Carichiamo i post quando la pagina viene caricata

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Devi essere loggato per pubblicare un post!");
      return;
    }

    setLoading(true);
    setError(""); // Resetta eventuali errori
    setSuccess(""); // Resetta eventuali successi

    try {
      const response = await fetch("http://localhost:3001/blogPosts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          readTime: {
            value: parseInt(form.readTime),
            unit: "min",
          },
        }),
      });

      if (response.ok) {
        const newPost = await response.json(); // Ottieni il nuovo post creato dal server
        setPosts((prevPosts) => [newPost, ...prevPosts]); // Aggiungi il nuovo post alla lista
        setSuccess("Post creato con successo!");
        setForm({ title: "", category: "", cover: "", readTime: 1, content: "" }); // Reset del modulo
      } else {
        throw new Error("Errore nella creazione del post");
      }
    } catch (error) {
      setError("C'è stato un errore durante la creazione del post. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit} className="new-post-form">
        <h2 className="text-center mb-4">Crea un Nuovo Post</h2>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="card p-4 shadow-sm rounded">
          <div className="form-group mb-3">
            <label htmlFor="title">Titolo</label>
            <input
              id="title"
              name="title"
              placeholder="Inserisci il titolo del post"
              value={form.title}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="category">Categoria</label>
            <input
              id="category"
              name="category"
              placeholder="Categoria"
              value={form.category}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="cover">Immagine di Copertina (URL)</label>
            <input
              id="cover"
              name="cover"
              placeholder="URL immagine di copertina"
              value={form.cover}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="readTime">Tempo di Lettura (minuti)</label>
            <input
              id="readTime"
              name="readTime"
              type="number"
              placeholder="Tempo di lettura"
              value={form.readTime}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="content">Contenuto</label>
            <textarea
              id="content"
              name="content"
              placeholder="Scrivi il contenuto del post"
              value={form.content}
              onChange={handleChange}
              required
              className="form-control"
              rows="6"
            ></textarea>
          </div>

          <div className="d-flex justify-content-center">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "disabled" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" />
              ) : (
                "Pubblica il Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm;
