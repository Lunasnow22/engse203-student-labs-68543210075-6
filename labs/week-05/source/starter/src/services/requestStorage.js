/**
 * requestStorage.js — ที่เดียวที่แตะ localStorage ได้
 *
 * ไฟล์นี้ทั้งไฟล์เป็นงานของ **คาบ 5B** คาบแรกยังไม่ต้องแตะ
 * ส่วน validateRequests() และค่าคงที่ด้านล่างเตรียมไว้ให้แล้ว
 */

export const STORAGE_KEY = 'engse203-campus-requests-v1';
export const SCHEMA_VERSION = 1;

const priorities = new Set(['normal', 'urgent']);
const statuses = new Set(['pending', 'in-progress', 'completed']);

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidRequest(request) {
  return Boolean(
    request
      && isNonEmptyString(request.id)
      && request.id.startsWith('REQ-')
      && typeof request.requesterName === 'string'
      && request.requesterName.trim().length >= 2
      && isNonEmptyString(request.requestType)
      && isNonEmptyString(request.location)
      && typeof request.details === 'string'
      && request.details.trim().length >= 10
      && priorities.has(request.priority)
      && statuses.has(request.status),
  );
}

function validateRequests(requests) {
  if (!Array.isArray(requests) || !requests.every(isValidRequest)) return false;
  return new Set(requests.map((request) => request.id)).size === requests.length;
}

/**
 * TODO 5B-A · อ่านข้อมูลที่เก็บไว้ พร้อมรับมือกับข้อมูลที่เสียหาย
 *
 * ต้องคืน object ที่มี status เป็นหนึ่งใน 3 ค่า
 *   { status: 'missing' }                        ยังไม่เคยเก็บ
 *   { status: 'valid', requests: [...] }         ข้อมูลถูกต้อง
 *   { status: 'invalid', reason: '...' }         ข้อมูลเสียหาย
 *
 * ลำดับที่ต้องทำ
 *   1. getItem แล้วถ้าได้ null ให้คืน missing
 *   2. JSON.parse ใน try/catch — parse ไม่ได้คือ invalid
 *   3. parse ได้แล้วยังต้องตรวจต่อ ว่า schemaVersion ตรงและ requests ผ่าน validateRequests
 *   4. คืนสำเนาด้วย structuredClone()
 *
 * ห้าม throw ออกไปจากฟังก์ชันนี้ เพราะจะทำให้หน้าจอพังทั้งหน้า
 */
export function readStoredRequests() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData===null) return{ status: 'missing' };
  try {
    const parse = JSON.parse(storedData);
    // TODO 5B-A2: ตรวจ schemaVersion และ validateRequests ให้ครบใน CP04b
    if (parse.schemaVersion !== SCHEMA_VERSION) {
      return { status: 'invalid', reason: 'schemaVersion ไม่ตรงกับที่โปรแกรมคาดหวัง' };
    }
    if (!validateRequests(parse.requests)) {
      return { status: 'invalid', reason: 'ข้อมูลคำร้องไม่ถูกต้อง' };
    }
    //คืนสำเนาด้วย structuredClone()
    return { status: 'valid', requests: structuredClone(parse.requests) };
  } catch {
    return { status: 'invalid', reason: 'ข้อมูลที่บันทึกไว้ไม่ใช่ JSON ที่อ่านได้' };
  }
}

/**
 * TODO 5B-B · เขียนข้อมูลลงที่เก็บ
 *
 *   1. ตรวจด้วย validateRequests() ก่อน ถ้าไม่ผ่านให้ throw
 *      (ที่นี่ throw ได้ เพราะเป็นความผิดพลาดของโปรแกรมเราเอง ไม่ใช่ข้อมูลจากภายนอก)
 *   2. เขียน envelope ที่มี schemaVersion, updatedAt และ requests
 *   3. อย่าลืมว่าที่เก็บรับได้แต่ข้อความ --> stringify() ก่อน
 */
export function writeStoredRequests(requests) {
  //ตรวจด้วย validateRequests() ก่อน ถ้าไม่ผ่านให้ throw
  if (!validateRequests(requests))  
    throw new Error('ข้อมูลคำร้องไม่ถูกต้อง ไม่สามารถบันทึกได้');
  //envelope and stringify()
  const envelope = JSON.stringify({ 
    schemaVersion: SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    requests: structuredClone(requests),
  });
  //เก็บข้อมูลลง localStorage
  localStorage.setItem(STORAGE_KEY, envelope); 
}

/**
 * ให้มาแล้ว — สังเกตว่าใช้ removeItem ไม่ใช่ clear()
 * เพราะ clear() จะลบข้อมูลของทุกเว็บที่ใช้โดเมนเดียวกัน
 */
export function clearStoredRequests() {
  localStorage.removeItem(STORAGE_KEY);
}