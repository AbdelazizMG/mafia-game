// server/routes/playerRoutes.js

const express = require('express');
const router = express.Router();
const PlayerController = require('../controllers/playerController');

router.get('/',              PlayerController.getPlayers);
router.post('/',             PlayerController.addPlayer);
router.delete('/:id',        PlayerController.removePlayer);
router.post('/reset-scores', PlayerController.resetScores);

module.exports = router;