import React, { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm.jsx";
import BlogPostsList from "../components/BlogPostsList.jsx";
import sfondo from "../assets/sfondo-login.jpg"; // Importa l'immagine di sfondo

const Homepage = () => {
  const [mode, setMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userNome") || "");
  const [userGender, setUserGender] = useState(localStorage.getItem("userGender") || "");

  // Quando il componente viene caricato, aggiorniamo lo stato in base al token di autenticazione
  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setUserName(localStorage.getItem("userNome") || "");
    setUserGender(localStorage.getItem("userGender") || "");
  }, []);

  // Funzione di logout
  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserName("");
    setUserGender("");
    setMode(null);
    window.location.reload();
  };

  // Funzione di login success
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUserName(localStorage.getItem("userNome") || "");
    setUserGender(localStorage.getItem("userGender") || "");
    setMode(null);
    window.location.reload();
  };

  // Funzione per togglare la visualizzazione del form
  const toggleForm = (formType) => {
    setMode((prev) => (prev === formType ? null : formType));
  };

  return (
    <div
      className={`${
        !isAuthenticated ? "vh-100 vw-100" : "" // Applica vh-100 e vw-100 solo quando non è autenticato
      }`} 
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: !isAuthenticated ? `url(${sfondo})` : "none", // Applica lo sfondo solo quando non è autenticato
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      }}
    >
      {!isAuthenticated ? (
        <div className="container h-100 d-flex flex-column justify-content-center align-items-start px-4">
          <h1 className="text-white mb-3 fs-2">Benvenuto su Strive Blog</h1>
          <p className="lead text-white mb-4">
            Condividi articoli, leggi contenuti tech, e scopri nuovi autori!
          </p>

          <div className="mb-3 d-flex gap-3 flex-wrap">
            <button className="btn btn-primary" onClick={() => toggleForm("login")}>
              Login
            </button>
            <button className="btn btn-success" onClick={() => toggleForm("register")}>
              Registrati
            </button>
          </div>

          {mode && (
            <div
              className="p-4 rounded shadow"
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                width: "100%",
                maxWidth: "400px",
              }}
            >
              <AuthForm mode={mode} onSuccess={handleLoginSuccess} />
            </div>
          )}
        </div>
      ) : (
        <div className="container py-5">
          <h1 className="mb-4">
            🎉 {userGender === "femmina" ? "Benvenuta" : "Benvenuto"} {userName}!
          </h1>
          <BlogPostsList />
        </div>
      )}
    </div>
  );
};

export default Homepage;
