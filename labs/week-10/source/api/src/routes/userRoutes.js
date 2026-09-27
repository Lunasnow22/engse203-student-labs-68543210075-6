import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '../..');
const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');

const db = new DatabaseSync(DB_FILE);
db.exec('PRAGMA foreign_keys = ON');

// GET /api/users → รายชื่อผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, department, email FROM users ORDER BY id').all();
  res.json(users);
});

// GET /api/users/:id/requests → คำร้องของผู้ใช้นั้น
router.get('/:id/requests', (req, res) => {
  const query = `
    SELECT r.id,
           u.name          AS requesterName,
           r.request_type  AS requestType,
           r.location,
           r.details,
           r.priority,
           r.status
    FROM requests r
    JOIN users u ON u.id = r.requester_id
    WHERE r.requester_id = ?
    ORDER BY r.id
  `;
  const requests = db.prepare(query).all(req.params.id);
  res.json(requests);
});


export default router;
