/**
 * password.js — เก็บรหัสผ่านอย่างปลอดภัยด้วย scrypt (มากับ Node ใน node:crypto)
 *
 * 🏫 TODO W13-HASH (CP49) — ทำให้ tests/unit/password.test.js ผ่านทุกข้อ
 *
 *   รูปแบบที่ต้องเก็บ:  scrypt$<salt>$<hash>
 *     salt = randomBytes(16) แปลงเป็น hex  (32 ตัวอักษร)
 *     hash = scryptSync(รหัสผ่าน, salt, 64) แปลงเป็น hex  (128 ตัวอักษร)
 *
 *   ⚠ รูปแบบต้องตรงเป๊ะ — schema.sql มี hash ของบัญชีเจ้าหน้าที่ (รหัสผ่าน staff1234)
 *     ที่สร้างด้วยรูปแบบนี้ ถ้าเขียนต่างไป จะเข้าสู่ระบบด้วยบัญชีนี้ไม่ได้
 */
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LENGTH = 64;

export function hashPassword(plain) {
  const salt = randomBytes(16).toString('hex');                     // 32 ตัวอักษร
  const hash = scryptSync(plain, salt, KEY_LENGTH).toString('hex'); // 128 ตัวอักษร
  return `scrypt$${salt}$${hash}`;
}

export function verifyPassword(plain, stored) {
  if (typeof plain !== 'string' || typeof stored !== 'string' ||
      !/^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/.test(stored)) return false;
  const [, salt, hashHex] = stored.split('$');
  const expected = Buffer.from(hashHex, 'hex');
  const actual = scryptSync(plain, salt, KEY_LENGTH);
  // timingSafeEqual ใช้เวลาเท่ากันไม่ว่าจะผิดตัวที่เท่าไร — กันการเดาจากเวลาที่ใช้ตอบ
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
