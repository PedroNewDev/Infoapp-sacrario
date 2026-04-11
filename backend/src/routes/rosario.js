const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');
const verificarAcesso = require('../middleware/verificarAcesso');

const router = express.Router();

// POST /api/rosario/registrar
router.post('/registrar', autenticar, verificarAcesso, async (req, res) => {
  try {
    const { misterio } = req.body;

    await pool.execute(
      'INSERT INTO rosarios_rezados (usuario_id, misterio) VALUES (?, ?)',
      [req.usuario.id, misterio || 'completo']
    );

    const [count] = await pool.execute(
      'SELECT COUNT(*) as total FROM rosarios_rezados WHERE usuario_id = ?',
      [req.usuario.id]
    );

    res.json({ sucesso: true, totalRosarios: count[0].total });
  } catch (err) {
    console.error('Erro ao registrar rosário:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// GET /api/rosario/contagem
router.get('/contagem', autenticar, async (req, res) => {
  try {
    const [count] = await pool.execute(
      'SELECT COUNT(*) as total FROM rosarios_rezados WHERE usuario_id = ?',
      [req.usuario.id]
    );
    res.json({ totalRosarios: count[0].total });
  } catch (err) {
    console.error('Erro ao buscar contagem:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
