import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authorsRouter from "./routes/authors.js"; // Mantieni questa
import blogPostsRouter from "./routes/blogPosts.js";
import passport from "passport";
import authRoutes from "./routes/auth.js";
import createAdminRoutes from './routes/createAdmin.js'; // Assicurati che il percorso sia corretto
import { uploader } from "./utils/cloudinary.js"; // Importa l'uploader da Cloudinary

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Usa Multer + Cloudinary per caricare le immagini
app.post("/upload", uploader.single("avatar"), (req, res) => {
  // Verifica che il file sia stato caricato
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Controlla che il file sia effettivamente un'immagine
  const allowedFormats = ["image/jpeg", "image/png", "image/gif"];
  if (!allowedFormats.includes(req.file.mimetype)) {
    return res.status(400).json({ error: "Invalid file type. Only JPEG, PNG, and GIF are allowed." });
  }

  // L'URL dell'immagine su Cloudinary
  const imageUrl = req.file.path; // Questo è l'URL HTTPS di Cloudinary

  // Risposta di successo
  res.status(200).json({
    message: "Immagine caricata con successo",
    url: imageUrl, // Restituisce l'URL dell'immagine
  });
});


// Rotte
app.use("/authors", authorsRouter); // Solo una rotta per gli autori
app.use("/blogPosts", blogPostsRouter);
app.use("/auth", authRoutes);
app.use("/api/create-admin", createAdminRoutes); // Resta come rotta separata per creare admin

app.use(passport.initialize());

const PORT = process.env.PORT || 3001;

await mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connesso");
  app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
});
