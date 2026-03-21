// server/controllers/nightController.js

const NightService = require('../services/nightService');
const { getRoom }  = require('../models/state');

const NightController = {
  setMafiaTarget(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const actions = NightService.setMafiaTarget(state, req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  setDoctorSave(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const actions = NightService.setDoctorSave(state, req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  setDetectiveCheck(req, res) {
    try {
      const state   = getRoom(req.params.room);
      const actions = NightService.setDetectiveCheck(state, req.body.playerId);
      res.json({ nightActions: actions });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  resolveNight(req, res) {
    try {
      const state            = getRoom(req.params.room);
      // silencePlayerId is optional — sent from frontend only if Godfather picked someone
      const silencePlayerId  = req.body.silencePlayerId || null;
      const result           = NightService.resolveNightActions(state, silencePlayerId);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
};

module.exports = NightController;