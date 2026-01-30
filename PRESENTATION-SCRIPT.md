# 🎤 Script de Presentación: GitHub Actions Secrets en Environments

## 📝 Introducción (2 minutos)

**Mensaje clave**: Mostrar cómo manejar secrets de forma segura en CI/CD sin archivos .env commiteados.

### Apertura

> "Buenos días/tardes. Hoy voy a demostrar cómo GitHub Actions maneja secrets de forma segura usando **Environments**, una funcionalidad que elimina la necesidad de tener archivos .env con credenciales en nuestro repositorio."

### Contexto del Problema

> "Actualmente, muchos proyectos tienen este problema:"

**Mostrar en pantalla:**
```bash
# ❌ MAL: archivo .env en el repositorio
DB_PASSWORD=password123
API_KEY=secretkey456
```

> "Este enfoque tiene varios riesgos:
> - Las credenciales quedan en el historial de Git
> - Difícil rotación de secrets
> - Sin control de acceso
> - Fácil leak accidental al hacer commits"

---

## 🎯 Solución Propuesta (3 minutos)

### Introducción a Environments

> "La solución es usar **GitHub Environments** con secrets específicos por ambiente."

**Mostrar diagrama en pantalla** (del DEMO-GUIDE.md)

> "Con este enfoque:
> - Cada environment (dev, staging, prod) tiene sus propios secrets
> - Los secrets NUNCA se commitean al repositorio
> - GitHub maneja la inyección de secrets en tiempo de deployment
> - Tenemos control de acceso y auditoría completa"

### Beneficios Principales

| Antes                          | Ahora                           |
|--------------------------------|---------------------------------|
| ❌ .env en el repo             | ✅ Secrets en GitHub UI         |
| ❌ Sin auditoría               | ✅ Logs de acceso               |
| ❌ Difícil rotación            | ✅ Rotación inmediata           |
| ❌ Sin protección prod         | ✅ Aprobaciones requeridas      |

---

## 💻 Demo en Vivo (10 minutos)

### Parte 1: Configuración en GitHub (3 min)

**Navegar a GitHub UI:**

1. **Ir a Settings > Environments**

   > "Aquí tenemos configurados 3 environments: development, staging y production."

2. **Click en 'development'**

   > "Cada environment tiene sus propios secrets. Vemos que tenemos configurados:
   > - API_KEY
   > - DB_HOST, DB_USER, DB_PASSWORD
   > - EXTERNAL_API_URL, EXTERNAL_API_TOKEN
   > - Feature flags
   >
   > Noten que no puedo ver los valores, solo que están configurados. Esto es por seguridad."

3. **Mostrar 'production' environment**

   > "Para producción, tenemos protecciones adicionales:
   > - Required reviewers: El deployment requiere aprobación
   > - Wait timer: 5 minutos de espera antes de deployar
   > - Deployment branches: Solo se puede deployar desde main"

### Parte 2: Ejecutar Pipeline (4 min)

**En terminal o GitHub Actions UI:**

1. **Trigger del Pipeline**

   ```bash
   git checkout develop
   git commit --allow-empty -m "Demo: trigger dev deployment"
   git push origin develop
   ```

   > "Acabamos de hacer push a la rama develop. Esto automáticamente triggerea el pipeline de development."

2. **Navegar a Actions Tab**

   > "Vemos que el workflow '🟡 Deploy to DEVELOPMENT' se está ejecutando."

3. **Mostrar Logs del Pipeline**

   Click en el job actual, mostrar los steps:

   > "El pipeline hace lo siguiente:
   > 1. Checkout del código
   > 2. Elimina contenedores previos
   > 3. Buildea la imagen Docker
   > 4. **Aquí está lo importante**: Despliega el contenedor inyectando los secrets"

   **Mostrar el step de deploy:**

   ```yaml
   docker run -d \
     --name secrets-demo-dev \
     -e ENVIRONMENT=dev \
     -e API_KEY="${{ secrets.API_KEY }}" \
     -e DB_PASSWORD="${{ secrets.DB_PASSWORD }}" \
     ...
   ```

   > "GitHub Actions automáticamente reemplaza ${{ secrets.API_KEY }} con el valor real del secret configurado en el environment 'development'."

4. **Mostrar Output del Deploy**

   > "El pipeline nos muestra qué secrets se cargaron exitosamente:"

   ```
   📋 Secrets loaded from GitHub Environment 'development':
     - API_KEY: ✅ Set
     - DB_PASSWORD: ✅ Set (hidden)
     ...
   ```

### Parte 3: Aplicación en Funcionamiento (3 min)

1. **Abrir navegador en http://localhost:3001**

   > "Esta es la aplicación demo desplegada en desarrollo. Vemos:
   > - El environment actual: DEVELOPMENT
   > - Todos los secrets que se cargaron
   > - Noten que los passwords se muestran parcialmente ocultos por seguridad"

2. **Navegar al endpoint /config**

   > "Este endpoint nos devuelve la configuración en formato JSON, útil para debugging."

3. **Comparar con Staging**

   > "Ahora voy a ejecutar el deployment de staging y comparar."

   ```bash
   git checkout staging
   git merge develop
   git push origin staging
   ```

   **Esperar deployment, luego abrir http://localhost:3002**

   > "Noten las diferencias:
   > - Environment: STAGING (en azul)
   > - API_KEY diferente
   > - DB_HOST apunta a staging-db en lugar de dev-db
   > - Feature flags pueden ser diferentes"

---

## 🔍 Comparación con Pipeline Actual (3 minutos)

### Enfoque Actual (SISCOOP)

**Mostrar en pantalla el código actual:**

```yaml
- name: Modificar archivo de properties - develop
  run: |
    sed -i 's|\${{secrets.PASSWORD_LDAP}}|${{ secrets.PASSWORD_LDAP }}|g' \
      ${{env.ruta-clone}}/src/main/resources/siscoop_ad_des.properties
```

> "El pipeline actual usa `sed` para reemplazar placeholders en archivos de properties.
>
> **Problemas con este enfoque:**
> - Los secrets temporalmente quedan en archivos en el filesystem
> - Más complejo de mantener (regex de sed)
> - Requiere archivos template en el repo"

### Enfoque Propuesto

```yaml
docker run -d \
  -e DB_PASSWORD="${{ secrets.DB_PASSWORD }}" \
  -e API_KEY="${{ secrets.API_KEY }}" \
  my-app:latest
```

> "Con el nuevo enfoque:
> - Secrets inyectados directamente como variables de entorno
> - No tocan el filesystem
> - Más simple y limpio
> - La aplicación lee de process.env"

---

## 📊 Mejoras y Ventajas (2 minutos)

### Tabla Comparativa

| Aspecto               | Enfoque Actual      | Enfoque Propuesto    |
|-----------------------|---------------------|----------------------|
| Seguridad             | ⚠️ Media            | ✅ Alta              |
| Complejidad           | ⚠️ sed + archivos   | ✅ Variables env     |
| Auditoría             | ❌ Limitada         | ✅ Completa          |
| Rotación de secrets   | ⚠️ Manual           | ✅ Inmediata         |
| Protección prod       | ⚠️ Manual           | ✅ Aprobaciones      |
| Múltiples ambientes   | ⚠️ Múltiples files  | ✅ Environments      |

### Ventajas Adicionales

> "Además de las ventajas de seguridad, tenemos:
>
> 1. **Auditoría**: GitHub logs quién accede a qué secrets y cuándo
> 2. **Control granular**: Podemos limitar qué workflows acceden a qué environments
> 3. **Aprobaciones**: Producción puede requerir aprobación manual
> 4. **Rotación fácil**: Cambiar un secret es instantáneo en GitHub UI
> 5. **Sin archivos .env**: Eliminamos el riesgo de commits accidentales"

---

## 🎯 Implementación en Proyectos Existentes (2 minutos)

### Roadmap de Migración

> "Para migrar un proyecto existente, estos son los pasos:"

**Mostrar en pantalla:**

```
Fase 1: Preparación (1 sprint)
├── Identificar todos los secrets actuales
├── Crear environments en GitHub
└── Configurar secrets por environment

Fase 2: Adaptación (1-2 sprints)
├── Modificar aplicación para leer de variables de entorno
├── Actualizar Dockerfile para aceptar env vars
└── Crear/actualizar docker-compose.yaml

Fase 3: Pipeline (1 sprint)
├── Actualizar workflows para usar environments
├── Inyectar secrets como variables de entorno
└── Eliminar uso de sed para reemplazo de secrets

Fase 4: Validación (1 sprint)
├── Testing en development
├── Testing en staging
└── Deployment controlado a producción
```

### Ejemplo de Código

**Antes (Java/Properties):**
```properties
# archivo en repo
db.password=${DB_PASSWORD}  # placeholder
```

**Después (Variables de entorno):**
```java
// leer de environment
String dbPassword = System.getenv("DB_PASSWORD");
```

---

## ❓ Preguntas Frecuentes (3 minutos)

### Q1: ¿Qué pasa con desarrollo local?

> "Para desarrollo local, cada developer tiene su propio archivo `.env` que NO se commitea.
> Tenemos un `.env.example` en el repo como template.
>
> El developer hace:
> ```bash
> cp .env.example .env
> # Editar .env con valores locales
> ```
>
> El `.gitignore` previene que se commitee accidentalmente."

### Q2: ¿Cómo rotamos un secret?

> "Super simple:
> 1. Ir a GitHub > Settings > Environments > [env] > Secrets
> 2. Click en el secret
> 3. Update value
> 4. El próximo deployment usa el nuevo valor automáticamente
>
> No necesitamos tocar el código ni hacer commits."

### Q3: ¿Funciona con nuestros runners actuales?

> "Sí, completamente compatible. Solo necesitamos:
> - Cambiar `runs-on: ubuntu-latest` por `runs-on: ltrodckrapde01-org`
> - El resto es idéntico
> - Los runners ya tienen Docker instalado"

### Q4: ¿Podemos mantener el enfoque actual durante la migración?

> "Sí, la migración puede ser gradual:
> - Nuevos proyectos: usar el nuevo enfoque
> - Proyectos existentes: migrar paulatinamente
> - Ambos enfoques pueden coexistir durante la transición"

---

## 🎬 Cierre y Próximos Pasos (2 minutos)

### Resumen

> "En resumen, GitHub Environments con Secrets nos da:
>
> ✅ **Mayor seguridad**: Secrets nunca en el repo
> ✅ **Mejor control**: Aprobaciones y auditoría
> ✅ **Más simplicidad**: No gestionar archivos .env
> ✅ **Escalabilidad**: Fácil agregar más ambientes"

### Próximos Pasos Sugeridos

> "Propongo estos pasos:
>
> 1. **Esta semana**: Validar el enfoque con el equipo de SI
> 2. **Próximo sprint**: Piloto con 1 proyecto pequeño
> 3. **Siguiente mes**: Documentar best practices
> 4. **Siguiente trimestre**: Roadmap de migración de proyectos críticos"

### Demo Repository

> "Todo el código de esta demo está disponible en:
> - Repositorio: [URL del repo]
> - Documentación completa: DEMO-GUIDE.md
> - Pueden clonarlo y probarlo en sus equipos"

---

## 📋 Checklist Pre-Presentación

Antes de la demo, asegurar:

- [ ] Environments creados en GitHub (dev, staging, prod)
- [ ] Todos los secrets configurados en cada environment
- [ ] Aplicación corriendo localmente (backup plan)
- [ ] Docker y docker-compose instalados
- [ ] Terminal y navegador abiertos en pestañas separadas
- [ ] GitHub UI abierto en Settings > Environments
- [ ] Documentos de referencia impresos (por si acaso)
- [ ] Backup slides con capturas de pantalla
- [ ] Cronómetro para respetar tiempos

---

## 🆘 Plan B (Si algo falla)

### Si falla el pipeline:

1. Mostrar screenshots de una ejecución previa exitosa
2. Explicar el proceso basado en los screenshots
3. Mostrar la aplicación corriendo localmente (previamente desplegada)

### Si falla Docker local:

1. Usar la versión con `npm start` (sin Docker)
2. Los secrets se cargan igual desde .env
3. El concepto es el mismo

### Si GitHub está lento:

1. Tener la demo completa en video (backup)
2. Mostrar screenshots de cada paso
3. Focus en explicación conceptual

---

**Duración Total**: ~30 minutos
- Introducción: 5 min
- Demo en vivo: 10 min
- Comparación: 3 min
- Ventajas: 2 min
- Implementación: 2 min
- Q&A: 3 min
- Cierre: 2 min
- Buffer: 3 min

**¡Buena suerte con la presentación!** 🚀
