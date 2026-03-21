// server/controllers/gameController.js

const GameService = require('../services/gameService');
const { getRoom } = require('../models/state');

const GameController = {
  getState(req, res) {
    const state = getRoom(req.params.room);
    res.json(GameService.getGameState(state));
  },

  start(req, res) {
    try {
      const state = getRoom(req.params.room);
      res.json(GameService.startGame(state));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  reset(req, res) {
    const state = getRoom(req.params.room);
    GameService.resetGame(state);
    res.json({ message: 'Game reset', state: GameService.getGameState(state) });
  },

  assignRoles(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const players = GameService.assignRoles(state);
      res.json({ players });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  nextPhase(req, res) {
    try {
      const state = getRoom(req.params.room);
      res.json(GameService.nextPhase(state));
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  revealNext(req, res) {
    const state = getRoom(req.params.room);
    if (state.revealIndex >= state.players.length) {
      return res.status(400).json({ error: 'All roles have been revealed' });
    }
    state.players[state.revealIndex].isRevealed = true;
    state.revealIndex += 1;
    res.json({ revealIndex: state.revealIndex, players: state.players });
  },

  updateConfig(req, res) {
    try {
      const state  = getRoom(req.params.room);
      const config = GameService.updateConfig(state, req.body);
      res.json({ config });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  useSilence(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const silence = GameService.useSilence(state, req.body.playerId);
      res.json({ silence });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = GameController;