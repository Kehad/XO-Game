import type { PlayerType } from '../types';

interface GameStatusProps {
    winner: PlayerType | 'Draw' | null;
    xIsNext: boolean;
    playerXName?: string;
    playerOName?: string;
    isVsComputer?: boolean;
}

export function GameStatus({ winner, xIsNext, playerXName, playerOName, isVsComputer }: GameStatusProps) {
    const xName = playerXName?.trim() ? `${playerXName.trim()} (X)` : 'X';
    const oName = isVsComputer ? 'Computer (O)' : playerOName?.trim() ? `${playerOName.trim()} (O)` : 'O';

    const winnerName = winner === 'X' ? xName : oName;
    const winnerColor = winner === 'X' ? 'text-cyan-400' : 'text-pink-400';

    const nextTurnName = xIsNext ? xName : oName;
    const nextTurnColor = xIsNext ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]' : 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.5)]';

    return (
        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 py-4 px-8 rounded-2xl shadow-xl min-w-[280px] text-center transform transition-all">
            {winner ? (
                <div className="text-2xl font-bold animate-pulse">
                    {winner === 'Draw' ? (
                        <span className="text-yellow-400">It's a Draw! 🤝</span>
                    ) : (
                        <span className="flex flex-col sm:flex-row items-center justify-center gap-2">
                            <span className={winnerColor}>
                                {winnerName}
                            </span>
                            <span className="text-white">Wins! 🎉</span>
                        </span>
                    )}
                </div>
            ) : (
                <div className="text-xl font-medium flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-gray-300">
                    Next Turn:
                    <span className={`text-3xl font-bold ${nextTurnColor}`}>
                        {nextTurnName}
                    </span>
                </div>
            )}
        </div>
    );
}
