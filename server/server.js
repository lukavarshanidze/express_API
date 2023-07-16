const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3001;

app.use(express.json());

function readData() {
  const data = fs.readFileSync('data.json');
  return JSON.parse(data);
}

function writeData(data) {
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
}

app.get('/entries', (req, res) => {
  const jsonData = readData();
  res.json(jsonData);
});

app.get('/entries/:id', (req, res) => {
  const jsonData = readData();
  const entryId = parseInt(req.params.id);
  const entry = jsonData.find(entry => entry.id === entryId);

  if (entry) {
    res.json(entry);
  } else {
    res.status(404).json({ error: 'Entry not foundo' });
  }
});

app.post('/entries', (req, res) => {
  const jsonData = readData();
  const newEntry = req.body;
  jsonData.unshift(newEntry);
  writeData(jsonData);
  res.json({ message: 'Entry created successfully' });
});

app.put('/entries/:id', (req, res) => {
  const jsonData = readData();
  const entryId = parseInt(req.params.id);
  const updatedEntry = req.body;
  const entryIndex = jsonData.findIndex(entry => entry.id === entryId);

  if (entryIndex !== -1) {
    jsonData[entryIndex] = { ...jsonData[entryIndex], ...updatedEntry };
    writeData(jsonData);
    res.json({ message: 'Entry updated successfully' });
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

app.delete('/entries/:id', (req, res) => {
  const jsonData = readData();
  const entryId = parseInt(req.params.id);
  const entryIndex = jsonData.findIndex(entry => entry.id === entryId);

  if (entryIndex !== -1) {
    jsonData.splice(entryIndex, 1);
    writeData(jsonData);
    res.json({ message: 'Entry deleted successfully' });
  } else {
    res.status(404).json({ error: 'Entry not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});