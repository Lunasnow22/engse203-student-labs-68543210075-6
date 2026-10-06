import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';
import { resetLoginLimiter } from '../../src/routes/authRoutes.js';
import { vi, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { config } from '../../src/config.js';

/**
 * Week 13 — เข้าสู่ระบบและสิทธิ์
 * test 3 ข้อแรกให้มาแล้ว — จะ fail จนกว่าจะทำ CP50–CP51 เสร็จ (เขียน test ก่อน แล้วทำให้ผ่าน)
 */
const app = createApp();
beforeEach(async () => { resetLoginLimiter(); await loadSeed(); });
afterEach(() => { vi.useRealTimers(); });

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });
  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });

  test('unknown email and wrong password have the same 401 response', async () => {
    const wrong = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' });
    const unknown = await request(app).post('/api/auth/login').send({ email: 'missing@example.com', password: 'wrong' });
    expect(unknown.status).toBe(401);
    expect(unknown.body).toEqual(wrong.body);
  });
  test('token and response do not expose password hashes', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(jwt.decode(r.body.token)).toMatchObject({ role: 'staff' });
    expect(JSON.stringify(r.body.user)).not.toMatch(/password|hash/i);
    expect(jwt.decode(r.body.token)).not.toHaveProperty('passwordHash');
  });
  test.each([{}, { email: 'bad', password: 'abc' }, { ...STAFF, password: 123 }])('invalid login -> 400: %j', async (body) => {
    expect((await request(app).post('/api/auth/login').send(body)).status).toBe(400);
  });
});

describe('security regressions', () => {
  test.each(['put', 'delete'])('%s: requester -> 403; forged/expired token -> 401', async (method) => {
    const url = '/api/requests/REQ-001';
    expect((await request(app)[method](url).set('Authorization', `Bearer ${tokenFor('requester')}`).send({ status: 'completed' })).status).toBe(403);
    expect((await request(app)[method](url).set('Authorization', `Bearer ${tokenFor('staff', 'wrong-secret')}`).send({ status: 'completed' })).status).toBe(401);
    const expired = jwt.sign({ sub: '5', role: 'staff' }, config.jwtSecret, { expiresIn: -1 });
    expect((await request(app)[method](url).set('Authorization', `Bearer ${expired}`).send({ status: 'completed' })).status).toBe(401);
  });
  test('staff can update and delete', async () => {
    const auth = { Authorization: `Bearer ${await loginAsStaff(app)}` };
    expect((await request(app).put('/api/requests/REQ-001').set(auth).send({ status: 'completed' })).status).toBe(200);
    expect((await request(app).delete('/api/requests/REQ-001').set(auth)).status).toBe(204);
  });
  test('missing DELETE token -> 401', async () => {
    expect((await request(app).delete('/api/requests/REQ-001')).status).toBe(401);
  });
  test('oversized body -> JSON 413 with security headers', async () => {
    const r = await request(app).post('/api/requests').send({ details: 'x'.repeat(11000) });
    expect(r.status).toBe(413);
    expect(r.body.error).toBe('ข้อมูลที่ส่งมามีขนาดใหญ่เกินกำหนด');
    expect(r.headers['x-content-type-options']).toBe('nosniff');
    expect(r.headers['x-frame-options']).toBe('DENY');
    expect(r.headers['referrer-policy']).toBe('no-referrer');
  });
  test('five failures block even a correct password; window expiry unlocks', async () => {
    for (let i = 0; i < 5; i++) expect((await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' })).status).toBe(401);
    const blocked = await request(app).post('/api/auth/login').send(STAFF);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + 16 * 60 * 1000);
    expect((await request(app).post('/api/auth/login').send(STAFF)).status).toBe(200);
  });
  test('successful login resets failures', async () => {
    for (let i = 0; i < 4; i++) await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' });
    expect((await request(app).post('/api/auth/login').send(STAFF)).status).toBe(200);
    expect((await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' })).status).toBe(401);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  test('ไม่มี token → 401', async () => {
    const r = await request(app).put('/api/requests/REQ-001').send({ status: 'completed' });
    expect(r.status).toBe(401);
  });

  // 🏫 TODO W13-AUTH (CP51): เพิ่ม
  //   - token ที่ไม่ใช่เจ้าหน้าที่ → 403      ใช้ tokenFor('requester')
  //   - token ปลอม (secret อื่น) → 401        ใช้ tokenFor('staff', 'not-the-real-secret')
  //   - เจ้าหน้าที่ → PUT 200 และ DELETE 204  ใช้ await loginAsStaff(app)
  //   ⚠ หลังผูก authenticate แล้ว test ของ PUT/DELETE ใน requests.api.test.js จะพัง (401)
  //     — นั่นคือสัญญาณว่า requirement เปลี่ยน: แก้ test ให้เข้าสู่ระบบก่อน
});
