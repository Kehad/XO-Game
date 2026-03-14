import { useState, useEffect } from "react";
import { initializeSocket, destroySocket } from "../../api/socket";
import type { Socket } from "socket.io-client";
import AlertModal from "../alert";

interface Props {
    goBack: () => void;
    onConnected: (socket: Socket, isHost: boolean, opponentName: string, myName: string, roomCode: string) => void;
}

const OnlineMultiplayer = ({ goBack, onConnected }: Props) => {
    const [view, setView] = useState<'menu' | 'create' | 'join' | 'waiting'>('menu');
    const [roomCode, setRoomCode] = useState('');
    const [playerName, setPlayerName] = useState('create');
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        return () => destroySocket();
    }, []);

    const generateRoomCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCancel = () => {
        setView('menu');
        setError('');
        destroySocket();
    };

   const setupSocketEvents = (socket: Socket, currentRoomCode: string, iAmHost: boolean) => {
    
    socket.on('player_joined', (data) => {
        // I am the host, a guest just joined my room
        if (iAmHost) {
            // Send my name back to the guest so they know who I am
            socket.emit('player_info', { 
                roomCode: currentRoomCode, 
                name: playerName 
            });
            
            // Trigger the transition to the Game Board
            onConnected(socket, true, data.name, playerName, currentRoomCode);
        }
    });

    socket.on('player_info', (data) => {
        // I am the guest, the host just sent me their name
        if (!iAmHost) {
            onConnected(socket, false, data.name, playerName, currentRoomCode);
        }
    });

    socket.on('connect_error', (err) => {
        setError('Connection error: ' + err.message);
        setView('menu');
        destroySocket();
    });
};

    const handleCreate = () => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }
        setError('');
        const code = generateRoomCode();
        setRoomCode(code);
        setIsHost(true);
        setView('waiting');

        const socket = initializeSocket();
        socket.once('connect', () => {
            socket.emit('join_room', { roomCode: code, name: playerName, isHost: true });
        });

        setupSocketEvents(socket, code, true);
    };

    const handleJoin = () => {
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!roomCode.trim() || roomCode.length < 6) {
            setError('Please enter a valid 6-character room code');
            return;
        }
        setError('');
        setIsHost(false);
        setView('waiting');

        const socket = initializeSocket();
        socket.once('connect', () => {
            socket.emit('join_room', { roomCode: roomCode, name: playerName, isHost: false });
        });

        setupSocketEvents(socket, roomCode, false);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans p-4 selection:bg-cyan-500/30">
            <button
                onClick={goBack}
                className="absolute top-4 left-4 sm:top-8 sm:left-8 text-gray-400 hover:text-white flex items-center gap-2 transition-colors font-medium bg-gray-800/50 py-2 px-4 rounded-full border border-gray-700/50 shadow-sm hover:bg-gray-700"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Menu
            </button>

            <div className="max-w-md w-full flex flex-col items-center gap-8">
                <div className="text-center space-y-2 mb-4">
                    <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
                        Multiplayer
                    </h1>
                    <p className="text-gray-400 font-medium tracking-wide uppercase text-sm h-5 transition-all">
                        {view === 'menu' && 'Play with friends online'}
                        {view === 'create' && 'Create a new room'}
                        {view === 'join' && 'Join an existing room'}
                        {view === 'waiting' && 'Waiting for opponent'}
                    </p>
                </div>

                {view === 'menu' && (
                    <div className="flex flex-col gap-4 w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <button
                            onClick={() => setView('create')}
                            className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Create Game
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </button>
                        <button
                            onClick={() => setView('join')}
                            className="bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/50 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-200 active:scale-95 text-xl flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                                Join Game
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                        </button>
                    </div>
                )}

                {(view === 'create' || view === 'join') && (
                    <div className="flex flex-col gap-5 w-full px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="space-y-4 bg-gray-800/50 p-6 rounded-3xl border border-gray-700/50 backdrop-blur-sm shadow-xl">
                            <div className="space-y-1">
                                <label className="text-sm text-gray-400 font-medium ml-1">Your Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    maxLength={15}
                                    className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                />
                            </div>

                            {view === 'join' && (
                                <div className="space-y-1">
                                    <label className="text-sm text-gray-400 font-medium ml-1">Room Code</label>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        maxLength={6}
                                        className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 font-mono tracking-widest uppercase text-center focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold"
                                    />
                                </div>
                            )}

                            {error && <p className="text-red-400 text-sm text-center font-medium animate-pulse pt-2">{error}</p>}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={view === 'create' ? handleCreate : handleJoin}
                                className={`flex-[2] text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${view === 'create'
                                    ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/25'
                                    : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25'
                                    }`}
                            >
                                {view === 'create' ? 'Create' : 'Join'} Room
                                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </button>
                        </div>
                    </div>
                )}

                {view === 'waiting' && (
                    <div className="flex flex-col items-center gap-6 w-full px-4 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-gray-800/80 p-8 rounded-3xl border border-gray-700/50 flex flex-col items-center gap-8 w-full relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10 flex flex-col items-center gap-3 text-center w-full">
                                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest">Share this Room Code</p>
                                <div className="flex items-center gap-3 justify-center w-full">
                                    <div className="bg-gray-900 border border-gray-700/80 px-8 py-4 rounded-2xl shadow-inner flex-1 max-w-[200px]">
                                        <span className="text-4xl font-mono font-bold tracking-[0.2em] text-white drop-shadow-md">{roomCode}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(roomCode);
                                            setAlertMessage("Room code copied to clipboard!");
                                        }}
                                        className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl transition-all text-blue-400 hover:text-white group active:scale-95"
                                        title="Copy to clipboard"
                                    >
                                        <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                                    </button>
                                </div>
                            </div>

                            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>

                            <div className="relative z-10 flex flex-col items-center gap-5 w-full">
                                <div className="relative">
                                    <div className="w-14 h-14 border-4 border-gray-700/50 border-t-blue-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-blue-500/20 rounded-full animate-ping"></div>
                                    </div>
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-white text-lg font-bold">
                                        {isHost ? 'Waiting for opponent...' : 'Connecting to room...'}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                        {isHost ? 'Ask your friend to join using the code above' : 'Please wait while we establish a connection'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => { setView('menu'); setError(''); }}
                            className="mt-2 text-red-400 hover:text-red-300 transition-colors font-semibold border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 py-3 px-8 rounded-xl active:scale-95 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Cancel Matchmaking
                        </button>
                    </div>
                )}
            </div>

            {alertMessage && (
                <AlertModal alertMessage={alertMessage} setAlertMessage={setAlertMessage} type="success" title="Copied!" />
            )}
        </div>
    );
};

export default OnlineMultiplayer;