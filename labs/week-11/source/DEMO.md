# CP42 — หลักฐานวิดีโอ (รอผู้จัดทำอัด)

สถานะ: ยังไม่มีวิดีโอ ไม่ถือว่า CP42 เสร็จ แม้ checker จะตรวจพบไฟล์นี้

## ช่วง A — สาธิตระบบ ประมาณ 3–4 นาที

ลิงก์วิดีโอ: ยังไม่ได้เพิ่ม

- เปิด Dashboard และเพิ่มคำร้องทดสอบ จดรหัสไว้
- ดูรายละเอียด เปลี่ยนสถานะ และตรวจข้อมูลใน Turso
- เปิด /api/health ให้เห็น production และ driver: turso
- Manual Deploy บน Render แล้วตรวจว่าคำร้องเดิมยังอยู่
- สาธิต production ในเครื่องพอร์ต 10000 และลบเฉพาะคำร้องทดสอบ

## ช่วง B — อธิบายโค้ด ประมาณ 4–5 นาที

ลิงก์วิดีโอหรือ timestamp: ยังไม่ได้เพิ่ม

- frontend/src/services/apiClient.js และ requestService.js: ส่งคำร้องไป API
- api/src/routes และ controllers: รับและตรวจคำร้อง
- api/src/services/requestService.js: transaction, JOIN และการเลือก SQLite/Turso
- api/src/config.js และ routes/healthRoutes.js: env และสถานะฐานข้อมูล
- api/src/app.js และ frontend/.env.production: dev ต่างจาก production อย่างไร

## เว็บสำหรับตรวจ

- [Live Demo](https://engse203-student-labs-68543210075-6.onrender.com/)
- [Health](https://engse203-student-labs-68543210075-6.onrender.com/api/health)
- [หลักฐานทดสอบในเครื่อง](../evidence/PRODUCTION_TEST.md)

ก่อนส่งให้แทนที่ข้อความรอลิงก์ ตั้งสิทธิ์วิดีโอให้ผู้มีลิงก์ดูได้ และทดสอบเปิดลิงก์ด้วยตนเอง
