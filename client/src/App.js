import React, { useEffect, useState } from 'react';
import './index.css';
import { GameProvider, useGame } from './context/GameContext';
import PhaseIndicator from './components/PhaseIndicator';
import LobbyPage      from './pages/LobbyPage';
import RoleRevealPage from './pages/RoleRevealPage';
import GameDashboard  from './pages/GameDashboard';
import WinScreen      from './pages/WinScreen';
import RoomPage       from './pages/RoomPage';
import { getRoomCode, setRoomCode } from './services/api';

function Router() {
  const { phase, refresh } = useGame();
  useEffect(() => { refresh(); }, [refresh]);

  if (!phase || phase === 'lobby') return <LobbyPage />;
  if (phase === 'reveal')          return <RoleRevealPage />;
  if (phase === 'ended')           return <WinScreen />;
  // night or day → step-by-step game dashboard (no PhaseIndicator needed here)
  return <GameDashboard />;
}

function AppShell({ onLeave, room }) {
  const { phase } = useGame();
  // Only show the top PhaseIndicator outside the game (lobby, reveal, ended)
  // During game, StepIndicator inside GameDashboard takes over
  const showTopBar = !phase || phase === 'lobby' || phase === 'reveal' || phase === 'ended';

  return (
    <div className="app">
      {showTopBar && (
        <PhaseIndicator roomCode={room} onLeave={onLeave} />
      )}
      <Router />
    </div>
  );
}

export default function App() {
  const [room, setRoom] = useState(getRoomCode());

  const handleJoin = (code) => {
    setRoomCode(code);
    setRoom(code);
  };

  const handleLeave = () => {
    sessionStorage.removeItem('mafiaRoom');
    setRoom('');
  };

  if (!room) return <RoomPage onJoin={handleJoin} />;

  return (
    <GameProvider>
      <AppShell onLeave={handleLeave} room={room} />
    </GameProvider>
  );
}
