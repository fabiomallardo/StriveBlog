# Strive Blog - Full Stack Blogging Platform

Strive Blog è un'applicazione full stack per la creazione e gestione di contenuti blog, con autenticazione, gestione utenti e ruoli, commenti, modifica profilo e dashboard di amministrazione.

## Obiettivi del progetto

- Creare una piattaforma moderna e responsive per la pubblicazione di articoli
- Consentire l'interazione tramite commenti
- Differenziare ruoli utente (admin / utente standard)
- Offrire funzionalità CRUD sui post
- Effettuare il deploy su cloud: Vercel (frontend) e Render (backend)

---

## Funzionalità principali

### Autenticazione

- Registrazione utente con nome, cognome, email, password e genere
- Login via form o tramite Google (OAuth 2.0)
- Accesso protetto da token JWT
- Salvataggio dei dati in `localStorage`

### Gestione contenuti

- Creazione di post da parte degli admin
- Lettura pubblica di tutti i post
- Categorie, tempo di lettura, immagine di copertina
- Ricerca per autore o categoria (facoltativa)

### Commenti

- Visualizzazione dei commenti per ogni post
- Solo utenti loggati possono commentare
- Solo l'autore del commento può eliminarlo

### Dashboard admin

- Accessibile solo dagli utenti con ruolo `admin`
- Visualizzazione e gestione autori
- Eliminazione post o autori

### Profilo utente

- Visualizzazione avatar, nome, bio ed email
- Modifica dell'immagine profilo (upload)
- Modifica biografia

---

## Stack tecnologico

### Frontend

- React
- React Router
- React-Bootstrap
- Fetch API

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Bcrypt
- Passport.js (Google OAuth)
- Multer (upload immagini)

---
