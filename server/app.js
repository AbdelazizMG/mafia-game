const express = require('express');
const cors = require('cors');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const voteRoutes = require('./routes/voteRoutes');
const nightRoutes = require('./routes/nightRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/players', playerRoutes);
app.use('/game', gameRoutes);
app.use('/vote', voteRoutes);
app.use('/night', nightRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Mafia game server running on port ${PORT}`);
});

module.exports = app;
