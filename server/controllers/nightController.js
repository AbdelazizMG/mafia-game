const NightService = require('../services/nightService');

const NightController = {
  setMafiaTarget(req, res) {
    try {
      const actions = NightService.setMafiaTarget(req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  setDoctorSave(req, res) {
    try {
      const actions = NightService.setDoctorSave(req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  setDetectiveCheck(req, res) {
    try {
      const actions = NightService.setDetectiveCheck(req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  resolveNight(req, res) {
    try {
      const result = NightService.resolveNightActions();
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};

module.exports = NightController;
