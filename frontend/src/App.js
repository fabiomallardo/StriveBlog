import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Homepage from "./pages/Homepage.jsx";
import AuthorsList from "./components/AuthorsList.jsx";
import NewPostForm from "./components/NewPostForm.jsx";
import Profile from "./pages/Profile.jsx";
import Footer from "./components/Footer.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import PostDetail from "./components/PostDetail.jsx";
import { jwtDecode } from "jwt-decode";
import "font-awesome/css/font-awesome.min.css";

// Layout principale con Flexbox per spingere il footer giù
const App = () => {
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
      <div className="app-wrapper" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ flex: 1 }}>
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
            <Route path="/blogPosts/:id" element={<PostDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
