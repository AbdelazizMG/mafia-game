// server/services/votingService.js

const state = require('../models/state');
const PlayerService = require('./playerService');
const GameService = require('./gameService');

const VotingService = {
  startVoting() {
    // Always start with a clean slate
    state.voting = { active: true, votes: {}, eliminated: null };
    return state.voting;
  },

  castVote(votedId) {
    if (!state.voting.active) throw new Error('No active voting round');
    const target = state.players.find(p => p.id === votedId);
    if (!target) throw new Error('Player not found');
    if (!target.isAlive) throw new Error('Cannot vote for a dead player');
    // Increment by 1 per call — frontend calls this once per hand raised
    state.voting.votes[votedId] = (state.voting.votes[votedId] || 0) + 1;
    return state.voting.votes;
  },

  tallyVotes() {
    if (!state.voting.active) throw new Error('No active voting round');

    const votes = state.voting.votes;
    if (Object.keys(votes).length === 0) {
      state.voting.active = false;
      return { eliminated: null, votes };
    }

    // Player with the highest vote count is eliminated
    const topId = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    const eliminatedPlayer = state.players.find(p => p.id === topId);

    PlayerService.eliminatePlayer(topId);
    state.voting.eliminated = topId;
    state.voting.active = false;

    // Pass role so DoDo win triggers correctly
    GameService.checkWinCondition(eliminatedPlayer?.role);

    return { eliminated: topId, votes };
  },

  getVotingResult() {
    return state.voting;
  }
};

module.exports = VotingService;