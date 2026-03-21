// client/src/App.js

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
  return <GameDashboard />;
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
      <div className="app">
        <PhaseIndicator
          roomCode={room}
          onLeave={handleLeave}
        />
        <Router />
      </div>
    </GameProvider>
  );
}