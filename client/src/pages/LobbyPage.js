import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { addPlayer, removePlayer, assignRoles, startGame, resetGame, updateConfig, resetScores } from '../services/api';
import Leaderboard from '../components/Leaderboard';

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function LobbyPage() {
  const { roster, players, act, error, loading, refresh, gameState } = useGame();
  const [name, setName]                     = useState('');
  const [rolesAssigned, setRolesAssigned]   = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [cfg, setCfg] = useState({
    mafiaCount: 'random', dodoCount: 0, detectiveCount: 1, doctorCount: 1,
  });

  useEffect(() => { refresh(); }, [refresh]);
  useEffect(() => { if (gameState?.config) setCfg(gameState.config); }, [gameState]);
  useEffect(() => {
    setRolesAssigned(players.length > 0 && players.every(p => p.role));
  }, [players]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await act(() => addPlayer(name.trim()));
    setName('');
  };

  const handleRemove      = (id)        => act(() => removePlayer(id));
  const handleCfgChange   = async (key, value) => {
    const next = { ...cfg, [key]: value };
    setCfg(next);
    await act(() => updateConfig(next));
  };
  const handleAssign      = ()          => act(() => assignRoles());
  const handleStart       = ()          => act(() => startGame());
  const handleReset       = ()          => act(() => resetGame());
  const handleResetScores = ()          => { if (window.confirm('Reset all scores and history?')) act(() => resetScores()); };

  const estMafia = cfg.mafiaCount === 'random'
    ? (roster.length <= 4 ? 1 : roster.length <= 9 ? 2 : 3)
    : Number(cfg.mafiaCount);

  const displayList = roster.map(r => {
    const active = players.find(p => p.id === r.id);
    return { ...r, role: active?.role || null };
  });

  return (
    <div className="page" style={{ maxWidth: 580 }}>

      <div className="lobby-hero">
        <span className="lobby-logo-emoji">🎭</span>
        <div className="lobby-title">MAFIA</div>
        <div className="lobby-subtitle">Godfather Control Panel</div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Role Config */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="lobby-divider">Role Configuration</div>
        <div className="config-grid">
          <div className="config-item mafia-config">
            <label>🔪 Mafia</label>
            <select className="input" style={{ width: '100%', padding: '6px 10px', fontSize: 14 }}
              value={cfg.mafiaCount}
              onChange={e => handleCfgChange('mafiaCount', e.target.value === 'random' ? 'random' : Number(e.target.value))}>
              <option value="random">Random {roster.length > 0 ? `(~${estMafia})` : ''}</option>
              {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="config-item dodo-config">
            <label>🃏 DoDo</label>
            <div className="flex gap-8">
              {[0,1].map(n => (
                <button key={n}
                  className={`btn btn-sm ${cfg.dodoCount === n ? 'btn-primary' : 'btn-secondary'}`}
                  style={cfg.dodoCount === n ? { background: '#4a1570', borderColor: '#6b21a8' } : {}}
                  onClick={() => handleCfgChange('dodoCount', n)}>
                  {n === 0 ? 'None' : '1'}
                </button>
              ))}
            </div>
          </div>
          <div className="config-item doctor-config">
            <label>💉 Doctor</label>
            <div className="config-fixed">1 <span>fixed</span></div>
          </div>
          <div className="config-item detective-config">
            <label>🔍 Detective</label>
            <div className="config-fixed">1 <span>fixed</span></div>
          </div>
        </div>
        {cfg.dodoCount === 1 && (
          <div style={{ marginTop: 10, padding: '10px 14px', background: '#1a0d2e', border: '1px solid #4a1570', borderRadius: 8, fontSize: 13, color: '#c084fc' }}>
            🃏 <strong>DoDo</strong> — Wins alone if voted out by the town. Tries to act suspicious!
          </div>
        )}
      </div>

      {/* Players & Scores */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
          <div className="lobby-divider" style={{ flex: 1, margin: 0 }}>Players & Scores</div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowLeaderboard(true)}
            style={{ marginLeft: 12, fontSize: 13 }}
          >
            🏆 Leaderboard
          </button>
        </div>

        <form onSubmit={handleAdd} className="flex gap-8">
          <input className="input" style={{ flex: 1 }} placeholder="Enter player name…"
            value={name} onChange={e => setName(e.target.value)} maxLength={30} autoFocus />
          <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>+ Add</button>
        </form>

        {roster.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {displayList.map(p => (
              <div key={p.id} className="player-item" style={{ justifyContent: 'space-between' }}>
                <div className="player-avatar">{initials(p.name)}</div>
                <span className="player-name">{p.name}</span>
                {rolesAssigned && p.role && (
                  <span className={`role-badge role-${p.role}`} style={{ fontSize: 10, padding: '1px 6px' }}>{p.role}</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#1a1a1a', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 10px', marginLeft: 'auto', marginRight: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 700 }}>{p.score ?? 0}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>pts</span>
                </div>
                {!rolesAssigned && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(p.id)}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}

        {roster.length === 0 && (
          <p className="text-muted" style={{ marginTop: 12, textAlign: 'center', fontSize: 13 }}>
            No players yet. Add at least 3 to start.
          </p>
        )}

        {roster.length > 0 && (
          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 4, background: '#222', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(roster.length / 12 * 100, 100)}%`, background: roster.length >= 3 ? 'var(--accent)' : '#555', borderRadius: 2, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {roster.length} / 12 players
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {roster.length >= 3 && (
        <div className="card" style={{ textAlign: 'center' }}>
          {!rolesAssigned ? (
            <>
              <p className="text-muted" style={{ marginBottom: 14, fontSize: 13 }}>
                Ready to assign roles to {roster.length} players.
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
                <button className="btn btn-secondary" onClick={handleAssign} disabled={loading}>🔄 Re-roll</button>
                <button className="btn btn-success" style={{ flex: 1, fontSize: 15, padding: '13px' }} onClick={handleStart} disabled={loading}>
                  ▶ Start Game
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {roster.length > 0 && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleResetScores} disabled={loading}>Reset Scores</button>
          <button className="btn btn-danger btn-sm" onClick={handleReset} disabled={loading}>⚠ New Game</button>
        </div>
      )}

      {showLeaderboard && <Leaderboard onClose={() => setShowLeaderboard(false)} />}
    </div>
  );
}