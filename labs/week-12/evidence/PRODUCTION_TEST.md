# CP43 — ผลทดสอบ production ในเครื่อง

เวลาทดสอบ: 2026-10-04T09:48:24.656Z (UTC)

Node: v24.20.0; NODE_ENV=production; PORT=10000

รัน production build ด้วย npm run build แล้วทดสอบ HTTP จริงด้วย node check-production.mjs โดยใช้ SQLite ชั่วคราว ไม่แก้ข้อมูล Turso หรือ campus.db ของผู้ใช้

- PASS: /: HTTP 200, React HTML
- PASS: /about: HTTP 200, React HTML
- PASS: Health: production, connected=true, driver=sqlite
- PASS: Production bundle: no localhost:3001
- PASS: Create 201 and update status 200
- PASS: Server restart: request and changed status persisted
- PASS: Delete 204, subsequent lookup 404
- PASS: Malformed JSON: 400 without stack trace

การทดสอบ restart นี้เป็น local SQLite ไม่ใช่หลักฐาน Render redeploy กับ Turso; หลักฐานส่วนนั้นต้องบันทึกจากเว็บจริงแยกต่างหาก
