const state = require('../models/state');
const { createPlayer } = require('../models/player');

/**
 * PlayerService handles CRUD operations on players in the game state.
 */
const PlayerService = {
  /**
   * Add a new player by name. Returns the created player.
   */
  addPlayer(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Player name cannot be empty');
    if (state.players.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('A player with that name already exists');
    }
    const player = createPlayer(trimmed);
    state.players.push(player);
    return player;
  },

  /**
   * Remove a player by ID. Returns the removed player or null.
   */
  removePlayer(playerId) {
    const index = state.players.findIndex(p => p.id === playerId);
    if (index === -1) return null;
    const [removed] = state.players.splice(index, 1);
    return removed;
  },

  /**
   * Assign a role to a specific player.
   */
  setRole(playerId, role) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');
    player.role = role;
    return player;
  },

  /**
   * Mark a player as eliminated (dead).
   */
  eliminatePlayer(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');
    if (!player.isAlive) throw new Error('Player is already dead');
    player.isAlive = false;
    return player;
  },

  /**
   * Revive all players (used on game reset).
   */
  reviveAllPlayers() {
    state.players.forEach(p => {
      p.isAlive = true;
      p.role = null;
      p.isRevealed = false;
    });
  },

  /**
   * Get all alive players.
   */
  getAlivePlayers() {
    return state.players.filter(p => p.isAlive);
  },

  /**
   * Get all dead players.
   */
  getDeadPlayers() {
    return state.players.filter(p => !p.isAlive);
  }
};

module.exports = PlayerService;
