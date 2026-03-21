const express = require('express');
const cors    = require('cors');
const path    = require('path');
const playerRoutes = require('./routes/playerRoutes');
const gameRoutes   = require('./routes/gameRoutes');
const voteRoutes   = require('./routes/voteRoutes');
const nightRoutes  = require('./routes/nightRoutes');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// All routes are prefixed with /:room so every group is isolated
app.use('/:room/players', playerRoutes);
app.use('/:room/game',    gameRoutes);
app.use('/:room/vote',    voteRoutes);
app.use('/:room/night',   nightRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Serve React frontend
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => console.log(`Mafia game server running on port ${PORT}`));

module.exports = app;