// server/models/player.js

const { v4: uuidv4 } = require('uuid');

/**
 * Creates a game-session player from a roster entry.
 * The id matches the roster entry so scores can be updated after the game.
 */
function createPlayer(id, name) {
  return {
    id,           // same id as roster entry
    name,
    role: null,
    isAlive: true,
    isRevealed: false
  };
}

/**
 * Creates a brand-new roster entry (permanent, survives game resets).
 */
function createRosterEntry(name) {
  return {
    id: uuidv4(),
    name,
    score: 0
  };
}

module.exports = { createPlayer, createRosterEntry };