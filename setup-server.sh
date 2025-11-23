#!/bin/bash

# Script de configuracion para el servidor
# Uso: ./setup-server.sh

set -e

echo "Configurando aplicacion en el servidor..."

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "[ERROR] Debes ejecutar este script desde ~/lolgg/backend"
    exit 1
fi

# 1. Verificar archivo .env
if [ -f ".env" ]; then
    echo "[OK] Archivo .env encontrado"
else
    echo "[ERROR] No se encontro archivo .env"
    echo "Asegurate de que backend/.env existe localmente antes de desplegar"
    exit 1
fi

# 2. Instalar dependencias
echo "Instalando dependencias..."
npm install --omit=dev

echo ""
echo "[OK] Configuracion completa!"
echo ""
echo "IMPORTANTE: El .env se cargara automaticamente con npm start"
echo ""
echo "Para iniciar la aplicacion:"
echo "  nohup npm start > server.log 2>&1 &"
echo ""
echo "Para ver logs:"
echo "  tail -f server.log"
echo ""
echo "Para detener:"
echo "  pkill -f 'lolgg/backend'"
echo ""
echo "Para verificar que esta corriendo:"
echo "  ps aux | grep node"
echo "  curl http://localhost:7153/api/champions"
echo ""

