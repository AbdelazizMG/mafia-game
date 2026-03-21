// client/src/services/api.js

const BASE_URL = process.env.REACT_APP_API_URL || '';

// Room code is stored in sessionStorage so it survives page refresh
// but resets when you close the tab
export function getRoomCode() {
  return sessionStorage.getItem('mafiaRoom') || '';
}

export function setRoomCode(code) {
  sessionStorage.setItem('mafiaRoom', code.toUpperCase());
}

async function request(method, path, body) {
  const room = getRoomCode();
  if (!room) return null;  // no room yet — silently do nothing

  const res = await fetch(`${BASE_URL}/${room}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Guard: if server returned HTML instead of JSON, throw a clean error
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Server returned unexpected response. Check your room code.');
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Players / Roster
export const getPlayers  = ()     => request('GET',    '/players');
export const addPlayer   = (name) => request('POST',   '/players', { name });
export const removePlayer= (id)   => request('DELETE', `/players/${id}`);
export const resetScores = ()     => request('POST',   '/players/reset-scores');

// Game
export const getGameState = ()       => request('GET',  '/game/state');
export const assignRoles  = ()       => request('POST', '/game/assign-roles');
export const startGame    = ()       => request('POST', '/game/start');
export const resetGame    = ()       => request('POST', '/game/reset');
export const nextPhase    = ()       => request('POST', '/game/next-phase');
export const revealNext   = ()       => request('POST', '/game/reveal-next');
export const updateConfig = (config) => request('POST', '/game/config', config);

// Voting
export const startVoting = ()           => request('POST', '/vote/start');
export const castVote    = (playerId)   => request('POST', '/vote', { playerId });
export const tallyVotes  = ()           => request('POST', '/vote/tally');
export const getVoteResult=()           => request('GET',  '/vote/result');

// Night actions
export const setMafiaTarget    = (playerId) => request('POST', '/night/mafia',     { playerId });
export const setDoctorSave     = (playerId) => request('POST', '/night/doctor',    { playerId });
export const setDetectiveCheck = (playerId) => request('POST', '/night/detective', { playerId });
export const resolveNight      = ()         => request('POST', '/night/resolve');