const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        erro: 'E-mail não encontrado. Verifique se está usando o mesmo e-mail da sua compra.'
      });
    }

    const usuario = rows[0];

    if (!usuario.senha_hash) {
      return res.status(401).json({
        erro: 'Você ainda não definiu sua senha. Verifique seu e-mail para o link de primeiro acesso.',
        primeiroAcesso: true
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta' });
    }

    // Atualizar primeiro login se necessário
    if (!usuario.data_primeiro_login) {
      await pool.execute(
        'UPDATE usuarios SET data_primeiro_login = NOW(), data_ultimo_acesso = NOW() WHERE id = ?',
        [usuario.id]
      );
    } else {
      await pool.execute(
        'UPDATE usuarios SET data_ultimo_acesso = NOW() WHERE id = ?',
        [usuario.id]
      );
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Calcular dias restantes para o countdown
    let diasRestantes = null;
    const loginDate = usuario.data_primeiro_login || new Date();
    if (!usuario.acesso_vitalicio && loginDate) {
      const diffMs = new Date() - new Date(loginDate);
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diasRestantes = Math.max(0, 45 - diffDias);
    }

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        acesso_vitalicio: !!usuario.acesso_vitalicio,
        modulo_audio: !!usuario.modulo_audio,
        upsell_limpeza: !!usuario.upsell_limpeza,
        onboarding_completo: !!usuario.onboarding_completo,
        intencao_principal: usuario.intencao_principal,
        horario_notificacao: usuario.horario_notificacao,
        data_primeiro_login: usuario.data_primeiro_login,
        diasRestantes
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/auth/definir-senha (primeiro acesso via token)
router.post('/definir-senha', async (req, res) => {
  try {
    const { token, senha } = req.body;

    if (!token || !senha) {
      return res.status(400).json({ erro: 'Token e senha são obrigatórios' });
    }

    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter no mínimo 6 caracteres' });
    }

    const [rows] = await pool.execute(
      'SELECT * FROM usuarios WHERE token_primeiro_acesso = ? AND token_expiracao > NOW()',
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ erro: 'Token inválido ou expirado. Solicite um novo link.' });
    }

    const usuario = rows[0];
    const senhaHash = await bcrypt.hash(senha, 10);

    await pool.execute(
      'UPDATE usuarios SET senha_hash = ?, token_primeiro_acesso = NULL, token_expiracao = NULL, data_primeiro_login = NOW() WHERE id = ?',
      [senhaHash, usuario.id]
    );

    const jwtToken = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    res.json({
      token: jwtToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        acesso_vitalicio: !!usuario.acesso_vitalicio,
        modulo_audio: !!usuario.modulo_audio,
        upsell_limpeza: !!usuario.upsell_limpeza,
        onboarding_completo: false,
        intencao_principal: null,
        horario_notificacao: null,
        data_primeiro_login: new Date()
      }
    });
  } catch (err) {
    console.error('Erro ao definir senha:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/auth/esqueci-senha
router.post('/esqueci-senha', async (req, res) => {
  try {
    const { email } = req.body;

    const [rows] = await pool.execute(
      'SELECT id FROM usuarios WHERE email = ?',
      [email.toLowerCase().trim()]
    );

    // Sempre retorna sucesso para não expor se o e-mail existe
    if (rows.length > 0) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiracao = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

      await pool.execute(
        'UPDATE usuarios SET token_primeiro_acesso = ?, token_expiracao = ? WHERE id = ?',
        [token, expiracao, rows[0].id]
      );

      // TODO: Integrar envio de e-mail com link de reset
      console.log(`[RESET SENHA] Token gerado para ${email}: ${token}`);
    }

    res.json({ mensagem: 'Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.' });
  } catch (err) {
    console.error('Erro no reset de senha:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/auth/me — retorna dados do usuário logado
router.get('/me', autenticar, async (req, res) => {
  const u = req.usuario;

  let diasRestantes = null;
  if (!u.acesso_vitalicio && u.data_primeiro_login) {
    const diffMs = new Date() - new Date(u.data_primeiro_login);
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    diasRestantes = Math.max(0, 45 - diffDias);
  }

  res.json({
    usuario: {
      id: u.id,
      nome: u.nome,
      email: u.email,
      acesso_vitalicio: !!u.acesso_vitalicio,
      modulo_audio: !!u.modulo_audio,
      upsell_limpeza: !!u.upsell_limpeza,
      onboarding_completo: !!u.onboarding_completo,
      intencao_principal: u.intencao_principal,
      horario_notificacao: u.horario_notificacao,
      data_primeiro_login: u.data_primeiro_login,
      interesse_loja: !!u.interesse_loja,
      diasRestantes
    }
  });
});

module.exports = router;
