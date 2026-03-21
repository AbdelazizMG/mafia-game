// client/src/pages/GameDashboard.js

import React from 'react';
import { useGame } from '../context/GameContext';
import { resetGame } from '../services/api';
import PlayerList from '../components/PlayerList';
import VotingPanel from '../components/VotingPanel';
import NightActionPanel from '../components/NightActionPanel';

export default function GameDashboard() {
  const { act, error, loading, nightResult, setNightResult, alivePlayers, deadPlayers } = useGame();

  const handleReset = () => act(() => resetGame());

  return (
    <div className="page">
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ color: 'var(--gold)' }}>🎮 Game in Progress</h1>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Night resolution result banner */}
      {nightResult && (
        <div className={`night-result ${nightResult.saved ? 'saved' : 'kill'}`}>
          {nightResult.message}
          <button
            onClick={() => setNightResult(null)}
            style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16 }}
          >✕</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Left: Player status */}
        <div>
          <div className="card">
            <div className="section-title">Alive Players ({alivePlayers.length})</div>
            <PlayerList showRoles showStatus />
          </div>

          {deadPlayers.length > 0 && (
            <div className="card">
              <div className="section-title">Eliminated ({deadPlayers.length})</div>
              {deadPlayers.map(p => (
                <div key={p.id} className="player-item dead">
                  <div className="player-avatar" style={{ opacity: 0.5 }}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="player-name">{p.name}</span>
                  <span className={`role-badge role-${p.role}`}>{p.role}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Night actions + Voting always visible together */}
        <div>
          <NightActionPanel />
          <VotingPanel />

          <div className="card" style={{ background: 'transparent', border: '1px dashed var(--border)' }}>
            <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Record night actions first, resolve them, then open voting when the day discussion is over.
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={loading}>
          ⚠ Abandon Game &amp; Return to Lobby
        </button>
      </div>
    </div>
  );
}