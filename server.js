const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const SUBMISSION_DIR = path.join(DATA_DIR, 'submissions');

const archiveItems = require('./data/content/archive.json');
const voiceHighlights = require('./data/content/voices.json');
const spotlight = require('./data/content/spotlight.json');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

app.get('/api/archive', (_req, res) => {
  res.json({ items: archiveItems });
});

app.get('/api/voices', (_req, res) => {
  res.json({ entries: voiceHighlights });
});

app.get('/api/spotlight', (_req, res) => {
  res.json(spotlight);
});

app.post('/api/newsletter', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const entry = {
    name,
    email,
    submittedAt: new Date().toISOString()
  };

  try {
    await appendRecord('newsletter.json', entry);
    res.status(201).json({ message: 'Thanks for lending your voice to Resonantia!' });
  } catch (error) {
    console.error('Error storing newsletter subscription', error);
    res.status(500).json({ error: 'We could not save your subscription. Please try again.' });
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const entry = {
    name,
    email,
    message,
    submittedAt: new Date().toISOString()
  };

  try {
    await appendRecord('messages.json', entry);
    res.status(201).json({ message: 'Your message is on its way to our curators. Thank you!' });
  } catch (error) {
    console.error('Error storing contact message', error);
    res.status(500).json({ error: 'We could not send your message. Please try again.' });
  }
});

app.use((req, res) => {
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Vox Librorum server listening on port ${PORT}`);
});

async function appendRecord(filename, record) {
  await ensureSubmissionDir();
  const filePath = path.join(SUBMISSION_DIR, filename);

  try {
    const existing = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(existing);
    data.push(record);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(filePath, JSON.stringify([record], null, 2));
    } else {
      throw error;
    }
  }
}

async function ensureSubmissionDir() {
  try {
    await fs.mkdir(SUBMISSION_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}
