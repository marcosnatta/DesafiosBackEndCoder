export function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'ADMIN') {
      next(); 
    } else {
      res.status(403).json({ error: 'No tenés los permisos para realizar ésta operación'});
    }
};
  
export function isUser(req, res, next) {
  console.log('Middleware isUser - Inicio');
  if (req.session.user && req.session.user.role === 'user') {
    console.log('Usuario tiene el rol "user"');
    next();
  } else {
    console.log('Usuario no tiene el rol "user"');
    res.status(403).json({ error: 'No tenés los permisos para realizar esta operación' });
  }
}
