# Week 13 — Evidence

ตรวจวันที่ 6 ตุลาคม 2026, Node.js 24
- `check-week13.mjs`: 27/27 (ในคาบ 23 + Challenge 4)
- `check-week12.mjs --inclass`: 20/20
- `npm test`: API 82/82, frontend 6/6
- `npm run coverage`: statements 89.82%, branches 79.73%, functions 87.23%, lines 91.62%
- `npm run build --prefix frontend`: ผ่าน
- npm install/audit: API 163 packages, frontend 44 packages, 0 vulnerabilities
- [Local production smoke](production-smoke.json): 9 checks ผ่านบนฐานข้อมูลในหน่วยความจำ โดยไม่แตะข้อมูลจริง
- [Coverage HTML](../publish/coverage/index.html)

CI: `.github/workflows/week13.yml`; ผ่านบน GitHub Actions

Live: https://campus-service-week13.onrender.com/
- `/api/health`: 200, env=production, database.connected=true, driver=sqlite
- Security headers: nosniff / DENY / no-referrer
- [ภาพทดสอบ staff เปลี่ยนสถานะในเครื่อง](status-update.png): บันทึกสำเร็จ; logout แล้วฟอร์มจัดการหาย
- Render Blueprint `campus-week13`, Free service แยกจาก Week11; secrets สุ่มโดย Render
- ไม่ได้เผยแพร่รหัสผ่านเจ้าหน้าที่ลงหลักฐาน
