# 🔐 Demo: GitHub Actions Secrets en Environments

## 📋 Índice

1. [Objetivo de la Demo](#objetivo-de-la-demo)
2. [Arquitectura](#arquitectura)
3. [Configuración de Secrets en GitHub](#configuración-de-secrets-en-github)
4. [Ejecución Local](#ejecución-local)
5. [Ejecución en CI/CD](#ejecución-en-cicd)
6. [Puntos Clave para la Presentación](#puntos-clave-para-la-presentación)
7. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Objetivo de la Demo

Demostrar cómo GitHub Actions maneja **secrets específicos por environment** (development, staging, production) sin necesidad de archivos `.env` commiteados al repositorio.

### ✅ Ventajas de este enfoque:

- **Seguridad**: Los secrets nunca se commitean al repositorio
- **Aislamiento**: Cada environment tiene sus propios secrets
- **Auditoría**: GitHub registra quién accede y modifica secrets
- **Control de acceso**: Protección de environments con aprobaciones requeridas
- **Sin archivos .env**: No hay riesgo de exponer credenciales accidentalmente

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                                                               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Environments & Secrets                   │  │
│  │                                                         │  │
│  │  📁 development                                        │  │
│  │     └─ 🔐 API_KEY=dev_api_key_123                     │  │
│  │     └─ 🔐 DB_HOST=dev-db.internal                     │  │
│  │     └─ 🔐 DB_PASSWORD=dev_password                    │  │
│  │                                                         │  │
│  │  📁 staging                                            │  │
│  │     └─ 🔐 API_KEY=staging_api_key_456                 │  │
│  │     └─ 🔐 DB_HOST=staging-db.internal                 │  │
│  │     └─ 🔐 DB_PASSWORD=staging_password                │  │
│  │                                                         │  │
│  │  📁 production                                         │  │
│  │     └─ 🔐 API_KEY=prod_api_key_789                    │  │
│  │     └─ 🔐 DB_HOST=prod-db.internal                    │  │
│  │     └─ 🔐 DB_PASSWORD=prod_password_secure            │  │
│  │     └─ ⚙️  Required reviewers: enabled                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    GitHub Actions Pipeline
                              │
                              ▼
              ┌───────────────┴───────────────┐
              │                               │
              ▼                               ▼
      🟡 Deploy Dev                   🔵 Deploy Staging
      Runner: dev-runner              Runner: staging-runner
      Port: 3001                      Port: 3002
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                      🟢 Deploy Production
                      Runner: prod-runner
                      Port: 3000
```

---

## 🔧 Configuración de Secrets en GitHub

### Paso 1: Crear Environments

1. Ve a tu repositorio en GitHub
2. Click en **Settings** > **Environments**
3. Click en **New environment**
4. Crear los siguientes environments:
   - `development`
   - `staging`
   - `production`

### Paso 2: Configurar Secrets por Environment

Para **CADA environment**, agregar los siguientes secrets:

#### 📝 Development Environment

| Secret Name            | Ejemplo de Valor                  |
|------------------------|-----------------------------------|
| `API_KEY`              | `dev_api_key_12345678`            |
| `DB_HOST`              | `dev-postgres.internal.com`       |
| `DB_USER`              | `dev_user`                        |
| `DB_PASSWORD`          | `dev_password_123!`               |
| `EXTERNAL_API_URL`     | `https://api-dev.example.com`     |
| `EXTERNAL_API_TOKEN`   | `dev_token_abcdef123456`          |
| `FEATURE_FLAG_PREMIUM` | `false`                           |

#### 📝 Staging Environment

| Secret Name            | Ejemplo de Valor                  |
|------------------------|-----------------------------------|
| `API_KEY`              | `staging_api_key_87654321`        |
| `DB_HOST`              | `staging-postgres.internal.com`   |
| `DB_USER`              | `staging_user`                    |
| `DB_PASSWORD`          | `staging_password_456!`           |
| `EXTERNAL_API_URL`     | `https://api-staging.example.com` |
| `EXTERNAL_API_TOKEN`   | `staging_token_xyz789`            |
| `FEATURE_FLAG_PREMIUM` | `false`                           |

#### 📝 Production Environment

| Secret Name            | Ejemplo de Valor                  |
|------------------------|-----------------------------------|
| `API_KEY`              | `prod_api_key_SECURE_999`         |
| `DB_HOST`              | `prod-postgres.internal.com`      |
| `DB_USER`              | `prod_user`                       |
| `DB_PASSWORD`          | `prod_SecureP@ssw0rd!2024`        |
| `EXTERNAL_API_URL`     | `https://api.example.com`         |
| `EXTERNAL_API_TOKEN`   | `prod_token_REAL_SECURE_TOKEN`    |
| `FEATURE_FLAG_PREMIUM` | `true`                            |

### Paso 3: Configurar Protecciones (Opcional pero Recomendado)

Para **Production** environment:

1. Settings > Environments > production
2. Marcar **Required reviewers**
3. Agregar revisores (ej: DevOps Lead, Tech Lead)
4. Marcar **Wait timer**: 5 minutos
5. **Deployment branches**: Solo `main` o `master`

---

## 💻 Ejecución Local

### Desarrollo Local (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar archivo de ejemplo
cp .env.example .env

# 3. Editar .env con tus valores locales
nano .env

# 4. Ejecutar la aplicación
npm start

# 5. Abrir en navegador
# http://localhost:3000
```

### Desarrollo Local (con Docker Compose)

```bash
# 1. Crear archivo .env local
cp .env.example .env

# 2. Editar .env con valores de desarrollo
nano .env

# 3. Levantar con docker-compose
docker-compose up --build

# 4. Ver logs
docker-compose logs -f

# 5. Detener
docker-compose down
```

---

## 🚀 Ejecución en CI/CD

### Trigger Automático

Los pipelines se ejecutan automáticamente al hacer push a las ramas correspondientes:

| Branch         | Environment  | Pipeline                    |
|----------------|--------------|-----------------------------|
| `develop/dev`  | development  | 🟡 Deploy to DEVELOPMENT    |
| `staging`      | staging      | 🔵 Deploy to STAGING        |
| `main/master`  | production   | 🟢 Deploy to PRODUCTION     |

### Ejecución Manual

1. Ve a **Actions** en GitHub
2. Selecciona el workflow deseado
3. Click en **Run workflow**
4. Selecciona la rama
5. Click en **Run workflow**

### Monitoreo del Deployment

```bash
# Ver logs del contenedor (en el runner)
docker logs secrets-demo-dev -f         # Development
docker logs secrets-demo-staging -f     # Staging
docker logs secrets-demo-prod -f        # Production

# Ver estado del contenedor
docker ps | grep secrets-demo

# Acceder a la aplicación
curl http://localhost:3001/health    # Dev
curl http://localhost:3002/health    # Staging
curl http://localhost:3000/health    # Prod
```

---

## 🎤 Puntos Clave para la Presentación

### 1. **Problema que Resolvemos**

❌ **Antes** (Mal enfoque):
```bash
# archivo .env commiteado al repo (¡PELIGRO!)
DB_PASSWORD=mi_password_secreto_123
API_KEY=clave_api_produccion_xyz
```

✅ **Ahora** (Enfoque correcto):
- Secrets en GitHub Environments
- Nunca se commitean
- Específicos por ambiente
- Auditables y seguros

### 2. **Demostración en Vivo**

**Flujo de Demo:**

1. **Mostrar GitHub UI**
   - Settings > Environments
   - Mostrar los 3 environments
   - Mostrar secrets configurados (sin revelar valores)

2. **Ejecutar Pipeline**
   - Hacer un commit a `develop`
   - Mostrar cómo se ejecuta el pipeline
   - Mostrar logs donde se ven los secrets inyectados

3. **Acceder a la Aplicación**
   - Abrir `http://localhost:3001` (dev)
   - Mostrar el dashboard con los secrets cargados
   - Notar las diferencias entre environments

4. **Comparar Environments**
   - Ejecutar staging pipeline
   - Mostrar que usa secrets diferentes
   - Abrir `http://localhost:3002` y comparar

### 3. **Ventajas Destacadas**

```
┌─────────────────────────────────────────────────────┐
│  ✅ Seguridad: Secrets nunca en el código          │
│  ✅ Aislamiento: Cada environment independiente    │
│  ✅ Auditoría: Logs de quién accede a secrets      │
│  ✅ Protección: Aprobaciones para producción       │
│  ✅ Simplicidad: No gestionar archivos .env        │
│  ✅ Escalabilidad: Fácil agregar más environments  │
└─────────────────────────────────────────────────────┘
```

### 4. **Comparación con Tu Pipeline Actual**

Tu pipeline actual (SISCOOP):
```yaml
- name: Modificar archivo de properties - develop
  run: |
    sed -i 's|\${{secrets.PASSWORD_LDAP}}|${{ secrets.PASSWORD_LDAP }}|g' \
      ${{env.ruta-clone}}/src/main/resources/siscoop_ad_des.properties
```

Demo mejorada:
```yaml
- name: Deploy container with secrets
  run: |
    docker run -d \
      -e DB_PASSWORD="${{ secrets.DB_PASSWORD }}" \
      -e API_KEY="${{ secrets.API_KEY }}" \
      ${{ env.IMAGE_NAME }}:dev
```

**Ventajas del nuevo enfoque:**
- No necesita `sed` para reemplazar en archivos
- Secrets inyectados directamente al contenedor
- Más limpio y mantenible
- No deja traces en archivos temporales

---

## ❓ Preguntas Frecuentes

### ¿Por qué NO usar archivos .env commiteados?

**Riesgos:**
- Exposición de credenciales en el historial de Git
- Difícil rotación de secrets
- Sin auditoría de acceso
- Fácil leak accidental

### ¿Cómo rotar secrets?

1. Ve a GitHub > Settings > Environments > [environment]
2. Click en el secret a actualizar
3. Ingresa el nuevo valor
4. El próximo deployment usará el nuevo valor automáticamente

### ¿Qué pasa si un secret no está configurado?

El contenedor arrancará pero mostrará `NOT_SET` en el dashboard.
El pipeline mostrará warnings en los logs.

### ¿Puedo tener secrets globales y por environment?

Sí:
- **Repository secrets**: Disponibles en todos los workflows
- **Environment secrets**: Específicos de cada environment
- **Priority**: Environment secrets sobrescriben repository secrets

### ¿Cómo manejar secrets locales?

Para desarrollo local:
```bash
# 1. Copiar template
cp .env.example .env

# 2. Editar con valores locales
nano .env

# 3. .env está en .gitignore - NUNCA se commitea
```

### ¿Necesito docker-compose en producción?

No necesariamente. El pipeline ejecuta `docker run` directamente.
Docker Compose es útil para desarrollo local y staging.

---

## 📊 Tabla Comparativa

| Aspecto             | Archivos .env          | GitHub Secrets        |
|---------------------|------------------------|-----------------------|
| Seguridad           | ❌ Bajo                | ✅ Alto               |
| Rotación            | ❌ Manual              | ✅ Inmediata          |
| Auditoría           | ❌ No disponible       | ✅ Completa           |
| Múltiples ambientes | ⚠️ Archivos múltiples  | ✅ Environments       |
| Acceso restringido  | ❌ Difícil             | ✅ Por roles          |
| Aprobaciones        | ❌ No                  | ✅ Configurable       |
| Historial Git       | ❌ Riesgo de leak      | ✅ No se commitea     |

---

## 🎓 Recursos Adicionales

- [GitHub Docs: Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [GitHub Docs: Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Best Practices: Managing Secrets](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

## 📝 Checklist de Presentación

- [ ] Crear los 3 environments en GitHub
- [ ] Configurar todos los secrets para cada environment
- [ ] Ejecutar pipeline de dev y verificar funcionamiento
- [ ] Ejecutar pipeline de staging
- [ ] Mostrar diferencias entre environments en el browser
- [ ] Explicar protecciones de producción
- [ ] Responder preguntas del equipo de SI

---

**¡Demo lista para presentar!** 🚀
