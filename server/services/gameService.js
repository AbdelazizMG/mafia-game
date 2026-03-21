// server/services/gameService.js

const state = require('../models/state');
const PlayerService = require('./playerService');

const SCORE_MAP = {
  citizen:   1,
  detective: 1,
  doctor:    1,
  dodo:      2,
  mafia:     3,
};

function buildRolePool(playerCount) {
  const cfg = state.config;

  let mafiaCount;
  if (cfg.mafiaCount === 'random') {
    if (playerCount <= 4)      mafiaCount = 1;
    else if (playerCount <= 9) mafiaCount = 2;
    else                       mafiaCount = 3;
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
  while (roles.length < playerCount)       roles.push('citizen');

  return roles;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const GameService = {

  resetGame() {
    state.players      = [];
    state.phase        = 'lobby';
    state.round        = 0;
    state.winner       = null;
    state.revealIndex  = 0;
    state.nightActions = { mafiaTarget: null, doctorSave: null, detectiveCheck: null, detectiveResult: null };
    state.voting       = { active: false, votes: {}, eliminated: null };
    // roster and config intentionally NOT reset — names and scores persist
  },

  updateConfig(newConfig) {
    state.config = { ...state.config, ...newConfig };
    return state.config;
  },

  assignRoles() {
    // Always rebuild active players from the roster before assigning
    PlayerService.buildPlayersFromRoster();

    const players = state.players;
    if (players.length < 3) throw new Error('Need at least 3 players to assign roles');

    const rolePool = shuffle(buildRolePool(players.length));
    players.forEach((player, i) => {
      player.role       = rolePool[i];
      player.isRevealed = false;
    });

    state.revealIndex = 0;
    return players;
  },

  startGame() {
    if (state.players.some(p => !p.role)) throw new Error('Roles must be assigned before starting');
    state.phase = 'reveal';
    state.round = 0;
    return state;
  },

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
      state.voting       = { active: false, votes: {}, eliminated: null };
    }
    return state;
  },

  getGameState() {
    return {
      phase:        state.phase,
      round:        state.round,
      winner:       state.winner,
      config:       state.config,
      roster:       state.roster,          // needed by WinScreen for scores
      players:      state.players,
      alivePlayers: PlayerService.getAlivePlayers(),
      deadPlayers:  PlayerService.getDeadPlayers(),
      nightActions: state.nightActions,
      voting:       state.voting,
      revealIndex:  state.revealIndex
    };
  },

  checkWinCondition(eliminatedRole) {
    console.log('[checkWinCondition] eliminatedRole =', eliminatedRole); // debug line

    // DoDo wins alone if voted out by the town during the day
    if (eliminatedRole === 'dodo') {
      state.winner = 'dodo';
      state.phase  = 'ended';
      this._awardScores('dodo');
      return 'dodo';
    }

    const alive         = PlayerService.getAlivePlayers();
    const aliveMafia    = alive.filter(p => p.role === 'mafia').length;
    const aliveNonMafia = alive.filter(p => p.role !== 'mafia').length;

    if (aliveMafia === 0) {
      state.winner = 'citizens';
      state.phase  = 'ended';
      this._awardScores('citizens');
      return 'citizens';
    }

    if (aliveMafia >= aliveNonMafia) {
      state.winner = 'mafia';
      state.phase  = 'ended';
      this._awardScores('mafia');
      return 'mafia';
    }

    return null;
  },

  _awardScores(winner) {
    state.players.forEach(player => {
      let wins = false;
      if (winner === 'dodo'     && player.role === 'dodo')  wins = true;
      if (winner === 'mafia'    && player.role === 'mafia') wins = true;
      if (winner === 'citizens' && player.role !== 'mafia' && player.role !== 'dodo') wins = true;

      if (wins) {
        const points = SCORE_MAP[player.role] ?? 1;
        PlayerService.addScore(player.id, points);
      }
    });
  }
};

module.exports = GameService;