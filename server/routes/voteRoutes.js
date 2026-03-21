const express = require('express');
const router  = express.Router({ mergeParams: true });
const VoteController = require('../controllers/voteController');

router.post('/start',  VoteController.startVoting);
router.post('/',       VoteController.castVote);
router.post('/tally',  VoteController.tallyVotes);
router.get('/result',  VoteController.getResult);

module.exports = router;