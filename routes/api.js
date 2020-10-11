// imports
const express = require('express');
const axios = require('axios');
const router = express.Router();

// initial route
router.get('/', function(req, res) {
    console.log('inital api route hit');
});

module.exports = router;