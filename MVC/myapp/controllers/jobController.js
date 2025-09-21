const Job = require('../models/jobModel');

exports.getOpenJobs = async (req, res) => {
  try {
    const jobs = await Job.findOpenJobs();
    res.render('jobs', { jobs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.send("Error loading jobs");
  }
};
