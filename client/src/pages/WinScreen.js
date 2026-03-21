import React from 'react';
import { useGame } from '../context/GameContext';
import { resetGame } from '../services/api';

export default function WinScreen() {
  const { winner, act, players } = useGame();

  const isMafia    = winner === 'mafia';
  const isCitizens = winner === 'citizens';

  const mafiamembers = players.filter(p => p.role === 'mafia');
  const citizens     = players.filter(p => p.role !== 'mafia');

  const handleReset = () => act(() => resetGame());

  return (
    <div className="page">
      <div className={`win-screen ${isMafia ? 'win-mafia' : 'win-citizens'}`}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {isMafia ? '🔪' : '⚖️'}
        </div>
        <div className="win-title">
          {isMafia ? 'Mafia Wins!' : 'Citizens Win!'}
        </div>
        <div className="win-sub" style={{ marginBottom: 32 }}>
          {isMafia
            ? 'The Mafia took control of the town.'
            : 'All Mafia members have been eliminated!'}
        </div>

        {/* Role reveal summary */}
        <div style={{ maxWidth: 400, margin: '0 auto', textAlign: 'left', marginBottom: 32 }}>
          <div className="card">
            <div className="section-title">Mafia Members</div>
            {mafiamembers.map(p => (
              <div key={p.id} className="player-item" style={{ opacity: 1 }}>
                <span className="player-name">{p.name}</span>
                <span className={`role-badge role-mafia`}>Mafia</span>
                {!p.isAlive && <span className="text-muted" style={{ fontSize: 12 }}>eliminated</span>}
              </div>
            ))}
          </div>

          <div className="card">
            <div className="section-title">Town</div>
            {citizens.map(p => (
              <div key={p.id} className="player-item" style={{ opacity: p.isAlive ? 1 : 0.5 }}>
                <span className="player-name">{p.name}</span>
                <span className={`role-badge role-${p.role}`}>{p.role}</span>
                {!p.isAlive && <span className="text-muted" style={{ fontSize: 12 }}>eliminated</span>}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-gold" style={{ fontSize: 16, padding: '14px 40px' }} onClick={handleReset}>
          🎲 Play Again
        </button>
      </div>
    </div>
  );
}
