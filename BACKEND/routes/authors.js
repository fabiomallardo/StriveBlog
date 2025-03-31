// routes/authors.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Author from "../models/Author.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
/* import uploader from "../middlewares/uploader.js"; */
import sendWelcomeEmail from "../utils/sendEmail.js";
import { uploader } from "../utils/cloudinary.js";

const router = express.Router();

// ✅ GET tutti gli autori (SOLO ADMIN)
router.get("/", isAuth, isAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const authors = await Author.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Author.countDocuments();

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      authors,
    });
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli autori" });
  }
});

// GET autore singolo
router.get("/:id", isAuth, async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);  // Trova autore per ID
    if (!author) {
      return res.status(404).send("Autore non trovato");
    }
    res.json(author);  // Ritorna i dati dell'autore
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero dei dati dell'autore" });
  }
});



// ✅ POST nuovo autore
router.post("/", async (req, res) => {
  const nuovoAutore = new Author(req.body);
  try {
    await nuovoAutore.save();
    await sendWelcomeEmail(nuovoAutore.email, nuovoAutore.nome);
    res.status(201).json(nuovoAutore);
  } catch (err) {
    res.status(500).json({ message: "Errore durante la creazione dell'autore" });
  }
});

// PUT modifica autore (bio + avatar)
router.put("/:id", uploader.single("avatar"), async (req, res) => {
  try {
    const { nome, cognome, email, bio } = req.body;
    const updateData = {};

    if (nome) updateData.nome = nome;
    if (cognome) updateData.cognome = cognome;
    if (email) updateData.email = email;
    if (bio) updateData.bio = bio;

    // Se è stato caricato un file, utilizza l'URL di Cloudinary
    if (req.file) {
      updateData.avatar = req.file.path;
    }

    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedAuthor) return res.status(404).send("Autore non trovato");

    res.json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ error: "Errore interno del server" });
  }
});


// DELETE /authors/:id
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).send("Autore non trovato");
    res.send("Autore eliminato");
  } catch (error) {
    res.status(500).send("Errore durante l'eliminazione dell'autore");
  }
});


router.patch("/:id/avatar", uploader.single("avatar"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Nessun file caricato");
  }

  const avatarURL = req.file.path; // Questo è l'URL dell'immagine su Cloudinary
  const author = await Author.findByIdAndUpdate(req.params.id, { avatar: avatarURL }, { new: true });
  
  if (!author) return res.status(404).send("Autore non trovato");

  res.json(author);
});



export default router;
