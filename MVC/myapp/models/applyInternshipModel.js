const Application = require('./applicationModel');

module.exports = {
  apply(job, candidate) {
    if (candidate.status !== "studying") {
      throw new Error("Only studying candidates can apply for internship jobs.");
    }
    const app = {
      job_id: job.job_id,
      candidate_id: candidate.candidate_id
    };
    return Application.create(app);
  }
};
