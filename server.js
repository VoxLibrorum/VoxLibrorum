const express = require('express');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

const indexPath = path.join(__dirname, 'index.html');

app.disable('x-powered-by');

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
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

function sendIndex(request, response, next) {
  response.setHeader('Cache-Control', 'no-store');
  response.sendFile(indexPath, (error) => {
    if (error) {
      next(error);
    }
  });
}

app.get('/', sendIndex);
app.get('/index.html', sendIndex);

app.use('/data', (req, res) => {
  res.status(404).send('Not Found');
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  if (req.method === 'GET' && req.accepts('html')) {
    return sendIndex(req, res, next);
  }

  res.status(404).send('Not Found');
});

app.use((error, req, res, next) => {
  console.error('Unexpected error while processing request:', error);

  if (res.headersSent) {
    return next(error);
  }

  if (req.accepts('json')) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  res.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
