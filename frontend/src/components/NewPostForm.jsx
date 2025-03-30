import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NewPostForm = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    cover: "",
    readTime: 1,
    content: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

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
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/blogPosts`, {
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
        await response.json();
        setSuccess("Post creato con successo!");
        setForm({ title: "", category: "", cover: "", readTime: 1, content: "" });

        // 🔁 Reindirizza alla homepage per vedere il nuovo post
        setTimeout(() => window.location.href = "/", 1000);
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
