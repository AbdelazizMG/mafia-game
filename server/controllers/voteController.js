// server/controllers/voteController.js

const VotingService = require('../services/votingService');
const { getRoom } = require('../models/state');

const VoteController = {
  startVoting(req, res) {
    try {
      const state  = getRoom(req.params.room);
      const voting = VotingService.startVoting(state);
      res.json({ voting });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  castVote(req, res) {
    try {
      const state = getRoom(req.params.room);
      const votes = VotingService.castVote(state, req.body.playerId);
      res.json({ votes });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  tallyVotes(req, res) {
    try {
      const state  = getRoom(req.params.room);
      const result = VotingService.tallyVotes(state);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getResult(req, res) {
    const state = getRoom(req.params.room);
    res.json(VotingService.getVotingResult(state));
  },
};

module.exports = VoteController;