import React from 'react';
import { useGame } from '../../context/GameContext';

export default function VoteResultStep({ onDone }) {
  const { players, voting } = useGame();

  const eliminatedId     = voting?.eliminated;
  const eliminatedPlayer = players.find(p => p.id === eliminatedId);

  return (
    <div className="vote-result-screen">
      <span className="night-result-icon">⚖️</span>

      <h1 style={{ fontSize: 26, marginBottom: 8 }}>
        The town has spoken!
      </h1>

      {eliminatedPlayer ? (
        <>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 16 }}>
            <strong style={{ color: 'var(--text)', fontSize: 22 }}>{eliminatedPlayer.name}</strong>
            <br />has been eliminated.
          </p>

          {/* Big role reveal */}
          <div style={{
            display: 'inline-block',
            padding: '20px 32px',
            background: '#1a1a1a',
            border: '1px solid var(--border)',
            borderRadius: 12,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Their role was
            </div>
            <span className={`role-badge role-${eliminatedPlayer.role}`} style={{ fontSize: 20, padding: '6px 20px' }}>
              {eliminatedPlayer.role}
            </span>
          </div>

          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            Announce this to the table before proceeding.
          </p>
        </>
      ) : (
        <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No one was eliminated this round.</p>
      )}

      <div style={{ marginTop: 32 }}>
        <button
          className="btn btn-primary"
          style={{ fontSize: 16, padding: '14px 40px' }}
          onClick={onDone}
        >
          🌙 Begin Next Night
        </button>
      </div>
    </div>
  );
}
