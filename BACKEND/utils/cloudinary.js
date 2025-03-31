import {v2 as cloudinary} from "cloudinary"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "strive-blog",
    format: async () => "png", // oppure 'jpeg'
    public_id: (req, file) => file.originalname,
  },
})

const uploader = multer({ storage })

 export { cloudinary, storage }
