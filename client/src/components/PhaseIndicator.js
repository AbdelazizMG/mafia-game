// client/src/components/PhaseIndicator.js

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const PHASE_LABELS = {
  lobby:  'Lobby',
  reveal: 'Role Reveal',
  night:  'Game in Progress',
  day:    'Game in Progress',
  ended:  'Game Over',
};

export default function PhaseIndicator({ roomCode, onLeave }) {
  const { phase, round, alivePlayers, deadPlayers } = useGame();
  const [copied, setCopied] = useState(false);

  if (!phase) return null;

  const dotClass = (phase === 'night' || phase === 'day') ? 'night' : phase;

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="phase-bar" style={{ flexWrap: 'wrap', gap: 8 }}>
      <div className={`phase-dot ${dotClass}`} />

      <span style={{ fontWeight: 600, fontSize: 15 }}>
        {PHASE_LABELS[phase] || phase}
        {round > 0 && ` — Round ${round}`}
      </span>

      {/* Room code badge + copy button */}
      {roomCode && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Room Code:</span>
          <span style={{
            background: '#1a1a1a',
            border: '1px solid var(--border)',
            borderRadius: 20,
            padding: '3px 12px',
            fontSize: 13,
            letterSpacing: '0.12em',
            color: 'var(--gold)',
            fontWeight: 700,
          }}>
            {roomCode}
          </span>
          <button
            onClick={handleCopy}
            title="Copy room code"
            style={{
              background: copied ? '#0d2a1a' : '#1a1a1a',
              border: `1px solid ${copied ? '#1a5e35' : 'var(--border)'}`,
              borderRadius: 6,
              color: copied ? '#5dba7e' : 'var(--text-muted)',
              fontSize: 12,
              padding: '3px 10px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
        </div>
      )}

      <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
        {alivePlayers.length} alive · {deadPlayers.length} dead
      </span>

      {/* Leave button */}
      {onLeave && (
        <button
          onClick={onLeave}
          style={{
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            padding: '6px 14px',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
          }}
          onMouseOver={e => e.target.style.opacity = 0.8}
          onMouseOut={e => e.target.style.opacity = 1}
        >
          Leave Room
        </button>
      )}
    </div>
  );
}