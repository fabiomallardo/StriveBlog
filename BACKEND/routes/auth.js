import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import passport from "passport"
import "../auth/passport.js"
import Author from "../models/Author.js"
import isAuth  from '../middlewares/isAuth.js';
import isAdmin  from '../middlewares/isAdmin.js';

const router = express.Router()


router.post("/register", async (req, res) => {
  const { nome, cognome, email, password, gender } = req.body;  // Aggiungi gender

  // Verifica se l'utente esiste già
  const existingUser = await Author.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Utente già registrato!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Author({
    nome,
    cognome,
    email,
    password: hashedPassword,
    gender,  // Salva il campo gender
  });

  await newUser.save();
  res.status(201).json({ message: "Registrazione completata" });
});


// Login dell'autore (inclusione del ruolo nel token)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const author = await Author.findOne({ email });
    if (!author) return res.status(404).json({ message: "Autore non trovato" });

    const isMatch = await bcrypt.compare(password, author.password);
    if (!isMatch) return res.status(400).json({ message: "Password errata" });

    const token = jwt.sign(
      { id: author._id, role: author.role, nome: author.nome, cognome: author.cognome, gender : author.gender, email : author.email},  // Aggiungi i dati dell'autore
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Errore durante il login" });
  }
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.redirect(`http://localhost:3000?token=${token}`)
  }
)

export default router
