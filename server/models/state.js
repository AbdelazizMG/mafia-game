// server/models/state.js

/**
 * Instead of one global state, we keep a map of roomCode → roomState.
 * Each room is a completely isolated game.
 */
const rooms = {};

/** Returns a fresh state object for a new room */
function createRoomState() {
  return {
    roster:  [],
    players: [],
    phase:   'lobby',
    round:   0,
    winner:  null,
    config: {
      mafiaCount:    'random',
      dodoCount:     0,
      detectiveCount: 1,
      doctorCount:   1,
    },
    nightActions: {
      mafiaTarget:     null,
      doctorSave:      null,
      detectiveCheck:  null,
      detectiveResult: null,
    },
    voting: {
      active:    false,
      votes:     {},
      eliminated: null,
    },
    revealIndex: 0,
  };
}

/**
 * Get an existing room's state, or create a new one if it doesn't exist.
 * Room codes are case-insensitive — always stored uppercase.
 */
function getRoom(roomCode) {
  const code = roomCode.toUpperCase();
  if (!rooms[code]) {
    rooms[code] = createRoomState();
  }
  return rooms[code];
}

/**
 * Delete a room entirely (optional cleanup).
 */
function deleteRoom(roomCode) {
  delete rooms[roomCode.toUpperCase()];
}

module.exports = { getRoom, deleteRoom };