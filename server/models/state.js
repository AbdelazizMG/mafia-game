// server/models/state.js

/**
 * Central in-memory state for the entire game.
 * All services read/write this object.
 * Easy to swap for a database later.
 */
const state = {
  // Persisted across games — names and scores survive reset
  roster: [],           // [{ id, name, score }] — permanent player list

  players: [],          // active Player objects for the current game
  phase: 'lobby',       // lobby | reveal | night | day | ended
  round: 0,
  winner: null,         // null | 'mafia' | 'citizens' | 'dodo'

  // Godfather-configurable role counts
  config: {
    mafiaCount: 'random',
    dodoCount: 0,
    detectiveCount: 1,
    doctorCount: 1,
  },

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
    votes: {},
    eliminated: null
  },

  // Role reveal pointer
  revealIndex: 0
};

module.exports = state;