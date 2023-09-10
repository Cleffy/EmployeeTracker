
const express = require('express');     // Require express
const routes = require('./routes');     // Require routes folder
require('dotenv').config();

const PORT = process.env.PORT || 3001;  // Create port
const app = express();                  // Initialize express

// Describe express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use(routes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is now runing on port ${PORT}`);
});