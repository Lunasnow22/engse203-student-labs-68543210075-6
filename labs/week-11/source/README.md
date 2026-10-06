# Campus Service Request — Week 11

ระบบคำร้องบริการภายในมหาวิทยาลัย สำหรับดูรายการ เพิ่มคำร้อง ดูรายละเอียด กรองสถานะ เปลี่ยนสถานะ และลบคำร้อง พัฒนาต่อจาก Week 10 ให้รันแบบ production ได้ โดยใช้ React + Vite, Express และ SQLite หรือ Turso ผ่านแพ็กเกจ `libsql`

- [เว็บบน Render](https://engse203-student-labs-68543210075-6.onrender.com/)
- [Health Check](https://engse203-student-labs-68543210075-6.onrender.com/api/health)
- โค้ดอยู่ที่ `labs/week-11/source/` ของ Student Repository

## สถาปัตยกรรม 3 ชั้น

```text
React frontend
    │ HTTP / JSON
    ▼
Express API: route → controller → service
    │ SQL พร้อม parameters
    ▼
SQLite ในเครื่อง หรือ Turso บน cloud
```

| ชั้น | หน้าที่ | ตำแหน่ง |
|---|---|---|
| Frontend | แสดง Dashboard, ฟอร์ม, รายละเอียด และสถานะ loading/error | `frontend/src/` |
| API | รับ HTTP ตรวจข้อมูล ประมวลผล และตอบ JSON | `api/src/` |
| Database | เก็บผู้แจ้งและคำร้องที่เชื่อมด้วย foreign key | `api/data/schema.sql`, `api/data/campus.db` หรือ Turso |

เมื่อกดเพิ่มคำร้อง React เรียก `frontend/src/services/requestService.js` ผ่าน `apiClient.js` ไปยัง `POST /api/requests` จากนั้น middleware ตรวจข้อมูล ก่อน controller เรียก service เพื่อหา/สร้างผู้แจ้งและเพิ่มคำร้องใน transaction เดียวกัน แล้วตอบข้อมูลกลับให้หน้าเว็บ

ตาราง `requests.requester_id` อ้างถึง `users.id` โดย service ใช้ JOIN เพื่อคืนชื่อผู้แจ้งให้ frontend การลบคำร้องลบเฉพาะแถวใน `requests` ส่วนผู้แจ้งใน `users` ยังอยู่สำหรับคำร้องอื่น

```text
source/
├── api/
│   ├── data/                 schema.sql และ SQLite local
│   ├── src/
│   │   ├── config.js         environment configuration
│   │   ├── app.js            middleware, routes และ static files
│   │   ├── server.js         เปิดฐานข้อมูลและรับ HTTP
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/         SQL และการเลือก SQLite/Turso
│   │   └── middleware/       validation และ error handling
│   ├── tests/
│   └── .env.example
├── frontend/
│   ├── src/                  pages, components และ API client
│   └── dist/                 ผลลัพธ์จาก build
├── package.json              คำสั่ง build/start รวม
└── check-week07.mjs, check-week10.mjs, check-week11.mjs
```

## เตรียมเครื่อง

ใช้ Node.js 22.13.0 ขึ้นไปตาม `source/package.json` พร้อม npm และ Git คำสั่งต่อไปนี้ใช้ Windows PowerShell โดยเริ่มที่ root ของ Student Repository:

```powershell
cd labs/week-11/source
node --version
npm install
npm install --prefix api
npm install --prefix frontend --include=dev
if (!(Test-Path api/.env)) { Copy-Item api/.env.example api/.env }
npm run db:setup --prefix api
```

`db:setup` เตรียม SQLite ในเครื่องและไม่เขียนทับไฟล์เดิมถ้ามีอยู่แล้ว สำหรับ local ให้เว้น `TURSO_DATABASE_URL` และ `TURSO_AUTH_TOKEN` ใน `api/.env` ว่างทั้งคู่ ไม่ต้องเปิด database server แยก เพราะ API เปิดไฟล์ SQLite ให้เอง

## วิธีรัน development

เปิดสอง terminal โดยทั้งสองอยู่ที่ `labs/week-11/source/`

**Terminal 1 — API**

```powershell
npm run dev --prefix api
```

คำสั่งนี้อ่าน `api/.env` และเปิด API ที่ `http://localhost:3001` ตามค่าเริ่มต้น ตรวจด้วย `http://localhost:3001/api/health`

**Terminal 2 — Frontend**

```powershell
$env:VITE_API_BASE_URL = 'http://localhost:3001'
npm run dev --prefix frontend -- --port 5173 --strictPort
```

เปิด `http://localhost:5173` ต้องตั้ง `VITE_API_BASE_URL` เพราะ frontend และ API อยู่คนละพอร์ต และ Vite config ปัจจุบันไม่มี proxy ส่วน `CORS_ORIGIN` ต้องตรงกับ origin ของ frontend

เมื่อหยุด frontend ด้วย Ctrl+C ให้ล้างค่าก่อนนำ terminal นี้ไป build production:

```powershell
Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
```

## วิธีรัน production ในเครื่อง

เริ่มที่ `labs/week-11/source/`:

```powershell
$env:NODE_ENV = 'production'
$env:VITE_API_BASE_URL = ''
npm run build
$env:PORT = '10000'
npm start
```

`npm run build` ติดตั้ง dependencies ของ API และ frontend แล้วสร้าง `frontend/dist/` โดยใส่ `--include=dev` ฝั่ง frontend เพื่อให้มี Vite แม้ตั้ง `NODE_ENV=production` จากนั้น Express เสิร์ฟเว็บและ API ผ่านพอร์ตเดียว

`npm start` ไม่อ่าน `api/.env` อัตโนมัติ ถ้าจะใช้ Turso ในโหมดนี้ต้องตั้ง environment ของ process ให้ครบทั้งสองตัวก่อน start เมื่อไม่ตั้งจะใช้ SQLite local ส่วน Render ใช้ค่าจากหน้า Environment ของ service

| จุดตรวจ | ผลที่ควรเห็น |
|---|---|
| `http://localhost:10000/` | หน้าเว็บ React |
| `http://localhost:10000/#/about` | หน้า About ตาม HashRouter ที่ใช้จริง |
| `http://localhost:10000/api/health` | `status: ok`, `env: production`, `database.connected: true` |
| เพิ่ม/ดู/เปลี่ยนสถานะ/ลบคำร้อง | ข้อมูลเปลี่ยนผ่าน API บน origin เดียวกัน |

API client ปัจจุบันใช้ URL ว่างเป็นค่าเริ่มต้น จึงเรียก `/api/...` บน origin เดียวกับเว็บ ห้ามทิ้งค่า development ไว้ตอน build หากมีไฟล์ environment ของ Vite ต้องตรวจด้วยว่าค่าไม่ได้ชี้ localhost คำสั่งตรวจ bundle นี้ควรไม่พบผลลัพธ์:

```powershell
Select-String -Path frontend/dist/assets/*.js -Pattern 'localhost:3001'
```

เมื่อเสร็จ กด Ctrl+C แล้วคืน environment และเครื่องมือทดสอบ:

```powershell
Remove-Item Env:NODE_ENV, Env:PORT, Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
npm install --prefix api --include=dev
```

การแก้ frontend ต้อง build ใหม่ก่อน production จะแสดงโค้ดล่าสุด

## Environment Variables

| ตัวแปร | ค่าเริ่มต้น | หน้าที่ |
|---|---|---|
| `NODE_ENV` | `development` | `production` เปิด static serving, combined log และซ่อน stack trace |
| `PORT` | `3001` | พอร์ต API; Render กำหนดให้ผ่าน environment |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ของ frontend ที่ได้รับอนุญาต |
| `DB_FILE` | `api/data/campus.db` อ้างจากตำแหน่งโค้ด | ไฟล์ SQLite local; ค่าที่กำหนดเองแนะนำ absolute path |
| `STATIC_DIR` | `frontend/dist` อ้างจากตำแหน่งโค้ด | โฟลเดอร์ static สำหรับ production |
| `TURSO_DATABASE_URL` | ว่าง | URL ฐานข้อมูล Turso ต้องตั้งคู่กับ Token |
| `TURSO_AUTH_TOKEN` | ว่าง | Token ฐานข้อมูล เก็บเฉพาะฝั่ง API |
| `VITE_API_BASE_URL` | ว่างใน API client | dev ใช้ `http://localhost:3001`; production ใช้ค่าว่าง |
| `NODE_VERSION` | ไม่มีในแอป | Render ตั้ง `22.13.0` ในการ deploy นี้ |

ตัวแปร `VITE_` ใช้ใน frontend จึงไม่ใส่ Token ในตัวแปรเหล่านี้ ใช้ `api/.env.example` เป็นแม่แบบ และไม่ commit `.env` หรือ Token จริง

## Turso และ Render

การ deploy นี้ใช้ branch `lab/week-11`, Root Directory `labs/week-11/source`, Build Command `npm run build` และ Start Command `npm start` โดยตั้ง `NODE_ENV=production` พร้อม `TURSO_DATABASE_URL` และ `TURSO_AUTH_TOKEN` ใน Environment ของ Render

- ไม่ตั้ง URL และ Token: ใช้ `node:sqlite` กับไฟล์ local
- ตั้งครบทั้งคู่: ใช้ `libsql` เชื่อม Turso และ health แสดง `driver: turso`
- ตั้งเพียงค่าเดียว: หยุดพร้อมแจ้ง configuration error เพื่อไม่ใช้ฐานข้อมูลผิดตัว

เมื่อฐานข้อมูลใหม่ว่าง ระบบสร้างตารางและข้อมูลตั้งต้นจาก `schema.sql` ตอนเริ่ม API การเชื่อม Turso ไม่ได้ย้ายข้อมูลที่เคยเพิ่มใน SQLite local ให้อัตโนมัติ ถ้ามีตารางเดิมบางส่วนแต่ไม่มี `requests` ระบบปฏิเสธการรัน schema ทับ เพราะ schema มี DROP TABLE

ข้อมูล Turso แยกจากไฟล์ของ Render วิธีทดสอบความคงอยู่คือเพิ่มคำร้อง จดรหัส แล้ว Manual Deploy บน Render หลังกลับมา Live ให้ตรวจว่าคำร้องเดิมยังอยู่ทั้งบนเว็บและ Turso → Edit Data → requests

## เหตุผลการออกแบบ

- แยก 3 ชั้นเพื่อให้ frontend ดูแลหน้าจอ, API ดูแลกติกา และ database ดูแลการเก็บข้อมูล เมื่อเปลี่ยน SQLite เป็น Turso จึงปรับที่ service โดยคงรูปแบบ API เดิม
- เลือก SQLite เพราะผู้แจ้งกับคำร้องมีโครงสร้างและความสัมพันธ์ชัดเจน ใช้ JOIN, foreign key และ transaction ได้ อีกทั้งรันในเครื่องได้โดยไม่ติดตั้ง database server
- ใช้ Turso เพื่อเก็บข้อมูลแยกจากเครื่องที่ deploy เว็บ และใช้ `libsql` ซึ่งมี API แบบ synchronous ใกล้เคียง `node:sqlite` จึงใช้ query เดิมต่อได้
- ใช้ parameterized queries แยกค่าผู้ใช้ออกจากคำสั่ง SQL และ transaction เพื่อให้การสร้างผู้แจ้งกับคำร้องสำเร็จหรือย้อนกลับด้วยกัน
- Production เสิร์ฟเว็บและ API จาก origin เดียว จึงไม่ต้องฝัง localhost ของเครื่องผู้พัฒนาใน frontend
- Health check ตรวจถึงฐานข้อมูล คืน 200 เมื่อพร้อม หรือ 503 เมื่อการตรวจพบว่าเชื่อมไม่ได้ ส่วน error handler ซ่อน stack ใน production

## ตรวจสอบระบบ

จาก `labs/week-11/source/` หลังติดตั้ง dependencies และ build แล้ว:

```powershell
npm test --prefix api
node check-production.mjs
node --disable-warning=ExperimentalWarning check-week11.mjs --inclass
node --disable-warning=ExperimentalWarning check-week11.mjs
node --disable-warning=ExperimentalWarning check-week10.mjs
node --disable-warning=ExperimentalWarning check-week07.mjs
```

API tests ใช้ฐานข้อมูลชั่วคราวและล้างค่า Turso ใน process ทดสอบเพื่อไม่เขียนลงฐานข้อมูลจริง ส่วน checker ให้ไม่ตั้ง `DB_FILE` ของข้อมูลจริงใน terminal เพื่อให้ใช้ฐานข้อมูลชั่วคราวตามปกติ

Checker บางข้อค้นข้อความในโค้ด จึงไม่ทดแทนการทดสอบพฤติกรรมจริง เช่น Week 07 ค้น `isProduction` หรือ `NODE_ENV` แต่โค้ดใช้ `config.isProd` จึงอาจรายงานข้อนี้ไม่ผ่าน แม้ regression test ยืนยันว่า production ไม่ส่ง stack แล้ว

`check-production.mjs` เปิดเซิร์ฟเวอร์จริงที่พอร์ต 10000 ด้วยฐานข้อมูลชั่วคราว ทดสอบ CRUD, restart และการซ่อน stack แล้วเขียนผลลง [PRODUCTION_TEST.md](../evidence/PRODUCTION_TEST.md) ต้อง build frontend ก่อนและพอร์ต 10000 ต้องว่าง

อ่าน [คำตอบ CP41](DATABASE_CHOICES.md), [การใช้ AI](AI_USAGE.md) และ [แผนคลิป CP42](DEMO.md) โดย CP42 ยังรอผู้จัดทำอัดคลิปและใส่ลิงก์จริง
