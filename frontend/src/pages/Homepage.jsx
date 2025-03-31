import React, { useState, useEffect } from "react";
import AuthForm from "../components/AuthForm.jsx";
import BlogPostsList from "../components/BlogPostsList.jsx";
import sfondo from "../assets/sfondo-login.jpg";

const Homepage = () => {
  const [mode, setMode] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [userName, setUserName] = useState(localStorage.getItem("userNome") || "");
  const [userGender, setUserGender] = useState(localStorage.getItem("userGender") || "");

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("token"));
    setUserName(localStorage.getItem("userNome") || "");
    setUserGender(localStorage.getItem("userGender") || "");
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserName("");
    setUserGender("");
    setMode(null);
    window.location.reload();
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setUserName(localStorage.getItem("userNome") || "");
    setUserGender(localStorage.getItem("userGender") || "");
    setMode(null);
    window.location.reload();
  };

  const toggleForm = (formType) => {
    setMode((prev) => (prev === formType ? null : formType));
  };

  return (
    <div
      className="vh-100 vw-100"
      style={{
        margin: 0,
        padding: 0,
        backgroundImage: !isAuthenticated ? `url(${sfondo})` : "none",
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
