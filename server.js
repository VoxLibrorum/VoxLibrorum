const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const indexPath = path.join(__dirname, 'index.html');

function sendIndex(request, response) {
  response.sendFile(indexPath);
}

app.get('/', sendIndex);
app.get('/index.html', sendIndex);

app.use('/data', (req, res) => {
  res.status(404).send('Not Found');
});

app.use((req, res) => {
  res.status(404).send('Not Found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
