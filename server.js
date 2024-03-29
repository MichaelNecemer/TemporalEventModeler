const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;


app.use(express.static(__dirname + '/dist'));


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}/`);
});