const state = require('../models/state');
const PlayerService = require('./playerService');
const GameService = require('./gameService');

const VotingService = {
  /** Open the voting round */
  startVoting() {
    state.voting = { active: true, votes: {}, eliminated: null };
    return state.voting;
  },

  /**
   * Cast a vote against a player.
   * votedId: the player being voted against.
   */
  castVote(votedId) {
    if (!state.voting.active) throw new Error('No active voting round');

    const target = state.players.find(p => p.id === votedId);
    if (!target) throw new Error('Player not found');
    if (!target.isAlive) throw new Error('Cannot vote for a dead player');

    state.voting.votes[votedId] = (state.voting.votes[votedId] || 0) + 1;
    return state.voting.votes;
  },

  /** Tally votes and eliminate the player with the most votes */
  tallyVotes() {
    if (!state.voting.active) throw new Error('No active voting round');

    const votes = state.voting.votes;
    if (Object.keys(votes).length === 0) {
      // No votes cast — no elimination
      state.voting.active = false;
      return { eliminated: null, votes };
    }

    // Find the player with the highest vote count
    const topId = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];

    // Eliminate that player
    PlayerService.eliminatePlayer(topId);
    state.voting.eliminated = topId;
    state.voting.active = false;

    // Check win condition after elimination
    GameService.checkWinCondition();

    return { eliminated: topId, votes };
  },

  getVotingResult() {
    return state.voting;
  }
};

module.exports = VotingService;
