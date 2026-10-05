# LAB 12 — การทดสอบและการแก้ไขข้อผิดพลาด

ENGSE203 · Week 12 · CP44–CP47 · Student ID 68543210075-6

เริ่มจาก starter ของอาจารย์สำหรับ Week 12 และแก้บั๊ก 4 เรื่อง พร้อมทดสอบด้วย Vitest และ Supertest

## ผลตรวจ

ตรวจในเครื่องวันที่ 5 ตุลาคม 2026 ด้วย Node.js 24.20.0:

- API: 47 tests ผ่านทั้งหมด
- Frontend: 2 tests ผ่านทั้งหมด
- Checker: 22/22 (ในห้อง 20/20 และ Challenge 2/2)
- API statements coverage: 88.59% (เกณฑ์ 85%)
- Branches 80.45%, functions 91.42%, lines 90.27%

## ติดตั้งและตรวจงาน

รันจาก `labs/week-12/source`:

```sh
npm ci --prefix api
npm ci --prefix frontend
npm test
npm run coverage
node --disable-warning=ExperimentalWarning check-week12.mjs
```

รายงาน coverage อยู่ที่ `api/coverage/index.html` การทดสอบใช้ฐานข้อมูล SQLite `:memory:` และปิดค่า Turso ใน test config จึงไม่แตะฐานข้อมูลจริง การรัน coverage จะไม่ผ่านหาก statements ต่ำกว่า 85%

## เปิดระบบในเครื่อง

ฐานข้อมูล `api/data/campus.db` ที่แนบมีผู้ใช้ 4 รายและคำร้อง 5 รายตาม schema ตั้งต้น หากยังไม่มีฐานข้อมูลให้รัน `npm run db:setup --prefix api`

PowerShell:

```powershell
Copy-Item api/.env.example api/.env
npm run dev --prefix api
# เปิด terminal อีกหน้าที่ source แล้วรัน:
npm run dev --prefix frontend
```

เปิด Frontend ตาม URL ที่ Vite แสดง (ปกติ http://localhost:5173) และ API ที่ http://localhost:3001

## เอกสารและเทสต์ที่ส่ง

| CP | ไฟล์ / หลักฐาน |
|---|---|
| CP44 | [TEST_CASES.md](TEST_CASES.md): 12 กรณี มีค่าขอบและข้อมูลผิดรูปแบบ |
| CP45 | [unit tests](api/tests/unit/requestValidator.test.js): ทดสอบ validator และค่าขอบ 9/10/11 ตัวอักษร |
| CP46 | [integration tests](api/tests/integration/requests.api.test.js): GET/POST/PUT/DELETE และข้อผิดพลาด |
| CP47 | [frontend tests](frontend/src/utils/requestSummary.test.js), regression tests และ [DEBUG_LOG.md](DEBUG_LOG.md) |
| Challenge | [system tests](api/tests/integration/system.api.test.js), [error tests](api/tests/integration/errors.api.test.js), coverage ≥85% และ workflow ที่ root `.github/workflows/check.yml` |

## บั๊กที่แก้

1. รายละเอียด 10 ตัวอักษรพอดีต้องผ่าน: ใช้ `< MIN_DETAILS` แทน `<=`
2. ลบรายการกลางแล้วเพิ่มใหม่: สร้าง ID จากรหัสล่าสุด แทนจำนวนแถว
3. Dashboard: นับสถานะ `in-progress` ให้ตรงกับ API
4. PUT คำร้องที่ไม่มี: ตรวจผลลัพธ์ว่างก่อนใช้ `.id` และตอบ 404

## CI และการส่ง

GitHub Actions รัน `npm test` และ coverage เมื่อ push/เปิด PR โดยใช้ Node 24 และฐานข้อมูลทดสอบในหน่วยความจำ รายงาน coverage ของแต่ละรอบดาวน์โหลดได้จาก Actions artifacts

- Branch: `lab/week-12` ตาม Repository Contract
- Tag: `lab-12-submission-v1`
- ส่ง Pages Hub + PR URL + Tag/Commit ตาม Student Repository
- หน้า Pages เป็นรายงานสำหรับตรวจงาน พร้อมรายงาน coverage ไม่ได้รัน Express หรือฐานข้อมูลในเบราว์เซอร์

## เตรียมอธิบายให้อาจารย์

- ค่าขอบ 10 ตัวช่วยตรวจ off-by-one ที่การทดสอบ 9 กับ 11 อาจไม่พบ
- `beforeEach(loadSeed)` แยกฐานข้อมูลของแต่ละ test จึงไม่ขึ้นกับลำดับการรัน
- Network แสดง `in-progress` ถูกแล้ว จึงตรวจเงื่อนไขนับสถานะฝั่ง frontend
- Coverage บอกว่าโค้ดถูกเรียก แต่ยังต้องมี assertions ที่ตรวจพฤติกรรมถูกต้อง

## การใช้ AI

ใช้ Codex ช่วยตรวจไฟล์ ติดตั้ง dependencies เพิ่มเทสต์ health/users/error handling ตั้งค่า CI และจัดหน้าเอกสารส่งงาน ผลข้างต้นมาจากคำสั่งที่รันจริงในเครื่อง ผู้จัดทำควรอ่านเทสต์และอธิบายสาเหตุบั๊กได้ด้วยตนเอง
