// server/controllers/playerController.js

const PlayerService = require('../services/playerService');
const state = require('../models/state');

const PlayerController = {
  // Returns the roster (permanent list with scores)
  getPlayers(req, res) {
    res.json({ players: state.roster });
  },

  addPlayer(req, res) {
    try {
      const { name } = req.body;
      const entry = PlayerService.addToRoster(name);
      res.status(201).json({ player: entry });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  removePlayer(req, res) {
    try {
      const removed = PlayerService.removeFromRoster(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Player not found' });
      res.json({ removed });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  // Reset all scores to 0 without removing players
  resetScores(req, res) {
    state.roster.forEach(p => p.score = 0);
    res.json({ roster: state.roster });
  }
};

module.exports = PlayerController;