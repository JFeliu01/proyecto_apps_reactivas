#!/bin/bash

# Script de despliegue para LoL.GG
# Uso: ./deploy.sh

set -e

SERVER="fullstack@fullstack.dcc.uchile.cl"
PORT="219"
REMOTE_DIR="lolgg"

echo "Iniciando despliegue de LoL.GG..."

# 1. Compilar backend
echo "Compilando backend..."
cd backend
npm install
npm run build
cd ..

# 2. Compilar frontend
echo "Compilando frontend..."
cd frontend
npm install
npm run build
cd ..

# 3. Crear directorios remotos
echo "Creando directorios en servidor..."
ssh -p $PORT $SERVER "mkdir -p ~/$REMOTE_DIR/backend ~/$REMOTE_DIR/frontend-dist"

# 4. Copiar archivos al servidor
echo "Copiando archivos al servidor..."

# Copiar backend
echo "  - Backend..."
scp -P $PORT -r backend/dist $SERVER:~/$REMOTE_DIR/backend/
scp -P $PORT -r backend/champion-icons $SERVER:~/$REMOTE_DIR/backend/
scp -P $PORT backend/champion.json $SERVER:~/$REMOTE_DIR/backend/
scp -P $PORT backend/package.json $SERVER:~/$REMOTE_DIR/backend/
scp -P $PORT backend/.env $SERVER:~/$REMOTE_DIR/backend/
scp -P $PORT setup-server.sh $SERVER:~/$REMOTE_DIR/backend/

# Copiar frontend
echo "  - Frontend..."
scp -P $PORT -r frontend/dist/* $SERVER:~/$REMOTE_DIR/frontend-dist/

echo ""
echo "Archivos copiados exitosamente!"
echo ""
echo "Proximos pasos MANUALES en el servidor:"
echo ""
echo "1. Conéctate al servidor:"
echo "   ssh -p 219 fullstack@fullstack.dcc.uchile.cl"
echo ""
echo "2. Configura e inicia la aplicacion:"
echo "   cd ~/lolgg/backend"
echo "   chmod +x setup-server.sh"
echo "   ./setup-server.sh"
echo "   nohup npm start > server.log 2>&1 &"
echo ""
echo "Backend estara disponible en: http://fullstack.dcc.uchile.cl:7153"

