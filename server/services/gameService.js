const state = require('../models/state');
const PlayerService = require('./playerService');

/**
 * Build role pool from Godfather's config settings.
 * Falls back to automatic mafia count if set to 'random'.
 */
function buildRolePool(playerCount) {
  const cfg = state.config;

  // Determine mafia count
  let mafiaCount;
  if (cfg.mafiaCount === 'random') {
    if (playerCount <= 4)       mafiaCount = 1;
    else if (playerCount <= 9)  mafiaCount = 2;
    else                        mafiaCount = 3;
  } else {
    mafiaCount = Number(cfg.mafiaCount);
  }

  const dodoCount      = Number(cfg.dodoCount)      || 0;
  const detectiveCount = Number(cfg.detectiveCount) || 0;
  const doctorCount    = Number(cfg.doctorCount)    || 0;

  const specialCount = mafiaCount + dodoCount + detectiveCount + doctorCount;
  if (specialCount >= playerCount) {
    throw new Error('Too many special roles for the number of players. Reduce role counts.');
  }

  const roles = [];
  for (let i = 0; i < mafiaCount;     i++) roles.push('mafia');
  for (let i = 0; i < dodoCount;      i++) roles.push('dodo');
  for (let i = 0; i < detectiveCount; i++) roles.push('detective');
  for (let i = 0; i < doctorCount;    i++) roles.push('doctor');
  // Fill the rest with citizens
  while (roles.length < playerCount) roles.push('citizen');

  return roles;
}

/**
 * Fisher-Yates shuffle — returns a new shuffled array.
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GameService = {
  /** Reset everything to initial lobby state */
  resetGame() {
    state.players = [];
    state.phase = 'lobby';
    state.round = 0;
    state.winner = null;
    state.revealIndex = 0;
    state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
    state.voting = { active: false, votes: {}, eliminated: null };
    // Keep config intact so Godfather doesn't have to re-enter it
  },

  /** Update game configuration (mafia count, dodo, etc.) */
  updateConfig(newConfig) {
    state.config = { ...state.config, ...newConfig };
    return state.config;
  },

  /** Assign roles randomly to all current players */
  assignRoles() {
    const players = state.players;
    if (players.length < 3) throw new Error('Need at least 3 players to assign roles');

    const rolePool = shuffle(buildRolePool(players.length));
    players.forEach((player, i) => {
      player.role = rolePool[i];
      player.isRevealed = false;
    });

    state.revealIndex = 0;
    return players;
  },

  /** Transition to role reveal phase */
  startGame() {
    if (state.players.some(p => !p.role)) throw new Error('Roles must be assigned before starting');
    state.phase = 'reveal';
    state.round = 0;
    return state;
  },

  /** Advance to next phase: reveal → night → day → night → ... */
  nextPhase() {
    if (state.phase === 'reveal') {
      state.phase = 'night';
      state.round = 1;
      state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
    } else if (state.phase === 'night') {
      state.phase = 'day';
    } else if (state.phase === 'day') {
      state.phase = 'night';
      state.round += 1;
      state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
      state.voting = { active: false, votes: {}, eliminated: null };
    }
    return state;
  },

  /** Full snapshot of current game state */
  getGameState() {
    return {
      phase: state.phase,
      round: state.round,
      winner: state.winner,
      config: state.config,
      players: state.players,
      alivePlayers: PlayerService.getAlivePlayers(),
      deadPlayers: PlayerService.getDeadPlayers(),
      nightActions: state.nightActions,
      voting: state.voting,
      revealIndex: state.revealIndex
    };
  },

  /**
   * Check win conditions after every elimination.
   * - DoDo wins alone if voted out during the day (checked in votingService).
   * - Citizens win if all mafia are dead.
   * - Mafia wins if mafia count >= alive non-mafia count.
   * Returns 'mafia' | 'citizens' | 'dodo' | null (game continues).
   */
  checkWinCondition(eliminatedRole) {
    // DoDo wins if they were the one voted out during day
    if (eliminatedRole === 'dodo') {
      state.winner = 'dodo';
      state.phase = 'ended';
      return 'dodo';
    }

    const alive = PlayerService.getAlivePlayers();
    const aliveMafia    = alive.filter(p => p.role === 'mafia').length;
    const aliveNonMafia = alive.filter(p => p.role !== 'mafia').length;

    if (aliveMafia === 0) {
      state.winner = 'citizens';
      state.phase = 'ended';
      return 'citizens';
    }

    if (aliveMafia >= aliveNonMafia) {
      state.winner = 'mafia';
      state.phase = 'ended';
      return 'mafia';
    }

    return null; // game continues
  }
};

module.exports = GameService;