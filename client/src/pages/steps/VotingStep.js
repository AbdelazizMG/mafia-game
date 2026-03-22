import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { startVoting, castVote, tallyVotes } from '../../services/api';

export default function VotingStep({ onDone }) {
  const { alivePlayers, voting, act, players, silence, setNightResolved } = useGame();

  const [localVotes, setLocalVotes] = useState({});
  const [phase, setPhase]           = useState('idle'); // idle | voting | done

  const eliminated       = voting?.eliminated;
  const eliminatedPlayer = players.find(p => p.id === eliminated);
  const silencedId       = silence?.silencedId;

  // Max votes = alive players minus the silenced one (they can't raise hand)
  const maxVotesAllowed = alivePlayers.filter(p => p.id !== silencedId).length;
  const totalVotes      = Object.values(localVotes).reduce((s, v) => s + v, 0);
  const maxVotes        = Math.max(0, ...Object.values(localVotes));

  useEffect(() => {
    if (voting?.active) {
      const initial = {};
      alivePlayers.forEach(p => { initial[p.id] = 0; });
      setLocalVotes(initial);
      setPhase('voting');
    }
  }, [voting?.active, alivePlayers]);

  const handleStart = async () => {
    await act(() => startVoting());
  };

  const adjust = (id, delta) => {
    if (delta > 0 && totalVotes >= maxVotesAllowed) return;
    setLocalVotes(prev => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) + delta) }));
  };

  const handleSubmit = async () => {
    const calls = [];
    Object.entries(localVotes).forEach(([id, count]) => {
      for (let i = 0; i < count; i++) calls.push(() => castVote(id));
    });
    for (const call of calls) await call();
    const result = await act(() => tallyVotes());
    setNightResolved(false);
    if (result) {
      setPhase('done');
      setTimeout(() => onDone(), 300); // brief pause then advance
    }
  };

  // Idle — not started yet
  if (phase === 'idle' && !voting?.active) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🗳️</div>
        <h2 style={{ marginBottom: 8 }}>Day Voting</h2>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 28 }}>
          Discussion is over. Time to vote someone out.
          {silencedId && (
            <span style={{ display: 'block', marginTop: 8, color: '#a0a0ff' }}>
              🤫 <strong>{players.find(p => p.id === silencedId)?.name}</strong> is silenced and cannot vote.
            </span>
          )}
        </p>
        <button className="btn btn-primary" style={{ fontSize: 16, padding: '14px 40px' }} onClick={handleStart}>
          Start Voting Round
        </button>
      </div>
    );
  }

  // Voting in progress
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ fontSize: 32 }}>🗳️</div>
        <h2 style={{ marginTop: 6, marginBottom: 4 }}>Cast Your Votes</h2>
        <p className="text-muted" style={{ fontSize: 13 }}>
          Go through each player — raise hands, tap + for each vote.
        </p>
      </div>

      {/* Silenced notice */}
      {silencedId && (
        <div style={{ marginBottom: 14, padding: '8px 12px', background: '#1a1a2e', border: '1px solid #3a3a6e', borderRadius: 8, fontSize: 13, color: '#a0a0ff' }}>
          🤫 <strong>{players.find(p => p.id === silencedId)?.name}</strong> cannot vote but can be voted against.
        </div>
      )}

      {/* Vote budget */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 12, padding: '8px 14px',
        background: '#111', borderRadius: 8, border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Votes cast</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: totalVotes >= maxVotesAllowed ? 'var(--accent)' : 'var(--gold)' }}>
          {totalVotes} / {maxVotesAllowed}
        </span>
      </div>

      {alivePlayers.map(player => {
        const votes      = localVotes[player.id] ?? 0;
        const isLeader   = votes > 0 && votes === maxVotes;
        const isSilenced = player.id === silencedId;
        const plusOff    = totalVotes >= maxVotesAllowed;

        return (
          <div
            key={player.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', borderRadius: 8, marginBottom: 8,
              background: isLeader ? '#3d1a0a' : '#111',
              border: `1px solid ${isLeader ? '#a03010' : isSilenced ? '#3a3a6e' : 'var(--border)'}`,
              transition: 'all 0.2s',
            }}
          >
            <span style={{ flex: 1, fontSize: 16, fontWeight: isLeader ? 600 : 400, color: isLeader ? '#ff9966' : 'var(--text)' }}>
              {player.name}
              {isSilenced && <span style={{ marginLeft: 8, fontSize: 11, color: '#6060aa' }}>🤫 can't vote</span>}
              {!isSilenced && isLeader && <span style={{ marginLeft: 8, fontSize: 11, color: '#ff7744' }}>most votes</span>}
            </span>

            <button onClick={() => adjust(player.id, -1)} disabled={votes === 0}
              style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid var(--border)', background: '#1a1a1a', color: votes === 0 ? 'var(--text-dim)' : 'var(--text)', fontSize: 20, cursor: votes === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              −
            </button>

            <span style={{ minWidth: 32, textAlign: 'center', fontSize: 20, fontWeight: 700, color: votes > 0 ? 'var(--gold)' : 'var(--text-dim)' }}>
              {votes}
            </span>

            <button onClick={() => adjust(player.id, +1)} disabled={plusOff}
              style={{ width: 38, height: 38, borderRadius: 8, border: '1px solid var(--border)', background: '#1a1a1a', color: plusOff ? 'var(--text-dim)' : 'var(--text)', fontSize: 20, cursor: plusOff ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              +
            </button>
          </div>
        );
      })}

      <button
        className="btn btn-danger btn-full"
        style={{ fontSize: 15, padding: 14, marginTop: 8 }}
        disabled={totalVotes === 0}
        onClick={handleSubmit}
      >
        Eliminate Most Voted
      </button>
    </div>
  );
}
