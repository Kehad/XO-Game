"use client";
import type { PlayerType, GameMode, Difficulty } from '../types';
import { Board } from './Board';
import { GameStatus } from './GameStatus';
import { Scoreboard } from './Scoreboard';
import AlertModal from './alert';

interface GameScreenProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  playerXName: string;
  playerOName: string;
  scores: { X: number; O: number; Draws: number };
  winner: PlayerType | 'Draw' | null;
  xIsNext: boolean;
  board: PlayerType[];
  winningLine: number[] | null;
  handleClick: (index: number) => void;
  resetGame: () => void;
  newGame: () => void;
  goBackToMenu: () => void;
  alertMessage: string;
  setAlertMessage: (msg: string) => void;
}

export function GameScreen({
  gameMode, difficulty,
  playerXName, playerOName,
  scores, winner, xIsNext,
  board, winningLine,
  handleClick, resetGame, newGame, goBackToMenu,
  alertMessage, setAlertMessage
}: GameScreenProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4 selection:bg-cyan-500/30">
      <button
        onClick={goBackToMenu}
        className="absolute top-4 left-4 sm:top-8 sm:left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-medium bg-gray-800/50 py-2 px-4 rounded-full border border-gray-700/50 shadow-sm hover:bg-gray-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Menu
      </button>

      <div className="max-w-md w-full flex flex-col items-center gap-8">
        <div className="text-center space-y-2 mt-12 sm:mt-0">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Tic Tac Toe
          </h1>
          <p className="text-gray-400 font-medium tracking-wide uppercase text-sm flex items-center justify-center gap-2">
            {gameMode === 'offline_computer' ? (
              <>
                Playing vs Computer
                <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${difficulty === 'easy' ? 'bg-green-600/30 text-green-400' : difficulty === 'medium' ? 'bg-yellow-600/30 text-yellow-400' : 'bg-red-600/30 text-red-400'}`}>
                  {difficulty?.toUpperCase()}
                </span>
              </>
            ) : 'Local Multiplayer'}
          </p>
        </div>

        {alertMessage && (
          <AlertModal alertMessage={alertMessage} setAlertMessage={setAlertMessage} type="error" title="Disconnected" />
        )}

        <Scoreboard
          scores={scores}
          playerXName={playerXName}
          playerOName={playerOName}
          isVsComputer={gameMode === 'offline_computer'}
        />

        <GameStatus
          winner={winner}
          xIsNext={xIsNext}
          playerXName={playerXName}
          playerOName={playerOName}
          isVsComputer={gameMode === 'offline_computer'}
        />

        <Board
          board={board}
          winningLine={winningLine}
          onSquareClick={handleClick}
        />

        <div className="flex gap-4 flex-row">
          <button
            onClick={resetGame}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 w-full sm:w-auto text-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Restart Game
          </button>
          <button
            onClick={newGame}
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 w-full sm:w-auto text-lg flex items-center justify-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            New Game
          </button>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
