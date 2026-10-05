import { randomUUID } from 'node:crypto';
import { documentWorkflow } from './workflow/documentWorkflow.js';

export const appStore = {
  users: [
    { id: '11111111-1111-4111-8111-111111111111', username: 'admin', password: 'Admin@1234', role: 'QA', fullName: 'System Admin', active: true },
    { id: '22222222-2222-4222-8222-222222222222', username: 'jdoe', password: 'Password123!', role: 'AUTHOR', fullName: 'Jane Doe', active: true },
    { id: '33333333-3333-4333-8333-333333333333', username: 'ramesh', password: 'Password123!', role: 'APPROVER', fullName: 'Ramesh Kumar', active: true }
  ],
  documents: [
    {
      id: 'doc-001',
      title: 'SOP-001: Document Control',
      status: 'DRAFT',
      ownerId: '22222222-2222-4222-8222-222222222222',
      version: 1,
      createdAt: '2026-01-09T00:00:00.000Z',
      versions: [
        {
          id: 'v1-doc-001',
          version: 1,
          status: 'DRAFT',
          changeReason: 'Initial document creation',
          changedBy: '22222222-2222-4222-8222-222222222222',
          createdAt: '2026-01-09T00:00:00.000Z'
        }
      ]
    },
    {
      id: 'doc-002',
      title: 'Calibration and Equipment Log',
      status: 'EFFECTIVE',
      ownerId: '11111111-1111-4111-8111-111111111111',
      version: 3,
      createdAt: '2025-12-10T00:00:00.000Z',
      versions: [
        {
          id: 'v1-doc-002',
          version: 1,
          status: 'DRAFT',
          changeReason: 'Initial setup',
          changedBy: '11111111-1111-4111-8111-111111111111',
          createdAt: '2025-12-10T00:00:00.000Z'
        },
        {
          id: 'v2-doc-002',
          version: 2,
          status: 'EFFECTIVE',
          changeReason: 'Implementation approved',
          changedBy: '11111111-1111-4111-8111-111111111111',
          createdAt: '2026-01-05T00:00:00.000Z'
        },
        {
          id: 'v3-doc-002',
          version: 3,
          status: 'EFFECTIVE',
          changeReason: 'Routine update',
          changedBy: '33333333-3333-4333-8333-333333333333',
          createdAt: '2026-02-01T00:00:00.000Z'
        }
      ]
    }
  ],
  qualityEvents: [
    {
      id: 'qev-001',
      type: 'DEVIATION',
      title: 'Temperature excursion at storage area',
      description: 'The room temperature exceeded the approved range for 36 minutes.',
      severity: 'MEDIUM',
      status: 'OPEN',
      fields: {
        product: 'API-001',
        reportedBy: 'jdoe',
        rootCause: 'Cooling unit maintenance delay'
      },
      raisedBy: '22222222-2222-4222-8222-222222222222',
      createdAt: '2026-03-10T09:00:00.000Z'
    }
  ],
  auditTrail: [
    {
      id: 'audit-001',
      entityType: 'DOCUMENT',
      entityId: 'doc-001',
      action: 'DOCUMENT_CREATED',
      actorId: '22222222-2222-4222-8222-222222222222',
      details: { title: 'SOP-001: Document Control' },
      createdAt: '2026-01-09T00:00:00.000Z'
    }
  ]
};

export function getUserById(userId) {
  return appStore.users.find((user) => user.id === userId) || null;
}

export function loginUser(username, password) {
  if (!username || !password) {
    return null;
  }

  const user = appStore.users.find((entry) => entry.username === username && entry.password === password && entry.active);
  if (!user) {
    return null;
  }

  return { user: { ...user } };
}

export function changePassword(userId, currentPassword, newPassword) {
  const user = getUserById(userId);
  if (!user) {
    return { ok: false, error: 'User not found' };
  }

  if (user.password !== currentPassword) {
    return { ok: false, error: 'Current password is incorrect' };
  }

  if (!newPassword || newPassword.length < 12) {
    return { ok: false, error: 'Password must be at least 12 characters long' };
  }

  if (newPassword === currentPassword) {
    return { ok: false, error: 'New password cannot be the same as the current password' };
  }

  user.password = newPassword;
  return { ok: true };
}

export function listDocuments() {
  return appStore.documents.map((document) => ({
    id: document.id,
    title: document.title,
    status: document.status,
    ownerId: document.ownerId,
    version: document.version,
    createdAt: document.createdAt,
    versionsCount: document.versions.length
  }));
}

export function getDocumentById(documentId) {
  return appStore.documents.find((document) => document.id === documentId) || null;
}

export function addAuditEvent({ entityType, entityId, action, actorId, details }) {
  const entry = {
    id: randomUUID(),
    entityType,
    entityId,
    action,
    actorId,
    details: details || {},
    createdAt: new Date().toISOString()
  };

  appStore.auditTrail.unshift(entry);
  return entry;
}

export function transitionDocument(documentId, toStatus, actorId) {
  const document = getDocumentById(documentId);
  if (!document) {
    return { ok: false, error: 'Document not found' };
  }

  const allowed = documentWorkflow[document.status] || [];
  if (!allowed.includes(toStatus)) {
    return { ok: false, error: `Status transition from ${document.status} to ${toStatus} is not allowed` };
  }

  document.status = toStatus;
  document.versions.push({
    id: randomUUID(),
    version: document.version,
    status: toStatus,
    changeReason: `Transition to ${toStatus}`,
    changedBy: actorId,
    createdAt: new Date().toISOString()
  });

  addAuditEvent({
    entityType: 'DOCUMENT',
    entityId: document.id,
    action: 'DOCUMENT_STATUS_CHANGED',
    actorId,
    details: {
      fromStatus: document.status,
      toStatus,
      reason: `Transition to ${toStatus}`
    }
  });

  return { ok: true, document };
}

export function createDocumentRevision(documentId, reason, versionNo, actorId) {
  const document = getDocumentById(documentId);
  if (!document) {
    return { ok: false, error: 'Document not found' };
  }

  if (document.status !== 'EFFECTIVE') {
    return { ok: false, error: 'Only effective documents can be revised' };
  }

  const normalizedReason = (reason || '').trim();
  if (normalizedReason.length < 5 || normalizedReason.length > 1000) {
    return { ok: false, error: 'Revision reason must be between 5 and 1000 characters' };
  }

  const newVersion = Number(versionNo) || document.version + 1;
  if (newVersion <= document.version) {
    return { ok: false, error: 'Revision version must be greater than the current version' };
  }

  document.version = newVersion;
  document.status = 'DRAFT';
  document.versions.push({
    id: randomUUID(),
    version: newVersion,
    status: 'DRAFT',
    changeReason: normalizedReason,
    changedBy: actorId,
    createdAt: new Date().toISOString()
  });

  addAuditEvent({
    entityType: 'DOCUMENT',
    entityId: document.id,
    action: 'DOCUMENT_REVISION_CREATED',
    actorId,
    details: {
      reason: normalizedReason,
      newVersion
    }
  });

  return { ok: true, document };
}

export function listQualityEvents() {
  return appStore.qualityEvents;
}

export function createQualityEvent(payload, actorId) {
  const { type, title, description, severity, fields } = payload || {};

  if (!type || !title || !description) {
    return { ok: false, error: 'Type, title and description are required' };
  }

  const event = {
    id: randomUUID(),
    type: String(type).toUpperCase(),
    title: String(title).trim(),
    description: String(description).trim(),
    severity: String(severity || 'MEDIUM').toUpperCase(),
    status: 'OPEN',
    fields: fields || {},
    raisedBy: actorId,
    createdAt: new Date().toISOString()
  };

  appStore.qualityEvents.unshift(event);
  addAuditEvent({
    entityType: 'QUALITY_EVENT',
    entityId: event.id,
    action: 'QUALITY_EVENT_CREATED',
    actorId,
    details: {
      type: event.type,
      title: event.title,
      severity: event.severity
    }
  });

  return { ok: true, event };
}

export function getDashboardSummary() {
  return {
    documents: appStore.documents.length,
    openQualityEvents: appStore.qualityEvents.filter((event) => event.status === 'OPEN').length,
    overdueTraining: 2,
    overdueCalibration: 3,
    activeUsers: appStore.users.filter((user) => user.active).length,
    totalAuditEvents: appStore.auditTrail.length
  };
}

export function listAuditTrail({ action, entityType, limit } = {}) {
  let items = [...appStore.auditTrail];

  if (action) {
    items = items.filter((item) => item.action === action);
  }

  if (entityType) {
    items = items.filter((item) => item.entityType === entityType);
  }

  return items.slice(0, Number(limit) || 50);
}
