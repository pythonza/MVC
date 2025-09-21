const Candidate = require('../models/candidateModel');

exports.showLogin = (req, res) => {
  res.render('login');
};

exports.login = async (req, res) => {
  const { candidate_id, email } = req.body;
  if (!candidate_id || !email) {
    return res.send(`<script>alert("Missing login info"); window.location="/auth/login";</script>`);
  }

  const candidate = await Candidate.findById(candidate_id);
  if (!candidate) {
    return res.send(`<script>alert("Invalid login"); window.location="/auth/login";</script>`);
  }

  // Validate email @gmail.com
  if (!email.toLowerCase().endsWith('@gmail.com')) {
    return res.send(`<script>alert("Email ต้องเป็น @gmail.com"); window.location="/auth/login";</script>`);
  }

  if (candidate.email !== email) {
    return res.send(`<script>alert("Invalid login"); window.location="/auth/login";</script>`);
  }

  req.session.user = { id: candidate.candidate_id, name: candidate.first_name };
  res.redirect('/jobs');
};


exports.logout = (req, res) => {
  req.session.destroy(err => {
    res.redirect('/jobs');
  });
};
