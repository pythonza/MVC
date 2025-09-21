const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/applications.csv');

function saveApplications(applications) { //เอาข้อมูลการสมัครเข้า application.csv
  const header = "app_id,job_id,candidate_id,apply_datetime\n";
  const rows = applications.map(a => `${a.app_id},${a.job_id},${a.candidate_id},${a.apply_datetime}`).join("\n");
  fs.writeFileSync(filePath, header + rows);
}

module.exports = {
  create(app) {
    let applications = [];

    // ตรวจสอบว่ามีไฟล์
    if (fs.existsSync(filePath)) {
      // อ่านข้อมูลแล้วตัด header ออก
      const content = fs.readFileSync(filePath, 'utf-8').trim().split("\n");
      content.slice(1).forEach(line => {
        // แยกข้อมูลแต่ละคอลัมน์ด้วย comma แล้วเก็บเป็น object
        const [app_id, job_id, candidate_id, apply_datetime] = line.split(",");
        applications.push({ app_id, job_id, candidate_id, apply_datetime });
      });
    }

    // กำหนด app_id ใหม่
    app.app_id = applications.length + 1;

    // สร้างเวลา รูปแบบ YYYY-MM-DD HH:mm:ss
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    app.apply_datetime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    // เพิ่ม app ใหม่
    applications.push(app);

    // บันทึก กลับไปยังไฟล์
    saveApplications(applications);

    return app;
  }
};
