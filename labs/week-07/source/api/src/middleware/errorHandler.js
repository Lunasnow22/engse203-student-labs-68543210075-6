import { config } from '../config.js';

/** ⭐ Challenge 1: Custom Error class ที่กำหนด HTTP status code ได้เอง */
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

/** ⭐ Challenge 2: Wrapper สำหรับดัก async error ส่งต่อให้ errorHandler อัตโนมัติ */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/** จับ error ที่หลุดมาจากทุก route */
export function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;

  if (status >= 500) {
    console.error('เกิดข้อผิดพลาดภายใน:', err.message);
  }

  res.status(status).json({
    error: status >= 500 ? 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' : err.message,
    // ส่ง stack trace เฉพาะตอนพัฒนาเท่านั้น (ซ่อนตอน production)
    ...(config.isProduction ? {} : { stack: err.stack?.split('\n').slice(0, 3) }),
  });
}

/** ไม่มี route ไหนตรง */
export function notFound(req, res) {
  res.status(404).json({ error: `ไม่พบเส้นทาง ${req.method} ${req.originalUrl}` });
}