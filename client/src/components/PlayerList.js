// client/src/components/PlayerList.js

import React from 'react';
import { useGame } from '../context/GameContext';
import { removePlayer } from '../services/api';

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function PlayerList({ showRoles = false, showRemove = false, showStatus = false }) {
  const { players, act } = useGame();

  if (players.length === 0) {
    return <p className="text-muted">No players added yet.</p>;
  }

  const handleRemove = async (id) => {
    await act(() => removePlayer(id));
  };

  return (
    <div>
      {players.map(player => (
        <div key={player.id} className={`player-item ${!player.isAlive ? 'dead' : ''}`}>
          <div className="player-avatar">{initials(player.name)}</div>

          <span className="player-name">
            {player.name}
            {!player.isAlive && (
              <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-dim)' }}>✝</span>
            )}
          </span>

          {/* Silenced badge */}
          {player.isSilenced && player.isAlive && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: '#1a1a2e', border: '1px solid #3a3a6e',
              color: '#a0a0ff', borderRadius: 20,
              padding: '2px 8px', letterSpacing: '0.04em',
            }}>
              🤫 Silenced
            </span>
          )}

          {showRoles && player.role && (
            <span className={`role-badge role-${player.role}`}>{player.role}</span>
          )}

          {showStatus && (
            <span className="player-status">{player.isAlive ? 'Alive' : 'Eliminated'}</span>
          )}

          {showRemove && (
            <button className="btn btn-danger btn-sm" onClick={() => handleRemove(player.id)}>
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}