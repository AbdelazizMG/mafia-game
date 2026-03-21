import React from 'react';
import { useGame } from '../context/GameContext';
import { removePlayer } from '../services/api';

// Returns initials from a name ("John Doe" → "JD", "Alice" → "A")
function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Renders the list of players.
 * showRoles: show role badges (Godfather view during game)
 * showRemove: show remove buttons (lobby phase)
 * showStatus: show alive/dead status
 */
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
            {!player.isAlive && <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-dim)' }}>✝</span>}
          </span>

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
