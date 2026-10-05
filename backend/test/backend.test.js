import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/app.js';

const app = createApp();

function makeRequest(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const port = server.address().port;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      fetch(`http://127.0.0.1:${port}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined
      })
        .then((response) => response.json().then((data) => ({ status: response.status, data })))
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

test('login succeeds for valid user', async () => {
  const result = await makeRequest('/api/auth/login', 'POST', { username: 'jdoe', password: 'Password123!' });
  assert.equal(result.status, 200);
  assert.ok(result.data.token);
  assert.equal(result.data.user.username, 'jdoe');
});

test('documents list is protected by auth', async () => {
  const result = await makeRequest('/api/documents');
  assert.equal(result.status, 401);
  assert.equal(result.data.error, 'Missing token');
});

test('documents list returns data with valid token', async () => {
  const login = await makeRequest('/api/auth/login', 'POST', { username: 'jdoe', password: 'Password123!' });
  const result = await makeRequest('/api/documents', 'GET', null, login.data.token);
  assert.equal(result.status, 200);
  assert.equal(Array.isArray(result.data), true);
});

test('dashboard summary is available', async () => {
  const login = await makeRequest('/api/auth/login', 'POST', { username: 'mike', password: 'Password123!' });
  const result = await makeRequest('/api/dashboard/summary', 'GET', null, login.data.token);
  assert.equal(result.status, 200);
  assert.equal(result.data.documents, 2);
});
