# การใช้ AI — Week 11

ใช้ OpenAI Codex ช่วยตรวจและพัฒนางานในวันที่ 4 ตุลาคม 2026

| งานที่ขอความช่วยเหลือ | ส่วนที่ใช้จากคำตอบ/โค้ด AI |
|---|---|
| ตรวจงานกับใบงาน Week 11 | ตรวจโครงสร้างและรัน checker เพื่อหางานคงเหลือ |
| แก้ stack trace ใน production | ใช้ config.isProd ใน error handler และเพิ่ม regression test |
| เชื่อม Turso | เพิ่ม libsql, environment config และให้ API ผู้ใช้กับคำร้องใช้ service เดียวกัน |
| CP40 และ CP41 | AI ร่าง README และ DATABASE_CHOICES.md จากโค้ดและข้อกำหนด |
| CP43 และหลักฐาน | เตรียม environment ตัวอย่าง ทดสอบ production ในเครื่อง และบันทึกผลจริง |
| หน้า Portfolio | เพิ่มลิงก์ Render และข้อมูลประกอบการตรวจ Week 11 |

ผู้จัดทำสมัครและสร้างฐานข้อมูล Turso ตั้ง environment บน Render และทดลองสร้าง/ลบคำร้องผ่านหน้าเว็บแล้วตรวจข้อมูลใน Turso ด้วยตนเอง

ก่อนส่ง ผู้จัดทำต้องอ่านและปรับคำตอบ CP41 ให้ตรงกับความเข้าใจ รวมถึงอธิบายการไหล frontend → API → service → database ในคลิปด้วยตนเอง เอกสารนี้ไม่อ้างว่าคลิปเสร็จแล้ว และไม่เก็บ Auth Token
