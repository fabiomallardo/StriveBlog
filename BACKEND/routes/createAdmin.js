import express from "express";
import bcrypt from "bcryptjs";
import Author from "../models/Author.js"; // Assicurati che il modello Author sia corretto

const router = express.Router();

// Crea un nuovo admin manualmente
router.post("/", async (req, res) => {
  const { nome, cognome, email, password, gender} = req.body;

  try {
    // Verifica se l'email esiste già
    const existingAuthor = await Author.findOne({ email });
    if (existingAuthor) {
      return res.status(400).json({ message: "Autore con questa email già esistente" });
    }

    // Crea una password criptata
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crea l'autore con ruolo "admin"
    const newAdmin = new Author({
      nome,
      cognome,
      email,
      password: hashedPassword,
      gender,
      role: "admin", // Imposta direttamente il ruolo su admin
    });

    // Salva il nuovo admin nel database
    await newAdmin.save();
    res.status(201).json({ message: "Admin creato con successo" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore durante la creazione dell'admin. Riprova più tardi." });
  }
});

export default router;
