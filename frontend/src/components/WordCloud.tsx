import React, { useEffect, useState, useRef } from 'react';
import { fetchWords } from '../lib/api';

interface WordCloudProps {
    isPolling: boolean;
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

export const WordCloud: React.FC<WordCloudProps> = ({ isPolling }) => {
    const [words, setWords] = useState<string[]>([]);
    const [displayWords, setDisplayWords] = useState<{ text: string; style: string }[]>([]);
    const [totalWords, setTotalWords] = useState(0);
    const [uniqueCount, setUniqueCount] = useState(0);
    const prevWordsRef = useRef<string[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        const loadWords = async () => {
            const newWords = await fetchWords();

            // Basic deep compare to avoid useless re-renders
            if (JSON.stringify(newWords) !== JSON.stringify(prevWordsRef.current)) {
                prevWordsRef.current = newWords;
                setWords(newWords);

                // Calculate stats
                setTotalWords(newWords.length);
                const unique = new Set(newWords.map(w => w.toLowerCase().trim()));
                setUniqueCount(unique.size);

                // Map to styles (ensure consistent styling based on word content or index)
                const mapped = newWords.map((w, i) => ({
                    text: w,
                    style: BUBBLE_STYLES[i % BUBBLE_STYLES.length]
                })).reverse(); // Show newest first

                setDisplayWords(mapped);
            }
        };

        if (isPolling) {
            loadWords(); // Initial load
            interval = setInterval(loadWords, 2000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isPolling]);

    return (
        <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col h-full border-t border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/20"></div>

            <div className="flex justify-between items-end mb-6 relative z-10">
                <div>
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        Collected Words
                    </h2>
                    <p className="text-white/40 text-sm mt-1">Live from the audience</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-2xl font-bold text-white" id="totalResponses">{totalWords}</div>
                        <div className="text-xs text-white/40 uppercase tracking-wider">Total</div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-400" id="uniqueWords">{uniqueCount}</div>
                        <div className="text-xs text-indigo-400/60 uppercase tracking-wider">Unique</div>
                    </div>
                </div>
            </div>

            <div className="flex-grow relative min-h-[300px] border border-white/5 rounded-xl bg-black/20 p-4 overflow-hidden">
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
        </div>
    );
};
