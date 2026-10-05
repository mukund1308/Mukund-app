import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { db, seedData } from './data/store.js';
import { documentWorkflow } from './workflow/documentWorkflow.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '8mb' }));

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '0');
    next();
  });

  const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me');
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'mukund-qms-api' });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};
    const user = db.users.find((entry) => entry.username === username && entry.password === password);

    if (!user || !user.active) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET || 'development-secret-change-me', {
      expiresIn: '8h'
    });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });

  app.post('/api/auth/change-password', authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const user = db.users.find((entry) => entry.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== currentPassword) {
      return res.status(400).json({ error: 'Current password does not match' });
    }

    if (!newPassword || newPassword.length < 12) {
      return res.status(400).json({ error: 'New password must be at least 12 characters' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ error: 'Password cannot be reused' });
    }

    user.password = newPassword;

    res.json({ ok: true, message: 'Password updated' });
  });

  app.get('/api/documents', authMiddleware, (req, res) => {
    const documents = db.documents.map((document) => ({
      id: document.id,
      title: document.title,
      status: document.status,
      owner: document.owner,
      version: document.version
    }));

    res.json(documents);
  });

  app.get('/api/documents/:id/versions', authMiddleware, (req, res) => {
    const { id } = req.params;
    const document = db.documents.find((entry) => entry.id === id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({ documentId: id, versions: document.versions });
  });

  app.post('/api/documents/:id/transition', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { toStatus } = req.body || {};
    const document = db.documents.find((entry) => entry.id === id);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const allowed = documentWorkflow[document.status];
    const nextStatus = allowed && allowed.includes(toStatus) ? toStatus : null;

    if (!nextStatus) {
      return res.status(400).json({ error: 'Transition not allowed' });
    }

    document.status = nextStatus;
    document.versions.push({
      version: document.version,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });

    res.json({ ok: true, document });
  });

  app.get('/api/dashboard/summary', authMiddleware, (req, res) => {
    const summary = {
      documents: db.documents.length,
      openQualityEvents: 3,
      overdueTraining: 1,
      overdueCalibration: 2,
      activeUsers: db.users.filter((user) => user.active).length
    };

    res.json(summary);
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  return app;
}

export function startServer(port = Number(process.env.PORT || 3000)) {
  const app = createApp();
  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve(server));
  });
}

const isDirectExecution = process.argv[1] && process.argv[1] === __filename;
if (isDirectExecution) {
  startServer().then((server) => {
    const address = server.address();
    console.log(`Mukund QMS API running on http://localhost:${address.port}`);
  });
}

export { db, seedData };
