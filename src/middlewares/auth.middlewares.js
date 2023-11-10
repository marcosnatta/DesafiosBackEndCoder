export function isAdmin(req, res, next) {
  const user = req.user; 
 
  if (user && user.role === "ADMIN") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para administradores" }); 
  }
}

export function isUser(req, res, next) {
  const user = req.user; 
  if (user && user.role === "user") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para usuarios" }); 
  }
}


export function isPremium(req, res, next) {
  const user = req.user; 

  if (user && user.role === "premium") {
    next(); 
  } else {
    res.status(403).json({ error: "Acceso no autorizado para usuarios premium" });
  }
}

