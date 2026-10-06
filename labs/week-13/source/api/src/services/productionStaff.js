import { upsertStaff } from './requestService.js';
import { hashPassword } from '../utils/password.js';

// The public classroom password must never grant access to the deployed app.
export function configureProductionStaff(password = process.env.STAFF_PASSWORD) {
  if (typeof password !== 'string' || password.length < 16 || password === 'staff1234') {
    throw new Error('STAFF_PASSWORD must be a private value of at least 16 characters in production');
  }
  upsertStaff({ email: 'staff@rmutl.ac.th', name: 'เจ้าหน้าที่ฝ่ายบริการ', passwordHash: hashPassword(password) });
}
