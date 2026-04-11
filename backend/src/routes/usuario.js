const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');

const router = express.Router();

// PUT /api/usuario/onboarding
router.put('/onboarding', autenticar, async (req, res) => {
  try {
    const { nome, intencao_principal, horario_notificacao } = req.body;
    const userId = req.usuario.id;

    await pool.execute(
      `UPDATE usuarios SET
        nome = COALESCE(?, nome),
        intencao_principal = ?,
        horario_notificacao = ?,
        onboarding_completo = 1
      WHERE id = ?`,
      [nome, intencao_principal, horario_notificacao, userId]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro no onboarding:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/usuario/intencao
router.put('/intencao', autenticar, async (req, res) => {
  try {
    const { intencao_principal } = req.body;
    await pool.execute(
      'UPDATE usuarios SET intencao_principal = ? WHERE id = ?',
      [intencao_principal, req.usuario.id]
    );
    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao atualizar intenção:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// PUT /api/usuario/interesse-loja
router.put('/interesse-loja', autenticar, async (req, res) => {
  try {
    await pool.execute(
      'UPDATE usuarios SET interesse_loja = 1 WHERE id = ?',
      [req.usuario.id]
    );
    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao registrar interesse:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
