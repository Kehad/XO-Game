"use client";
import type { GameMode } from '../types';
import Image from 'next/image';
import AlertModal from './alert';

interface MainMenuProps {
  playerXName: string;
  setPlayerXName: (name: string) => void;
  playerOName: string;
  setPlayerOName: (name: string) => void;
  setShowDifficultyMenu: (show: boolean) => void;
  startGame: (mode: GameMode) => void;
  alertMessage: string;
  setAlertMessage: (msg: string) => void;
}

export function MainMenu({
  playerXName, setPlayerXName,
  playerOName, setPlayerOName,
  setShowDifficultyMenu, startGame,
  alertMessage, setAlertMessage
}: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4 selection:bg-cyan-500/30">
      {alertMessage && (
        <AlertModal alertMessage={alertMessage} setAlertMessage={setAlertMessage} type="info" title="Not Ready" />
      )}
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        <div className="text-center flex flex-col items-center space-y-2 mb-4">
          <Image src="/logo.png" alt="XO Game Logo" width={150} height={150} className="mb-2 drop-shadow-[0_0_15px_rgba(6,182,212,0.5)] rounded-3xl" />
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            XO Game
          </h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
            Select Game Mode
          </p>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 px-4 mb-2">
          <input
            type="text"
            placeholder="Player X Name (Optional)"
            value={playerXName}
            onChange={(e) => setPlayerXName(e.target.value)}
            maxLength={15}
            className="w-full sm:w-1/2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center sm:text-left"
          />
          <input
            type="text"
            placeholder="Player O Name (Optional)"
            value={playerOName}
            onChange={(e) => setPlayerOName(e.target.value)}
            maxLength={15}
            className="w-full sm:w-1/2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all text-center sm:text-left"
          />
        </div>

        <div className="flex flex-col gap-4 w-full px-4">
          <button
            onClick={() => setShowDifficultyMenu(true)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            🤖 Play vs Computer
          </button>
          <button
            onClick={() => startGame('offline_multiplayer')}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            👥 Local Multiplayer
          </button>
          <button
          // onClick={() => startGame('online_multiplayer')} 
          // // Uncomment to enable online multiplayer
            onClick={() => setAlertMessage('Online mode is not ready yet.')}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            🌐 Online Multiplayer
          </button>
        </div>
      </div>
    </div>
  );
}
