const PlayerService = require('../services/playerService');
const { getRoom }   = require('../models/state');

const PlayerController = {
  getPlayers(req, res) {
    const state = getRoom(req.params.room);
    res.json({ players: state.roster });
  },

  addPlayer(req, res) {
    try {
      const state = getRoom(req.params.room);
      const entry = PlayerService.addToRoster(state, req.body.name);
      res.status(201).json({ player: entry });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  removePlayer(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const removed = PlayerService.removeFromRoster(state, req.params.id);
      if (!removed) return res.status(404).json({ error: 'Player not found' });
      res.json({ removed });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  resetScores(req, res) {
    const state = getRoom(req.params.room);
    // Clear scores AND history together
    state.roster.forEach(p => { p.score = 0; p.history = []; });
    res.json({ roster: state.roster });
  },
};

module.exports = PlayerController;