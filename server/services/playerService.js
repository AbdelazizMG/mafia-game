// server/services/playerService.js

const { createPlayer, createRosterEntry } = require('../models/player');

/**
 * PlayerService now receives `state` as a parameter (the room's state).
 * No more importing the global singleton.
 */
const PlayerService = {

  addToRoster(state, name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Player name cannot be empty');
    if (state.roster.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('A player with that name already exists');
    }
    const entry = createRosterEntry(trimmed);
    state.roster.push(entry);
    return entry;
  },

  removeFromRoster(state, id) {
    const index = state.roster.findIndex(p => p.id === id);
    if (index === -1) return null;
    const [removed] = state.roster.splice(index, 1);
    return removed;
  },

  addScore(state, id, points) {
    const entry = state.roster.find(p => p.id === id);
    if (entry) entry.score += points;
  },

  buildPlayersFromRoster(state) {
    state.players = state.roster.map(entry => createPlayer(entry.id, entry.name));
  },

  eliminatePlayer(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');
    if (!player.isAlive) throw new Error('Player is already dead');
    player.isAlive = false;
    return player;
  },

  getAlivePlayers(state) {
    return state.players.filter(p => p.isAlive);
  },

  getDeadPlayers(state) {
    return state.players.filter(p => !p.isAlive);
  }
};

module.exports = PlayerService;