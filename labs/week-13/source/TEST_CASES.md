# ตารางกรณีทดสอบ (Test Cases) — POST /api/requests

ออกแบบ**ก่อน**เขียนโค้ด test (CP44) · แต่ละข้อเปลี่ยนข้อมูลทีละช่องจากข้อมูลที่ถูกต้อง

**ข้อมูลตั้งต้นที่ถูกต้อง:** ชื่อ `สมชาย ใจดี` · ประเภท `แจ้งซ่อม` · สถานที่ `ห้อง 301` · รายละเอียด `แอร์ไม่เย็นตั้งแต่เช้า` · ความเร่งด่วน `normal`

| รหัส | กลุ่ม | ข้อมูลที่เปลี่ยน | ผลที่คาดหวัง | ระดับ test |
|---|---|---|---|---|
| TC-01 | ถูกต้อง | — (ถูกทุกช่อง) | ไม่มี error · API ตอบ 201 | unit + integration |
| TC-02 | ค่าขอบ รายละเอียด | 9 ตัวอักษร | error 1 ข้อ | unit |
| TC-03 | ค่าขอบ รายละเอียด | 10 ตัวอักษรพอดี | ผ่าน | unit |
| TC-04 | ค่าขอบ รายละเอียด | 11 ตัวอักษร | ผ่าน | unit |
| TC-05 | ไม่ถูกต้อง | รายละเอียดเป็นช่องว่างล้วน | error (ตัดช่องว่างก่อนนับ) | unit |
| TC-06 | ค่าขอบ ชื่อ | 1 ตัวอักษร | error | unit |
| TC-07 | ค่าขอบ ชื่อ | 2 ตัวอักษร | ผ่าน | unit |
| TC-08 | นอกรายการ | ประเภท `แจ้งเหตุ` | error ประเภทไม่ถูกต้อง | unit |
| TC-09 | นอกรายการ | ความเร่งด่วน `high` | error | unit |
| TC-10 | ผิดรูปแบบ | body เป็น null / array / ตัวเลข | error เดียว "ต้องส่งข้อมูล" | unit |
| TC-11 | ผิดหลายช่อง | `{}` | error ครบ 5 ช่อง · API ตอบ 400 | unit + integration |
| TC-12 | ลำดับการทำงาน | ลบ REQ-002 แล้วเพิ่มใหม่ | 201 · รหัสไม่ซ้ำ | integration |

> **ทำไมต้องมีค่าขอบ** — bug ชอบซ่อนตรงขอบ เช่น เขียน `<=` แทน `<` · ทดสอบ 9 · 10 · 11 จะเห็นทันที


## Week 13 — Security cases
| ID | ข้อมูล/ขั้นตอน | ผลที่คาด |
|---|---|---|
| S01 | ชื่อ 100 / 101 ตัว | ผ่าน / ปฏิเสธ |
| S02 | สถานที่ 100 / 101 ตัว | ผ่าน / ปฏิเสธ |
| S03 | รายละเอียด 1000 / 1001 ตัว | ผ่าน / ปฏิเสธ |
| S04 | numeric/null/array/object แทนข้อความ | validation error |
| S05 | JSON body เกิน 10KB | 413 JSON |
| S06 | scrypt hash สองครั้ง | salt/hash ต่างกัน ตรวจรหัสถูกได้ |
| S07 | hash format ผิด/hex ไม่ครบ | false ไม่ crash |
| S08 | staff login ถูก | 200, JWT มี role/exp ไม่มี passwordHash |
| S09 | email ไม่มี / password ผิด | 401 ข้อความเดียวกัน |
| S10 | PUT/DELETE ไม่มี/ปลอม/หมดอายุ token | 401 |
| S11 | requester token PUT/DELETE | 403 |
| S12 | staff token PUT/DELETE | 200 / 204 |
| S13 | login ผิด 5 ครั้ง แล้วครั้งที่ 6 ถูก | 429, Retry-After |
| S14 | เวลาผ่าน 15 นาที | login ได้ใหม่ |
| S15 | production ไม่มี JWT_SECRET | ไม่เริ่มระบบ |
| S16 | production malformed JSON | 400 ไม่มี stack |
| S17 | frontend token + custom header | มี Authorization และ headers ครบ |
| S18 | API ตอบ 401 | ล้าง session |
| S19 | production staff1234 / private password | 401 / 200 |
