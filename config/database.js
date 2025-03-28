const mongoose = require('mongoose');
require('dotenv').config();
require('../models/Score.js');

async function configDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = { configDatabase };