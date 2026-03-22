import React from 'react';
import { useGame } from '../../context/GameContext';

export default function NightResultStep({ onDone }) {
  const { nightResult, players, silence } = useGame();

  const killed       = nightResult?.killed;
  const saved        = nightResult?.saved;
  const killedPlayer = players.find(p => p.id === killed);
  const silencedId   = silence?.silencedId;
  const silencedPlayer = players.find(p => p.id === silencedId);

  return (
    <div className="night-result-screen">
      {/* Kill result */}
      {saved ? (
        <>
          <span className="night-result-icon">🛡️</span>
          <h1 style={{ color: '#5dba7e', fontSize: 28, marginBottom: 8 }}>No Deaths Tonight!</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 8 }}>
            The Mafia struck — but the Doctor saved their target.
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            Read this to the table, then proceed to discussion.
          </p>
        </>
      ) : killed ? (
        <>
          <span className="night-result-icon">💀</span>
          <h1 style={{ color: '#ff6b6b', fontSize: 28, marginBottom: 8 }}>
            {killedPlayer?.name} was killed!
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, marginBottom: 4 }}>
            The Mafia eliminated them during the night.
          </p>
          <div style={{ marginTop: 12 }}>
            <span className={`role-badge role-${killedPlayer?.role}`} style={{ fontSize: 14, padding: '4px 14px' }}>
              {killedPlayer?.role}
            </span>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: 13, marginTop: 16 }}>
            Read this to the table, then proceed to discussion.
          </p>
        </>
      ) : (
        <>
          <span className="night-result-icon">🌙</span>
          <h1 style={{ fontSize: 24, marginBottom: 8 }}>A quiet night…</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            No actions were taken this night.
          </p>
        </>
      )}

      {/* Silence result */}
      {silencedId && silencedPlayer && (
        <div style={{
          marginTop: 24, padding: '14px 20px',
          background: '#1a1a2e', border: '1px solid #3a3a6e',
          borderRadius: 10, textAlign: 'left',
        }}>
          <p style={{ color: '#a0a0ff', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            🤫 Silence Applied
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            <strong style={{ color: 'var(--text)' }}>{silencedPlayer.name}</strong> has been silenced by the Mafia.
            They cannot speak or vote this round.
            <br />
            <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>
              Announce this to the table — the silenced player must stay quiet.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
