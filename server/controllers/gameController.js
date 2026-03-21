const GameService = require('../services/gameService');
const state = require('../models/state');

const GameController = {
  getState(req, res) {
    res.json(GameService.getGameState());
  },

  start(req, res) {
    try {
      const newState = GameService.startGame();
      res.json(newState);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  reset(req, res) {
    GameService.resetGame();
    res.json({ message: 'Game reset', state: GameService.getGameState() });
  },

  assignRoles(req, res) {
    try {
      const players = GameService.assignRoles();
      res.json({ players });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  nextPhase(req, res) {
    try {
      const newState = GameService.nextPhase();
      res.json(newState);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  /** Advance the role-reveal pointer by one */
  revealNext(req, res) {
    if (state.revealIndex >= state.players.length) {
      return res.status(400).json({ error: 'All roles have been revealed' });
    }
    state.players[state.revealIndex].isRevealed = true;
    state.revealIndex += 1;
    res.json({ revealIndex: state.revealIndex, players: state.players });
  },

  /** Update lobby configuration */
  updateConfig(req, res) {
    try {
      const config = GameService.updateConfig(req.body);
      res.json({ config });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = GameController;