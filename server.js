const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/check-login', (req, res) => {
    const { customerId, password } = req.body;

    const database = JSON.parse(fs.readFileSync('./database/hackers-db.json', 'utf8'));

    const match = database.find(
        (entry) => entry.customerId === customerId && entry.password === password
    );

    if (match) {
        return res.json({ found: true });
    } else {
        return res.json({ found: false });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
