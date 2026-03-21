// client/src/context/GameContext.js

import React, { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [gameState, setGameState]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [nightResult, setNightResult] = useState(null);

const refresh = useCallback(async () => {
  try {
    const state = await api.getGameState();
    if (!state) return;  // no room code yet, ignore
    setGameState(state);
    setError(null);
  } catch (err) {
    setError(err.message);
  }
}, []);

  const act = useCallback(async (fn) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      await refresh();
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const value = {
    gameState,
    loading,
    error,
    nightResult,
    setNightResult,
    refresh,
    act,
    phase:        gameState?.phase,
    // roster has scores; players has roles/alive status
    roster:       gameState?.roster       || [],
    players:      gameState?.players      || [],
    alivePlayers: gameState?.alivePlayers || [],
    deadPlayers:  gameState?.deadPlayers  || [],
    voting:       gameState?.voting,
    nightActions: gameState?.nightActions,
    winner:       gameState?.winner,
    round:        gameState?.round,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}