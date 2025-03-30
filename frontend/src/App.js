import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx"; 
import Homepage from "./pages/Homepage.jsx";
import AuthorsList from "./components/AuthorsList.jsx";
import NewPostForm from "./components/NewPostForm.jsx";
import Profile from "./pages/Profile.jsx";  
import Footer from "./components/Footer.jsx";
import 'font-awesome/css/font-awesome.min.css';
import AdminDashboard from "./components/AdminDashboard.jsx";
import { jwtDecode } from "jwt-decode";
import PostDetail from "./components/PostDetail.jsx";  // Importa il nuovo componente PostDetail

function App() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  let isAdmin = false;
  if (isAuthenticated) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === "admin";
    } catch (err) {
      console.error("Token non valido:", err);
    }
  }

  return (
    <Router>
      <Navbar />
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/authors"
            element={isAuthenticated ? <AuthorsList /> : <Navigate to="/" />}
          />
          <Route
            path="/new-post"
            element={isAuthenticated ? <NewPostForm /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/admin"
            element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/" />}
          />
          
          {/* Aggiungi la rotta per il post completo */}
          <Route path="/post/:id" element={<PostDetail />} />  {/* Nuova rotta per il post completo */}
          
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
