interface ScoreboardProps {
    scores: { X: number; O: number; Draws: number };
    playerXName: string;
    playerOName: string;
    isVsComputer: boolean;
}

export function Scoreboard({ scores, playerXName, playerOName, isVsComputer }: ScoreboardProps) {
    const xName = playerXName?.trim() ? playerXName.trim() : 'Player X';
    const oName = playerOName?.trim() ? playerOName.trim() : isVsComputer ? 'Computer' : 'Player O';

    return (
        <div className="flex justify-center gap-3 w-full mb-2">
            <div className="flex-1 bg-gray-800/80 backdrop-blur-sm border border-cyan-500/50 rounded-2xl py-3 px-2 text-center shadow-[0_0_15px_rgba(34,211,238,0.1)] flex flex-col justify-center transform transition-all hover:scale-105">
                <p className="text-cyan-400 text-xs sm:text-sm font-bold truncate uppercase tracking-wider">{xName}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{scores.X}</p>
            </div>
            <div className="flex-1 bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-2xl py-3 px-2 text-center flex flex-col justify-center transform transition-all hover:scale-105">
                <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Draws</p>
                <p className="text-3xl font-extrabold text-white mt-1">{scores.Draws}</p>
            </div>
            <div className="flex-1 bg-gray-800/80 backdrop-blur-sm border border-pink-500/50 rounded-2xl py-3 px-2 text-center shadow-[0_0_15px_rgba(244,114,182,0.1)] flex flex-col justify-center transform transition-all hover:scale-105">
                <p className="text-pink-400 text-xs sm:text-sm font-bold truncate uppercase tracking-wider">{oName}</p>
                <p className="text-3xl font-extrabold text-white mt-1">{scores.O}</p>
            </div>
        </div>
    );
}
