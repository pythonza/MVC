const express = require('express');
const session = require('express-session');
const path = require('path');

const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const applyRoutes = require('./routes/applyRoutes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/jobs', jobRoutes);
app.use('/auth', authRoutes);
app.use('/apply', applyRoutes);

app.get('/', (req, res) => res.redirect('/jobs'));

app.listen(4000, () => console.log("Server running at http://localhost:4000"));
