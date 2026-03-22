import React, { useState, useEffect, useRef } from 'react';

const PRESETS = [1, 2, 3, 5];

export default function DiscussionStep({ onDone }) {
  const [totalSeconds, setTotalSeconds] = useState(3 * 60);
  const [remaining,    setRemaining]    = useState(null);
  const [running,      setRunning]      = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => () => clearInterval(intervalRef.current), []);

  // Bug 1 fix: start/resume from current `remaining`, not from `totalSeconds`
  const start = () => setRunning(true);

  const pause = () => setRunning(false);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(null);
  };

  const handlePreset = (mins) => {
    setTotalSeconds(mins * 60);
    setRemaining(null);
    setRunning(false);
  };

  // Tick — only depends on `running`
  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return;
    }

    // If just started and no remaining set yet, initialise it
    setRemaining(prev => prev === null ? totalSeconds : prev);

    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRunning(false);

          // Bug 2 fix: vibrate + play a beep sound
          if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);

          // Play beep using Web Audio API — no external files needed
          try {
            const ctx  = new (window.AudioContext || window.webkitAudioContext)();
            const beep = (freq, start, dur) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.connect(g);
              g.connect(ctx.destination);
              o.frequency.value = freq;
              o.type = 'sine';
              g.gain.setValueAtTime(0.4, ctx.currentTime + start);
              g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
              o.start(ctx.currentTime + start);
              o.stop(ctx.currentTime + start + dur + 0.05);
            };
            beep(880, 0,    0.18);
            beep(880, 0.22, 0.18);
            beep(1100, 0.5, 0.4);
          } catch (e) {
            // Audio not supported — silent fail
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [running, totalSeconds]);

  const secs   = remaining ?? totalSeconds;
  const mins   = Math.floor(secs / 60);
  const sec    = secs % 60;
  const pct    = remaining === null ? 1 : totalSeconds > 0 ? remaining / totalSeconds : 0;
  const urgent = remaining !== null && remaining <= 30 && remaining > 0;
  const done   = remaining === 0;

  const timerClass = done ? 'done' : urgent ? 'urgent' : 'normal';

  return (
    <div style={{ textAlign: 'center', padding: '24px 0' }}>
      <div style={{ fontSize: 32, marginBottom: 4 }}>☀️</div>
      <h2 style={{ marginBottom: 4 }}>Discussion Time</h2>
      <p className="text-muted" style={{ fontSize: 13, marginBottom: 24 }}>
        Players discuss and debate who the Mafia might be.
      </p>

      {/* Presets — only before starting */}
      {remaining === null && (
        <>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Choose discussion duration:</p>
          <div className="timer-presets">
            {PRESETS.map(m => (
              <button
                key={m}
                className={`btn ${totalSeconds === m * 60 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handlePreset(m)}
              >
                {m} min
              </button>
            ))}
          </div>
        </>
      )}

      {/* Timer display */}
      <div
        className={`timer-display ${timerClass}`}
        style={{
          margin: '24px 0',
          // Bug 2: pulse animation when done
          animation: done ? 'pulse 0.8s ease-in-out 3' : 'none',
        }}
      >
        {String(mins).padStart(2, '0')}:{String(sec).padStart(2, '0')}
      </div>

      {/* Progress bar */}
      {remaining !== null && (
        <div style={{ height: 6, background: '#222', borderRadius: 3, margin: '0 20px 24px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct * 100}%`,
            background: done ? 'var(--text-dim)' : urgent ? 'var(--accent)' : 'var(--gold)',
            borderRadius: 3,
            transition: 'width 1s linear, background 0.5s',
          }} />
        </div>
      )}

      {/* Done message */}
      {done && (
        <div style={{
          background: '#3d0a0a', border: '1px solid var(--accent)',
          borderRadius: 10, padding: '14px 20px', margin: '0 0 20px',
          animation: 'pulse 0.8s ease-in-out 3',
        }}>
          <p style={{ color: '#ff9999', fontWeight: 600, fontSize: 15 }}>
            ⏰ Time's up! Proceed to voting.
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-8" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
        {remaining === null && (
          <button className="btn btn-gold" style={{ fontSize: 15, padding: '12px 32px' }} onClick={start}>
            ▶ Start Timer
          </button>
        )}
        {remaining !== null && !done && running && (
          <button className="btn btn-secondary" onClick={pause}>⏸ Pause</button>
        )}
        {remaining !== null && !done && !running && (
          // Bug 1: resume picks up from where it left off (remaining is preserved)
          <button className="btn btn-gold" onClick={start}>▶ Resume</button>
        )}
        {remaining !== null && (
          <button className="btn btn-secondary" onClick={reset}>↺ Reset</button>
        )}
      </div>

      {/* Bug 3: Skip button made clearly visible — white text, bordered */}
      <div style={{ marginTop: 28 }}>
        <button
          onClick={onDone}
          style={{
            background: '#2a2a2a',
            border: '1px solid #555',
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: 14,
            padding: '10px 24px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseOver={e => e.currentTarget.style.background = '#333'}
          onMouseOut={e  => e.currentTarget.style.background = '#2a2a2a'}
        >
          Skip to Voting →
        </button>
      </div>
    </div>
  );
}