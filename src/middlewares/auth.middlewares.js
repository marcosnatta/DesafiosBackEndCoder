export function isUser(req, res, next) {
  const user = req.user; // Obtén el usuario desde la sesión (asegúrate de que passport haya configurado req.user)

  if (user && user.role === "user") {
    next(); // Usuario autenticado y con rol de "user", continúa
  } else {
    res.status(403).json({ error: "Acceso no autorizado para usuarios" }); // Usuario no autorizado
  }
}

export function isAdmin(req, res, next) {
  const user = req.user; // Obtén el usuario desde la sesión (asegúrate de que passport haya configurado req.user)

  if (user && user.role === "ADMIN") {
    next(); // Usuario autenticado y con rol de "ADMIN", continúa
  } else {
    res.status(403).json({ error: "Acceso no autorizado para administradores" }); // Usuario no autorizado
  }
}

