import React, { useState } from "react";

const AuthForm = ({ mode = "login", onSuccess }) => {
  const [form, setForm] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    gender: "", // Aggiungi il campo gender
  });

  const isLogin = mode === "login";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin ? "/auth/login" : "/auth/register";
    const payload = isLogin
      ? { email: form.email, password: form.password }
      : form; // Aggiungi form completo (con gender)

      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split(".")[1])); // decodifica il token
        localStorage.setItem("userId", payload.id); // salva l'ID utente
        localStorage.setItem("userNome", payload.nome) 
        localStorage.setItem("userCognome", payload.cognome)
        localStorage.setItem("userGender", payload.gender); // Salva il genere dell'utente
        localStorage.setItem("userEmail", payload.email);
        onSuccess?.(); // chiamata per aggiornare lo stato nel componente genitore
      } else {
        alert("Registrazione completata! Ora effettua il login.");
      }
    } else {
      alert("Errore! Verifica i dati inseriti.");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3001/auth/google";
  };

  return (
    <div className="auth-wrapper">
    <div className="card p-4 shadow-sm mx-auto" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-3">{isLogin ? "Login" : "Registrati"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <div className="mb-2">
              <input
                className="form-control"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-2">
              <input
                className="form-control"
                name="cognome"
                placeholder="Cognome"
                value={form.cognome}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}
        <div className="mb-2">
          <input
            className="form-control"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Aggiungi il campo per il genere alla fine */}
        {!isLogin && (
          <div className="mb-3">
            <div>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="maschio"
                  onChange={handleChange}
                  checked={form.gender === "maschio"}
                />
                Maschio
              </label>
              <label className="ms-3">
                <input
                  type="radio"
                  name="gender"
                  value="femmina"
                  onChange={handleChange}
                  checked={form.gender === "femmina"}
                />
                Femmina
              </label>
            </div>
          </div>
        )}

        <button className="btn btn-primary w-100" type="submit">
          {isLogin ? "Login" : "Registrati"}
        </button>
      </form>

      <button className="btn btn-danger w-100 mt-3" onClick={handleGoogleLogin}>
        {isLogin ? "Accedi con Google" : "Registrati con Google"}
      </button>
    </div>
    </div>
  );
};

export default AuthForm;
