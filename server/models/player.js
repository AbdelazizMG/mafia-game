const { v4: uuidv4 } = require('uuid');

function createPlayer(id, name) {
  return {
    id,
    name,
    role:       null,
    isAlive:    true,
    isRevealed: false,
    isSilenced: false,
  };
}

function createRosterEntry(name) {
  return {
    id:      uuidv4(),
    name,
    score:   0,
    history: [], // [{ role, points }] — last 8 won games, newest first
  };
}

module.exports = { createPlayer, createRosterEntry };