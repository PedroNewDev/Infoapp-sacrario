const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');
const verificarAcesso = require('../middleware/verificarAcesso');

const router = express.Router();

// GET /api/pedidos
router.get('/', autenticar, verificarAcesso, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT p.id, p.texto, p.contador_rezando, p.data_publicacao, u.nome
       FROM pedidos_oracao p
       JOIN usuarios u ON p.usuario_id = u.id
       WHERE p.data_expiracao > NOW()
       ORDER BY p.data_publicacao DESC
       LIMIT 50`,
      []
    );
    res.json({ pedidos: rows });
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/pedidos
router.post('/', autenticar, verificarAcesso, async (req, res) => {
  try {
    const { texto } = req.body;

    if (!texto || !texto.trim() || texto.length > 250) {
      return res.status(400).json({ erro: 'Texto deve ter entre 1 e 250 caracteres' });
    }

    // Verificar limite de 1 pedido por dia
    const [hoje] = await pool.execute(
      `SELECT id FROM pedidos_oracao
       WHERE usuario_id = ? AND DATE(data_publicacao) = CURDATE()`,
      [req.usuario.id]
    );

    if (hoje.length > 0) {
      return res.status(400).json({ erro: 'Você já fez um pedido hoje. Tente novamente amanhã.' });
    }

    const dataExpiracao = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    const [result] = await pool.execute(
      `INSERT INTO pedidos_oracao (usuario_id, texto, data_expiracao)
       VALUES (?, ?, ?)`,
      [req.usuario.id, texto.trim(), dataExpiracao]
    );

    res.json({
      sucesso: true,
      pedido: {
        id: result.insertId,
        texto: texto.trim(),
        contador_rezando: 0,
        data_publicacao: new Date(),
        nome: req.usuario.nome
      }
    });
  } catch (err) {
    console.error('Erro ao criar pedido:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/pedidos/:id/rezando
router.post('/:id/rezando', autenticar, verificarAcesso, async (req, res) => {
  try {
    const pedidoId = req.params.id;

    await pool.execute(
      `INSERT IGNORE INTO pedidos_interacoes (pedido_id, usuario_id) VALUES (?, ?)`,
      [pedidoId, req.usuario.id]
    );

    await pool.execute(
      `UPDATE pedidos_oracao SET contador_rezando = (
        SELECT COUNT(*) FROM pedidos_interacoes WHERE pedido_id = ?
      ) WHERE id = ?`,
      [pedidoId, pedidoId]
    );

    res.json({ sucesso: true });
  } catch (err) {
    console.error('Erro ao registrar interação:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
