import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)
const router = Router();
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
export function resetLoginLimiter() { attempts.clear(); }

router.post('/login', (req, res) => {
  const now = Date.now();
  // Per-IP failures also limit attempts that rotate email addresses.
  for (const [key, value] of attempts) if (value.until <= now) attempts.delete(key);
  const key = req.ip;
  const attempt = attempts.get(key);
  res.set('Cache-Control', 'no-store');
  if (attempt?.count >= 5) {
    res.set('Retry-After', String(Math.ceil((attempt.until - now) / 1000)));
    return res.status(429).json({ error: 'เข้าสู่ระบบผิดหลายครั้ง กรุณาลองใหม่ภายใน 15 นาที' });
  }
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    attempts.set(key, { count: (attempt?.count ?? 0) + 1, until: attempt?.until ?? now + WINDOW_MS });
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }
  attempts.delete(key);
  res.status(200).json(result);
});

export default router;
