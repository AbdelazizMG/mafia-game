const VotingService = require('../services/votingService');

const VoteController = {
  startVoting(req, res) {
    try {
      const voting = VotingService.startVoting();
      res.json({ voting });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  castVote(req, res) {
    try {
      const { playerId } = req.body;
      const votes = VotingService.castVote(playerId);
      res.json({ votes });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  tallyVotes(req, res) {
    try {
      const result = VotingService.tallyVotes();
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  getResult(req, res) {
    res.json(VotingService.getVotingResult());
  }
};

module.exports = VoteController;
