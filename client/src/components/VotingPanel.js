import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { startVoting, castVote, tallyVotes } from '../services/api';

export default function VotingPanel() {
  const { alivePlayers, voting, act, players } = useGame();
  const [selectedId, setSelectedId] = useState('');

  const isActive = voting?.active;
  const votes = voting?.votes || {};
  const eliminated = voting?.eliminated;

  const handleStart = () => act(() => startVoting());

  const handleVote = async () => {
    if (!selectedId) return;
    await act(() => castVote(selectedId));
    setSelectedId('');
  };

  const handleTally = () => act(() => tallyVotes());

  const eliminatedPlayer = players.find(p => p.id === eliminated);

  return (
    <div className="card">
      <div className="section-title">Day Voting</div>

      {/* Tally result */}
      {eliminated && !isActive && (
        <div className="error-banner" style={{ background: '#3d0a0a', marginBottom: 12 }}>
          🗳️ <strong>{eliminatedPlayer?.name || 'Unknown'}</strong> was voted out!
          {eliminatedPlayer?.role && (
            <span style={{ marginLeft: 8 }}>
              They were: <span className={`role-badge role-${eliminatedPlayer.role}`}>{eliminatedPlayer.role}</span>
            </span>
          )}
        </div>
      )}

      {!isActive && (
        <button className="btn btn-primary" onClick={handleStart}>
          Start Voting Round
        </button>
      )}

      {isActive && (
        <div>
          {/* Vote tally display */}
          {Object.keys(votes).length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div className="section-title">Current Votes</div>
              {Object.entries(votes).map(([pid, count]) => {
                const p = players.find(x => x.id === pid);
                return (
                  <div key={pid} className="flex gap-8" style={{ marginBottom: 6, alignItems: 'center' }}>
                    <span style={{ flex: 1 }}>{p?.name || pid}</span>
                    <span className="vote-count">{count}</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Cast vote */}
          <div className="flex gap-8 mt-8">
            <select
              className="input"
              style={{ flex: 1 }}
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Select player to vote against…</option>
              {alivePlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button className="btn btn-primary" disabled={!selectedId} onClick={handleVote}>
              +1 Vote
            </button>
          </div>

          <div className="flex gap-8 mt-8">
            <button className="btn btn-danger" onClick={handleTally} style={{ flex: 1 }}>
              Tally &amp; Eliminate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
