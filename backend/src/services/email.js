const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

const EMAIL_FROM = process.env.EMAIL_FROM || process.env.BREVO_SMTP_USER;
const APP_URL = process.env.FRONTEND_URL || 'https://sacrariodorosario.vercel.app';

// Template base HTML
function templateBase(conteudo) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Sacrário do Rosário</title>
</head>
<body style="margin:0;padding:0;background:#faf8f3;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:12px;border:1px solid #e8dfc8;overflow:hidden;">

          <!-- Cabeçalho -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#3d2b1f 0%,#5c3d2e 100%);padding:32px 24px;">
              <p style="margin:0;font-size:28px;letter-spacing:4px;color:#c9932a;">✦ ✦ ✦</p>
              <h1 style="margin:8px 0 0;font-size:22px;color:#e8d5a3;letter-spacing:2px;font-weight:normal;">Sacrário do Rosário</h1>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding:32px 32px 24px;">
              ${conteudo}
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td align="center" style="padding:16px 32px 32px;border-top:1px solid #f0e8d8;">
              <p style="margin:0;font-size:11px;color:#a09080;letter-spacing:0.5px;">Ave Maria, cheia de graça</p>
              <p style="margin:4px 0 0;font-size:10px;color:#c0b090;">
                Este e-mail foi enviado automaticamente. Não responda a esta mensagem.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// E-mail de primeiro acesso (enviado pelo webhook após compra)
async function enviarPrimeiroAcesso(email, nome, token) {
  const link = `${APP_URL}/definir-senha?token=${token}`;
  const primeiroNome = nome?.split(' ')[0] || 'Devota';

  const conteudo = `
    <p style="margin:0 0 8px;font-size:18px;color:#c9932a;font-weight:normal;">Bem-vinda ao Sacrário, ${primeiroNome} 🌹</p>
    <p style="margin:0 0 20px;font-size:14px;color:#4a3728;line-height:1.6;">
      Sua jornada de 21 dias de consagração a Nossa Senhora está esperando por você.
      Para começar, defina sua senha clicando no botão abaixo.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${link}"
             style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#c9932a,#e0b555);color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
            DEFINIR MINHA SENHA »
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 8px;font-size:12px;color:#7a6a5a;">
      Ou copie e cole este link no navegador:
    </p>
    <p style="margin:0;font-size:11px;color:#c9932a;word-break:break-all;">
      <a href="${link}" style="color:#c9932a;">${link}</a>
    </p>

    <p style="margin:24px 0 0;font-size:12px;color:#9a8878;font-style:italic;">
      ⚠️ Este link expira em 24 horas. Se você não realizou nenhuma compra, ignore este e-mail.
    </p>
  `;

  return transporter.sendMail({
    from: `"Sacrário do Rosário" <${EMAIL_FROM}>`,
    to: email,
    subject: '✦ Bem-vinda ao Sacrário — Defina sua senha para começar',
    html: templateBase(conteudo),
  });
}

// E-mail de reset de senha
async function enviarResetSenha(email, nome, token) {
  const link = `${APP_URL}/definir-senha?token=${token}`;
  const primeiroNome = nome?.split(' ')[0] || 'Devota';

  const conteudo = `
    <p style="margin:0 0 8px;font-size:18px;color:#c9932a;font-weight:normal;">Redefinição de senha, ${primeiroNome}</p>
    <p style="margin:0 0 20px;font-size:14px;color:#4a3728;line-height:1.6;">
      Recebemos uma solicitação para redefinir a senha da sua conta no Sacrário do Rosário.
      Clique no botão abaixo para criar uma nova senha.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td align="center">
          <a href="${link}"
             style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#c9932a,#e0b555);color:#fff;text-decoration:none;border-radius:999px;font-size:13px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;">
            REDEFINIR MINHA SENHA »
          </a>
        </td>
      </tr>
    </table>

    <p style="margin:20px 0 8px;font-size:12px;color:#7a6a5a;">
      Ou copie e cole este link no navegador:
    </p>
    <p style="margin:0;font-size:11px;color:#c9932a;word-break:break-all;">
      <a href="${link}" style="color:#c9932a;">${link}</a>
    </p>

    <p style="margin:24px 0 0;font-size:12px;color:#9a8878;font-style:italic;">
      ⚠️ Este link expira em 24 horas. Se você não solicitou a redefinição, ignore este e-mail — sua senha permanece a mesma.
    </p>
  `;

  return transporter.sendMail({
    from: `"Sacrário do Rosário" <${EMAIL_FROM}>`,
    to: email,
    subject: '✦ Sacrário do Rosário — Redefinição de senha',
    html: templateBase(conteudo),
  });
}

module.exports = { enviarPrimeiroAcesso, enviarResetSenha };
