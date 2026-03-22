import React, { useEffect, useRef, useState } from 'react';
import { useGame } from '../context/GameContext';

const ROLE_EMOJI = {
  mafia:     '🔪',
  citizen:   '👤',
  detective: '🔍',
  doctor:    '💉',
  dodo:      '🃏',
};

// Rank 0 = Gold, 1 = Silver, 2 = Bronze, 3+ = plain
const RANK_STYLES = {
  0: {
    bg:     'linear-gradient(135deg, #2a1f00, #3d2e00)',
    border: '#d4a843',
    label:  '#d4a843',
    badge:  '👑',
    size:   22,
    glow:   '0 0 18px rgba(212,168,67,0.35)',
  },
  1: {
    bg:     'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
    border: '#aab4c4',
    label:  '#aab4c4',
    badge:  '🥈',
    size:   18,
    glow:   '0 0 10px rgba(170,180,196,0.2)',
  },
  2: {
    bg:     'linear-gradient(135deg, #1a1208, #261a0a)',
    border: '#cd7f32',
    label:  '#cd7f32',
    badge:  '🥉',
    size:   16,
    glow:   '0 0 8px rgba(205,127,50,0.2)',
  },
};

// Animated score counter
function AnimatedScore({ target }) {
  const [display, setDisplay] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    const duration = 800;
    const start    = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return <span>{display}</span>;
}

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

/**
 * Assigns dense ranks accounting for ties.
 * e.g. scores [10, 10, 7, 5] → ranks [0, 0, 2, 3]
 * Tied players share the same rank, and the next rank
 * skips by the number of tied players.
 */
function assignRanks(sorted) {
  const ranks = [];
  let rank = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].score === sorted[i - 1].score) {
      // Same score as previous — share the same rank
      ranks.push(ranks[i - 1]);
    } else {
      // New rank = current index (accounts for all tied players above)
      rank = i;
      ranks.push(rank);
    }
  }
  return ranks;
}

export default function Leaderboard({ onClose }) {
  const { roster } = useGame();

  const sorted = [...roster].sort((a, b) => b.score - a.score);
  const ranks  = assignRanks(sorted);

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="drawer" style={{ maxHeight: '80vh' }}>
        <div className="drawer-handle" />

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 28 }}>🏆</div>
          <div style={{ fontWeight: 700, fontSize: 18, marginTop: 4 }}>Leaderboard</div>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
            {roster.length} players · all time scores
          </div>
        </div>

        {sorted.length === 0 && (
          <p className="text-muted" style={{ textAlign: 'center', fontSize: 13 }}>
            No scores yet. Finish a game to see rankings!
          </p>
        )}

        {sorted.map((player, i) => {
          const rank    = ranks[i];
          const style   = RANK_STYLES[rank] || null;
          const isTop3  = rank < 3;
          const isFirst = rank === 0;

          return (
            <div
              key={player.id}
              style={{
                marginBottom: isTop3 ? 12 : 8,
                padding:      isTop3 ? '14px 16px' : '10px 14px',
                borderRadius: 10,
                background:   style ? style.bg    : '#111',
                border:       `1px solid ${style  ? style.border : 'var(--border)'}`,
                boxShadow:    style ? style.glow   : 'none',
                transition:   'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                {/* Rank badge */}
                <div style={{
                  width:      isTop3 ? 36 : 28,
                  height:     isTop3 ? 36 : 28,
                  borderRadius: '50%',
                  background: style ? 'transparent' : '#1a1a1a',
                  border:     `1px solid ${style ? style.border : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize:   isTop3 ? 18 : 12,
                  fontWeight: 700,
                  color:      style ? style.label : 'var(--text-dim)',
                  flexShrink: 0,
                }}>
                  {isTop3 ? style.badge : rank + 1}
                </div>

                {/* Avatar */}
                <div style={{
                  width:      isTop3 ? 38 : 30,
                  height:     isTop3 ? 38 : 30,
                  borderRadius: '50%',
                  background: '#2a2a2a',
                  border:     `1px solid ${style ? style.border : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize:   isTop3 ? 13 : 11,
                  fontWeight: 700,
                  color:      style ? style.label : 'var(--text-muted)',
                  flexShrink: 0,
                }}>
                  {initials(player.name)}
                </div>

                {/* Name + history */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: isFirst ? 700 : isTop3 ? 600 : 400,
                    fontSize:   style ? style.size : 14,
                    color:      style ? style.label : 'var(--text)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {player.name}
                  </div>

                  {/* Match history emoji row */}
                  {player.history && player.history.length > 0 && (
                    <div style={{ display: 'flex', gap: 3, marginTop: 4, flexWrap: 'wrap' }}>
                      {player.history.map((h, idx) => (
                        <span
                          key={idx}
                          title={`${h.role} +${h.points}pts`}
                          style={{
                            fontSize: isTop3 ? 14 : 12,
                            opacity:  Math.max(1 - idx * 0.1, 0.3),
                            cursor:   'default',
                          }}
                        >
                          {ROLE_EMOJI[h.role] || '❓'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize:   isTop3 ? 24 : 18,
                    fontWeight: 800,
                    color:      style ? style.label : 'var(--text-muted)',
                    lineHeight: 1,
                  }}>
                    <AnimatedScore target={player.score} />
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>pts</div>
                </div>
              </div>
            </div>
          );
        })}

        <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={onClose}>
          Close
        </button>
      </div>
    </>
  );
}