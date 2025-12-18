import React, { useState } from 'react';
import { submitWord } from '../lib/api';

const PRESET_WORDS = [
    "Strategic", "Fearless", "Relentless", "Results-driven",
    "Game-changer", "Trailblazer", "Visionary", "Bold",
    "Honest", "Inspiring", "Focused", "Strong",
    "Trusted", "Steady", "Sharp", "Fast",
    "Wise", "Driven", "Grounded", "Confident"
];

export const SubmitWord: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Sync Input to find active pills
    const activeWords = inputValue.split(',').map(s => s.trim().toLowerCase()).filter(s => s);

    const handlePillClick = (word: string) => {
        const currentList = inputValue.split(',').map(s => s.trim()).filter(s => s);
        const wordIndex = currentList.findIndex(w => w.toLowerCase() === word.toLowerCase());

        if (wordIndex >= 0) {
            // Remove
            currentList.splice(wordIndex, 1);
        } else {
            // Add
            currentList.push(word);
        }
        setInputValue(currentList.join(', '));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        setIsSubmitting(true);
        const success = await submitWord(inputValue);
        setIsSubmitting(false);

        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                setInputValue("");
                setShowSuccess(false);
            }, 3000);
        } else {
            alert("Failed to submit word.");
        }
    };

    return (
        <div className="bg-black text-white min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Blobs */}
            <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

            <div className="max-w-2xl w-full z-10">
                <div className="glass-card p-8 md:p-12 rounded-3xl text-center relative overflow-hidden">

                    {showSuccess ? (
                        <div className="animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-2">Submitted!</h2>
                            <p className="text-white/60">Thank you for your contribution</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>

                            <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Your Word Matters</h1>
                            <p className="text-white/60 mb-8 max-w-lg mx-auto">Contribute one word that inspires you. Together, we'll create something magical.</p>

                            <div className="mb-8">
                                <label htmlFor="word" className="block text-left text-xs font-semibold uppercase tracking-widest text-white/50 mb-2 pl-1">Your Word(s)</label>
                                <input
                                    type="text"
                                    id="word"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Select words or type them..."
                                    className="w-full bg-black/30 border border-white/10 rounded-2xl px-6 py-4 text-lg font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-white/20"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-semibold text-white/50 mb-4">Or choose power words (multi-select):</p>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {PRESET_WORDS.map(word => {
                                        const isActive = activeWords.includes(word.toLowerCase());
                                        return (
                                            <button
                                                key={word}
                                                type="button"
                                                onClick={() => handlePillClick(word)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${isActive
                                                        ? 'bg-indigo-500/20 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:-translate-y-0.5'
                                                    }`}
                                            >
                                                {word}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !inputValue.trim()}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-lg text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
