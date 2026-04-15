require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const webhookRoutes = require('./routes/webhook');
const usuarioRoutes = require('./routes/usuario');
const jornadaRoutes = require('./routes/jornada');
const rosarioRoutes = require('./routes/rosario');
const pedidosRoutes = require('./routes/pedidos');
const velasRoutes = require('./routes/velas');
const perfilRoutes = require('./routes/perfil');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5176',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin?.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// JSON parser
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/usuario', usuarioRoutes);
app.use('/api/jornada', jornadaRoutes);
app.use('/api/rosario', rosarioRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/velas', velasRoutes);
app.use('/api/perfil', perfilRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Sacrário Backend] Rodando na porta ${PORT}`);
  });
}

module.exports = app;
