const mongoose = require('mongoose');
require('../models/Score.js');

async function configDatabase() {
    const connectionString = 'mongodb://localhost:27017/gameDB';

    try {
        await mongoose.connect(connectionString);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = { configDatabase };