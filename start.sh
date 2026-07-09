#!/usr/bin/env bash
# Sobe o ambiente completo de desenvolvimento: MySQL (Docker), API e frontend.
# Uso: ./start.sh
set -e

cd "$(dirname "$0")"

echo "==> Subindo MySQL (docker compose)..."
docker compose up -d

echo "==> Aguardando o MySQL ficar saudável..."
until docker exec banheiros-mysql mysqladmin ping -h localhost --silent >/dev/null 2>&1; do
  sleep 2
done

echo "==> Subindo a API (http://localhost:8080)..."
(cd backend && mvn spring-boot:run) &
API_PID=$!

echo "==> Subindo o frontend (http://localhost:4200)..."
if [ ! -d frontend/node_modules ]; then
  (cd frontend && npm install)
fi
(cd frontend && npm start) &
FRONT_PID=$!

trap "kill $API_PID $FRONT_PID 2>/dev/null" EXIT
echo ""
echo "Tudo no ar! API: http://localhost:8080 | App: http://localhost:4200"
echo "Login admin: admin@utfpr.edu.br / admin123 (Ctrl+C para encerrar)"
wait
