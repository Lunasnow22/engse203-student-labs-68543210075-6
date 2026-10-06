function AboutPage() {
  return (
    <section data-testid="page-about">
      <div className="page-heading"><div><p className="eyebrow dark">ABOUT THE LAB</p><h1>เกี่ยวกับระบบ</h1></div></div>
      <article className="panel prose"><p>Campus Service Request เป็นกรณีศึกษา Week 13 เรื่อง validation การเข้าสู่ระบบ และการกำหนดสิทธิ์</p><h2>สถาปัตยกรรม</h2><p>React เรียก Express API ซึ่งตรวจข้อมูลและสิทธิ์ก่อนทำงานกับ SQLite เจ้าหน้าที่ใช้ JWT เพื่อเปลี่ยนสถานะหรือลบคำร้อง</p><h2>ข้อมูลสาธิต</h2><p>บริการ Free นี้อาจคืนข้อมูลตั้งต้นเมื่อ redeploy ห้ามบันทึกข้อมูลส่วนบุคคลจริง รหัสผ่าน token หรือ secret ในคำร้อง</p></article>
    </section>
  );
}

export default AboutPage;
