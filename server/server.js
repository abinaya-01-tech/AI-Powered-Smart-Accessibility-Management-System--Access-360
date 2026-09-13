/**
 * Standalone Node.js Express server entry point for server/
 */
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.js';
import { wheelchairRouter } from './routes/wheelchair.js';
import { accessibilityRouter } from './routes/accessibility.js';
import { locationsRouter } from './routes/locations.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'Accessibility Backend API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRouter);
app.use('/api/wheelchair', wheelchairRouter);
app.use('/api/accessibility', accessibilityRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/admin', adminRouter);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend service listening on port ${PORT}`);
  });
}

export default app;
