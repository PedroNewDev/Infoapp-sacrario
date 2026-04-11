-- =============================================
-- Sacrário do Rosário — Schema MySQL
-- Rodar no hPanel da Hostinger ou via SSH
-- =============================================

CREATE DATABASE IF NOT EXISTS sacrario_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sacrario_db;

-- Tabela de usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  email VARCHAR(200) UNIQUE NOT NULL,
  senha_hash VARCHAR(255),
  token_primeiro_acesso VARCHAR(255),
  token_expiracao DATETIME,
  avatar VARCHAR(500),
  intencao_principal TEXT,
  horario_notificacao TIME,
  data_primeiro_login DATETIME,
  onboarding_completo TINYINT(1) DEFAULT 0,
  acesso_vitalicio TINYINT(1) DEFAULT 0,
  modulo_audio TINYINT(1) DEFAULT 0,
  upsell_limpeza TINYINT(1) DEFAULT 0,
  interesse_loja TINYINT(1) DEFAULT 0,
  data_criacao DATETIME DEFAULT NOW(),
  data_ultimo_acesso DATETIME
) ENGINE=InnoDB;

-- Progresso da jornada de 21 dias
CREATE TABLE jornada_progresso (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  dia INT NOT NULL,
  concluido TINYINT(1) DEFAULT 0,
  intencao_texto TEXT,
  data_conclusao DATETIME,
  data_criacao DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unico_dia_usuario (usuario_id, dia)
) ENGINE=InnoDB;

-- Rosários rezados
CREATE TABLE rosarios_rezados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  misterio VARCHAR(50),
  data DATETIME DEFAULT NOW(),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Pedidos de oração (comunidade)
CREATE TABLE pedidos_oracao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  texto VARCHAR(250) NOT NULL,
  contador_rezando INT DEFAULT 0,
  data_publicacao DATETIME DEFAULT NOW(),
  data_expiracao DATETIME,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Interações "estou rezando por você"
CREATE TABLE pedidos_interacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  usuario_id INT NOT NULL,
  data_interacao DATETIME DEFAULT NOW(),
  FOREIGN KEY (pedido_id) REFERENCES pedidos_oracao(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY unico_pedido_usuario (pedido_id, usuario_id)
) ENGINE=InnoDB;

-- Velas virtuais
CREATE TABLE velas_virtuais (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  intencao VARCHAR(250) NOT NULL,
  data_acendimento DATETIME DEFAULT NOW(),
  data_expiracao DATETIME,
  status VARCHAR(20) DEFAULT 'acesa',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Índices para performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_jornada_usuario ON jornada_progresso(usuario_id);
CREATE INDEX idx_rosarios_usuario ON rosarios_rezados(usuario_id);
CREATE INDEX idx_pedidos_data ON pedidos_oracao(data_publicacao);
CREATE INDEX idx_velas_status ON velas_virtuais(status, data_expiracao);
