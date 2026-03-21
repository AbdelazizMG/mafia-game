const { v4: uuidv4 } = require('uuid');

/**
 * Player model factory.
 * Creates a plain object representing a player.
 */
function createPlayer(name) {
  return {
    id: uuidv4(),
    name,
    role: null,       // assigned later
    isAlive: true,
    isRevealed: false // used during role reveal phase
  };
}

module.exports = { createPlayer };
