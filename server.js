const express = require('express');
const session = require('express-session');
const connectDB = require('./db');
const { User } = require('./User');

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secretKey_20I0777_AyoobHaroon',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 } // 1 hour
}));

// ─── Authentication Middleware ───────────────────────────────────────────────
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized. Please login first.' });
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// POST /register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = new User(username, password);
    const result = await user.register();
    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// POST /login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = new User(username, password);
    const result = await user.login();

    // Create session
    req.session.user = result.username;

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
});

// GET /dashboard  (Protected Route)
app.get('/dashboard', isAuthenticated, (req, res) => {
  return res.status(200).json({ message: `Welcome ${req.session.user}` });
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    return res.status(200).json({ message: 'Logout successful' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;