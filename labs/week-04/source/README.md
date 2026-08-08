# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: นิรันดร์รักษ์ อนุสนธิ์
- รหัสนักศึกษา: 68543210075-6
- Section: 1

## URLs

- Repository: https://github.com/Lunasnow22/engse203-student-labs-68543210075-6/tree/main
- Pull Request: https://github.com/Lunasnow22/engse203-student-labs-68543210075-6/pull/7
- GitHub Pages: TODO

## Component Tree

```text
App (State Owner: requests, statusFilter)
 ├── AppHeader
 ├── SummaryPanel
 ├── RequestForm (State Owner: formData, errors, feedback)
 └── section
      ├── FilterBar
      └── RequestList
```

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

- **App**: เป็น State Owner หลักที่เก็บข้อมูล `requests` (รายการคำร้องทั้งหมด) และ `statusFilter` (สถานะที่ใช้กรองรายการ)
- **RequestForm**: เป็น State Owner ย่อยที่จัดการ State ภายในฟอร์มของตัวเอง ได้แก่ `formData`, `errors` และ `feedback`
- **Props**: ข้อมูลสถานะและรายการคำร้องที่ถูกกรอง (`filteredRequests`, `summary`, `statusFilter`) จะถูกส่งผ่าน Props ไหลจาก App ลงไปยัง Component ลูก เช่น `SummaryPanel`, `FilterBar`, และ `RequestList`
- **Callbacks**: ฟังก์ชันสำหรับจัดการข้อมูล เช่น `handleAddRequest`, `handleDeleteRequest`, และ `setStatusFilter` จะถูกส่งเป็น Props ไปยัง `RequestForm`, `RequestList` และ `FilterBar` เมื่อผู้ใช้โต้ตอบกับ UI Component ลูกจะเรียก Callback เพื่อส่งข้อมูลไหลกลับขึ้นมาให้ App ทำการอัปเดต State หลัก

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | TODO | TODO | TODO |
| TC-02 Controlled input | TODO | TODO | TODO |
| TC-03 Invalid | TODO | TODO | TODO |
| TC-04 Valid add | TODO | TODO | TODO |
| TC-05 Filter | TODO | TODO | TODO |
| TC-06 All | TODO | TODO | TODO |
| TC-07 Empty | TODO | TODO | TODO |
| TC-08 Delete | TODO | TODO | TODO |
| TC-09 Mobile | TODO | TODO | TODO |
| TC-10 Keyboard | TODO | TODO | TODO |
| TC-11 Build | TODO | TODO | TODO |
| TC-12 Pages | TODO | TODO | TODO |

## Screenshots

- Desktop: `evidence/desktop.png`
- Mobile 375px: `evidence/mobile-375.png`
- Validation/empty state: TODO

## Week 03 → Week 04 Reflection

การใช้ State-driven UI แบบ React (Week 04) ช่วยให้เราไม่ต้องเข้าไปยุ่งกับการจัดการ DOM โดยตรงด้วยคำสั่งอย่าง `document.createElement` หรือ `innerHTML` แบบใน Vanilla JS (Week 03) เลยครับ เราเพียงแค่ออกแบบ UI ให้สอดคล้องกับ State ของข้อมูล (เช่น ข้อมูลรายการ `requests`) เมื่อ State ถูกอัปเดต React จะทำหน้าที่ตรวจสอบและนำไปแสดงผล (Render) ลงบนหน้าเว็บให้โดยอัตโนมัติ ทำให้โค้ดของเราสะอาดขึ้น อ่านเข้าใจง่ายขึ้น และลดโอกาสเกิด Bug จากการแก้ไข DOM ผิดพลาดเมื่อแอปพลิเคชันมีความซับซ้อนมากขึ้น

## AI / External Resource Disclosure

ใช้ AI (Gemini) ในการช่วยให้คำแนะนำเรื่องการตรวจสอบสาเหตุของ Bug (เช่น กรณีการลืมใส่ setrequests ใน App.jsx และการแก้ไข Warning ของ Controlled/Uncontrolled Component ใน `<select>`) โดยได้นำคำแนะนำมาประกอบการเรียนรู้และแก้ไขโค้ดให้ถูกต้อง

