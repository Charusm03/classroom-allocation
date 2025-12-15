const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increased limit for potential file uploads/large data

// Helper to read DB
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, '{}', 'utf8');
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    try {
        return JSON.parse(data);
    } catch (e) {
        return {};
    }
};

// Helper to write DB
const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};

// GET all data
app.get('/api/storage', (req, res) => {
    const db = readDB();
    res.json(db);
});

// GET specific key
app.get('/api/storage/:key', (req, res) => {
    const { key } = req.params;
    const db = readDB();
    const value = db[key];
    // Mimic localStorage: return plain value or null
    // If we want to strictly mimic the App.jsx expectation of { value: "stringified" }, we might need to adjust.
    // However, the plan was to refactor App.jsx to use JSON directly. 
    // Let's return the JSON object directly.
    res.json(value !== undefined ? value : null);
});

// POST update key
app.post('/api/storage/:key', (req, res) => {
    const { key } = req.params;
    const body = req.body; // Expecting raw JSON data, not { value: ... } wrapper unless we keep that.

    // The previous app used storage.set(key, JSON.stringify(data)).
    // Ideally we store real JSON in db.json, not stringified JSON strings.

    const db = readDB();
    db[key] = body;
    writeDB(db);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
