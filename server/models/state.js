// server/models/state.js

const rooms = {};

function createRoomState() {
  return {
    roster:  [],
    players: [],
    phase:   'lobby',
    round:   0,
    winner:  null,
    config: {
      mafiaCount:     'random',
      dodoCount:      0,
      detectiveCount: 1,
      doctorCount:    1,
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
    // Silence ability — one use per game
    silence: {
      used:      false,   // true once the ability has been used
      silencedId: null,   // id of the silenced player
    },
    revealIndex: 0,
  };
}

function getRoom(roomCode) {
  const code = roomCode.toUpperCase();
  if (!rooms[code]) rooms[code] = createRoomState();
  return rooms[code];
}

function deleteRoom(roomCode) {
  delete rooms[roomCode.toUpperCase()];
}

module.exports = { getRoom, deleteRoom };