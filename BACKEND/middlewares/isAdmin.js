const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accesso negato: solo admin' });
    }
    next(); // Se l'utente è un admin, consenti l'accesso
  };
  
  export default isAdmin;
  