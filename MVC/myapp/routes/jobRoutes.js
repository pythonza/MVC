const express = require('express');
const router = express.Router();  

const jobController = require('../controllers/jobController');
// ดึง jobController

// แสดงรายการงานทั้งหมดที่เปิดรับ
router.get('/', jobController.getOpenJobs);

module.exports = router;
// export router เพื่อไปใช้ในไฟล์ app.js