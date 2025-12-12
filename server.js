const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Database & Models
const sequelize = require('./database');
const User = require('./models/User');
const Project = require('./models/Project');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'vox-librorum-secret-key-change-me'; // in prod use process.env

// Middleware
app.use(express.json()); // Allow JSON body parsing
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        baseUri: ["'self'"],
        connectSrc: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Static Files
const indexPath = path.join(__dirname, 'index.html');
const publicPath = path.join(__dirname, 'public');
app.use('/js', express.static(path.join(publicPath, 'js')));
app.use('/public', express.static(publicPath));
app.use('/desk', express.static(path.join(__dirname, 'desk')));

// Helper: Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// --- API ROUTES ---

// 1. Auth: Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Basic validation
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });

    // Create User (hashing happens in model)
    const user = await User.create({
      username,
      email: email || `${username}@vox.archive`,
      password_hash: password
    });

    res.status(201).json({ message: 'Witness Registered', userId: user.id });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(400).json({ error: 'Registration failed. Identity may already exist.' });
  }
});

// 2. Auth: Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid Credentials' });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    // Set Cookie
    res.cookie('auth_token', token, { httpOnly: true, maxAge: 86400000 }); // 24h
    res.json({ message: 'Access Granted', username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Login validation failed' });
  }
});

// 3. Projects: Get All (for logged in user)
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    // For now, return all projects. Later filter by ownerId
    // const projects = await Project.findAll({ where: { ownerId: req.user.id } });
    const projects = await Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve archives' });
  }
});

// 4. Projects: Create
app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { id, title, description, resources, aiContext } = req.body;
    const project = await Project.create({
      id,
      title,
      description,
      resources_json: resources,
      ai_context: aiContext,
      ownerId: req.user.id
    });
    res.json({ message: 'Project Initialized', project });
  } catch (error) {
    res.status(500).json({ error: 'Project creation failed' });
  }
});


// Serve Pages
function sendIndex(request, response) {
  response.sendFile(indexPath);
}

app.get('/', sendIndex);
app.get('/index.html', sendIndex);
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));

// Initialize DB and Start Server
sequelize.sync({ force: false }) // force: false means don't delete existing data
  .then(() => {
    console.log('📚 Vox Archive Database Connected.');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });
