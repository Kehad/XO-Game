import { useState, useEffect } from 'react';
import type { PlayerType, GameMode, Difficulty } from './types';
import type { DataConnection } from 'peerjs';
import { destroyPeer } from './api/peer';
import { calculateWinner, getBestMove } from './utils';
import { Board } from './components/Board';
import { GameStatus } from './components/GameStatus';
import { Scoreboard } from './components/Scoreboard';
import OnlineMultiplayer from './components/mode/OnlineMutliplayer';

function App() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [board, setBoard] = useState<PlayerType[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O'>('X');
  const [playerXName, setPlayerXName] = useState('');
  const [playerOName, setPlayerOName] = useState('');
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [peerConnection, setPeerConnection] = useState<DataConnection | null>(null);
  const [isOnlineHost, setIsOnlineHost] = useState(false);

  const { winner, line: winningLine } = calculateWinner(board);

  useEffect(() => {
    if (winner) {
      if (winner === 'X') setScores(s => ({ ...s, X: s.X + 1 }));
      else if (winner === 'O') setScores(s => ({ ...s, O: s.O + 1 }));
      else if (winner === 'Draw') setScores(s => ({ ...s, Draws: s.Draws + 1 }));
    }
  }, [winner]);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    if (gameMode === 'offline_computer' && !xIsNext) return;

    if (gameMode === 'online_multiplayer') {
      const myTurn = isOnlineHost ? xIsNext : !xIsNext;
      if (!myTurn) return;
    }

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';

    if (gameMode === 'online_multiplayer' && peerConnection) {
      peerConnection.send({ type: 'move', board: newBoard, xIsNext: !xIsNext });
    }

    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  useEffect(() => {
    if (gameMode === 'offline_computer' && !xIsNext && !winner) {
      const timer = setTimeout(() => {
        const move = getBestMove(board, 'O', difficulty);
        if (move !== -1) {
          const newBoard = [...board];
          newBoard[move] = 'O';
          setBoard(newBoard);
          setXIsNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, gameMode, winner, difficulty]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });
    if (gameMode === 'online_multiplayer' && peerConnection) {
      peerConnection.send({ type: 'reset', scores: { X: 0, O: 0, Draws: 0 } });
    }
  };
  const newGame = () => {
    setBoard(Array(9).fill(null));
    if (gameMode === 'offline_multiplayer' || gameMode === 'online_multiplayer' || gameMode === 'offline_computer') {
      const nextStarter = startingPlayer === 'X' ? 'O' : 'X';
      setStartingPlayer(nextStarter);
      setXIsNext(nextStarter === 'X');

      if (gameMode === 'online_multiplayer' && peerConnection) {
        peerConnection.send({ type: 'newGame', startingPlayer: nextStarter, xIsNext: nextStarter === 'X' });
      }
    } else {
      setStartingPlayer('X');
      setXIsNext(true);
    }
  };

  const startGame = (mode: GameMode, diff?: Difficulty) => {
    setGameMode(mode);
    if (diff) setDifficulty(diff);
    setShowDifficultyMenu(false);

    let firstPlayer: 'X' | 'O' = 'X';
    if (mode === 'offline_multiplayer') {
      firstPlayer = Math.random() < 0.5 ? 'X' : 'O';
    }

    setStartingPlayer(firstPlayer);
    setXIsNext(firstPlayer === 'X');
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });
  };

  const goBackToMenu = () => {
    setGameMode(null);
    setShowDifficultyMenu(false);
    setBoard(Array(9).fill(null));
    setStartingPlayer('X');
    setXIsNext(true);
    setScores({ X: 0, O: 0, Draws: 0 });
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
      destroyPeer();
    }
  };

  if (showDifficultyMenu) {
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

  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4 selection:bg-cyan-500/30">
        <div className="max-w-md w-full flex flex-col items-center gap-8">
          <div className="text-center space-y-2 mb-4">
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
              Tic Tac Toe
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
              onClick={() => startGame('online_multiplayer')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3"
            >
              🌐 Online Multiplayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleOnlineConnected = (conn: DataConnection, isHost: boolean, oppName: string, myName: string) => {
    setPeerConnection(conn);
    setIsOnlineHost(isHost);

    if (isHost) {
      setPlayerXName(myName);
      setPlayerOName(oppName);
      setStartingPlayer('X');
      setXIsNext(true);
    } else {
      // Guest joins, Host is X, Guest is O
      setPlayerOName(myName);
      setPlayerXName(oppName);
      setStartingPlayer('X');
      setXIsNext(true);
    }
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });

    conn.on('data', (data: any) => {
      if (data.type === 'move') {
        setBoard(data.board);
        setXIsNext(data.xIsNext);
      } else if (data.type === 'reset') {
        setBoard(Array(9).fill(null));
        setScores(data.scores);
      } else if (data.type === 'newGame') {
        setBoard(Array(9).fill(null));
        setStartingPlayer(data.startingPlayer);
        setXIsNext(data.xIsNext);
      }
    });

    conn.on('close', () => {
      alert('Opponent disconnected!');
      goBackToMenu();
    });

    conn.on('error', () => {
      alert('Connection lost!');
      goBackToMenu();
    });
  };

  if (gameMode === 'online_multiplayer' && !peerConnection) {
    return (
      <OnlineMultiplayer goBack={goBackToMenu} onConnected={handleOnlineConnected} />
    );
  }

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
        {/* Header */}
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

        {/* Controls */}
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

export default App;
