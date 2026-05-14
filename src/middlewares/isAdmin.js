module.exports = (req, res, next) => {
  if (req.usuario.tipo !== "admin") {
    return res.status(403).json({ mensagem: "Acesso negado" });
  }

  next();
};