// client/src/components/VotingPanel.js

import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { startVoting, castVote, tallyVotes } from '../services/api';

export default function VotingPanel() {
  const { alivePlayers, voting, act, players } = useGame();

  const [localVotes, setLocalVotes] = useState({});

  const isActive         = voting?.active;
  const eliminated       = voting?.eliminated;
  const eliminatedPlayer = players.find(p => p.id === eliminated);

  // Total alive players = max votes that can be cast across ALL players combined
  const maxVotesAllowed = alivePlayers.length;

  useEffect(() => {
    if (isActive) {
      const initial = {};
      alivePlayers.forEach(p => { initial[p.id] = 0; });
      setLocalVotes(initial);
    }
  }, [isActive, alivePlayers]);

  const handleStart = () => act(() => startVoting());

  const totalVotes = Object.values(localVotes).reduce((s, v) => s + v, 0);
  const maxVotes   = Math.max(0, ...Object.values(localVotes));

  const adjust = (id, delta) => {
    // Don't allow total votes across all players to exceed alive player count
    if (delta > 0 && totalVotes >= maxVotesAllowed) return;
    setLocalVotes(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta)
    }));
  };

  const handleSubmit = async () => {
    const calls = [];
    Object.entries(localVotes).forEach(([id, count]) => {
      for (let i = 0; i < count; i++) calls.push(() => castVote(id));
    });
    for (const call of calls) await call();
    await act(() => tallyVotes());
  };

  return (
    <div className="card">
      <div className="section-title">Day Voting</div>

      {/* Result banner */}
      {!isActive && eliminated && (
        <div className="error-banner" style={{ background: '#3d0a0a', marginBottom: 12 }}>
          🗳️ <strong>{eliminatedPlayer?.name || 'Unknown'}</strong> was voted out!
          {eliminatedPlayer?.role && (
            <span style={{ marginLeft: 8 }}>
              They were: <span className={`role-badge role-${eliminatedPlayer.role}`}>{eliminatedPlayer.role}</span>
            </span>
          )}
        </div>
      )}

      {/* Start button */}
      {!isActive && (
        <button className="btn btn-primary btn-full" onClick={handleStart}>
          Start Voting Round
        </button>
      )}

      {/* Voting table */}
      {isActive && (
        <>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 14 }}>
            Go through each player aloud. Raise hands — tap + for each hand you see.
          </p>

          {/* Vote budget indicator */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12, padding: '6px 12px',
            background: '#111', borderRadius: 6, border: '1px solid var(--border)'
          }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Votes cast</span>
            <span style={{
              fontSize: 14, fontWeight: 700,
              color: totalVotes >= maxVotesAllowed ? 'var(--accent)' : 'var(--gold)'
            }}>
              {totalVotes} / {maxVotesAllowed}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {alivePlayers.map(player => {
              const votes      = localVotes[player.id] ?? 0;
              const isLeader   = votes > 0 && votes === maxVotes;
              const plusDisabled = totalVotes >= maxVotesAllowed;

              return (
                <div
                  key={player.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 8,
                    background: isLeader ? '#3d1a0a' : '#111',
                    border: `1px solid ${isLeader ? '#a03010' : 'var(--border)'}`,
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <span style={{
                    flex: 1, fontSize: 15,
                    fontWeight: isLeader ? 600 : 400,
                    color: isLeader ? '#ff9966' : 'var(--text)',
                  }}>
                    {player.name}
                    {isLeader && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: '#ff7744', fontWeight: 400 }}>
                        most votes
                      </span>
                    )}
                  </span>

                  {/* − */}
                  <button
                    onClick={() => adjust(player.id, -1)}
                    disabled={votes === 0}
                    style={{
                      width: 34, height: 34, borderRadius: 6,
                      border: '1px solid var(--border)', background: '#1a1a1a',
                      color: votes === 0 ? 'var(--text-dim)' : 'var(--text)',
                      fontSize: 18, cursor: votes === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >−</button>

                  {/* Count */}
                  <span style={{
                    minWidth: 28, textAlign: 'center',
                    fontSize: 18, fontWeight: 700,
                    color: votes > 0 ? 'var(--gold)' : 'var(--text-dim)',
                  }}>
                    {votes}
                  </span>

                  {/* + */}
                  <button
                    onClick={() => adjust(player.id, +1)}
                    disabled={plusDisabled}
                    style={{
                      width: 34, height: 34, borderRadius: 6,
                      border: '1px solid var(--border)', background: '#1a1a1a',
                      color: plusDisabled ? 'var(--text-dim)' : 'var(--text)',
                      fontSize: 18, cursor: plusDisabled ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >+</button>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', flex: 1 }}>
              {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
            </span>
            <button
              className="btn btn-danger"
              style={{ flex: 1 }}
              disabled={totalVotes === 0}
              onClick={handleSubmit}
            >
              Eliminate Most Voted
            </button>
          </div>
        </>
      )}
    </div>
  );
}