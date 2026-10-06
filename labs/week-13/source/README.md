# LAB 13 — Quality & Security

ENGSE203 · 68543210075-6 · CP48–CP52 และ Challenge

[เปิดเว็บจริง](https://campus-service-week13.onrender.com/) · [Health Check](https://campus-service-week13.onrender.com/api/health) · [PR #34](https://github.com/Lunasnow22/engse203-student-labs-68543210075-6/pull/34)

## ติดตั้งและทดสอบ
จาก `labs/week-13/source` ใช้ Node.js 24:
```sh
npm install --prefix api
npm install --prefix frontend
npm test
npm run coverage
node --disable-warning=ExperimentalWarning check-week13.mjs
node --disable-warning=ExperimentalWarning check-week12.mjs --inclass
```
ผลวันที่ 6 ตุลาคม 2026: API **82 tests**, frontend **6 tests**, checker **27/27**, regression Week 12 **20/20**; statement coverage **89.82%**. `npm audit` ของ API และ frontend ไม่พบช่องโหว่

## เปิดในเครื่อง
```sh
npm run dev --prefix api
npm run dev --prefix frontend
```
API: http://localhost:3001 · frontend: http://localhost:5173
ฐานข้อมูลตั้งต้น `api/data/campus.db` มี 5 คำร้องและบัญชีตัวอย่าง หากฐานข้อมูลหาย ระบบสร้างจาก `schema.sql` อัตโนมัติ
บัญชีเฉพาะ development/test: `staff@rmutl.ac.th` / `staff1234`
เข้าเมนูเข้าสู่ระบบ แล้วเปิดรายละเอียดคำร้องเพื่อเปลี่ยนสถานะ หรือกดลบจาก Dashboard; ผู้ใช้ทั่วไปดูและสร้างคำร้องได้

## โหมด production และ Render
```sh
npm run build
```
ตั้ง `NODE_ENV=production`, `JWT_SECRET` เป็นค่าสุ่มส่วนตัว และ `STAFF_PASSWORD` อย่างน้อย 16 ตัวอักษร จากนั้น `npm start`
PowerShell ใช้ `$env:ชื่อตัวแปร="ค่า"` ก่อนรัน; ห้าม commit ค่าจริง
ใช้ `api/.env.example` เป็นรายการตัวแปรและเก็บค่าจริงใน `api/.env` ที่ถูก ignore; ค่าว่างใช้ค่าเริ่มต้น ยกเว้น secrets ที่บังคับใน production

Render Blueprint ใช้ `labs/week-13/source/render.yaml`, branch `lab/week-13`, Free Web Service ชื่อ `campus-service-week13`; Render สุ่ม `JWT_SECRET` และ `STAFF_PASSWORD` ให้เอง
บัญชีบนเว็บ: `staff@rmutl.ac.th`; เจ้าของดูรหัสผ่านใน Render → Environment → `STAFF_PASSWORD` แล้วกรอกที่หน้า login โดยไม่โพสต์ลง repo/แชต
ตอน production ระบบแทน hash ของบัญชีตัวอย่างด้วยรหัสส่วนตัวก่อนเปิด server ทำให้ `staff1234` ใช้ไม่ได้

บริการนี้ใช้ SQLite แยกสำหรับ Week 13 บน Render Free: ข้อมูลเดโมอาจคืนค่าเริ่มต้นเมื่อ restart/redeploy ไม่ได้ใช้ฐานข้อมูล Turso ของ Week 11
หากต้องการข้อมูลถาวร ให้เตรียม Turso ของ Week 13 ที่มี schema `role/password_hash` แยกต่างหากก่อนตั้ง `TURSO_DATABASE_URL` และ `TURSO_AUTH_TOKEN`

## สิ่งที่ส่ง
| CP | การทำงานและหลักฐาน |
|---|---|
| CP48 | ตรวจชนิดข้อความ, ชื่อ/สถานที่สูงสุด 100, รายละเอียด 10–1000, body 10KB → 413; unit tests ค่าขอบ |
| CP49 | scrypt salt สุ่ม 16 bytes + key 64 bytes; timingSafeEqual; ปฏิเสธ hash ผิดรูปแบบ |
| CP50 | POST `/api/auth/login` ออก JWT 2 ชั่วโมง ไม่มี password/hash ใน payload; บัญชีผิดตอบเหมือนกัน |
| CP51 | PUT/DELETE เฉพาะ staff; ไม่มี/ปลอม/หมดอายุ → 401; role ผิด → 403; GET/POST เปิดสาธารณะ |
| CP52 | JWT secret ว่างใน production → fail fast; errors ไม่ส่ง stack; `.env.example` ค่าว่าง; secrets ไม่อยู่ใน Git |
| Challenge | security headers, login ผิด 5 ครั้ง/15 นาที → 429, frontend Bearer token, Render generated secret |

- [Test cases](TEST_CASES.md), [Debug log](DEBUG_LOG.md), [Release checklist](RELEASE_CHECKLIST.md)
- [หลักฐาน](../evidence/README.md) และรายงาน coverage ในหน้า Pages
- CI: `.github/workflows/week13.yml` ทดสอบและบังคับ statement coverage ≥85%
- Branch `lab/week-13` ตาม Student Repository; tag `lab-13-submission-v1`
- A5: LAB13 มี 4 คะแนน; อีก 6 คะแนนมาจาก Final Term Project ซึ่งเป็นงานแยกจาก LAB นี้

## ขอบเขตความปลอดภัย
- API เป็นผู้ตรวจสิทธิ์จริง การซ่อนปุ่ม frontend เป็นเพียง UX
- sessionStorage เก็บ token เฉพาะแท็บ; logout และ API ตอบ 401 จะล้าง session แต่ JWT ที่ออกแล้วหมดอายุตามเวลา (ยังไม่มี revoke list)
- limiter เก็บในหน่วยความจำต่อ IP, reset เมื่อ process restart และไม่ได้ใช้ร่วมกันข้าม instance; เหมาะกับ LAB instance เดียว ก่อน production จริงควรใช้ shared store และกำหนด trusted proxy ตามระบบ
- React แสดงข้อความด้วย escaping ไม่ใช้ dangerouslySetInnerHTML กับข้อมูลผู้ใช้

## อธิบายได้ก่อนส่ง
401 คือยังยืนยันตัวตนไม่ได้; 403 คือยืนยันแล้วแต่ไม่มีสิทธิ์. Hash ใช้ตรวจรหัสโดยไม่เก็บรหัสจริง; salt สุ่มทำให้รหัสเดียวกันได้ hash ต่างกัน. JWT ลงลายเซ็นแต่ payload ไม่ได้เข้ารหัสจึงห้ามใส่ความลับ. ต้องตรวจ API แม้ frontend ตรวจแล้ว เพราะเรียก API โดยตรงได้

ใช้ Codex ช่วยตรวจและเติม implementation, tests, เอกสาร และ deployment; ผลในหน้านี้มาจากคำสั่งทดสอบจริง
