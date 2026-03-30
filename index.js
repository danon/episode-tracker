const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'progress.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readProgress() {
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function writeProgress(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/progress', (req, res) => {
  res.json(readProgress());
});

app.post('/api/progress/:show', (req, res) => {
  const { show } = req.params;
  const { season, episode } = req.body;

  if (!Number.isInteger(season) || !Number.isInteger(episode) || season < 1 || episode < 1) {
    return res.status(400).json({ error: 'Season and episode must be positive integers.' });
  }

  const progress = readProgress();
  if (!progress[show]) {
    return res.status(404).json({ error: 'Show not found.' });
  }

  progress[show] = { season, episode };
  writeProgress(progress);
  res.json(progress[show]);
});

app.listen(PORT, () => {
  console.log(`Episode tracker running at http://localhost:${PORT}`);
});
