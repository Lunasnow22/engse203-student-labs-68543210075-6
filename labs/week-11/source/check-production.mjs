import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdtemp, rm, readFile, readdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import net from 'node:net';

const root = path.dirname(fileURLToPath(import.meta.url));
const probe = net.createServer();
await new Promise((resolve, reject) => { probe.once('error', reject); probe.listen(10000, '127.0.0.1', resolve); });
await new Promise(resolve => probe.close(resolve));
const directory = await mkdtemp(path.join(tmpdir(), 'week11-production-'));
const env = { ...process.env, NODE_ENV: 'production', PORT: '10000', DB_FILE: path.join(directory, 'test.db') };
delete env.TURSO_DATABASE_URL;
delete env.TURSO_AUTH_TOKEN;
delete env.STATIC_DIR;
const results = [];
let child;
async function start() {
  child = spawn(process.execPath, ['--disable-warning=ExperimentalWarning', 'src/server.js'], { cwd: path.join(root, 'api'), env, stdio: 'ignore' });
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw new Error('Server exited before readiness');
    try { const r = await fetch('http://127.0.0.1:10000/api/health'); if (r.ok) return; } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Server readiness timeout');
}
async function stop() {
  if (child && child.exitCode === null) { const exited = once(child, 'exit'); child.kill(); await exited; }
}
const request = (p, options) => fetch(`http://127.0.0.1:10000${p}`, options);
const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
try {
  await start();
  for (const route of ['/', '/about']) {
    const r = await request(route); assert.equal(r.status, 200); assert.match(await r.text(), /id="root"/);
    results.push(`${route}: HTTP 200, React HTML`);
  }
  const health = await (await request('/api/health')).json();
  assert.equal(health.env, 'production'); assert.equal(health.database.connected, true);
  results.push('Health: production, connected=true, driver=' + health.database.driver);
  const assets = path.join(root, 'frontend/dist/assets');
  for (const name of await readdir(assets)) if (name.endsWith('.js')) assert.ok(!(await readFile(path.join(assets, name), 'utf8')).includes('localhost:3001'));
  results.push('Production bundle: no localhost:3001');
  const r = await request('/api/requests', json('POST', { requesterName: 'CP43 test', requestType: 'แจ้งซ่อม', location: 'Production test', details: 'Temporary isolated production test', priority: 'normal' }));
  assert.equal(r.status, 201); const created = await r.json();
  const updated = await request(`/api/requests/${created.id}`, json('PUT', { status: 'completed' }));
  assert.equal(updated.status, 200); assert.equal((await updated.json()).status, 'completed');
  results.push('Create 201 and update status 200');
  await stop(); await start();
  const persisted = await (await request(`/api/requests/${created.id}`)).json(); assert.equal(persisted.status, 'completed');
  results.push('Server restart: request and changed status persisted');
  assert.equal((await request(`/api/requests/${created.id}`, { method: 'DELETE' })).status, 204);
  assert.equal((await request(`/api/requests/${created.id}`)).status, 404);
  results.push('Delete 204, subsequent lookup 404');
  const bad = await request('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
  assert.equal(bad.status, 400); assert.equal(Object.hasOwn(await bad.json(), 'stack'), false);
  results.push('Malformed JSON: 400 without stack trace');
  const report = '# CP43 — ผลทดสอบ production ในเครื่อง\n\n' +
    `เวลาทดสอบ: ${new Date().toISOString()} (UTC)\n\nNode: ${process.version}; NODE_ENV=production; PORT=10000\n\n` +
    'รัน production build ด้วย npm run build แล้วทดสอบ HTTP จริงด้วย node check-production.mjs โดยใช้ SQLite ชั่วคราว ไม่แก้ข้อมูล Turso หรือ campus.db ของผู้ใช้\n\n' + results.map(x => '- PASS: ' + x).join('\n') +
    '\n\nการทดสอบ restart นี้เป็น local SQLite ไม่ใช่หลักฐาน Render redeploy กับ Turso; หลักฐานส่วนนั้นต้องบันทึกจากเว็บจริงแยกต่างหาก\n';
  await writeFile(path.join(root, '../evidence/PRODUCTION_TEST.md'), report);
  console.log(report);
} finally { await stop(); await rm(directory, { recursive: true, force: true }); }
