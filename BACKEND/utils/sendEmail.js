import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"

dotenv.config()

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (to, name) => {
  const msg = {
    to,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: "Benvenuto su Strive Blog!",
    html: `<h2>Ciao ${name} 👋</h2>
           <p>Grazie per esserti registrato come autore sul nostro blog ✨</p>
           <p>Inizia a pubblicare articoli e condividi le tue idee con il mondo 🌍</p>`,
  }

  try {
    await sgMail.send(msg)
    console.log(`✅ Email inviata a ${to}`)
  } catch (error) {
    console.error("Errore nell'invio email:", error)
  }
}

export default sendWelcomeEmail
