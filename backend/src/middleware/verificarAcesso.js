const verificarAcesso = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.acesso_vitalicio) {
    return next();
  }

  if (!usuario.data_primeiro_login) {
    return next();
  }

  const agora = new Date();
  const primeiroLogin = new Date(usuario.data_primeiro_login);
  const diffMs = agora - primeiroLogin;
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias > 45) {
    return res.status(403).json({
      expirado: true,
      diasDecorridos: diffDias,
      mensagem: 'Seu acesso de 45 dias expirou.'
    });
  }

  req.diasRestantes = 45 - diffDias;
  next();
};

module.exports = verificarAcesso;
