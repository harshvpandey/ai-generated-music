import React, { useEffect, useState, useRef } from 'react';

interface WordCloudProps {
    words: string[];
    onGenerate: () => void;
    onToggleConfig: () => void;
    isConfigOpen: boolean;
}

const BUBBLE_STYLES = [
    "text-4xl font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20",
    "text-2xl font-medium text-purple-300 bg-purple-500/10 border border-purple-500/20",
    "text-3xl font-semibold text-white bg-white/5 border border-white/10",
    "text-xl text-indigo-200 bg-indigo-500/5 border border-indigo-500/10",
    "text-4xl font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20",
    "text-2xl font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20",
    "text-xl text-white/70 bg-white/5",
    "text-3xl font-semibold text-white bg-white/5 border border-white/10"
];

export const WordCloud: React.FC<WordCloudProps> = ({ words, onGenerate, onToggleConfig, isConfigOpen }) => {
    const [displayWords, setDisplayWords] = useState<{ text: string; style: string }[]>([]);
    const prevWordsRef = useRef<string[]>([]);

    useEffect(() => {
        // Basic deep compare to avoid useless re-renders/animations
        if (JSON.stringify(words) !== JSON.stringify(prevWordsRef.current)) {
            prevWordsRef.current = words;

            // Map to styles (ensure consistent styling based on word content or index)
            const mapped = words.map((w, i) => ({
                text: w,
                style: BUBBLE_STYLES[i % BUBBLE_STYLES.length]
            })).reverse(); // Show newest first

            setDisplayWords(mapped);
        }
    }, [words]);

    return (
        <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col h-full border-t border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20"></div>

            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Anish Bhai's Superpowers
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Words from leaders</p>
                </div>
            </div>

            <div className="flex-grow relative min-h-[300px] rounded-xl p-4 overflow-hidden mb-4">
                {displayWords.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/30">
                        <p>Waiting for words...</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap items-center justify-center gap-3 content-center h-full overflow-y-auto playlist-scroll p-2">
                        {displayWords.map((item, idx) => (
                            <span key={`${item.text}-${idx}`} className={`word-cloud-word ${item.style}`}>
                                {item.text}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Controls */}
            <div className="pt-4 border-t border-white/10 flex gap-3 z-10">
                <button
                    onClick={onGenerate}
                    className="flex-1 bg-white text-black py-3 px-4 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-white/20"
                >
                    <span>🎵</span> Generate
                </button>
                <button
                    onClick={onToggleConfig}
                    className="bg-white/5 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-center gap-2 text-sm backdrop-blur-md"
                >
                    <span>⚙️</span> Advance <span className={`transition-transform duration-300 ${isConfigOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
            </div>
        </div>
    );
};
