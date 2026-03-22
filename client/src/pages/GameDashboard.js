import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { resetGame } from '../services/api';
import StepIndicator    from '../components/StepIndicator';
import PlayerDrawer     from '../components/PlayerDrawer';
import Leaderboard      from '../components/Leaderboard';
import NightActionsStep from './steps/NightActionsStep';
import NightResultStep  from './steps/NightResultStep';
import DiscussionStep   from './steps/DiscussionStep';
import VotingStep       from './steps/VotingStep';
import VoteResultStep   from './steps/VoteResultStep';

const STEP_NIGHT   = 0;
const STEP_RESULT  = 1;
const STEP_DISCUSS = 2;
const STEP_VOTE    = 3;
const STEP_VOTED   = 4;

export default function GameDashboard() {
  const { act, error, alivePlayers, deadPlayers, round } = useGame();
  const [step,            setStep]            = useState(STEP_NIGHT);
  const [drawerOpen,      setDrawerOpen]      = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const handleReset          = () => act(() => resetGame());
  const handleNightResolved  = () => setStep(STEP_RESULT);
  const handleStartDay       = () => setStep(STEP_DISCUSS);
  const handleDiscussionDone = () => setStep(STEP_VOTE);
  const handleVotingDone     = () => setStep(STEP_VOTED);
  const handleNextNight      = () => setStep(STEP_NIGHT);

  return (
    <div className="step-screen">
      <StepIndicator currentStep={step} />

      <div className="step-body">
        {error && <div className="error-banner" style={{ marginBottom: 16 }}>{error}</div>}
        {step === STEP_NIGHT   && <NightActionsStep onDone={handleNightResolved}  />}
        {step === STEP_RESULT  && <NightResultStep  onDone={handleStartDay}       />}
        {step === STEP_DISCUSS && <DiscussionStep   onDone={handleDiscussionDone} />}
        {step === STEP_VOTE    && <VotingStep       onDone={handleVotingDone}     />}
        {step === STEP_VOTED   && <VoteResultStep   onDone={handleNextNight}      />}
      </div>

      {/* Sticky footer */}
      <div className="step-footer">
        {step === STEP_RESULT && (
          <button className="btn btn-success btn-full" style={{ fontSize: 15, padding: 13 }} onClick={handleStartDay}>
            ☀️ Start Day Discussion
          </button>
        )}

        <div className="mini-bar">
          <span className="mini-bar-stat">
            Round {round} · {alivePlayers.length} alive · {deadPlayers.length} out
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setDrawerOpen(true)}>
              👥 Players
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setLeaderboardOpen(true)}>
              🏆
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleReset}>
              ✕ End
            </button>
          </div>
        </div>
      </div>

      {drawerOpen      && <PlayerDrawer  onClose={() => setDrawerOpen(false)}      />}
      {leaderboardOpen && <Leaderboard   onClose={() => setLeaderboardOpen(false)} />}
    </div>
  );
}