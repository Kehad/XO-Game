"use client";
import type { PlayerType } from '../types';
import { Square } from './Square';

interface BoardProps {
    board: PlayerType[];
    winningLine: number[] | null;
    onSquareClick: (index: number) => void;
}

export function Board({ board, winningLine, onSquareClick }: BoardProps) {
    return (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-5 bg-gray-800/50 rounded-3xl border border-gray-700/50 shadow-2xl backdrop-blur-sm">
            {board.map((square, index) => (
                <Square
                    key={index}
                    value={square}
                    onClick={() => onSquareClick(index)}
                    isWinningSquare={winningLine?.includes(index) ?? false}
                />
            ))}
        </div>
    );
}
