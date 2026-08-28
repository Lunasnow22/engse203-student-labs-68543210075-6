# ENGSE203 LAB 05 — Student Evidence README

## ผู้จัดทำ

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
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```
