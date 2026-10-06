import { beforeEach, expect, test } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';

const app = createApp();
beforeEach(async () => { await loadSeed(); });

test('health reports the connected test database', async () => {
  const { body } = await request(app).get('/api/health').expect(200);
  expect(body.status).toBe('ok');
  expect(body.env).toBe('test');
  expect(body.database).toMatchObject({ connected: true, driver: 'sqlite' });
  expect(body.database.tables).toBeGreaterThanOrEqual(2);
  expect(Number.isNaN(Date.parse(body.time))).toBe(false);
});

test('users endpoint returns users without exposing their email addresses', async () => {
  const { body } = await request(app).get('/api/users').expect(200);
  expect(body.length).toBeGreaterThan(0);
  for (const user of body) {
    expect(user).toEqual({ id: expect.any(Number), name: expect.any(String), department: expect.any(String) });
  }
});

test('user requests belong to that user and reflect saved status changes', async () => {
  const users = (await request(app).get('/api/users').expect(200)).body;
  const requests = (await request(app).get('/api/requests').expect(200)).body;
  const user = users.find((u) => u.name === requests[0].requesterName);
  const expected = requests.filter((r) => r.requesterName === user.name);
  await request(app).put(`/api/requests/${expected[0].id}`).send({ status: 'completed' }).expect(200);
  const { body } = await request(app).get(`/api/users/${user.id}/requests`).expect(200);
  expect(body.map((r) => r.id)).toEqual(expected.map((r) => r.id));
  expect(body[0].status).toBe('completed');
  expect(body[0].requestType).toBe(expected[0].requestType);
  await request(app).get('/api/users/999999/requests').expect(200, []);
});

test('API entry point and development root return useful JSON', async () => {
  const api = await request(app).get('/api').expect(200);
  expect(api.body.message).toBe('Campus Service API is running');
  const root = await request(app).get('/').expect(200);
  expect(root.body.api).toBe('/api');
});
