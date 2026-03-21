const PlayerService = require('../services/playerService');
const state = require('../models/state');

const PlayerController = {
  getPlayers(req, res) {
    res.json({ players: state.players });
  },

  addPlayer(req, res) {
    try {
      const { name } = req.body;
      const player = PlayerService.addPlayer(name);
      res.status(201).json({ player });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  removePlayer(req, res) {
    try {
      const removed = PlayerService.removePlayer(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Player not found' });
      res.json({ removed });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = PlayerController;
