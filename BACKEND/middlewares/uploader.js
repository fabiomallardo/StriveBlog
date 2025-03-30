import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads");

// Se la cartella non esiste, creala
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const uploader = multer({ storage });
export default uploader;
