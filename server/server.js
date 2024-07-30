const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the React app's public folder
app.use(express.static(path.join(__dirname, '../client/public')));

// API routes can be added here
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the server!' });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});