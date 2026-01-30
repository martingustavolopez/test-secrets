const express = require('express');
const app = express();

// Puerto configurado por variable de entorno
const PORT = process.env.PORT || 3000;

// Variables de entorno que demuestran los secrets
const ENVIRONMENT = process.env.ENVIRONMENT || 'unknown';
const API_KEY = process.env.API_KEY || 'NOT_SET';
const DB_HOST = process.env.DB_HOST || 'NOT_SET';
const DB_USER = process.env.DB_USER || 'NOT_SET';
const DB_PASSWORD = process.env.DB_PASSWORD || 'NOT_SET';
const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'NOT_SET';
const EXTERNAL_API_TOKEN = process.env.EXTERNAL_API_TOKEN || 'NOT_SET';
const FEATURE_FLAG_PREMIUM = process.env.FEATURE_FLAG_PREMIUM || 'false';

// Middleware para logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Endpoint principal - Dashboard de Secrets
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo Secrets - GitHub Actions Environments</title>
      <style>
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          max-width: 1200px;
          margin: 50px auto;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        h1 {
          color: #2d3748;
          border-bottom: 3px solid #667eea;
          padding-bottom: 10px;
        }
        .env-badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 20px;
        }
        .env-dev { background: #fbbf24; color: #78350f; }
        .env-staging { background: #60a5fa; color: #1e3a8a; }
        .env-prod { background: #34d399; color: #064e3b; }
        .secret-card {
          background: #f7fafc;
          border-left: 4px solid #667eea;
          padding: 15px;
          margin: 15px 0;
          border-radius: 5px;
        }
        .secret-label {
          font-weight: bold;
          color: #4a5568;
          font-size: 14px;
          text-transform: uppercase;
        }
        .secret-value {
          color: #2d3748;
          font-family: 'Courier New', monospace;
          background: #edf2f7;
          padding: 8px;
          border-radius: 4px;
          margin-top: 5px;
          word-break: break-all;
        }
        .masked {
          background: #fed7d7;
          color: #c53030;
        }
        .warning {
          background: #fef3c7;
          border-left-color: #f59e0b;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .info {
          background: #dbeafe;
          border: 1px solid #3b82f6;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .timestamp {
          color: #718096;
          font-size: 12px;
          text-align: right;
          margin-top: 20px;
        }
        .feature-flag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: bold;
        }
        .flag-enabled { background: #34d399; color: #064e3b; }
        .flag-disabled { background: #fca5a5; color: #7f1d1d; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Demo: GitHub Actions Secrets en Environments</h1>

        <div class="env-badge env-${ENVIRONMENT.toLowerCase()}">
          🌍 Environment: ${ENVIRONMENT.toUpperCase()}
        </div>

        <div class="info">
          <strong>ℹ️ Propósito de esta demo:</strong><br>
          Esta aplicación demuestra cómo GitHub Actions inyecta secrets específicos
          por environment (dev, staging, prod) sin necesidad de archivos .env commiteados.
        </div>

        <h2>📊 Configuración de Secrets Cargados</h2>

        <div class="secret-card">
          <div class="secret-label">🔑 API Key (Público)</div>
          <div class="secret-value">${API_KEY}</div>
        </div>

        <div class="secret-card">
          <div class="secret-label">🗄️ Database Host</div>
          <div class="secret-value">${DB_HOST}</div>
        </div>

        <div class="secret-card">
          <div class="secret-label">👤 Database User</div>
          <div class="secret-value">${DB_USER}</div>
        </div>

        <div class="secret-card">
          <div class="secret-label">🔒 Database Password (Sensible)</div>
          <div class="secret-value masked">
            ${DB_PASSWORD !== 'NOT_SET' ? '****** (oculto por seguridad - ' + DB_PASSWORD.substring(0, 4) + '...)' : 'NOT_SET'}
          </div>
        </div>

        <div class="secret-card">
          <div class="secret-label">🌐 External API URL</div>
          <div class="secret-value">${EXTERNAL_API_URL}</div>
        </div>

        <div class="secret-card">
          <div class="secret-label">🎟️ External API Token</div>
          <div class="secret-value masked">
            ${EXTERNAL_API_TOKEN !== 'NOT_SET' ? '****** (oculto - ' + EXTERNAL_API_TOKEN.substring(0, 8) + '...)' : 'NOT_SET'}
          </div>
        </div>

        <div class="secret-card">
          <div class="secret-label">🚀 Feature Flag: Premium Features</div>
          <div class="feature-flag ${FEATURE_FLAG_PREMIUM === 'true' ? 'flag-enabled' : 'flag-disabled'}">
            ${FEATURE_FLAG_PREMIUM === 'true' ? '✅ ENABLED' : '❌ DISABLED'}
          </div>
        </div>

        <div class="warning">
          <strong>⚠️ Nota de Seguridad:</strong><br>
          En producción, NUNCA exponer passwords o tokens completos.
          Esta demo los muestra parcialmente solo con fines educativos.
        </div>

        <h2>🎯 Endpoints Disponibles</h2>
        <ul>
          <li><code>GET /</code> - Este dashboard</li>
          <li><code>GET /health</code> - Health check</li>
          <li><code>GET /config</code> - Configuración en JSON</li>
        </ul>

        <div class="timestamp">
          🕐 Servidor iniciado en: ${new Date().toISOString()}<br>
          🔌 Puerto: ${PORT}
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    environment: ENVIRONMENT,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Config endpoint (JSON)
app.get('/config', (req, res) => {
  res.json({
    environment: ENVIRONMENT,
    port: PORT,
    secrets: {
      api_key: API_KEY,
      database: {
        host: DB_HOST,
        user: DB_USER,
        password_set: DB_PASSWORD !== 'NOT_SET'
      },
      external_api: {
        url: EXTERNAL_API_URL,
        token_set: EXTERNAL_API_TOKEN !== 'NOT_SET'
      },
      features: {
        premium: FEATURE_FLAG_PREMIUM === 'true'
      }
    }
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🚀 Servidor iniciado correctamente');
  console.log(`🌍 Environment: ${ENVIRONMENT}`);
  console.log(`🔌 Puerto: ${PORT}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log('========================================');
  console.log('📊 Secrets cargados:');
  console.log(`  API_KEY: ${API_KEY !== 'NOT_SET' ? '✅' : '❌'}`);
  console.log(`  DB_HOST: ${DB_HOST}`);
  console.log(`  DB_USER: ${DB_USER}`);
  console.log(`  DB_PASSWORD: ${DB_PASSWORD !== 'NOT_SET' ? '✅ (oculto)' : '❌'}`);
  console.log(`  EXTERNAL_API_URL: ${EXTERNAL_API_URL}`);
  console.log(`  EXTERNAL_API_TOKEN: ${EXTERNAL_API_TOKEN !== 'NOT_SET' ? '✅ (oculto)' : '❌'}`);
  console.log(`  FEATURE_FLAG_PREMIUM: ${FEATURE_FLAG_PREMIUM}`);
  console.log('========================================');
});
