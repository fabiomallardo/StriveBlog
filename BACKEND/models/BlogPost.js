import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  email: { type: String, required: true }, // 👈 aggiungi questo
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const blogPostSchema = new mongoose.Schema({
  category: String,
  title: String,
  cover: String,
  readTime: {
    value: Number,
    unit: String,
  },
  author: String, // email autore
  content: String,

  comments: [commentSchema], // 👈 aggiunto array embedded
});

export default mongoose.model("BlogPost", blogPostSchema);
