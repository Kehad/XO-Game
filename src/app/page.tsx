"use client";
import { useState, useEffect } from 'react';
import type { PlayerType, GameMode, Difficulty } from '../types';
import type { Socket } from 'socket.io-client';
import { calculateWinner, getBestMove } from '../utils';
import { destroySocket } from '../api/socket';
import { MainMenu } from '../components/MainMenu';
import { DifficultyMenu } from '../components/DifficultyMenu';
import { GameScreen } from '../components/GameScreen';
import OnlineMultiplayer from '../components/mode/OnlineMultiplayer';

export default function App() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultyMenu, setShowDifficultyMenu] = useState(false);
  const [board, setBoard] = useState<PlayerType[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O'>('X');
  const [playerXName, setPlayerXName] = useState('');
  const [playerOName, setPlayerOName] = useState('');
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [socketConnection, setSocketConnection] = useState<Socket | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [isOnlineHost, setIsOnlineHost] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

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

    if (gameMode === 'online_multiplayer' && socketConnection) {
      socketConnection.emit('move', { board: newBoard, xIsNext: !xIsNext, roomCode });
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

  const handleOnlineConnected = (conn: Socket, isHost: boolean, oppName: string, myName: string, code: string) => {
    setSocketConnection(conn);
    setIsOnlineHost(isHost);
    setRoomCode(code);

    if (isHost) {
      setPlayerXName(myName);
      setPlayerOName(oppName);
      setStartingPlayer('X');
      setXIsNext(true);
    } else {
      setPlayerOName(myName);
      setPlayerXName(oppName);
      setStartingPlayer('X');
      setXIsNext(true);
    }
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });

    conn.on('move', (data: any) => {
      setBoard(data.board);
      setXIsNext(data.xIsNext);
    });

    conn.on('reset', (data: any) => {
      setBoard(Array(9).fill(null));
      setScores(data.scores);
    });

    conn.on('newGame', (data: any) => {
      setBoard(Array(9).fill(null));
      setStartingPlayer(data.startingPlayer);
      setXIsNext(data.xIsNext);
    });

    conn.on('opponent_disconnected', () => {
      setAlertMessage('Opponent disconnected!');
    });

    conn.on('disconnect', () => {
      setAlertMessage('Connection lost to server!');
    });
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setScores({ X: 0, O: 0, Draws: 0 });
    if (gameMode === 'online_multiplayer' && socketConnection) {
      socketConnection.emit('reset', { scores: { X: 0, O: 0, Draws: 0 }, roomCode });
    }
  };
  
  const newGame = () => {
    setBoard(Array(9).fill(null));
    if (gameMode === 'offline_multiplayer' || gameMode === 'online_multiplayer' || gameMode === 'offline_computer') {
      const nextStarter = startingPlayer === 'X' ? 'O' : 'X';
      setStartingPlayer(nextStarter);
      setXIsNext(nextStarter === 'X');

      if (gameMode === 'online_multiplayer' && socketConnection) {
        socketConnection.emit('newGame', { startingPlayer: nextStarter, xIsNext: nextStarter === 'X', roomCode });
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
    if (socketConnection) {
      destroySocket();
      setSocketConnection(null);
      setRoomCode('');
    }
  };

  if (showDifficultyMenu) {
    return (
      <DifficultyMenu
        playerXName={playerXName}
        setPlayerXName={setPlayerXName}
        startGame={startGame}
        setShowDifficultyMenu={setShowDifficultyMenu}
      />
    );
  }

  if (!gameMode) {
    return (
      <MainMenu
        playerXName={playerXName}
        setPlayerXName={setPlayerXName}
        playerOName={playerOName}
        setPlayerOName={setPlayerOName}
        setShowDifficultyMenu={setShowDifficultyMenu}
        startGame={startGame}
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
    );
  }

  if (gameMode === 'online_multiplayer' && !socketConnection) {
    return (
      <OnlineMultiplayer goBack={goBackToMenu} onConnected={handleOnlineConnected} />
    );
  }


  return (
    <GameScreen
      gameMode={gameMode}
      difficulty={difficulty}
      playerXName={playerXName}
      playerOName={playerOName}
      scores={scores}
      winner={winner}
      xIsNext={xIsNext}
      board={board}
      winningLine={winningLine}
      handleClick={handleClick}
      resetGame={resetGame}
      newGame={newGame}
      goBackToMenu={goBackToMenu}
      alertMessage={alertMessage}
      setAlertMessage={setAlertMessage}
    />
  );
}
