import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token mancante o malformato" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded 
    next()
  } catch (err) {
    return res.status(403).json({ message: "Token non valido" })
  }
}

export default isAuth
