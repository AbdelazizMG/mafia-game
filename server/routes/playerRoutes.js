const express = require('express');
const router  = express.Router({ mergeParams: true });
const PlayerController = require('../controllers/playerController');

router.get('/',              PlayerController.getPlayers);
router.post('/',             PlayerController.addPlayer);
router.delete('/:id',        PlayerController.removePlayer);
router.post('/reset-scores', PlayerController.resetScores);

module.exports = router;