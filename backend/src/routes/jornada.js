const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');
const verificarAcesso = require('../middleware/verificarAcesso');

const router = express.Router();

// GET /api/jornada/progresso
router.get('/progresso', autenticar, verificarAcesso, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT dia, concluido, intencao_texto, data_conclusao FROM jornada_progresso WHERE usuario_id = ? ORDER BY dia',
      [req.usuario.id]
    );

    const diasConcluidos = rows.filter(r => r.concluido).map(r => r.dia);
    const diaAtual = diasConcluidos.length > 0 ? Math.max(...diasConcluidos) + 1 : 1;

    res.json({
      progresso: rows,
      diasConcluidos,
      diaAtual: Math.min(diaAtual, 21),
      totalConcluidos: diasConcluidos.length,
      percentual: Math.round((diasConcluidos.length / 21) * 100),
      jornadaCompleta: diasConcluidos.length >= 21
    });
  } catch (err) {
    console.error('Erro ao buscar progresso:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

// POST /api/jornada/concluir
router.post('/concluir', autenticar, verificarAcesso, async (req, res) => {
  try {
    const { dia, intencao_texto } = req.body;

    if (!dia || dia < 1 || dia > 21) {
      return res.status(400).json({ erro: 'Dia inválido' });
    }

    if (!intencao_texto || !intencao_texto.trim()) {
      return res.status(400).json({ erro: 'A intenção é obrigatória para concluir o dia' });
    }

    if (intencao_texto.length > 250) {
      return res.status(400).json({ erro: 'Intenção deve ter no máximo 250 caracteres' });
    }

    // Verificar se o dia anterior está concluído (exceto dia 1)
    if (dia > 1) {
      const [anterior] = await pool.execute(
        'SELECT concluido FROM jornada_progresso WHERE usuario_id = ? AND dia = ? AND concluido = 1',
        [req.usuario.id, dia - 1]
      );
      if (anterior.length === 0) {
        return res.status(400).json({ erro: 'Você precisa concluir o dia anterior primeiro' });
      }
    }

    await pool.execute(
      `INSERT INTO jornada_progresso (usuario_id, dia, concluido, intencao_texto, data_conclusao)
       VALUES (?, ?, 1, ?, NOW())
       ON DUPLICATE KEY UPDATE concluido = 1, intencao_texto = ?, data_conclusao = NOW()`,
      [req.usuario.id, dia, intencao_texto.trim(), intencao_texto.trim()]
    );

    res.json({
      sucesso: true,
      dia,
      proximoDia: dia < 21 ? dia + 1 : null,
      jornadaCompleta: dia >= 21
    });
  } catch (err) {
    console.error('Erro ao concluir dia:', err);
    res.status(500).json({ erro: 'Erro interno do servidor' });
  }
});

module.exports = router;
