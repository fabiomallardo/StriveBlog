import express from "express"
import BlogPostModel from "../models/BlogPost.js"
import Author from "../models/Author.js"
/* import uploader from"../middlewares/uploader.js" */
import isAuth from "../middlewares/isAuth.js"
import isAdmin from "../middlewares/isAdmin.js"
import BlogPost from "../models/BlogPost.js";
import { uploader } from "../utils/cloudinary.js"


const router = express.Router();
// Backend: GET /blogPosts
router.get("/", async (req, res) => {
  const { page = 1, limit = 10, title, category } = req.query;

  const query = {};

  if (title) query.title = new RegExp(title, "i");
  if (category) query.category = new RegExp(category, "i");


  try {
    const posts = await BlogPost.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await BlogPost.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (error) {
    console.error("Errore nel recupero dei post:", error);
    res.status(500).json({ message: "Errore durante il recupero dei post" });
  }
});


  

// GET singolo post
router.get("/:id", async (req, res) => {
  const post = await BlogPost.findById(req.params.id)
  if (!post) return res.status(404).send("Post non trovato")
  res.json(post)
})


router.post("/", isAuth, async (req, res) => {
  const author = await Author.findById(req.user.id)
  if (!author) return res.status(400).send("Autore non trovato")
  
  console.log("Autore trovato:", author); // Log per vedere se l'autore esiste
  
  const nuovoPost = new BlogPost({
    ...req.body,
    author: author.email,
  })

  try {
    await nuovoPost.save();
    res.status(201).json(nuovoPost);
  } catch (error) {
    console.error("Errore nel salvataggio del post:", error);
    res.status(500).send("Errore durante la creazione del post");
  }
})


// PUT modifica un post del blog (solo admin)
router.put("/:id", isAuth, isAdmin, async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { title, content, category },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post non trovato" });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Errore durante la modifica del post" });
  }
});


// DELETE un post
router.delete("/:id", isAuth, isAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id); // Trova e elimina il post
    if (!post) return res.status(404).send("Post non trovato");
    res.send("Post eliminato");
  } catch (error) {
    res.status(500).send("Errore durante l'eliminazione del post");
  }
});




// GET tutti i post di uno specifico autore
router.get("/author/:email", async (req, res) => {
  const posts = await BlogPost.find({ author: req.params.email })
  res.json(posts)
})

router.patch("/:id/cover", uploader.single("cover"), async (req, res) => {
  const coverURL = req.file.path;
  console.log("Nuova cover URL:", coverURL); // Log per vedere l'URL della copertura

  const post = await BlogPost.findByIdAndUpdate(
    req.params.id,
    { cover: coverURL },
    { new: true }
  );
  if (!post) return res.status(404).send("Post non trovato");

  res.json(post);
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { author, email, text } = req.body;

    if (!author || !email || !text) {
      return res.status(400).json({ message: "Dati mancanti nel commento" });
    }

    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    const newComment = {
      author,
      email, // 👈 questa è la chiave per evitare il ValidationError
      text,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      message: "Commento aggiunto",
      comments: post.comments,
    });
  } catch (err) {
    console.error("❌ Errore nel salvataggio del commento:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});


router.delete("/:postId/comments/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { email } = req.body; // 👈 ora confrontiamo email

    const post = await BlogPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trovato" });

    const comment = post.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: "Commento non trovato" });

    if (comment.email !== email) {
      return res.status(403).json({ message: "Non autorizzato a cancellare questo commento" });
    }

    comment.deleteOne(); // Rimuove il commento
    await post.save();

    res.status(200).json({ message: "Commento eliminato", comments: post.comments });
  } catch (err) {
    console.error("Errore eliminazione commento:", err);
    res.status(500).json({ message: "Errore del server" });
  }
});



export default router