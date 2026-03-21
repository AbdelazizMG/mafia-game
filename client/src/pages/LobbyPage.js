import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { addPlayer, assignRoles, startGame, resetGame } from '../services/api';
import PlayerList from '../components/PlayerList';

export default function LobbyPage() {
  const { players, act, error, loading, refresh } = useGame();
  const [name, setName] = useState('');
  const [rolesAssigned, setRolesAssigned] = useState(false);

  useEffect(() => { refresh(); }, [refresh]);

  // Check if roles have been assigned already
  useEffect(() => {
    setRolesAssigned(players.length > 0 && players.every(p => p.role));
  }, [players]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await act(() => addPlayer(name.trim()));
    setName('');
  };

  const handleAssign = () => act(() => assignRoles());

  const handleStart = () => act(() => startGame());

  const handleReset = async () => {
    await act(() => resetGame());
    setRolesAssigned(false);
  };

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ color: 'var(--gold)', marginBottom: 4 }}>🎭 Mafia — Godfather Panel</h1>
        <p className="text-muted">Add players, assign roles, and run the game from this device.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Add player form */}
      <div className="card">
        <div className="section-title">Add Players</div>
        <form onSubmit={handleAdd} className="flex gap-8">
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Player name…"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
            Add
          </button>
        </form>

        {players.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div className="section-title">{players.length} player{players.length !== 1 ? 's' : ''}</div>
            <PlayerList showRemove={!rolesAssigned} showRoles={rolesAssigned} />
          </div>
        )}
      </div>

      {/* Role assignment */}
      {players.length >= 3 && (
        <div className="card">
          <div className="section-title">Role Setup</div>

          {!rolesAssigned ? (
            <div>
              <p className="text-muted" style={{ marginBottom: 12 }}>
                Roles are assigned automatically based on {players.length} players.
              </p>
              <button className="btn btn-gold btn-full" onClick={handleAssign} disabled={loading}>
                🎲 Assign Roles Randomly
              </button>
            </div>
          ) : (
            <div>
              <p style={{ marginBottom: 12, color: 'var(--text-muted)', fontSize: 13 }}>
                Roles assigned! Review above, then start the game.
              </p>
              <div className="flex gap-8">
                <button className="btn btn-secondary" onClick={handleAssign} disabled={loading}>
                  Re-roll Roles
                </button>
                <button className="btn btn-success" style={{ flex: 1 }} onClick={handleStart} disabled={loading}>
                  ▶ Start Game &amp; Reveal Roles
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {players.length > 0 && (
        <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={loading}>
          Reset Everything
        </button>
      )}

      {players.length < 3 && players.length > 0 && (
        <p className="text-muted mt-8">Need at least 3 players to start.</p>
      )}
    </div>
  );
}
