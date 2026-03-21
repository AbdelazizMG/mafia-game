import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { setMafiaTarget, setDoctorSave, setDetectiveCheck, resolveNight } from '../services/api';

export default function NightActionPanel() {
  const { alivePlayers, nightActions, act, players, setNightResult } = useGame();

  const [mafiaId, setMafiaId]     = useState('');
  const [doctorId, setDoctorId]   = useState('');
  const [detectiveId, setDetectiveId] = useState('');

  const hasMafia      = players.some(p => p.role === 'mafia' && p.isAlive);
  const hasDoctor     = players.some(p => p.role === 'doctor' && p.isAlive);
  const hasDetective  = players.some(p => p.role === 'detective' && p.isAlive);

  const handleResolve = async () => {
    const result = await act(() => resolveNight());
    if (result) setNightResult(result);
  };

  return (
    <div className="card">
      <div className="section-title">Night Actions</div>
      <p className="text-muted" style={{ marginBottom: 16 }}>
        Ask each special role privately, then record their choices here.
      </p>

      {/* Mafia */}
      {hasMafia && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#ff6b6b' }}>🔪 Mafia Target</div>
          <div className="flex gap-8">
            <select className="input" style={{ flex: 1 }} value={mafiaId} onChange={e => setMafiaId(e.target.value)}>
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

      {/* Doctor */}
      {hasDoctor && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#f0c060' }}>💉 Doctor Saves</div>
          <div className="flex gap-8">
            <select className="input" style={{ flex: 1 }} value={doctorId} onChange={e => setDoctorId(e.target.value)}>
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

      {/* Detective */}
      {hasDetective && (
        <div style={{ marginBottom: 14 }}>
          <div className="section-title" style={{ color: '#6baeff' }}>🔍 Detective Investigates</div>
          <div className="flex gap-8">
            <select className="input" style={{ flex: 1 }} value={detectiveId} onChange={e => setDetectiveId(e.target.value)}>
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
      <button className="btn btn-primary btn-full" onClick={handleResolve}>
        Resolve Night &amp; Announce Results
      </button>
    </div>
  );
}
