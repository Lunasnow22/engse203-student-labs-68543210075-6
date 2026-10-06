// Tests must never write to the user's local database or to Turso.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const directory = mkdtempSync(path.join(tmpdir(), 'campus-api-test-'));
process.env.DB_FILE = path.join(directory, 'test.db');
delete process.env.TURSO_DATABASE_URL;
delete process.env.TURSO_AUTH_TOKEN;
process.on('exit', () => {
  try { rmSync(directory, { recursive: true, force: true }); } catch {}
});
