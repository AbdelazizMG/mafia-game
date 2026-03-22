import React from 'react';
import { useGame } from '../context/GameContext';

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function PlayerDrawer({ onClose }) {
  const { players, silence } = useGame();
  const alive = players.filter(p => p.isAlive);
  const dead  = players.filter(p => !p.isAlive);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-handle" />
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>
          Players — {alive.length} alive · {dead.length} eliminated
        </div>

        {alive.map(p => (
          <div key={p.id} className="player-item" style={{ marginBottom: 8 }}>
            <div className="player-avatar">{initials(p.name)}</div>
            <span className="player-name">{p.name}</span>
            {p.isSilenced && (
              <span style={{ fontSize: 11, color: '#a0a0ff', background: '#1a1a2e', border: '1px solid #3a3a6e', borderRadius: 20, padding: '2px 8px' }}>
                🤫 Silenced
              </span>
            )}
            <span className={`role-badge role-${p.role}`}>{p.role}</span>
          </div>
        ))}

        {dead.length > 0 && (
          <>
            <div className="section-title" style={{ marginTop: 16, marginBottom: 8 }}>Eliminated</div>
            {dead.map(p => (
              <div key={p.id} className="player-item dead" style={{ marginBottom: 8 }}>
                <div className="player-avatar" style={{ opacity: 0.4 }}>{initials(p.name)}</div>
                <span className="player-name" style={{ opacity: 0.5 }}>{p.name}</span>
                <span className={`role-badge role-${p.role}`}>{p.role}</span>
              </div>
            ))}
          </>
        )}

        <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}
