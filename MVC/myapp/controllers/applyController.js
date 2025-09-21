const Job = require('../models/jobModel');
const Candidate = require('../models/candidateModel');
const applyInternship = require('../models/applyInternshipModel');
const applyNormal = require('../models/applyNormalModel');

exports.showApplyForm = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');

  const job = await Job.findById(req.params.jobId);
  if (!job) return res.send("Job not found");

  res.render('apply', { job, user: req.session.user });
};

exports.submitApplication = async (req, res) => {
  if (!req.session.user) return res.redirect('/auth/login');

  const job = await Job.findById(req.params.jobId);
  const candidate = await Candidate.findById(req.session.user.id);

  if (!job || !candidate) {
    return res.send(`<script>alert("Job หรือ Candidate ไม่พบ"); window.location="/jobs";</script>`);
  }

  // Validate email
  if (!candidate.email.toLowerCase().endsWith('@gmail.com')) {
    return res.send(`<script>alert("Email ต้องเป็น @gmail.com"); window.location="/jobs";</script>`);
  }

  try {
    if (job.job_type === 'internship') {
      applyInternship.apply(job, candidate);
    } else {
      applyNormal.apply(job, candidate);
    }

    // ปิดรับสมัครทันที
    await Job.closeJob(job.job_id);

    // Popup แจ้งสำเร็จ + redirect
    res.send(`<script>alert("สมัครงานสำเร็จ!"); window.location="/jobs";</script>`);
  } catch (err) {
    // Popup แจ้ง error + redirect
    res.send(`<script>alert("${err.message}"); window.location="/jobs";</script>`);
  }
};
