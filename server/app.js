const express = require('express');
const cors = require('cors');
const path = require('path');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const voteRoutes = require('./routes/voteRoutes');
const nightRoutes = require('./routes/nightRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/players', playerRoutes);
app.use('/game', gameRoutes);
app.use('/vote', voteRoutes);
app.use('/night', nightRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve built React app statically
app.use(express.static(path.join(__dirname, '../client/build')));

// Catch-all: any route not matched above returns index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Mafia game server running on port ${PORT}`);
});

module.exports = app;