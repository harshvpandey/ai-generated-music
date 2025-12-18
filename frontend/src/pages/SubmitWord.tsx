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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans text-white bg-black w-full">
            {/* Blobs */}
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>

            <div className="relative z-10 w-full max-w-[700px]">
                <div className="glass-card-dark p-8 md:p-12 rounded-[2rem] text-center relative overflow-hidden flex flex-col items-center">

                    {showSuccess ? (
                        <div className="w-full animate-[scaleIn_0.5s_ease]">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-2xl font-bold mb-2">Submitted!</div>
                            <div className="text-white/60">Thank you for your contribution</div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
                            <div className="w-[50px] h-[50px] bg-gradient-primary rounded-full flex items-center justify-center mb-6">
                                <svg className="w-[25px] h-[25px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>

                            <h1 className="text-[clamp(2rem,5vw,2.5rem)] font-extrabold mb-2 text-gradient text-center">Your Word Matters</h1>
                            <p className="text-center text-[clamp(1rem,2vw,1.1rem)] text-white/60 mb-8 max-w-[90%] leading-relaxed">
                                Contribute one word that inspires you. Together, we'll create something magical.
                            </p>

                            <div className="w-full mb-8">
                                <label htmlFor="word" className="block w-full text-left text-[0.9rem] font-semibold text-white/70 uppercase tracking-widest mb-3">Your Word(s)</label>
                                <input
                                    type="text"
                                    id="word"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Select words or type them..."
                                    className="w-full p-5 md:p-6 text-[16px] md:text-[1.5rem] font-semibold font-sans bg-black/30 border-2 border-white/10 rounded-2xl text-white transition-all focus:outline-none focus:border-indigo-500/50 focus:bg-black/50 focus:shadow-[0_0_0_4px_rgba(99,102,241,0.1)] placeholder:text-white/20"
                                    autoComplete="off"
                                />
                            </div>

                            <div className="w-full mb-8">
                                <span className="block w-full text-center text-[0.9rem] font-semibold text-white/50 mb-4">Or choose power words (multi-select):</span>
                                <div className="flex flex-wrap justify-center gap-3 w-full">
                                    {PRESET_WORDS.map(word => {
                                        const isActive = activeWords.includes(word.toLowerCase());
                                        return (
                                            <button
                                                key={word}
                                                type="button"
                                                onClick={() => handlePillClick(word)}
                                                className={`px-4 py-2.5 rounded-[2rem] text-[0.9rem] font-medium border transition-all user-select-none ${isActive
                                                    ? 'bg-indigo-500/20 border-[#6366f1] text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                                    : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15 hover:-translate-y-[2px] hover:border-indigo-500/30'
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
                                className="w-full p-5 text-[1.2rem] font-bold font-sans bg-gradient-primary border-none rounded-2xl text-white cursor-pointer transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:-translate-y-[2px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
