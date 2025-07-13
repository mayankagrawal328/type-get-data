const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

let clipboardData = "";
let pendingDataForFlask = "";
let type=true

// Receive clipboard data from local Flask
app.post('/api/data', (req, res) => {
    clipboardData = req.body.data;
    console.log(`📥 Clipboard data from Flask: ${clipboardData}`);
    res.sendStatus(200);
});

// Serve clipboard data to browser
app.get('/api/data', (req, res) => {
    res.json({ data: clipboardData });
});

// Receive textarea submission from frontend
app.post('/api/send-to-flask', (req, res) => {
    pendingDataForFlask = req.body.data;
    console.log(`📨 Textarea data queued for Flask: ${pendingDataForFlask}`);
    res.json({ message: "✅ Data queued for Flask" });
});

// Flask polling endpoint to retrieve pending data
app.get('/api/pending-data', (req, res) => {
    res.json({ data: pendingDataForFlask });
    pendingDataForFlask = "";  // Clear after sending
});


app.get('/api/type', (req, res) => {
    type=false
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/api/stop-write', (req, res) => {
    res.json({ data: type });
    type=true
});



app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


// Serve frontend
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log(`🚀 Node.js server running on port ${PORT}`);
});
