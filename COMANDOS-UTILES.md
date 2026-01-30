# 🛠️ Comandos Útiles para la Demo

## 📦 Setup Inicial

### Instalación Local
```bash
# Clonar repo
git clone <url-repo>
cd test-secrets

# Instalar dependencias
npm install

# Configurar environment local
cp .env.example .env

# Editar .env (Windows)
notepad .env

# Editar .env (Linux/Mac)
nano .env
```

## 🐳 Docker - Comandos Básicos

### Desarrollo Local con Docker Compose
```bash
# Iniciar aplicación
docker-compose up --build

# Iniciar en background
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down

# Detener y limpiar volúmenes
docker-compose down -v

# Reiniciar
docker-compose restart
```

### Docker Manual (sin compose)
```bash
# Build de imagen
docker build -t secrets-demo:dev .

# Run contenedor
docker run -d \
  --name secrets-demo \
  -p 3000:3000 \
  -e ENVIRONMENT=dev \
  -e API_KEY=test_key \
  -e DB_HOST=localhost \
  -e DB_USER=demo_user \
  -e DB_PASSWORD=demo_pass \
  -e EXTERNAL_API_URL=https://api.example.com \
  -e EXTERNAL_API_TOKEN=token123 \
  -e FEATURE_FLAG_PREMIUM=true \
  secrets-demo:dev

# Ver logs
docker logs secrets-demo -f

# Detener y eliminar
docker stop secrets-demo
docker rm secrets-demo
```

## 🔍 Inspección y Debugging

### Ver contenedores activos
```bash
# Listar contenedores
docker ps

# Listar todos (incluidos detenidos)
docker ps -a

# Ver recursos consumidos
docker stats secrets-demo-dev

# Inspeccionar contenedor
docker inspect secrets-demo-dev
```

### Acceder al contenedor
```bash
# Shell interactivo
docker exec -it secrets-demo-dev sh

# Ver variables de entorno dentro del contenedor
docker exec secrets-demo-dev env | grep -E "(API_KEY|DB_|ENVIRONMENT)"

# Health check manual
docker exec secrets-demo-dev wget -q -O- http://localhost:3000/health
```

### Ver logs específicos
```bash
# Últimas 50 líneas
docker logs secrets-demo-dev --tail 50

# Seguir logs en tiempo real
docker logs secrets-demo-dev -f

# Logs con timestamps
docker logs secrets-demo-dev -t
```

## 🌐 Testing de Endpoints

### Usando curl
```bash
# Health check
curl http://localhost:3000/health

# Dashboard (HTML)
curl http://localhost:3000/

# Config (JSON)
curl http://localhost:3000/config | jq

# Pretty print JSON
curl -s http://localhost:3000/config | jq '.'
```

### Usando PowerShell (Windows)
```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:3000/health

# Config
Invoke-RestMethod -Uri http://localhost:3000/config | ConvertTo-Json

# Dashboard en navegador
Start-Process "http://localhost:3000"
```

## 🔄 Git - Workflow para Demo

### Preparar ramas
```bash
# Crear rama develop (si no existe)
git checkout -b develop
git push -u origin develop

# Crear rama staging
git checkout -b staging
git push -u origin staging

# Volver a main
git checkout main
```

### Trigger pipelines
```bash
# Deploy a Development
git checkout develop
git commit --allow-empty -m "Demo: deploy to development"
git push origin develop

# Deploy a Staging
git checkout staging
git merge develop
git push origin staging

# Deploy a Production
git checkout main
git merge staging
git push origin main
```

## 🧹 Limpieza

### Limpiar contenedores
```bash
# Detener todos los contenedores de la demo
docker ps -a | grep secrets-demo | awk '{print $1}' | xargs docker stop
docker ps -a | grep secrets-demo | awk '{print $1}' | xargs docker rm

# PowerShell (Windows)
docker ps -a --format "{{.ID}} {{.Names}}" | Select-String "secrets-demo" | ForEach-Object { docker rm -f ($_ -split " ")[0] }
```

### Limpiar imágenes
```bash
# Eliminar imágenes de la demo
docker images | grep secrets-demo | awk '{print $3}' | xargs docker rmi -f

# PowerShell (Windows)
docker images --format "{{.ID}} {{.Repository}}" | Select-String "secrets-demo" | ForEach-Object { docker rmi -f ($_ -split " ")[0] }
```

### Limpieza profunda
```bash
# Eliminar todo (cuidado!)
docker system prune -a

# Eliminar solo imágenes dangling
docker image prune

# Eliminar volúmenes no usados
docker volume prune
```

## 📊 Monitoreo

### Ver recursos en tiempo real
```bash
# Stats de todos los contenedores
docker stats

# Stats de contenedor específico
docker stats secrets-demo-dev

# Top processes dentro del contenedor
docker top secrets-demo-dev
```

### Health checks
```bash
# Verificar health status
docker inspect --format='{{.State.Health.Status}}' secrets-demo-dev

# Ver último health check
docker inspect --format='{{json .State.Health}}' secrets-demo-dev | jq
```

## 🎯 Comandos para la Presentación

### Setup pre-demo
```bash
# 1. Asegurar que no hay contenedores corriendo
docker ps -a | grep secrets-demo | awk '{print $1}' | xargs docker rm -f

# 2. Limpiar imágenes viejas
docker images | grep secrets-demo | awk '{print $3}' | xargs docker rmi -f

# 3. Verificar que .env.example existe
cat .env.example

# 4. Tener terminales preparadas
# Terminal 1: GitHub Actions UI
# Terminal 2: Docker logs
# Terminal 3: Comandos git
# Browser: http://localhost:3001, 3002, 3000
```

### Durante la demo
```bash
# Mostrar secrets configurados (sin valores)
echo "Secrets en development environment:"
echo "- API_KEY"
echo "- DB_HOST, DB_USER, DB_PASSWORD"
echo "- EXTERNAL_API_URL, EXTERNAL_API_TOKEN"
echo "- FEATURE_FLAG_PREMIUM"

# Trigger deployment
git checkout develop
git commit --allow-empty -m "Demo: GitHub Actions Secrets"
git push origin develop

# Seguir logs del contenedor cuando se despliegue
docker logs secrets-demo-dev -f

# Verificar que está corriendo
curl http://localhost:3001/health

# Abrir en navegador
start http://localhost:3001  # Windows
open http://localhost:3001   # Mac
xdg-open http://localhost:3001  # Linux
```

## 🚨 Troubleshooting

### Puerto en uso
```bash
# Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000  # Linux/Mac

# Matar proceso en puerto 3000 (Linux/Mac)
kill -9 $(lsof -ti:3000)
```

### Contenedor no inicia
```bash
# Ver logs completos
docker logs secrets-demo-dev

# Ver eventos de Docker
docker events

# Inspeccionar estado
docker inspect secrets-demo-dev | jq '.State'
```

### Variables de entorno no se cargan
```bash
# Verificar variables dentro del contenedor
docker exec secrets-demo-dev env

# Verificar que se pasaron al run
docker inspect secrets-demo-dev | jq '.Config.Env'
```

### Permisos en Linux
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Recargar grupos (o hacer logout/login)
newgrp docker
```

## 📝 Notas Adicionales

### Para presentación en empresa

1. **Antes de la demo**: Ejecutar todo localmente para verificar que funciona
2. **Durante la demo**: Tener plan B (screenshots, video)
3. **Después de la demo**: Compartir este documento con el equipo

### URLs importantes durante la demo

- Development: http://localhost:3001
- Staging: http://localhost:3002
- Production: http://localhost:3000
- GitHub Actions: https://github.com/[org]/[repo]/actions
- GitHub Environments: https://github.com/[org]/[repo]/settings/environments

### Credentials de ejemplo para configurar en GitHub

Ver archivo [DEMO-GUIDE.md](DEMO-GUIDE.md) sección "Configuración de Secrets por Environment"

---

**Tip**: Guardar estos comandos en snippets de tu editor favorito para acceso rápido durante la demo.
