// server.js
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import authorsRouter from "./routes/authors.js"    // Mantieni questa
import blogPostsRouter from "./routes/blogPosts.js"
import passport from "passport"
import authRoutes from "./routes/auth.js"
import path from 'path';
import createAdminRoutes from './routes/createAdmin.js' // Assicurati che il percorso sia corretto

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.resolve("uploads")));

// Rotte
app.use("/authors", authorsRouter)    // Solo una rotta per gli autori
app.use("/blogPosts", blogPostsRouter)
app.use("/auth", authRoutes)
app.use("/api/create-admin", createAdminRoutes);  // Resta come rotta separata per creare admin

app.use(passport.initialize())

const PORT = process.env.PORT || 3001

await mongoose.connect(process.env.MONGO_URL).then(() => {
  console.log("MongoDB connesso")
  app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`))
})

