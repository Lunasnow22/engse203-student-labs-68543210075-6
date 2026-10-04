import { Router } from 'express';
import { findUsers, findRequestsByUser } from '../services/requestService.js';

// ⭐ Challenge — endpoint สำหรับดูผู้ใช้และคำร้องของแต่ละคน
const router = Router();

router.get('/', (req, res) => {
  res.json(findUsers());
});

router.get('/:id/requests', (req, res) => {
  const rows = findRequestsByUser(Number(req.params.id));
  res.json(rows);
});

export default router;
