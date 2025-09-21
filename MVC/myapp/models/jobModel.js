const fs = require('fs');         
const path = require('path');     
const csv = require('csv-parser'); 

const JOBS_CSV = path.join(__dirname, '../data/jobs.csv');
const COMPANIES_CSV = path.join(__dirname, '../data/companies.csv');

// อ่านไฟล์ jobs.csv
function readJobsCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    //อ่าน เก็บข้อมูลแต่ละแถว
    fs.createReadStream(JOBS_CSV)
      .pipe(csv())
      .on('data', data => results.push(data)) 
      .on('end', () => resolve(results))      
      .on('error', err => reject(err));     
  });
}

// อ่านไฟล์ companies.csv
function readCompaniesCSV() {
  return new Promise((resolve, reject) => {
    const companies = {};
    fs.createReadStream(COMPANIES_CSV)
      .pipe(csv())
      .on('data', row => {
        companies[row.company_id] = row.company_name;
      })
      .on('end', () => resolve(companies))
      .on('error', err => reject(err));
  });
}

function saveJobs(jobs) { 
  const header = "job_id,job_title,company_id,status,job_type,deadline\n"; 
  const rows = jobs.map(j => 
    `${j.job_id},${j.job_title},${j.company_id},${j.status},${j.job_type},${j.deadline}`
  ).join("\n");
  fs.writeFileSync(JOBS_CSV, header + rows); 
}

module.exports = {
  // ดึงงานทั้งหมดที่ยังเปิดอยู่
  async findOpenJobs() {
    const jobs = await readJobsCSV();         // โหลด jobs
    const companies = await readCompaniesCSV(); // โหลด company mapping

    return jobs
      .filter(j => j.status.toLowerCase() === 'open') // คัดเฉพาะงานที่เปิดอยู่
      .sort((a,b) => a.deadline.localeCompare(b.deadline)) // เรียงตาม deadline
      .map(j => ({ ...j, company_name: companies[j.company_id] || 'Unknown' })); 
      // เพิ่มชื่อบริษัทเข้าไปใน object (ถ้าไม่เจอ → Unknown)
  },

  // ค้นหางานตาม job_id
  async findById(id) {
    const jobs = await readJobsCSV();
    const companies = await readCompaniesCSV();
    const job = jobs.find(j => j.job_id === id); // หา job ตาม id
    if (!job) return null;                       // ถ้าไม่เจอ → return null
    job.company_name = companies[job.company_id] || 'Unknown'; // เติมชื่อบริษัท
    return job;
  },

  // ปิด job
  async closeJob(jobId) {
    const jobs = await readJobsCSV();
    const job = jobs.find(j => j.job_id === jobId); // หา job ตาม id
    if (job) job.status = 'closed';                 // เปลี่ยน status เป็น closed
    saveJobs(jobs); // 
  }
};