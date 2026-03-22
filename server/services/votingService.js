// server/services/votingService.js

const PlayerService = require('./playerService');
const GameService   = require('./gameService');

const VotingService = {
  startVoting(state) {
    state.voting = { active: true, votes: {}, eliminated: null };
    return state.voting;
  },

  castVote(state, votedId) {
    if (!state.voting.active) throw new Error('No active voting round');
    const target = state.players.find(p => p.id === votedId);
    if (!target)         throw new Error('Player not found');
    if (!target.isAlive) throw new Error('Cannot vote for a dead player');
    state.voting.votes[votedId] = (state.voting.votes[votedId] || 0) + 1;
    return state.voting.votes;
  },

  tallyVotes(state) {
    if (!state.voting.active) throw new Error('No active voting round');

    const votes = state.voting.votes;
    if (Object.keys(votes).length === 0) {
      state.voting.active = false;
      return { eliminated: null, votes };
    }

    const topId            = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
    const eliminatedPlayer = state.players.find(p => p.id === topId);

    PlayerService.eliminatePlayer(state, topId);
    state.voting.eliminated = topId;
    state.voting.active     = false;

    // Lift silence after voting ends — effect expires after the day round
    state.players.forEach(p => { p.isSilenced = false; });
    state.silence.silencedId = null;
    // silence.used stays true — ability is one-time per game

    GameService.checkWinCondition(state, eliminatedPlayer?.role);
    return { eliminated: topId, votes };
  },

  getVotingResult(state) {
    return state.voting;
  },
};

module.exports = VotingService;