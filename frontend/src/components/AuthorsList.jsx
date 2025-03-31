import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap"; // Per visualizzare il caricamento
import { jwtDecode } from "jwt-decode"; // Corretto: usa "jwtDecode"

const AuthorsList = () => {
  const [authors, setAuthors] = useState([]); // Stato per gli autori
  const [loading, setLoading] = useState(true); // Stato di caricamento
  const [error, setError] = useState(null); // Stato per l'errore

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Verifica se il token esiste e decodifica il token
    if (!token) {
      setError("Token mancante. Assicurati di essere loggato.");
      setLoading(false);
      return;
    }

    // Decodifica il token per verificare il ruolo
    const decodedToken = jwtDecode(token);
    // Qui puoi accedere a `decodedToken.role` per il controllo del ruolo
    if (decodedToken.role !== "admin") {
      setError("Accesso negato. Solo gli admin possono visualizzare gli autori.");
      setLoading(false);
      return;
    }

    // Se l'utente è admin, recupera gli autori
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/authors?page=1&limit=10`, {
          method: "GET",
          headers: {
            Authorization: ` Bearer ${token}`, 
          },
        });

        
    if (!response.ok) {
      const errorText = await response.text(); // Ottieni il testo della risposta in caso di errore
      throw new Error(`Errore nel recupero degli autori: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setAuthors(data.authors); // Imposta gli autori
        setLoading(false); // Imposta il caricamento a false
      } catch (error) {
        console.error("Errore durante il recupero degli autori:", error);
        setError(error.message); // Imposta il messaggio di errore
        setLoading(false); // Fermiamo il caricamento in caso di errore
      }
    };

    fetchAuthors();
  }, []); // Esegui solo al montaggio del componente

  // Se è in corso il caricamento, mostra il "loading spinner"
  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Caricamento autori...</p>
      </div>
    );
  }

  // Se c'è un errore, mostra l'errore
  if (error) {
    return (
      <div className="text-center mt-5">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Lista Autori</h2>
      <div className="row">
        {authors.length > 0 ? (
          authors.map((author) => (
            <div className="col-md-4 col-sm-6 mb-4" key={author._id}>
              <div className="card shadow-sm border-light">
                <img
                  src={author.avatar}
                  alt={author.nome}
                  className="card-img-top"
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "10px 10px 0 0",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title text-center">
                    {author.nome} {author.cognome}
                  </h5>
                  <p className="card-text text-center">
                    <small className="text-muted">{author.email}</small>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">Non ci sono autori registrati.</p>
        )}
      </div>
    </div>
  );
};

export default AuthorsList;
