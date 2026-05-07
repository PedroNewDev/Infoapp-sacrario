#!/bin/bash
# Deploy Sacrário do Rosário → VPS Contabo (jornadademaria.online)
# Rodar localmente: bash deploy/deploy.sh
# Requer: rsync ou scp disponível

set -e

VPS="root@217.216.92.241"
WEBROOT="/www/wwwroot/jornadademaria.online"
DOMAIN="jornadademaria.online"

echo "=== [1/5] Build do frontend ==="
cd frontend
VITE_API_URL=/api npm run build
cd ..

echo "=== [2/5] Upload frontend (dist/) ==="
rsync -avz --delete frontend/dist/ $VPS:$WEBROOT/

echo "=== [3/5] Upload backend/ ==="
rsync -avz --delete \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='*.log' \
  backend/ $VPS:$WEBROOT/backend/

echo "=== [4/5] Upload media/audio (se existir) ==="
if [ -d "backend/media/audio" ]; then
  rsync -avz backend/media/audio/ $VPS:$WEBROOT/media/audio/
fi

echo "=== [5/5] Instalar dependências e reiniciar PM2 ==="
ssh $VPS "
  cd $WEBROOT/backend
  npm install --production
  pm2 delete sacrario-backend 2>/dev/null || true
  pm2 start ecosystem.config.js
  pm2 save
"

echo ""
echo "=== Deploy concluído! ==="
echo "Acesse: https://$DOMAIN"
echo ""
echo "Lembre-se de verificar:"
echo "  - .env em $WEBROOT/backend/.env"
echo "  - Nginx config em /www/server/nginx/conf/vhost/$DOMAIN.conf"
echo "  - SSL via aaPanel → Let's Encrypt"
