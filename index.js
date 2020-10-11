// imports
const express = require('express');
const axios = require('axios');
const path = require('path');
const api = require('./routes/api.js');

// routes
// const route = shit

// init express
const app = express();

// pull in routes
app.use('api', api);

// middleware logging
app.use((req, res, next) => {
    let time = Date.now();
    console.log(`web page hit at ${time}`);
    next();
})

// send base html
app.get('/', (req, res) => {
    res.sendFile('public/index.html', { root: __dirname });
})

// serve
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`App listening port ${port}`));