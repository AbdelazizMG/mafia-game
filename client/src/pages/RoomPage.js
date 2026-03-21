// client/src/pages/RoomPage.js

import React, { useState } from 'react';
import { setRoomCode } from '../services/api';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function RoomPage({ onJoin }) {
  const [input, setInput]   = useState('');
  const [error, setError]   = useState('');
  const [showRestore, setShowRestore] = useState(false);

  const join = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 3) {
      setError('Room code must be at least 3 characters');
      return;
    }
    setRoomCode(trimmed);
    onJoin(trimmed);
  };

  const handleCreate  = () => join(generateCode());
  const handleRestore = (e) => { e.preventDefault(); join(input); };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>

      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{
          fontSize: 88,
          display: 'block',
          marginBottom: 12,
          filter: 'drop-shadow(0 0 32px rgba(192,57,43,0.5))',
          animation: 'float 4s ease-in-out infinite',
        }}>🎭</span>
        <div style={{
          fontSize: 52, fontWeight: 800,
          color: 'var(--accent)',
          textShadow: '0 0 40px rgba(192,57,43,0.4)',
          letterSpacing: -1,
        }}>MAFIA</div>
        <div style={{
          fontSize: 13, color: 'var(--text-dim)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          marginTop: 4,
        }}>
          Godfather Control Panel
        </div>
      </div>

      {/* Main card */}
      <div className="card" style={{ width: '100%', maxWidth: 380, textAlign: 'center' }}>
        <p className="text-muted" style={{ marginBottom: 16, fontSize: 13 }}>
          Each game gets its own private room. Create one for your group and you're ready to play.
        </p>

        <button
          className="btn btn-gold btn-full"
          style={{ fontSize: 16, padding: 14 }}
          onClick={handleCreate}
        >
          🎲 Create New Room
        </button>

        {/* Restore session */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => { setShowRestore(v => !v); setError(''); }}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-dim)', fontSize: 12,
              cursor: 'pointer', textDecoration: 'underline',
            }}
          >
            Closed the tab by accident? Restore a session
          </button>

          {showRestore && (
            <form onSubmit={handleRestore} style={{ marginTop: 12 }}>
              <input
                className="input"
                style={{
                  width: '100%', marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  fontSize: 18, textAlign: 'center',
                }}
                placeholder="YOUR ROOM CODE"
                value={input}
                onChange={e => { setInput(e.target.value.toUpperCase()); setError(''); }}
                maxLength={10}
                autoFocus
              />
              {error && (
                <p style={{ color: 'var(--accent)', fontSize: 13, marginBottom: 8 }}>{error}</p>
              )}
              <button
                type="submit"
                className="btn btn-secondary btn-full"
                disabled={!input.trim()}
              >
                Restore Session
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-muted" style={{ marginTop: 24, fontSize: 12, textAlign: 'center', maxWidth: 320 }}>
        Your room code keeps your game private. Two groups, two codes — no collisions.
      </p>
    </div>
  );
}