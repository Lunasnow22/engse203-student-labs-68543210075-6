# Week 12 — ผลตรวจงาน

ตรวจ 5 ตุลาคม 2026 บน Node.js 24.20.0

| คำสั่ง (จาก source) | ผล |
|---|---|
| `npm test` | API 47/47 และ Frontend 2/2 |
| `npm run coverage` | Statements 88.59%, Branches 80.45%, Functions 91.42%, Lines 90.27% |
| `node --disable-warning=ExperimentalWarning check-week12.mjs` | 22/22 |
| `npm run db:setup --prefix api` | requests 5 แถว, users 4 แถว, Foreign Key ถูกต้อง |

รายงาน coverage HTML อยู่ที่ [publish/coverage](../publish/coverage/index.html) และต้นฉบับสร้างใหม่ได้ด้วย `npm run coverage`
ผล CI บน GitHub ตรวจได้จาก workflow Week 12 tests and coverage ในแท็บ Actions ของ repository
