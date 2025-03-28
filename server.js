require('dotenv').config();
const express = require('express');
const { configDatabase } = require('./config/database.js');
const path = require('path');
const Score = require('./models/Score.js');

const app = express();
const PORT = process.env.PORT || 3000;

configDatabase();

app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.post('/save-score', async (req, res) => {
    const { _userId, player, score } = req.body;

    try {
        const existingRecord = await Score.findOne({ _userId });

        if (!existingRecord) {
            const newScore = new Score({
                _userId,
                player,
                score
            });

            await newScore.save();
            return res.json({ message: 'Score added!' });
        }

        if (score > existingRecord.score) {
            await Score.findOneAndUpdate(
                { _userId },
                { player, score },
                { upsert: true, new: true }
            );
            return res.json({ message: 'Score updated!' });
        }

        res.json({ message: 'Score not improved!' });
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/get-user-score/:_userId', async (req, res) => {
    const _userId = req.params._userId;

    if (!_userId) {
        return res.status(400).json({ error: 'Missing user ID' });
    }

    try {
        const userScore = await Score.findOne({ _userId });

        if (!userScore) {
            return res.json({ score: 0 });
        }

        res.json({ score: userScore.score });
    } catch (err) {
        res.status(500).json({ error: 'Database error!' });
    }
});

app.get('/get-best-score', async (req, res) => {
    try {
        const bestScore = await Score.findOne().sort({ score: -1 });

        if (!bestScore) {
            return res.json({ score: 0 });
        }

        res.json({ player: bestScore.player, score: bestScore.score });
    } catch (err) {
        res.status(500).json({ error: 'Database error!' });
    }
});

app.get('*', (req, res) => {
    res.status(404);
    res.send('Page Not Found');
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});