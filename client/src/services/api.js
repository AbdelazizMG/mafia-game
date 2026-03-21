// Central API service — all fetch calls go through here.
// Change BASE_URL to point at a remote server when deploying.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Players
export const getPlayers = () => request('GET', '/players');
export const addPlayer = (name) => request('POST', '/players', { name });
export const removePlayer = (id) => request('DELETE', `/players/${id}`);

// Game
export const getGameState = () => request('GET', '/game/state');
export const assignRoles = () => request('POST', '/game/assign-roles');
export const startGame = () => request('POST', '/game/start');
export const resetGame = () => request('POST', '/game/reset');
export const nextPhase = () => request('POST', '/game/next-phase');
export const revealNext = () => request('POST', '/game/reveal-next');

// Voting
export const startVoting = () => request('POST', '/vote/start');
export const castVote = (playerId) => request('POST', '/vote', { playerId });
export const tallyVotes = () => request('POST', '/vote/tally');
export const getVoteResult = () => request('GET', '/vote/result');

// Night actions
export const setMafiaTarget = (playerId) => request('POST', '/night/mafia', { playerId });
export const setDoctorSave = (playerId) => request('POST', '/night/doctor', { playerId });
export const setDetectiveCheck = (playerId) => request('POST', '/night/detective', { playerId });
export const resolveNight = () => request('POST', '/night/resolve');
