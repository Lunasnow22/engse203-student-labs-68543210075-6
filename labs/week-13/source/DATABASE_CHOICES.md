# ฐานข้อมูล Week 13

SQLite แยกจาก Week11; schema เพิ่ม users.role/password_hash. Tests ใช้ :memory:. Render Free ใช้ฐานข้อมูลเดโมที่คืนค่าเมื่อ redeploy; ก่อนใช้ข้อมูลจริงเลือก persistent storage หรือ Turso แยกที่มี schema Week13 และตั้ง secrets ผ่าน environment
