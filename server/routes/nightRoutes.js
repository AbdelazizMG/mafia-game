const express = require('express');
const router = express.Router();
const NightController = require('../controllers/nightController');

router.post('/mafia', NightController.setMafiaTarget);
router.post('/doctor', NightController.setDoctorSave);
router.post('/detective', NightController.setDetectiveCheck);
router.post('/resolve', NightController.resolveNight);

module.exports = router;
