const express = require('express');
const pool = require('../db/connection');
const autenticar = require('../middleware/autenticar');

const router = express.Router();

// Definições das 8 conquistas
const CONQUISTAS = [
  {
    key: 'primeiro_misterio',
    nome: 'Primeiro Mistério',
    descricao: 'Complete o Dia 1 da jornada',
    icone: '✦',
    categoria: 'jornada'
  },
  {
    key: 'devota_fiel',
    nome: 'Devota Fiel',
    descricao: 'Complete 7 dias consecutivos',
    icone: '🕯️',
    categoria: 'jornada'
  },
  {
    key: 'perseveranca',
    nome: 'Perseverança',
    descricao: 'Complete 14 dias consecutivos',
    icone: '📿',
    categoria: 'jornada'
  },
  {
    key: 'consagrada',
    nome: 'Consagrada a Maria',
    descricao: 'Complete os 21 dias da jornada',
    icone: '👑',
    categoria: 'jornada'
  },
  {
    key: 'rosa_mistica',
    nome: 'Rosa Mística',
    descricao: 'Reze 10 rosários completos',
    icone: '🌹',
    categoria: 'devocao'
  },
  {
    key: 'intercessora',
    nome: 'Intercessora',
    descricao: 'Envie 5 pedidos de oração',
    icone: '🙏',
    categoria: 'devocao'
  },
  {
    key: 'chama_viva',
    nome: 'Chama Viva',
    descricao: 'Acenda 10 velas pela comunidade',
    icone: '🔥',
    categoria: 'devocao'
  },
  {
    key: 'estrela_da_manha',
    nome: 'Estrela da Manhã',
    descricao: 'Acesse o app por 30 dias',
    icone: '⭐',
    categoria: 'devocao'
  }
];

// Calcula streak (dias consecutivos de atividade)
async function calcularStreak(usuarioId) {
  const [rows] = await pool.execute(
    'SELECT data FROM atividade_diaria WHERE usuario_id = ? ORDER BY data DESC',
    [usuarioId]
  );

  if (rows.length === 0) return 0;

  let streak = 0;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  for (let i = 0; i < rows.length; i++) {
    const dataAtividade = new Date(rows[i].data);
    dataAtividade.setHours(0, 0, 0, 0);

    const diasAtras = Math.round((hoje - dataAtividade) / (1000 * 60 * 60 * 24));

    if (diasAtras === i || (i === 0 && diasAtras <= 1)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// Verifica e desbloqueia conquistas automaticamente
async function verificarConquistas(usuarioId) {
  const novasConquistas = [];

  // Buscar conquistas já desbloqueadas
  const [jaDesbloqueadas] = await pool.execute(
    'SELECT conquista_key FROM conquistas_usuario WHERE usuario_id = ?',
    [usuarioId]
  );
  const desbloqueadas = new Set(jaDesbloqueadas.map(r => r.conquista_key));

  // Dados para verificação
  const [jornadaRows] = await pool.execute(
    'SELECT dia FROM jornada_progresso WHERE usuario_id = ? AND concluido = 1 ORDER BY dia',
    [usuarioId]
  );
  const diasConcluidos = jornadaRows.map(r => r.dia);

  const [rosarioCount] = await pool.execute(
    'SELECT COUNT(*) as total FROM rosarios_rezados WHERE usuario_id = ?',
    [usuarioId]
  );

  const [pedidosCount] = await pool.execute(
    'SELECT COUNT(*) as total FROM pedidos_oracao WHERE usuario_id = ?',
    [usuarioId]
  );

  const [velasCount] = await pool.execute(
    'SELECT COUNT(*) as total FROM velas_virtuais WHERE usuario_id = ?',
    [usuarioId]
  );

  const [diasAtivos] = await pool.execute(
    'SELECT COUNT(*) as total FROM atividade_diaria WHERE usuario_id = ?',
    [usuarioId]
  );

  // Calcular dias consecutivos na jornada
  let maxConsecutivos = 0;
  let consecutivos = 0;
  for (let i = 0; i < diasConcluidos.length; i++) {
    if (i === 0 || diasConcluidos[i] === diasConcluidos[i - 1] + 1) {
      consecutivos++;
    } else {
      consecutivos = 1;
    }
    maxConsecutivos = Math.max(maxConsecutivos, consecutivos);
  }

  // Verificar cada conquista
  const checks = {
    primeiro_misterio: diasConcluidos.includes(1),
    devota_fiel: maxConsecutivos >= 7,
    perseveranca: maxConsecutivos >= 14,
    consagrada: diasConcluidos.length >= 21,
    rosa_mistica: rosarioCount[0].total >= 10,
    intercessora: pedidosCount[0].total >= 5,
    chama_viva: velasCount[0].total >= 10,
    estrela_da_manha: diasAtivos[0].total >= 30
  };

  for (const [key, condicao] of Object.entries(checks)) {
    if (condicao && !desbloqueadas.has(key)) {
      await pool.execute(
        'INSERT IGNORE INTO conquistas_usuario (usuario_id, conquista_key) VALUES (?, ?)',
        [usuarioId, key]
      );
      novasConquistas.push(key);
    }
  }

  return novasConquistas;
}

// POST /api/perfil/atividade — registra acesso diário
router.post('/atividade', autenticar, async (req, res) => {
  try {
    const agora = new Date();
    const horaAtual = `${agora.getHours()}:${agora.getMinutes()}:${agora.getSeconds()}`;

    await pool.execute(
      `INSERT IGNORE INTO atividade_diaria (usuario_id, data, hora_acesso) VALUES (?, CURDATE(), ?)`,
      [req.usuario.id, horaAtual]
    );

    // Verificar conquistas sempre que registra atividade
    const novasConquistas = await verificarConquistas(req.usuario.id);

    res.json({ registrado: true, novasConquistas });
  } catch (err) {
    console.error('Erro ao registrar atividade:', err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// GET /api/perfil/stats — retorna todas as stats do perfil
router.get('/stats', autenticar, async (req, res) => {
  try {
    const uid = req.usuario.id;

    // Jornada
    const [jornadaRows] = await pool.execute(
      'SELECT dia, data_conclusao FROM jornada_progresso WHERE usuario_id = ? AND concluido = 1 ORDER BY dia',
      [uid]
    );

    // Rosários
    const [rosarioCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM rosarios_rezados WHERE usuario_id = ?',
      [uid]
    );

    // Velas
    const [velasCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM velas_virtuais WHERE usuario_id = ?',
      [uid]
    );

    // Pedidos
    const [pedidosCount] = await pool.execute(
      'SELECT COUNT(*) as total FROM pedidos_oracao WHERE usuario_id = ?',
      [uid]
    );

    // Streak
    const streak = await calcularStreak(uid);

    // Dias ativos total
    const [diasAtivos] = await pool.execute(
      'SELECT COUNT(*) as total FROM atividade_diaria WHERE usuario_id = ?',
      [uid]
    );

    // Conquistas desbloqueadas
    const [conquistasDb] = await pool.execute(
      'SELECT conquista_key, data_desbloqueio FROM conquistas_usuario WHERE usuario_id = ? ORDER BY data_desbloqueio',
      [uid]
    );
    const conquistasMap = {};
    conquistasDb.forEach(c => {
      conquistasMap[c.conquista_key] = c.data_desbloqueio;
    });

    // Montar lista completa de conquistas com status
    const conquistas = CONQUISTAS.map(c => ({
      ...c,
      desbloqueada: !!conquistasMap[c.key],
      dataDesbloqueio: conquistasMap[c.key] || null
    }));

    // Histórico de atividades recentes (últimas 20)
    const [historico] = await pool.execute(
      `(SELECT 'jornada' as tipo, CAST(CONCAT('Dia ', dia, ' da Jornada') AS CHAR) as descricao, data_conclusao as data
        FROM jornada_progresso WHERE usuario_id = ? AND concluido = 1)
       UNION ALL
       (SELECT 'rosario' as tipo, CAST(CONCAT('Rosário - ', misterio) AS CHAR) as descricao, data as data
        FROM rosarios_rezados WHERE usuario_id = ?)
       UNION ALL
       (SELECT 'conquista' as tipo, CAST(CONCAT('Conquista: ', conquista_key) AS CHAR) as descricao, data_desbloqueio as data
        FROM conquistas_usuario WHERE usuario_id = ?)
       ORDER BY data DESC LIMIT 20`,
      [uid, uid, uid]
    );

    // Formatar nomes das conquistas no histórico
    const historicoFormatado = historico.map(h => {
      if (h.tipo === 'conquista') {
        const c = CONQUISTAS.find(c => h.descricao.includes(c.key));
        if (c) h.descricao = `Conquista: ${c.nome}`;
      }
      if (h.tipo === 'rosario') {
        const mist = h.descricao.replace('Rosário - ', '');
        const nomes = { gozosos: 'Gozosos', luminosos: 'Luminosos', dolorosos: 'Dolorosos', gloriosos: 'Gloriosos', completo: 'Completo' };
        h.descricao = `Rosário — ${nomes[mist] || mist}`;
      }
      return h;
    });

    // Velas acesas (últimos 21 dias para visualização)
    const [velasRecentes] = await pool.execute(
      'SELECT data FROM atividade_diaria WHERE usuario_id = ? AND data >= DATE_SUB(CURDATE(), INTERVAL 20 DAY) ORDER BY data',
      [uid]
    );

    res.json({
      jornada: {
        diasConcluidos: jornadaRows.length,
        totalDias: 21,
        percentual: Math.round((jornadaRows.length / 21) * 100),
        completa: jornadaRows.length >= 21
      },
      rosarios: rosarioCount[0].total,
      velas: velasCount[0].total,
      pedidos: pedidosCount[0].total,
      streak,
      diasAtivos: diasAtivos[0].total,
      conquistas,
      historico: historicoFormatado,
      velasRecentes: velasRecentes.map(v => v.data),
      membroDesde: req.usuario.data_criacao || req.usuario.data_primeiro_login
    });
  } catch (err) {
    console.error('Erro ao buscar stats:', err);
    res.status(500).json({ erro: 'Erro interno' });
  }
});

module.exports = router;
