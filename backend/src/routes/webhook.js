const express = require('express');
const crypto = require('crypto');
const pool = require('../db/connection');
const { enviarPrimeiroAcesso } = require('../services/email');

const router = express.Router();

// Validar assinatura do webhook Payt
function validarAssinatura(req) {
  const secret = process.env.PAYT_WEBHOOK_SECRET;
  if (!secret) return true; // Em dev sem secret configurado

  const assinatura = req.headers['x-payt-signature'] || req.headers['x-webhook-signature'];
  if (!assinatura) return false;

  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(assinatura));
}

// POST /api/webhook/payt
router.post('/payt', async (req, res) => {
  // Retornar 200 imediatamente
  res.status(200).json({ recebido: true });

  try {
    if (!validarAssinatura(req)) {
      console.error('[WEBHOOK] Assinatura inválida');
      return;
    }

    const dados = req.body;
    const email = dados.email?.toLowerCase().trim();
    const evento = dados.evento || dados.event || 'compra';

    if (!email) {
      console.error('[WEBHOOK] E-mail não fornecido');
      return;
    }

    console.log(`[WEBHOOK] Evento: ${evento} | Email: ${email}`);

    switch (evento) {
      case 'compra':
      case 'compra_produto_base': {
        // Verificar se usuário já existe
        const [existing] = await pool.execute(
          'SELECT id FROM usuarios WHERE email = ?', [email]
        );

        if (existing.length > 0) {
          // Atualizar flags
          await pool.execute(
            `UPDATE usuarios SET
              acesso_vitalicio = IF(? = 1, 1, acesso_vitalicio),
              modulo_audio = IF(? = 1, 1, modulo_audio),
              upsell_limpeza = IF(? = 1, 1, upsell_limpeza)
            WHERE email = ?`,
            [
              dados.order_bump_vitalicio ? 1 : 0,
              dados.order_bump_audio ? 1 : 0,
              dados.upsell_limpeza ? 1 : 0,
              email
            ]
          );
          console.log(`[WEBHOOK] Usuário existente atualizado: ${email}`);
        } else {
          // Criar conta nova
          const token = crypto.randomBytes(32).toString('hex');
          const tokenExpiracao = new Date(Date.now() + 24 * 60 * 60 * 1000);

          await pool.execute(
            `INSERT INTO usuarios (nome, email, token_primeiro_acesso, token_expiracao, acesso_vitalicio, modulo_audio, upsell_limpeza)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              dados.nome || 'Devota',
              email,
              token,
              tokenExpiracao,
              dados.order_bump_vitalicio ? 1 : 0,
              dados.order_bump_audio ? 1 : 0,
              dados.upsell_limpeza ? 1 : 0
            ]
          );

          // Enviar e-mail com link de primeiro acesso
          const nome = dados.nome || 'Devota';
          enviarPrimeiroAcesso(email, nome, token)
            .then(() => console.log(`[WEBHOOK] E-mail de primeiro acesso enviado para: ${email}`))
            .catch(err => console.error(`[WEBHOOK] Falha ao enviar e-mail para ${email}:`, err.message));
        }
        break;
      }

      case 'compra_vitalicio': {
        await pool.execute(
          'UPDATE usuarios SET acesso_vitalicio = 1 WHERE email = ?',
          [email]
        );
        console.log(`[WEBHOOK] Acesso vitalício ativado: ${email}`);
        break;
      }

      case 'compra_modulo_audio': {
        await pool.execute(
          'UPDATE usuarios SET modulo_audio = 1 WHERE email = ?',
          [email]
        );
        console.log(`[WEBHOOK] Módulo áudio ativado: ${email}`);
        break;
      }

      case 'compra_upsell_limpeza': {
        await pool.execute(
          'UPDATE usuarios SET upsell_limpeza = 1 WHERE email = ?',
          [email]
        );
        console.log(`[WEBHOOK] Upsell limpeza ativado: ${email}`);
        break;
      }

      case 'compra_vela': {
        const [users] = await pool.execute(
          'SELECT id FROM usuarios WHERE email = ?', [email]
        );
        if (users.length > 0) {
          const dataExpiracao = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
          await pool.execute(
            `INSERT INTO velas_virtuais (usuario_id, intencao, data_expiracao)
             VALUES (?, ?, ?)`,
            [users[0].id, dados.intencao_vela || 'Intenção de oração', dataExpiracao]
          );
          console.log(`[WEBHOOK] Vela acesa para: ${email}`);
        }
        break;
      }

      default:
        console.log(`[WEBHOOK] Evento não tratado: ${evento}`);
    }
  } catch (err) {
    console.error('[WEBHOOK] Erro ao processar:', err);
  }
});

module.exports = router;
