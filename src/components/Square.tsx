"use client";
import type { PlayerType } from '../types';

interface SquareProps {
    value: PlayerType;
    onClick: () => void;
    isWinningSquare: boolean;
}

export function Square({ value, onClick, isWinningSquare }: SquareProps) {
    return (
        <button
            className={`h-24 w-24 sm:h-32 sm:w-32 bg-gray-800 border-2 border-gray-700 rounded-xl text-5xl sm:text-7xl font-bold flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg
        ${!value ? 'hover:bg-gray-700' : ''}
        ${isWinningSquare ? 'bg-green-600/20 border-green-500 shadow-green-500/50 scale-105' : ''}
        ${value === 'X' ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]' : ''}
        ${value === 'O' ? 'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.8)]' : ''}
      `}
            onClick={onClick}
            disabled={!!value}
        >
            {value && (
                <span className="animate-[popIn_0.2s_ease-out]">
                    {value}
                </span>
            )}
        </button>
    );
}
