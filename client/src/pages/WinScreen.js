// client/src/pages/WinScreen.js

import React from 'react';
import { useGame } from '../context/GameContext';
import { resetGame } from '../services/api';

const POINTS = { mafia: 3, dodo: 2, citizen: 1, detective: 1, doctor: 1 };

export default function WinScreen() {
  const { winner, act, players, roster } = useGame();

  const isMafia    = winner === 'mafia';
  const isCitizens = winner === 'citizens';
  const isDodo     = winner === 'dodo';

  const mafiamembers = players.filter(p => p.role === 'mafia');
  const dodoPlayer   = players.find(p => p.role === 'dodo');
  const others       = players.filter(p => p.role !== 'mafia' && p.role !== 'dodo');

  const handleReset = () => act(() => resetGame());

  // Determine which players won this round
  const isWinner = (player) => {
    if (winner === 'dodo')     return player.role === 'dodo';
    if (winner === 'mafia')    return player.role === 'mafia';
    if (winner === 'citizens') return player.role !== 'mafia' && player.role !== 'dodo';
    return false;
  };

  // Get updated score from roster
  const getScore = (playerId) => roster.find(r => r.id === playerId)?.score ?? 0;

  return (
    <div className="page">
      <div className={`win-screen ${isMafia ? 'win-mafia' : isDodo ? 'win-dodo' : 'win-citizens'}`}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {isMafia ? '🔪' : isDodo ? '🃏' : '⚖️'}
        </div>
        <div className="win-title">
          {isMafia ? 'Mafia Wins!' : isDodo ? 'DoDo Wins!' : 'Citizens Win!'}
        </div>
        <div className="win-sub" style={{ marginBottom: 32 }}>
          {isMafia    && 'The Mafia took control of the town.'}
          {isCitizens && 'All Mafia members have been eliminated!'}
          {isDodo     && `${dodoPlayer?.name} fooled the entire town and won alone!`}
        </div>

        {/* Score earned this round */}
        <div style={{ maxWidth: 420, margin: '0 auto 32px', textAlign: 'left' }}>
          <div className="card">
            <div className="section-title" style={{ marginBottom: 12 }}>Points Earned This Round</div>
            {players.map(p => {
              const won    = isWinner(p);
              const pts    = won ? POINTS[p.role] ?? 1 : 0;
              const total  = getScore(p.id);
              return (
                <div key={p.id} className="player-item" style={{ opacity: 1, marginBottom: 6 }}>
                  <span className="player-name">{p.name}</span>
                  <span className={`role-badge role-${p.role}`}>{p.role}</span>

                  {/* Points gained */}
                  <span style={{
                    marginLeft: 'auto',
                    fontWeight: 700,
                    fontSize: 14,
                    color: won ? 'var(--gold)' : 'var(--text-dim)',
                    minWidth: 48,
                    textAlign: 'right'
                  }}>
                    {won ? `+${pts}` : '+0'}
                  </span>

                  {/* Running total */}
                  <span style={{
                    background: '#1a1a1a',
                    border: '1px solid var(--border)',
                    borderRadius: 20,
                    padding: '2px 10px',
                    fontSize: 12,
                    color: 'var(--text-muted)',
                    marginLeft: 8,
                    whiteSpace: 'nowrap'
                  }}>
                    {total} total
                  </span>
                </div>
              );
            })}
          </div>

          {/* Role reveal summary */}
          <div className="card">
            <div className="section-title">Mafia</div>
            {mafiamembers.map(p => (
              <div key={p.id} className="player-item">
                <span className="player-name">{p.name}</span>
                <span className="role-badge role-mafia">Mafia</span>
                {!p.isAlive && <span className="text-muted" style={{ fontSize: 12 }}>eliminated</span>}
              </div>
            ))}
          </div>

          {dodoPlayer && (
            <div className="card">
              <div className="section-title">DoDo</div>
              <div className="player-item">
                <span className="player-name">{dodoPlayer.name}</span>
                <span className="role-badge role-dodo">DoDo</span>
                {!dodoPlayer.isAlive && <span style={{ fontSize: 12, color: '#c084fc' }}>voted out — WINS!</span>}
              </div>
            </div>
          )}

          {others.length > 0 && (
            <div className="card">
              <div className="section-title">Town</div>
              {others.map(p => (
                <div key={p.id} className="player-item" style={{ opacity: p.isAlive ? 1 : 0.5 }}>
                  <span className="player-name">{p.name}</span>
                  <span className={`role-badge role-${p.role}`}>{p.role}</span>
                  {!p.isAlive && <span className="text-muted" style={{ fontSize: 12 }}>eliminated</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-gold" style={{ fontSize: 16, padding: '14px 40px' }} onClick={handleReset}>
          🎲 Play Again
        </button>
      </div>
    </div>
  );
}