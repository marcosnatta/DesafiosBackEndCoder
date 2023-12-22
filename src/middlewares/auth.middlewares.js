export function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === "ADMIN") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para administradores" }); 
  }
}

export function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === "user") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para usuarios" }); 
  }
}


export function isPremium(req, res, next) {
  console.log(req.session.user)
  if (req.session.user && req.session.user.role === "premium") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para usuarios premium" });
  }
}