const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const JOBS_CSV = path.join(__dirname, '../data/jobs.csv');
const COMPANIES_CSV = path.join(__dirname, '../data/companies.csv');

function readJobsCSV() {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(JOBS_CSV)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => resolve(results))
      .on('error', err => reject(err));
  });
}

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

module.exports = {
  async findOpenJobs() {
    const jobs = await readJobsCSV();
    const companies = await readCompaniesCSV();

    return jobs
      .filter(j => j.status.toLowerCase() === 'open')
      .sort((a,b) => a.deadline.localeCompare(b.deadline))
      .map(j => ({ ...j, company_name: companies[j.company_id] || 'Unknown' }));
  },

  async findById(id) {
    const jobs = await readJobsCSV();
    const companies = await readCompaniesCSV();
    const job = jobs.find(j => j.job_id === id);
    if (!job) return null;
    job.company_name = companies[job.company_id] || 'Unknown';
    return job;
  },

  async closeJob(jobId) {
    const jobs = await readJobsCSV();
    const job = jobs.find(j => j.job_id === jobId);
    if (job) job.status = 'closed';
    saveJobs(jobs);
  }
};
