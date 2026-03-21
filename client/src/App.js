import React, { useEffect } from 'react';
import './index.css';
import { GameProvider, useGame } from './context/GameContext';
import PhaseIndicator from './components/PhaseIndicator';
import LobbyPage from './pages/LobbyPage';
import RoleRevealPage from './pages/RoleRevealPage';
import GameDashboard from './pages/GameDashboard';
import WinScreen from './pages/WinScreen';

// Router: renders the correct page based on current game phase
function Router() {
  const { phase, refresh } = useGame();

  // Load game state on first mount
  useEffect(() => { refresh(); }, [refresh]);

  if (!phase || phase === 'lobby') return <LobbyPage />;
  if (phase === 'reveal')          return <RoleRevealPage />;
  if (phase === 'ended')           return <WinScreen />;
  // night or day → game dashboard
  return <GameDashboard />;
}

export default function App() {
  return (
    <GameProvider>
      <div className="app">
        <PhaseIndicator />
        <Router />
      </div>
    </GameProvider>
  );
}
