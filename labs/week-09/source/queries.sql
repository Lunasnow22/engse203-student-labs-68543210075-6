-- ═══════════════════════════════════════════════════════════
-- queries.sql — คำสั่งค้นหาตอบโจทย์
-- 🏠 TODO W09-QUERY (CP22) · เขียนอย่างน้อย 8 ข้อ
--
-- เขียนคำสั่งจริงที่รันได้ ไม่ใช่เขียนบรรยาย
-- ทุกข้อต้องทดสอบแล้วว่าได้ผลลัพธ์ถูกต้อง
-- ═══════════════════════════════════════════════════════════

-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT * FROM requests ORDER BY id; 

-- ② คำร้องที่ยังไม่ได้ดำเนินการ (status = 'pending')
SELECT id, location, details FROM requests 
WHERE status = 'pending' 
ORDER BY id;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ — ใช้เงื่อนไข 2 ข้อพร้อมกัน
SELECT id, location, details FROM requests
WHERE priority = 'urgent' AND status IN ('pending', 'in-progress')
ORDER BY id ;

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด  (คำใบ้: LIKE)
SELECT id, location, details 
FROM requests 
WHERE details LIKE '%ไม่ทำงาน%';
ORDER BY id;

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง  ← ต้องใช้ JOIN เพราะชื่ออยู่คนละตาราง
SELECT 
  r.id,
  u.name AS requester_name,
  r.request_type,
  r.location,
  r.status
FROM requests r
JOIN users u ON r.requester_id = u.id
ORDER BY r.id;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง  (JOIN + WHERE)
SELECT 
  r.id,
  u.name AS requester_name,
  u.department,
  r.request_type,
  r.location,
  r.status
FROM requests r
JOIN users u ON r.requester_id = u.id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์'
ORDER BY r.id;

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน  (คำใบ้: DISTINCT)
SELECT DISTINCT u.name, u.department
FROM users u
JOIN requests r ON r.requester_id = u.id
ORDER BY u.name;

-- ⑧ คำร้อง 3 รายการล่าสุด  (คำใบ้: ORDER BY + LIMIT)
SELECT r.id, r.request_type, r.location, r.details, r.created_at
FROM users u
JOIN requests r ON r.requester_id = u.id
ORDER BY r.id DESC
LIMIT 3;

INSERT INTO requests (id, requester_id, request_type, location, details, priority, status) VALUES
  ('REQ-006', 2, 'แจ้งซ่อม', 'ห้องปฏิบัติการ 401', 'ไฟในห้องกะพริบตลอดเวลา', 'normal', 'pending'),
  ('REQ-007', 3, 'บริการบัญชีผู้ใช้', 'อาคาร 1', 'ลืมรหัสผ่านอีเมลมหาวิทยาลัย', 'normal', 'completed'),
  ('REQ-008', 4, 'อื่น ๆ', 'ลานจอดรถ', 'ขอเพิ่มไฟส่องสว่างตอนกลางคืน', 'urgent', 'in-progress');

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ  (GROUP BY + COUNT)
SELECT status, COUNT(*) AS total
FROM requests
GROUP BY status
ORDER BY total DESC;
-- ⑩ ใครแจ้งคำร้องมากที่สุด  (คำใบ้: LEFT JOIN เพื่อให้คนที่ยังไม่เคยแจ้งติดมาด้วย)
SELECT u.name, u.department, COUNT(r.id) AS total
FROM users u
LEFT JOIN requests r ON r.requester_id = u.id
GROUP BY u.id
ORDER BY total DESC, u.name;
-- ⑪ สร้าง INDEX ให้การค้นด้วย status เร็วขึ้น
-- Index เหมือนดัชนีท้ายเล่มหนังสือ — แทนที่จะพลิกทุกหน้า ก็เปิดดัชนีแล้วกระโดดไปหน้าที่ต้องการเลย
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);