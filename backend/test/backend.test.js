import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const app = createApp();

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      })
        .then(async (response) => {
          const text = await response.text();
          const parsed = text ? JSON.parse(text) : {};
          return { status: response.status, data: parsed };
        })
        .then((result) => {
          server.close();
          resolve(result);
        })
        .catch((error) => {
          server.close();
          reject(error);
        });
    });
  });
}

test('health endpoint responds with ok', async () => {
  const result = await makeRequest('/api/health');
  assert.equal(result.status, 200);
  assert.equal(result.data.status, 'ok');
});

test('login succeeds for valid credentials', async () => {
  const result = await makeRequest('/api/auth/login', 'POST', { username: 'admin', password: 'Admin@1234' });
  assert.equal(result.status, 200);
  assert.ok(result.data.token);
  assert.equal(result.data.user.username, 'admin');
});

test('documents are protected by authentication', async () => {
  const result = await makeRequest('/api/documents');
  assert.equal(result.status, 401);
  assert.equal(result.data.error, 'Missing token');
});

test('documents route returns list with valid token', async () => {
  const login = await makeRequest('/api/auth/login', 'POST', { username: 'admin', password: 'Admin@1234' });
  const result = await makeRequest('/api/documents', 'GET', null, login.data.token);
  assert.equal(result.status, 200);
  assert.equal(Array.isArray(result.data), true);
  assert.ok(result.data.length >= 2);
});

test('quality event creation works', async () => {
  const login = await makeRequest('/api/auth/login', 'POST', { username: 'admin', password: 'Admin@1234' });
  const result = await makeRequest('/api/quality-events', 'POST', {
    type: 'DEVIATION',
    title: 'Packaging line issue',
    description: 'Label printer failed during batch packaging.',
    severity: 'HIGH',
    fields: { batchNo: 'B-1002' }
  }, login.data.token);

  assert.equal(result.status, 201);
  assert.equal(result.data.event.type, 'DEVIATION');
});

test('dashboard summary returns KPI data', async () => {
  const login = await makeRequest('/api/auth/login', 'POST', { username: 'jdoe', password: 'Password123!' });
  const result = await makeRequest('/api/dashboard/summary', 'GET', null, login.data.token);
  assert.equal(result.status, 200);
  assert.equal(typeof result.data.documents, 'number');
  assert.equal(typeof result.data.activeUsers, 'number');
});

