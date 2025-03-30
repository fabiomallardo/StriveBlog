import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import Author from "../models/Author.js"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

dotenv.config()

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const existingUser = await Author.findOne({ googleId: profile.id })

      if (existingUser) return done(null, existingUser)

      const newUser = new Author({
        nome: profile.name.givenName,
        cognome: profile.name.familyName,
        email: profile.emails[0].value,
        avatar: profile.photos[0].value,
        googleId: profile.id,
      })

      await newUser.save()
      return done(null, newUser)
    }
  )
)
