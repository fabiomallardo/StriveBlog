import mongoose from "mongoose"

const authorSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  email: { type: String, unique: true },
  dataDiNascita: String,
  avatar: String,
  password: String, 
  googleId: String, 
  bio : String,
  role : {
    type : String,
    enum: ["user", "admin"],
    default : "user",
  },
  gender: { type: String, enum: ["maschio", "femmina"], required: true },
}, {timestamps: true})


export default mongoose.model("Author", authorSchema)
