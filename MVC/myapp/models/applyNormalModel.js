const Application = require('./applicationModel');

module.exports = {
  apply(job, candidate) {
    if (candidate.status !== "graduated") {
      throw new Error("Only graduated candidates can apply for normal jobs.");
    }
    const app = {
      job_id: job.job_id,
      candidate_id: candidate.candidate_id
    };
    return Application.create(app);
  }
};
