// server/routes/gameRoutes.js

const express = require('express');
const router  = express.Router({ mergeParams: true });
const GameController = require('../controllers/gameController');

router.get('/state',         GameController.getState);
router.post('/start',        GameController.start);
router.post('/reset',        GameController.reset);
router.post('/assign-roles', GameController.assignRoles);
router.post('/next-phase',   GameController.nextPhase);
router.post('/reveal-next',  GameController.revealNext);
router.post('/config',       GameController.updateConfig);
router.post('/silence',      GameController.useSilence);

module.exports = router;