# ENGSE203 LAB05 Starter — Campus Service Request

Starter นี้เปิดได้และรักษาพฤติกรรมแกนของ Week04 แบบ in-memory แต่ตั้งใจยังไม่ผ่าน LAB05 ทุกข้อ ให้ทำตาม CP00–CP06 และรัน checker หลังแต่ละช่วง

- ชื่อ–นามสกุล: นิรันดร์รักษ์ อนุสนธิ์
- รหัสนักศึกษา: 68543210075-6
- Section: Sec 1
- ระบบปฏิบัติการที่ใช้: Windows 11
- Node version: v24.18.0
- Branch: lab/week-05

## Component Tree & Routing

```text
App (HashRouter + Routes)
└── AppLayout (Main layout with Outlet)
    ├── / (DashboardPage)
    │   ├── AppHeader
    │   ├── SummaryPanel
    │   ├── FilterBar
    │   └── RequestList ── RequestCard
    ├── /requests/new (NewRequestPage)
    │   ├── AppHeader
    │   └── RequestForm
    ├── /requests/:requestId (RequestDetailPage)
    │   └── AppHeader + Details
    └── * (NotFoundPage)
        └── AppHeader + 404 Message
```

## Setup และ Run

```bash
npm ci
npm run dev
npm run check
npm run build
npm run preview
```
