const fs = require('fs');        // ใช้สำหรับอ่านไฟล์
const path = require('path');    // ใช้จัดการ path ของไฟล์
const csv = require('csv-parser'); // library สำหรับ parse ไฟล์ CSV

// กำหนด path ของไฟล์ candidates.csv ที่อยู่ในโฟลเดอร์ data
const filePath = path.join(__dirname, '../data/candidates.csv');

// ฟังก์ชันอ่านไฟล์ CSV แล้ว return ข้อมูลเป็น array ของ object
function readCSV() {
  return new Promise((resolve, reject) => {
    const results = []; // เก็บข้อมูลที่อ่านได้

    fs.createReadStream(filePath) // เปิดไฟล์แบบ stream
      .pipe(csv())                // แปลง CSV เป็น object
      .on('data', data => results.push(data))  // เก็บข้อมูลแต่ละแถว
      .on('end', () => resolve(results))       // อ่านเสร็จ → คืนค่า array
      .on('error', err => reject(err));        // ถ้า error → reject
  });
}

module.exports = {
  // หา candidate จาก id ที่ระบุ
  async findById(id) {
    const candidates = await readCSV();                // โหลดข้อมูลทั้งหมดจากไฟล์ CSV
    return candidates.find(c => c.candidate_id === id); // คืน object แรกที่มี candidate_id ตรงกับ id
  }
};