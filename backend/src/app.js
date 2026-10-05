import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import {
  appStore,
  getUserById,
  loginUser,
  changePassword,
  listDocuments,
  getDocumentById,
  transitionDocument,
  createDocumentRevision,
  listQualityEvents,
  createQualityEvent,
  getDashboardSummary,
  listAuditTrail,
  addAuditEvent
} from './data/store.js';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '8mb' }));
  app.disable('x-powered-by');

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });

  const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret);
      req.user = payload;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'mukund-qms-api',
      timestamp: new Date().toISOString()
    });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body || {};
    const result = loginUser(username, password);

    if (!result) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      {
        id: result.user.id,
        username: result.user.username,
        role: result.user.role,
        fullName: result.user.fullName
      },
      config.jwtSecret,
      { expiresIn: '8h' }
    );

    addAuditEvent({
      entityType: 'USER',
      entityId: result.user.id,
      action: 'LOGIN',
      actorId: result.user.id,
      details: { username: result.user.username }
    });

    res.json({
      token,
      user: {
        id: result.user.id,
        username: result.user.username,
        fullName: result.user.fullName,
        role: result.user.role,
        active: result.user.active
      }
    });
  });

  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      active: user.active
    });
  });

  app.post('/api/auth/change-password', authMiddleware, (req, res) => {
    const { currentPassword, newPassword } = req.body || {};
    const result = changePassword(req.user.id, currentPassword, newPassword);

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    addAuditEvent({
      entityType: 'USER',
      entityId: req.user.id,
      action: 'PASSWORD_CHANGED',
      actorId: req.user.id,
      details: { passwordChanged: true }
    });

    res.json({ ok: true, message: 'Password updated successfully' });
  });

  app.get('/api/documents', authMiddleware, (req, res) => {
    res.json(listDocuments());
  });

  app.get('/api/documents/:id', authMiddleware, (req, res) => {
    const document = getDocumentById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  });

  app.get('/api/documents/:id/versions', authMiddleware, (req, res) => {
    const document = getDocumentById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json({
      documentId: document.id,
      versions: document.versions
    });
  });

  app.post('/api/documents/:id/transition', authMiddleware, (req, res) => {
    const { toStatus } = req.body || {};
    const result = transitionDocument(req.params.id, toStatus, req.user.id);

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ ok: true, document: result.document });
  });

  app.post('/api/documents/:id/create-revision', authMiddleware, (req, res) => {
    const { reason, versionNo } = req.body || {};
    const result = createDocumentRevision(req.params.id, reason, versionNo, req.user.id);

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.json({ ok: true, document: result.document });
  });

  app.get('/api/quality-events', authMiddleware, (req, res) => {
    res.json(listQualityEvents());
  });

  app.post('/api/quality-events', authMiddleware, (req, res) => {
    const { type, title, description, severity, fields } = req.body || {};
    const result = createQualityEvent({
      type,
      title,
      description,
      severity,
      fields
    }, req.user.id);

    if (!result.ok) {
      return res.status(400).json({ error: result.error });
    }

    res.status(201).json({ ok: true, event: result.event });
  });

  app.get('/api/dashboard/summary', authMiddleware, (req, res) => {
    res.json(getDashboardSummary());
  });

  app.get('/api/audit', authMiddleware, (req, res) => {
    const { action, entityType, limit = 50 } = req.query;
    const events = listAuditTrail({
      action: typeof action === 'string' ? action : undefined,
      entityType: typeof entityType === 'string' ? entityType : undefined,
      limit: Number(limit) || 50
    });

    res.json(events);
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

export function startServer(port = Number(config.port)) {
  const app = createApp();
  return new Promise((resolve) => {
    const server = app.listen(port, () => resolve(server));
  });
}

const isDirectExecution = process.argv[1] && process.argv[1].endsWith('app.js');
if (isDirectExecution) {
  startServer().then((server) => {
    const address = server.address();
    console.log(`Mukund QMS API running on http://localhost:${address.port}`);
  });
}

export { appStore };
