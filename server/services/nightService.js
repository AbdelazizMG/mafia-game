// server/services/nightService.js

const PlayerService = require('./playerService');
const GameService   = require('./gameService');

const NightService = {
  setMafiaTarget(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.mafiaTarget = playerId;
    return state.nightActions;
  },

  setDoctorSave(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.doctorSave = playerId;
    return state.nightActions;
  },

  setDetectiveCheck(state, playerId) {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.isAlive) throw new Error('Invalid target');
    state.nightActions.detectiveCheck  = playerId;
    state.nightActions.detectiveResult = player.role === 'mafia' ? 'mafia' : 'innocent';
    return state.nightActions;
  },

  resolveNightActions(state) {
    const { mafiaTarget, doctorSave } = state.nightActions;

    if (!mafiaTarget) {
      return { killed: null, saved: false, message: 'Mafia did not select a target' };
    }

    const saved = mafiaTarget === doctorSave;
    if (!saved) PlayerService.eliminatePlayer(state, mafiaTarget);

    GameService.checkWinCondition(state, null);

    const killedPlayer = state.players.find(p => p.id === mafiaTarget);
    return {
      killed:     saved ? null : mafiaTarget,
      killedName: saved ? null : killedPlayer?.name,
      saved,
      message: saved
        ? `${killedPlayer?.name} was targeted but saved by the Doctor!`
        : `${killedPlayer?.name} was eliminated by the Mafia.`,
    };
  },
};

module.exports = NightService;