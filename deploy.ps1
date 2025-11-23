# Script de despliegue para LoL.GG (PowerShell/Windows)
# Uso: .\deploy.ps1

$ErrorActionPreference = "Stop"

$SERVER = "fullstack@fullstack.dcc.uchile.cl"
$PORT = "219"
$REMOTE_DIR = "lolgg"

Write-Host "Iniciando despliegue de LoL.GG..." -ForegroundColor Cyan

# 1. Compilar backend
Write-Host "`nCompilando backend..." -ForegroundColor Yellow
Set-Location backend
npm install
npm run build
Set-Location ..

# 2. Compilar frontend
Write-Host "`nCompilando frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# 3. Crear directorios remotos
Write-Host "`nCreando directorios en servidor..." -ForegroundColor Yellow
ssh -p $PORT $SERVER "mkdir -p ~/$REMOTE_DIR/backend ~/$REMOTE_DIR/frontend-dist"

# 4. Copiar archivos al servidor
Write-Host "`nCopiando archivos al servidor..." -ForegroundColor Yellow

# Copiar backend
Write-Host "  - Backend..." -ForegroundColor Gray
scp -P $PORT -r backend/dist ${SERVER}:~/${REMOTE_DIR}/backend/
scp -P $PORT -r backend/champion-icons ${SERVER}:~/${REMOTE_DIR}/backend/
scp -P $PORT backend/champion.json ${SERVER}:~/${REMOTE_DIR}/backend/
scp -P $PORT backend/package.json ${SERVER}:~/${REMOTE_DIR}/backend/
scp -P $PORT backend/.env ${SERVER}:~/${REMOTE_DIR}/backend/
scp -P $PORT setup-server.sh ${SERVER}:~/${REMOTE_DIR}/backend/

# Copiar frontend
Write-Host "  - Frontend..." -ForegroundColor Gray
scp -P $PORT -r frontend/dist/* ${SERVER}:~/${REMOTE_DIR}/frontend-dist/

Write-Host "`nArchivos copiados exitosamente!" -ForegroundColor Green
Write-Host "`nProximos pasos MANUALES en el servidor:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Conéctate al servidor:"
Write-Host "   ssh -p 219 fullstack@fullstack.dcc.uchile.cl" -ForegroundColor White
Write-Host ""
Write-Host "2. Configura e inicia la aplicacion:"
Write-Host "   cd ~/lolgg/backend" -ForegroundColor White
Write-Host "   chmod +x setup-server.sh" -ForegroundColor White
Write-Host "   ./setup-server.sh" -ForegroundColor White
Write-Host "   nohup npm start > server.log 2>&1 &" -ForegroundColor White
Write-Host ""
Write-Host "Backend estara disponible en: http://fullstack.dcc.uchile.cl:7153" -ForegroundColor Green

