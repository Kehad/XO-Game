import type { PlayerType, Difficulty } from './types';

export function calculateWinner(squares: PlayerType[]): { winner: PlayerType | 'Draw' | null, line: number[] | null } {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return { winner: squares[a], line: lines[i] };
        }
    }
    if (!squares.includes(null)) {
        return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
}

export function getBestMove(squares: PlayerType[], computerPlayer: PlayerType, difficulty: Difficulty = 'hard'): number {
    const opponent = computerPlayer === 'X' ? 'O' : 'X';
    const availableSpots = squares.map((s, i) => s === null ? i : -1).filter(i => i !== -1);
    if (availableSpots.length === 0) return -1;
    if (difficulty === 'easy' || (difficulty === 'medium' && Math.random() < 0.5)) {
        return availableSpots[Math.floor(Math.random() * availableSpots.length)];
    }
    function minimax(board: PlayerType[], depth: number, isMaximizing: boolean): number {
        const { winner } = calculateWinner(board);
        if (winner === computerPlayer) return 10 - depth;
        if (winner === opponent) return depth - 10;
        if (winner === 'Draw') return 0;
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = computerPlayer;
                    const score = minimax(board, depth + 1, false);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!board[i]) {
                    board[i] = opponent;
                    const score = minimax(board, depth + 1, true);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
    if (squares.filter(s => s !== null).length === 0) return 4;
    if (squares.filter(s => s !== null).length === 1 && squares[4] === opponent) {
        const corners = [0, 2, 6, 8];
        return corners[Math.floor(Math.random() * corners.length)];
    }
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
        if (!squares[i]) {
            squares[i] = computerPlayer;
            const score = minimax(squares, 0, false);
            squares[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}
