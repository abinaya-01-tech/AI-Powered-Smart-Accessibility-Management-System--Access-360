import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { authRouter } from './server/routes/auth.js';
import { wheelchairRouter } from './server/routes/wheelchair.js';
import { accessibilityRouter } from './server/routes/accessibility.js';
import { locationsRouter } from './server/routes/locations.js';
import { adminRouter } from './server/routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      system: 'AI-Powered Smart Accessibility Management System',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // REST API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/wheelchair', wheelchairRouter);
  app.use('/api/accessibility', accessibilityRouter);
  app.use('/api/locations', locationsRouter);
  app.use('/api/admin', adminRouter);

  // Global API 404 handler for unmatched /api routes
  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Vite middleware for development vs static dist for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Accessibility System] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
