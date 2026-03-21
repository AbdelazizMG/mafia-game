import React from 'react';
import { useGame } from '../context/GameContext';
import { nextPhase, resetGame } from '../services/api';
import PlayerList from '../components/PlayerList';
import VotingPanel from '../components/VotingPanel';
import NightActionPanel from '../components/NightActionPanel';

export default function GameDashboard() {
  const { phase, act, error, loading, nightResult, setNightResult, alivePlayers, deadPlayers } = useGame();

  const isNight = phase === 'night';
  const isDay   = phase === 'day';

  const handleNextPhase = async () => {
    setNightResult(null);
    await act(() => nextPhase());
  };

  const handleReset = () => act(() => resetGame());

  return (
    <div className="page">
      {/* Header */}
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ color: isNight ? '#9b8ecf' : '#e0c050' }}>
          {isNight ? '🌙 Night Phase' : '☀️ Day Phase'}
        </h1>
        <button className="btn btn-secondary btn-sm" onClick={handleNextPhase} disabled={loading} style={{ marginLeft: 'auto' }}>
          {isNight ? 'Go to Day →' : 'Go to Night →'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Night resolution result */}
      {nightResult && (
        <div className={`night-result ${nightResult.saved ? 'saved' : 'kill'}`}>
          {nightResult.message}
          <button
            onClick={() => setNightResult(null)}
            style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 16 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Two-column layout on wide screens */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Left column: Player status */}
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

        {/* Right column: Phase actions */}
        <div>
          {isNight && <NightActionPanel />}
          {isDay   && <VotingPanel />}

          {/* Phase transition tip */}
          <div className="card" style={{ background: 'transparent', border: '1px dashed var(--border)' }}>
            <p className="text-muted" style={{ fontSize: 13, lineHeight: 1.6 }}>
              {isNight
                ? 'Record all night actions above, then click "Resolve Night". After announcing results to the table, advance to Day Phase.'
                : 'During the day, players discuss. Use the voting panel to track votes. After elimination, advance to Night Phase.'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={loading}>
          ⚠ Abandon Game &amp; Reset
        </button>
      </div>
    </div>
  );
}
