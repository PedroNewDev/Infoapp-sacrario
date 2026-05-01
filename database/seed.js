// Cria usuário de teste para o gestor acessar o app
// Uso: node database/seed.js

require('dotenv').config({ path: './backend/.env' });
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function seed() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  const senhaHash = await bcrypt.hash('teste123', 10);

  await pool.execute(
    `INSERT INTO usuarios
      (nome, email, senha_hash, acesso_vitalicio, modulo_audio, onboarding_completo, data_primeiro_login)
     VALUES (?, ?, ?, 1, 1, 1, NOW())
     ON DUPLICATE KEY UPDATE senha_hash = VALUES(senha_hash)`,
    ['Gestor Demo', 'gestor@demo.com', senhaHash]
  );

  console.log('✓ Usuário de demo criado: gestor@demo.com / teste123');
  await pool.end();
}

seed().catch(console.error);
