// server/services/playerService.js

const state = require('../models/state');
const { createPlayer, createRosterEntry } = require('../models/player');

const PlayerService = {

  // ── Roster (persists across games) ──────────────────────────────

  /** Add a new player to the permanent roster. */
  addToRoster(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Player name cannot be empty');
    if (state.roster.find(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      throw new Error('A player with that name already exists');
    }
    const entry = createRosterEntry(trimmed);
    state.roster.push(entry);
    return entry;
  },

  /** Remove a player from the roster entirely. */
  removeFromRoster(id) {
    const index = state.roster.findIndex(p => p.id === id);
    if (index === -1) return null;
    const [removed] = state.roster.splice(index, 1);
    return removed;
  },

  /**
   * Add points to a roster entry after a game ends.
   * Points: citizen = 1, dodo = 2, mafia = 3
   */
  addScore(id, points) {
    const entry = state.roster.find(p => p.id === id);
    if (entry) entry.score += points;
  },

  // ── Active game players ─────────────────────────────────────────

  /**
   * Populate state.players from the full roster for a new game.
   * All roster members participate by default.
   */
  buildPlayersFromRoster() {
    state.players = state.roster.map(entry => createPlayer(entry.id, entry.name));
  },

  setRole(playerId, role) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');
    player.role = role;
    return player;
  },

  eliminatePlayer(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player) throw new Error('Player not found');
    if (!player.isAlive) throw new Error('Player is already dead');
    player.isAlive = false;
    return player;
  },

  getAlivePlayers() {
    return state.players.filter(p => p.isAlive);
  },

  getDeadPlayers() {
    return state.players.filter(p => !p.isAlive);
  }
};

module.exports = PlayerService;