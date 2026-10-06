import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

/**
 * TODO W07-TEST (🏠 CP16) · เขียน test อย่างน้อย 6 เคส
 *
 * ที่ต้องมี
 *   1. GET /api/requests            → 200 และได้ array
 *   2. GET /api/requests/:id พบ      → 200
 *   3. GET /api/requests/:id ไม่พบ   → 404
 *   4. POST ข้อมูลถูกต้อง            → 201 และ status เป็น pending
 *   5. POST ข้อมูลไม่ครบ             → 400
 *   6. CORS header ตอบ origin ที่อนุญาต
 *
 * รันด้วย: npm test
 * ตัวอย่างโครง (ลบคอมเมนต์นี้แล้วเขียนจริง)
 */
describe('Campus Service API Tests (CP16 & CP33)', () => {
  test('1. GET /api/requests คืนรายการทั้งหมด พร้อม status 200 และเป็น array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
  test('2. คืนรูปแบบ requesterName (ไม่ใช่ requester_id)', async () => {
    const res = await request(app).get('/api/requests');
    assert.ok(res.body[0]);
    assert.ok('requesterName' in res.body[0]);
    assert.ok(!('requester_id' in res.body[0]));
  });
  test('3. GET /api/requests/:id เมื่อพบคำร้อง ตอบ status 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });
  test('4. GET /api/requests/:id เมื่อไม่พบคำร้อง ตอบ status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
  test('5. POST /api/requests ข้อมูลถูกต้อง ตอบ 201 และสถานะเริ่มต้นเป็น pending', async () => {
    const res = await request(app).post('/api/requests').send(validRequest);
    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id);
  });
  test('6. POST /api/requests ข้อมูลไม่ครบ ตอบ status 400 พร้อม error details', async () => {
    const res = await request(app).post('/api/requests').send({ requesterName: 'ก' });
    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
  test('7. ป้องกัน SQL injection ผ่าน ?status= ได้ผลลัพธ์ว่าง (0 รายการ)', async () => {
    const evil = encodeURIComponent("x' OR '1'='1");
    const res = await request(app).get(`/api/requests?status=${evil}`);
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.equal(res.body.length, 0);
  });
  test('8. CORS header ตอบ Access-Control-Allow-Origin ตรงกับที่อนุญาต', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');
    assert.equal(res.headers['access-control-allow-origin'], 'http://localhost:5173');
  });
  test('9. GET /api/users คืนรายการผู้ใช้ทั้งหมด 200', async () => {
    const res = await request(app).get('/api/users');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 4);
  });
  test('10. GET /api/users/:id/requests คืนคำร้องของผู้ใช้ 200', async () => {
    const res = await request(app).get('/api/users/1/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});