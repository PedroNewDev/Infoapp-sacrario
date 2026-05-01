-- Sacrário do Rosário — Schema completo
-- Rodar no MySQL Railway ou qualquer MySQL 8+

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  senha_hash VARCHAR(255),
  token_primeiro_acesso VARCHAR(255),
  token_expiracao DATETIME,
  avatar VARCHAR(500),
  intencao_principal TEXT,
  horario_notificacao TIME,
  onboarding_completo TINYINT(1) DEFAULT 0,
  data_primeiro_login DATETIME,
  data_ultimo_acesso DATETIME,
  acesso_vitalicio TINYINT(1) DEFAULT 0,
  modulo_audio TINYINT(1) DEFAULT 0,
  upsell_limpeza TINYINT(1) DEFAULT 0,
  interesse_loja TINYINT(1) DEFAULT 0,
  data_criacao DATETIME DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jornada_progresso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  dia INT NOT NULL,
  concluido TINYINT(1) DEFAULT 0,
  intencao_texto TEXT,
  data_conclusao DATETIME,
  data_criacao DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unico_dia_usuario (usuario_id, dia)
);

CREATE TABLE IF NOT EXISTS rosarios_rezados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  misterio VARCHAR(50),
  data DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pedidos_oracao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  texto VARCHAR(250) NOT NULL,
  contador_rezando INT DEFAULT 0,
  data_publicacao DATETIME DEFAULT NOW(),
  data_expiracao DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS velas_virtuais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  intencao VARCHAR(250) NOT NULL,
  data_acendimento DATETIME DEFAULT NOW(),
  data_expiracao DATETIME,
  status VARCHAR(20) DEFAULT 'acesa',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS atividade_diaria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  data DATE NOT NULL,
  hora_acesso TIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unico_dia_ativo (usuario_id, data)
);

CREATE TABLE IF NOT EXISTS conquistas_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  conquista_key VARCHAR(100) NOT NULL,
  data_desbloqueio DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unico_conquista (usuario_id, conquista_key)
);
