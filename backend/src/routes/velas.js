const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');
const verificarAcesso = require('../middleware/verificarAcesso');

const router = express.Router();

// GET /api/velas — velas acesas (altar)
router.get('/', autenticar, verificarAcesso, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT v.id, v.intencao, v.data_acendimento, v.data_expiracao, u.nome
       FROM velas_virtuais v
       JOIN usuarios u ON v.usuario_id = u.id
       WHERE v.status = 'acesa' AND v.data_expiracao > NOW()
       ORDER BY v.data_acendimento DESC`,
      []
    );
    res.json({ velas: rows });
  } catch (err) {
    console.error('Erro ao buscar velas:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/velas/minhas — histórico de velas do usuário
router.get('/minhas', autenticar, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT id, intencao, data_acendimento, data_expiracao, status
       FROM velas_virtuais
       WHERE usuario_id = ?
       ORDER BY data_acendimento DESC`,
      [req.usuario.id]
    );
    res.json({ velas: rows });
  } catch (err) {
    console.error('Erro ao buscar minhas velas:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
