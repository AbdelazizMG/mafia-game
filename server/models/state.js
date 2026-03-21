/**
 * Central in-memory state for the entire game.
 * All services read/write this object.
 * Easy to swap for a database later.
 */
const state = {
  players: [],          // array of Player objects
  phase: 'lobby',       // lobby | reveal | night | day | ended
  round: 0,
  winner: null,         // null | 'mafia' | 'citizens'

  // Night action targets (reset each night)
  nightActions: {
    mafiaTarget: null,
    doctorSave: null,
    detectiveCheck: null,
    detectiveResult: null
  },

  // Voting state
  voting: {
    active: false,
    votes: {},          // { votedPlayerId: count }
    eliminated: null
  },

  // Role reveal pointer
  revealIndex: 0
};

module.exports = state;
