# 🔐 Demo: GitHub Actions Secrets en Environments

Demo completa para mostrar el uso de **GitHub Actions Secrets** en diferentes **Environments** (development, staging, production).

## 🚀 Quick Start

### Desarrollo Local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd test-secrets

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Ejecutar aplicación
npm start

# 5. Abrir en navegador
http://localhost:3000
```

### Con Docker

```bash
# Crear archivo .env
cp .env.example .env

# Levantar contenedor
docker-compose up --build

# Ver la aplicación
http://localhost:3000
```

## 📂 Estructura del Proyecto

```
test-secrets/
├── .github/
│   └── workflows/
│       ├── deploy-dev.yaml         # Pipeline para Development
│       ├── deploy-staging.yaml     # Pipeline para Staging
│       └── deploy-production.yaml  # Pipeline para Production
├── server.js                       # Aplicación Node.js/Express
├── package.json
├── Dockerfile                      # Build de la imagen Docker
├── docker-compose.yaml             # Orquestación local
├── .env.example                    # Template de variables
├── .gitignore                      # .env nunca se commitea
├── DEMO-GUIDE.md                   # 📖 Guía completa de la demo
└── README.md                       # Este archivo
```

## 🎯 Objetivo

Demostrar cómo manejar secrets de forma segura en GitHub Actions usando **Environments**, sin necesidad de archivos `.env` commiteados.

### Ventajas

- ✅ **Seguridad**: Secrets nunca se commitean al repo
- ✅ **Aislamiento**: Cada environment tiene sus propios secrets
- ✅ **Auditoría**: GitHub registra accesos y cambios
- ✅ **Control**: Protección con aprobaciones en producción
- ✅ **Simplicidad**: No gestionar múltiples archivos .env

## 🔧 Configuración en GitHub

### 1. Crear Environments

En GitHub: **Settings > Environments**

Crear:
- `development`
- `staging`
- `production`

### 2. Configurar Secrets

Para cada environment, agregar estos secrets:

```
API_KEY
DB_HOST
DB_USER
DB_PASSWORD
EXTERNAL_API_URL
EXTERNAL_API_TOKEN
FEATURE_FLAG_PREMIUM
```

Ver valores de ejemplo en [`DEMO-GUIDE.md`](DEMO-GUIDE.md)

### 3. Protecciones (Producción)

Para `production`:
- ✅ Required reviewers
- ✅ Wait timer: 5 minutos
- ✅ Deployment branches: Solo `main`

## 📊 Environments

| Environment  | Branch        | Port  | Runner            |
|--------------|---------------|-------|-------------------|
| Development  | develop/dev   | 3001  | ubuntu-latest     |
| Staging      | staging       | 3002  | ubuntu-latest     |
| Production   | main/master   | 3000  | ubuntu-latest     |

## 🔍 Endpoints de la Demo

- `GET /` - Dashboard visual mostrando secrets cargados
- `GET /health` - Health check (JSON)
- `GET /config` - Configuración completa (JSON)

## 📖 Documentación Completa

Ver [**DEMO-GUIDE.md**](DEMO-GUIDE.md) para:
- Guía paso a paso de configuración
- Puntos clave para la presentación
- Comparación con enfoque actual
- FAQs y troubleshooting

## 🎤 Para la Demo

1. Mostrar GitHub UI (Environments y Secrets)
2. Ejecutar pipeline de dev
3. Acceder a http://localhost:3001
4. Comparar con staging (http://localhost:3002)
5. Explicar protecciones de producción

## ⚠️ Importante

- **NUNCA** commitear archivos `.env` con secrets reales
- El archivo `.env.example` es solo una plantilla
- Los secrets reales SOLO en GitHub Environments
- `.gitignore` protege archivos `.env`

## 🔗 Links Útiles

- [Guía Completa de la Demo](DEMO-GUIDE.md)
- [GitHub Environments Docs](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

**Demo creada para el área de SI** - Uso de Secrets en Environments con GitHub Actions 🚀
