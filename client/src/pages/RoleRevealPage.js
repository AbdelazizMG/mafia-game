import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { revealNext, startGame, nextPhase } from '../services/api';

export default function RoleRevealPage() {
  const { players, act, error, loading } = useGame();
  const [showingRole, setShowingRole] = useState(false);

  const revealed = players.filter(p => p.isRevealed);
  const current  = players.find(p => !p.isRevealed); // next player to reveal
  const allDone  = !current;

  // Step 1: Godfather hands device to player, taps "Show My Role"
  // Step 2: Player sees role, taps "Done — Hide"
  // Step 3: Repeat until all revealed

  const handleShowRole = () => setShowingRole(true);

  const handleHide = async () => {
    setShowingRole(false);
    await act(() => revealNext());
  };

  const handleBeginGame = () => act(() => nextPhase());

  const ROLE_ICONS = {
    mafia: '🔪',
    citizen: '👤',
    detective: '🔍',
    doctor: '💉',
  };

  const ROLE_DESC = {
    mafia:     'You are MAFIA. Each night, choose someone to eliminate.',
    citizen:   'You are a CITIZEN. Vote wisely during the day.',
    detective: 'You are the DETECTIVE. Each night, investigate one player.',
    doctor:    'You are the DOCTOR. Each night, choose someone to protect.',
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'var(--gold)', marginBottom: 4 }}>🎭 Role Reveal</h1>
        <p className="text-muted">Pass the device to each player privately to see their role.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Progress */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="section-title">Progress — {revealed.length} / {players.length} revealed</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {players.map((p, i) => (
            <span
              key={p.id}
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 13,
                background: p.isRevealed ? '#1a3a1a' : '#1a1a1a',
                border: `1px solid ${p.isRevealed ? '#1a5e35' : 'var(--border)'}`,
                color: p.isRevealed ? '#5dba7e' : 'var(--text-muted)'
              }}
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* Current player reveal card */}
      {!allDone && (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          {!showingRole ? (
            <>
              <p style={{ fontSize: 18, marginBottom: 6 }}>
                Ready, <strong style={{ color: 'var(--gold)' }}>{current?.name}</strong>?
              </p>
              <p className="text-muted" style={{ marginBottom: 24 }}>
                Make sure nobody else is looking at the screen.
              </p>
              <button className="btn btn-gold" style={{ fontSize: 16, padding: '14px 40px' }} onClick={handleShowRole}>
                👁 Show My Role
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 64, marginBottom: 8 }}>
                {ROLE_ICONS[current?.role] || '?'}
              </div>
              <div className={`role-badge role-${current?.role}`} style={{ fontSize: 18, padding: '6px 20px', marginBottom: 12 }}>
                {current?.role?.toUpperCase()}
              </div>
              <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>
                {ROLE_DESC[current?.role]}
              </p>
              <button className="btn btn-secondary" onClick={handleHide} disabled={loading}>
                ✓ Done — Hide Role
              </button>
            </>
          )}
        </div>
      )}

      {/* All revealed — start game */}
      {allDone && (
        <div className="card" style={{ textAlign: 'center', padding: '32px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌙</div>
          <h2 style={{ marginBottom: 8 }}>Everyone knows their role!</h2>
          <p className="text-muted" style={{ marginBottom: 24 }}>
            Collect the device back. Night falls — the game begins.
          </p>
          <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 40px' }} onClick={handleBeginGame}>
            Begin Night Phase
          </button>
        </div>
      )}
    </div>
  );
}
