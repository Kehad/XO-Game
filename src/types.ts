export type PlayerType = 'X' | 'O' | null;
export type GameMode = 'offline_computer' | 'offline_multiplayer' | 'online_multiplayer' | null;
export type Difficulty = 'easy' | 'medium' | 'hard' | null;

export interface GameState {
    board: PlayerType[];
    currentPlayer: PlayerType;
    winner: PlayerType | 'draw' | null;
    isGameOver: boolean;
    isXNext: boolean;
}
