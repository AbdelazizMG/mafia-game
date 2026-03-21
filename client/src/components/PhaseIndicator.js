import React from 'react';
import { useGame } from '../context/GameContext';

const PHASE_LABELS = {
  lobby: 'Lobby',
  reveal: 'Role Reveal',
  night: 'Night Phase',
  day: 'Day Phase',
  ended: 'Game Over',
};

export default function PhaseIndicator() {
  const { phase, round, alivePlayers, deadPlayers } = useGame();
  if (!phase) return null;

  return (
    <div className="phase-bar">
      <div className={`phase-dot ${phase}`} />
      <span style={{ fontWeight: 600, fontSize: 15 }}>
        {PHASE_LABELS[phase] || phase}
        {round > 0 && ` — Round ${round}`}
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-muted)' }}>
        {alivePlayers.length} alive · {deadPlayers.length} dead
      </span>
    </div>
  );
}
