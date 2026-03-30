"use client";
import type { GameMode, Difficulty } from '../types';

interface DifficultyMenuProps {
  playerXName: string;
  setPlayerXName: (name: string) => void;
  startGame: (mode: GameMode, diff: Difficulty) => void;
  setShowDifficultyMenu: (show: boolean) => void;
}

export function DifficultyMenu({
  playerXName, setPlayerXName,
  startGame, setShowDifficultyMenu
}: DifficultyMenuProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4 selection:bg-cyan-500/30">
      <div className="max-w-md w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Difficulty
          </h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-sm">
            Select Computer Difficulty
          </p>
        </div>

        <div className="w-full flex justify-center px-4 mb-2">
          <input
            type="text"
            placeholder="Player X Name (Optional)"
            value={playerXName}
            onChange={(e) => setPlayerXName(e.target.value)}
            maxLength={15}
            className="w-full sm:w-3/4 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-center"
          />
        </div>

        <div className="flex flex-col gap-4 w-full px-4">
          <button
            onClick={() => startGame('offline_computer', 'easy')}
            className="bg-green-600/20 hover:bg-green-600/40 border border-green-500/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            🌱 Easy Mode
          </button>
          <button
            onClick={() => startGame('offline_computer', 'medium')}
            className="bg-yellow-600/20 hover:bg-yellow-600/40 border border-yellow-500/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            ⚖️ Medium Mode
          </button>
          <button
            onClick={() => startGame('offline_computer', 'hard')}
            className="bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
          >
            🔥 Hard (Unbeatable)
          </button>
          <button
            onClick={() => setShowDifficultyMenu(false)}
            className="mt-4 text-gray-400 hover:text-white transition-colors py-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
