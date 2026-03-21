// client/src/components/NightActionPanel.js

import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { setMafiaTarget, setDoctorSave, setDetectiveCheck, resolveNight } from '../services/api';

export default function NightActionPanel() {
  const {
    alivePlayers, nightActions, act, players,
    setNightResult, setNightResolved, silence
  } = useGame();

  const [mafiaId,     setMafiaId]     = useState('');
  const [doctorId,    setDoctorId]    = useState('');
  const [detectiveId, setDetectiveId] = useState('');
  const [silenceId,   setSilenceId]   = useState(''); // local only — sent on resolve

  const hasMafia     = players.some(p => p.role === 'mafia'     && p.isAlive);
  const hasDoctor    = players.some(p => p.role === 'doctor'    && p.isAlive);
  const hasDetective = players.some(p => p.role === 'detective' && p.isAlive);

  const silenceUsed    = silence?.used;
  const silencedPlayer = players.find(p => p.id === silence?.silencedId);
  const silenceTargets = alivePlayers.filter(p => p.role !== 'mafia');

  const mafiaReady     = !hasMafia     || !!nightActions?.mafiaTarget;
  const doctorReady    = !hasDoctor    || !!nightActions?.doctorSave;
  const detectiveReady = !hasDetective || !!nightActions?.detectiveCheck;
  const canResolve     = mafiaReady && doctorReady && detectiveReady;

  const handleResolve = async () => {
    // Pass silenceId to resolve so everything applies atomically
    const result = await act(() => resolveNight(silenceId || null));
    if (result) {
      setNightResult(result);
      setNightResolved(true);
      // Reset all local dropdowns
      setMafiaId('');
      setDoctorId('');
      setDetectiveId('');
      setSilenceId('');
    }
  };

  return (
    <div className="card">
      <div className="section-title">Night Actions</div>
      <p className="text-muted" style={{ marginBottom: 16 }}>
        Ask each special role privately, then record their choices here.
        All actions take effect when you click Resolve.
      </p>

      {/* ── Mafia Kill ── */}
      {hasMafia && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#ff6b6b' }}>
            🔪 Mafia Target
            {nightActions?.mafiaTarget
              ? <span style={{ marginLeft: 8, color: '#5dba7e', fontSize: 10 }}>✓ SET</span>
              : <span style={{ marginLeft: 8, color: '#ff6b6b', fontSize: 10 }}>REQUIRED</span>
            }
          </div>
          <div className="flex gap-8">
            <select
              className="input"
              style={{ flex: 1 }}
              value={mafiaId}
              onChange={e => setMafiaId(e.target.value)}
            >
              <option value="">Choose target…</option>
              {alivePlayers.filter(p => p.role !== 'mafia').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              className="btn btn-danger btn-sm"
              disabled={!mafiaId}
              onClick={() => act(() => setMafiaTarget(mafiaId))}
            >
              Set
            </button>
          </div>
          {nightActions?.mafiaTarget && (
            <p className="text-muted mt-8">
              ✓ Target: <strong>{players.find(p => p.id === nightActions.mafiaTarget)?.name}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── Mafia Silence — local only, applied on resolve ── */}
      {hasMafia && (
        <div style={{
          marginBottom: 14, padding: '12px 14px',
          background: silenceUsed ? '#111' : '#1a1a2e',
          border: `1px solid ${silenceUsed ? 'var(--border)' : '#3a3a6e'}`,
          borderRadius: 8,
        }}>
          <div className="section-title" style={{ color: silenceUsed ? 'var(--text-dim)' : '#a0a0ff', marginBottom: 8 }}>
            🤫 Mafia Silence
            <span style={{
              marginLeft: 8, fontSize: 10,
              background: silenceUsed ? '#222' : '#2a2a5e',
              border: `1px solid ${silenceUsed ? 'var(--border)' : '#4a4a9e'}`,
              color: silenceUsed ? 'var(--text-dim)' : '#a0a0ff',
              borderRadius: 20, padding: '1px 8px',
            }}>
              {silenceUsed ? 'USED' : 'ONE TIME — OPTIONAL'}
            </span>
          </div>

          {silenceUsed ? (
            <p className="text-muted" style={{ fontSize: 13 }}>
              🤫 <strong>{silencedPlayer?.name}</strong> has been silenced this game.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 10 }}>
                Optional: silence a non-Mafia player for the rest of the game.
                Selection is applied when you click Resolve below.
              </p>
              <select
                className="input"
                style={{ width: '100%' }}
                value={silenceId}
                onChange={e => setSilenceId(e.target.value)}
              >
                <option value="">Choose player to silence… (optional)</option>
                {silenceTargets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              {silenceId && (
                <p className="text-muted mt-8" style={{ fontSize: 12 }}>
                  ⏳ <strong>{players.find(p => p.id === silenceId)?.name}</strong> will be silenced when you resolve.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Doctor ── */}
      {hasDoctor && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#f0c060' }}>
            💉 Doctor Saves
            {nightActions?.doctorSave
              ? <span style={{ marginLeft: 8, color: '#5dba7e', fontSize: 10 }}>✓ SET</span>
              : <span style={{ marginLeft: 8, color: '#f0c060', fontSize: 10 }}>REQUIRED</span>
            }
          </div>
          <div className="flex gap-8">
            <select
              className="input"
              style={{ flex: 1 }}
              value={doctorId}
              onChange={e => setDoctorId(e.target.value)}
            >
              <option value="">Choose save…</option>
              {alivePlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              className="btn btn-secondary btn-sm"
              disabled={!doctorId}
              onClick={() => act(() => setDoctorSave(doctorId))}
            >
              Set
            </button>
          </div>
          {nightActions?.doctorSave && (
            <p className="text-muted mt-8">
              ✓ Saving: <strong>{players.find(p => p.id === nightActions.doctorSave)?.name}</strong>
            </p>
          )}
        </div>
      )}

      {/* ── Detective ── */}
      {hasDetective && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#6baeff' }}>
            🔍 Detective Investigates
            {nightActions?.detectiveCheck
              ? <span style={{ marginLeft: 8, color: '#5dba7e', fontSize: 10 }}>✓ SET</span>
              : <span style={{ marginLeft: 8, color: '#6baeff', fontSize: 10 }}>REQUIRED</span>
            }
          </div>
          <div className="flex gap-8">
            <select
              className="input"
              style={{ flex: 1 }}
              value={detectiveId}
              onChange={e => setDetectiveId(e.target.value)}
            >
              <option value="">Choose to investigate…</option>
              {alivePlayers.filter(p => p.role !== 'detective').map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button
              className="btn btn-secondary btn-sm"
              disabled={!detectiveId}
              onClick={() => act(() => setDetectiveCheck(detectiveId))}
            >
              Check
            </button>
          </div>
          {nightActions?.detectiveCheck && (
            <p className="text-muted mt-8">
              ✓ <strong>{players.find(p => p.id === nightActions.detectiveCheck)?.name}</strong> is:{' '}
              <span style={{ color: nightActions.detectiveResult === 'mafia' ? '#ff6b6b' : '#5dba7e', fontWeight: 600 }}>
                {nightActions.detectiveResult}
              </span>{' '}
              (only the Godfather sees this)
            </p>
          )}
        </div>
      )}

      <hr className="divider" />

      <button
        className="btn btn-primary btn-full"
        onClick={handleResolve}
        disabled={!canResolve}
        title={!canResolve ? 'Set all required night actions first' : ''}
      >
        {canResolve
          ? 'Resolve Night & Announce Results'
          : `Waiting for: ${[
              !mafiaReady     && 'Mafia target',
              !doctorReady    && 'Doctor save',
              !detectiveReady && 'Detective check',
            ].filter(Boolean).join(', ')}`
        }
      </button>
    </div>
  );
}