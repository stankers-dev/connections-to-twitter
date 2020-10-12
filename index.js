// imports
const express = require('express');
const axios = require('axios');
const path = require('path');
const api = require('./routes/api.js');

// init express
const app = express();

// pull in routes
app.use('/api', api);

// establish static dir
app.use(express.static(__dirname + '/public'));

// middleware logging
app.use((req, res, next) => {
    let time = Date.now();
    console.log(`web page hit at ${time}`);
    next();
})

// serve
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening port ${port}`));