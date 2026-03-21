const state = require('../models/state');
const PlayerService = require('./playerService');
const GameService = require('./gameService');

const NightService = {
  /** Godfather records the mafia's kill target */
  setMafiaTarget(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.mafiaTarget = playerId;
    return state.nightActions;
  },

  /** Godfather records the doctor's save target */
  setDoctorSave(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.doctorSave = playerId;
    return state.nightActions;
  },

  /** Godfather records the detective's investigation target */
  setDetectiveCheck(playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.detectiveCheck = playerId;

    // Immediately compute result for the Godfather to see
    state.nightActions.detectiveResult = player.role === 'mafia' ? 'mafia' : 'innocent';
    return state.nightActions;
  },

  /**
   * Resolve all night actions:
   * - If mafia target != doctor save → kill the target
   * - If they match → target is saved (no death)
   * Returns a summary of what happened.
   */
  resolveNightActions() {
    const { mafiaTarget, doctorSave } = state.nightActions;

    if (!mafiaTarget) {
      return { killed: null, saved: false, message: 'Mafia did not select a target' };
    }

    const saved = mafiaTarget === doctorSave;

    if (!saved) {
      PlayerService.eliminatePlayer(mafiaTarget);
    }

    // Check win condition after night (night kills never trigger DoDo win)
    GameService.checkWinCondition(null);

    const killedPlayer = state.players.find(p => p.id === mafiaTarget);

    return {
      killed: saved ? null : mafiaTarget,
      killedName: saved ? null : killedPlayer?.name,
      saved,
      message: saved
        ? `${killedPlayer?.name} was targeted but saved by the Doctor!`
        : `${killedPlayer?.name} was eliminated by the Mafia.`
    };
  }
};

module.exports = NightService;