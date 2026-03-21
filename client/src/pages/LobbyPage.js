import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { addPlayer, assignRoles, startGame, resetGame, updateConfig } from '../services/api';
import { removePlayer } from '../services/api';

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function LobbyPage() {
  const { players, act, error, loading, refresh, gameState } = useGame();
  const [name, setName] = useState('');
  const [rolesAssigned, setRolesAssigned] = useState(false);

  // Local config state — synced from server
  const [cfg, setCfg] = useState({
    mafiaCount: 'random',
    dodoCount: 0,
    detectiveCount: 1,
    doctorCount: 1,
  });

  useEffect(() => { refresh(); }, [refresh]);

  // Sync config from server state
  useEffect(() => {
    if (gameState?.config) setCfg(gameState.config);
  }, [gameState]);

  useEffect(() => {
    setRolesAssigned(players.length > 0 && players.every(p => p.role));
  }, [players]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await act(() => addPlayer(name.trim()));
    setName('');
  };

  const handleRemove = (id) => act(() => removePlayer(id));

  const handleCfgChange = async (key, value) => {
    const next = { ...cfg, [key]: value };
    setCfg(next);
    await act(() => updateConfig(next));
  };

  const handleAssign = () => act(() => assignRoles());
  const handleStart  = () => act(() => startGame());
  const handleReset  = async () => { await act(() => resetGame()); setRolesAssigned(false); };

  // Derive estimated mafia count for display
  const estMafia = cfg.mafiaCount === 'random'
    ? (players.length <= 4 ? 1 : players.length <= 9 ? 2 : 3)
    : Number(cfg.mafiaCount);

  return (
    <div className="page" style={{ maxWidth: 580 }}>

      {/* ── Hero ── */}
      <div className="lobby-hero">
        <span className="lobby-logo-emoji">🎭</span>
        <div className="lobby-title">MAFIA</div>
        <div className="lobby-subtitle">Godfather Control Panel</div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* ── Role Config ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="lobby-divider">Role Configuration</div>

        <div className="config-grid">
          {/* Mafia count */}
          <div className="config-item mafia-config">
            <label>🔪 Mafia</label>
            <select
              className="input"
              style={{ width: '100%', padding: '6px 10px', fontSize: 14 }}
              value={cfg.mafiaCount}
              onChange={e => handleCfgChange('mafiaCount', e.target.value === 'random' ? 'random' : Number(e.target.value))}
            >
              <option value="random">Random {players.length > 0 ? `(~${estMafia})` : ''}</option>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* DoDo */}
          <div className="config-item dodo-config">
            <label>🃏 DoDo</label>
            <div className="flex gap-8">
              {[0,1].map(n => (
                <button
                  key={n}
                  className={`btn btn-sm ${cfg.dodoCount === n ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ flex: 1, background: cfg.dodoCount === n ? '#4a1570' : undefined, borderColor: cfg.dodoCount === n ? '#6b21a8' : undefined }}
                  onClick={() => handleCfgChange('dodoCount', n)}
                >
                  {n === 0 ? 'None' : '1'}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor — fixed */}
          <div className="config-item doctor-config">
            <label>💉 Doctor</label>
            <div className="config-fixed">1 <span>fixed</span></div>
          </div>

          {/* Detective — fixed */}
          <div className="config-item detective-config">
            <label>🔍 Detective</label>
            <div className="config-fixed">1 <span>fixed</span></div>
          </div>
        </div>

        {/* DoDo description */}
        {cfg.dodoCount === 1 && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: '#1a0d2e', border: '1px solid #4a1570', borderRadius: 8, fontSize: 13, color: '#c084fc' }}>
            🃏 <strong>DoDo</strong> — Wins alone if voted out by the town during the day. Tries to act suspicious!
          </div>
        )}
      </div>

      {/* ── Add Players ── */}
      <div className="card">
        <div className="lobby-divider">Players</div>

        <form onSubmit={handleAdd} className="flex gap-8">
          <input
            className="input"
            style={{ flex: 1 }}
            placeholder="Enter player name…"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={30}
            autoFocus
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
            + Add
          </button>
        </form>

        {/* Player pills */}
        {players.length > 0 && (
          <div className="player-pills">
            {players.map(p => (
              <div key={p.id} className="player-pill">
                <div className="pill-avatar">{initials(p.name)}</div>
                <span>{p.name}</span>
                {rolesAssigned && p.role && (
                  <span className={`role-badge role-${p.role}`} style={{ fontSize: 10, padding: '1px 6px' }}>{p.role}</span>
                )}
                {!rolesAssigned && (
                  <button onClick={() => handleRemove(p.id)} title="Remove">✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {players.length === 0 && (
          <p className="text-muted" style={{ marginTop: 12, textAlign: 'center', fontSize: 13 }}>
            No players yet. Add at least 3 to start.
          </p>
        )}

        {/* Player count bar */}
        {players.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(players.length / 12 * 100, 100)}%`,
                background: players.length >= 3 ? 'var(--accent)' : '#555',
                borderRadius: 2,
                transition: 'width 0.3s'
              }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {players.length} / 12 players
            </span>
          </div>
        )}
      </div>

      {/* ── Actions ── */}
      {players.length >= 3 && (
        <div className="card" style={{ textAlign: 'center' }}>
          {!rolesAssigned ? (
            <>
              <p className="text-muted" style={{ marginBottom: 14, fontSize: 13 }}>
                Ready to assign roles to {players.length} players.
              </p>
              <button className="btn btn-gold btn-full" style={{ fontSize: 15, padding: '13px' }} onClick={handleAssign} disabled={loading}>
                🎲 Assign Roles Randomly
              </button>
            </>
          ) : (
            <>
              <p style={{ marginBottom: 14, color: 'var(--text-muted)', fontSize: 13 }}>
                Roles assigned! Review the list above, then start.
              </p>
              <div className="flex gap-8">
                <button className="btn btn-secondary" onClick={handleAssign} disabled={loading}>
                  🔄 Re-roll
                </button>
                <button className="btn btn-success" style={{ flex: 1, fontSize: 15, padding: '13px' }} onClick={handleStart} disabled={loading}>
                  ▶ Start Game
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {players.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={loading}>
            ⚠ Reset Everything
          </button>
        </div>
      )}
    </div>
  );
}