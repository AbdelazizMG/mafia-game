const state = require('../models/state');
const PlayerService = require('./playerService');

/**
 * Role allocation rules based on player count.
 * Adjust to taste.
 */
function buildRolePool(playerCount) {
  const roles = [];

  if (playerCount <= 4) {
    // 1 mafia, rest citizens
    roles.push('mafia');
    for (let i = 1; i < playerCount; i++) roles.push('citizen');
  } else if (playerCount <= 6) {
    // 1 mafia, 1 detective, rest citizens
    roles.push('mafia', 'detective');
    for (let i = 2; i < playerCount; i++) roles.push('citizen');
  } else if (playerCount <= 9) {
    // 2 mafia, 1 detective, 1 doctor, rest citizens
    roles.push('mafia', 'mafia', 'detective', 'doctor');
    for (let i = 4; i < playerCount; i++) roles.push('citizen');
  } else {
    // 3 mafia, 1 detective, 1 doctor, rest citizens
    roles.push('mafia', 'mafia', 'mafia', 'detective', 'doctor');
    for (let i = 5; i < playerCount; i++) roles.push('citizen');
  }

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
      // Reset night actions for first round
      state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
    } else if (state.phase === 'night') {
      state.phase = 'day';
    } else if (state.phase === 'day') {
      state.phase = 'night';
      state.round += 1;
      // Reset night actions for new round
      state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
      // Reset voting
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
      players: state.players,
      alivePlayers: PlayerService.getAlivePlayers(),
      deadPlayers: PlayerService.getDeadPlayers(),
      nightActions: state.nightActions,
      voting: state.voting,
      revealIndex: state.revealIndex
    };
  },

  /**
   * Check win conditions.
   * Mafia wins if mafia count >= alive citizens count.
   * Citizens win if all mafia are dead.
   * Returns 'mafia' | 'citizens' | null (game continues).
   */
  checkWinCondition() {
    const alive = PlayerService.getAlivePlayers();
    const aliveMafia = alive.filter(p => p.role === 'mafia').length;
    const aliveCitizens = alive.filter(p => p.role !== 'mafia').length;

    if (aliveMafia === 0) {
      state.winner = 'citizens';
      state.phase = 'ended';
      return 'citizens';
    }

    if (aliveMafia >= aliveCitizens) {
      state.winner = 'mafia';
      state.phase = 'ended';
      return 'mafia';
    }

    return null; // game continues
  }
};

module.exports = GameService;
