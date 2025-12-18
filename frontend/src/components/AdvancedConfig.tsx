import React, { useState, useEffect } from 'react';
import { fetchWords } from '../lib/api';

interface AdvancedConfigProps {
    isVisible: boolean;
    onConfigChange: (config: { personName: string; occasion: string }) => void;
}

export const AdvancedConfig: React.FC<AdvancedConfigProps> = ({ isVisible, onConfigChange }) => {
    const [personName, setPersonName] = useState("Anish Bhai");
    const [occasion, setOccasion] = useState("Birthday Celebration");
    const [previewText, setPreviewText] = useState("Waiting for words...");

    // We need words to generate the preview. 
    // For simplicity, we might just re-fetch or pass them down. 
    // Let's re-fetch for now to ensure we have latest, or better, pass from parent.
    // Actually, let's keep it simple and just show a placeholder or static if no words, 
    // but ideally this updates with real words.
    // Let's implement a simple prompt preview generator matching the HTML logic.

    useEffect(() => {
        // Notify parent of changes
        onConfigChange({ personName, occasion });
        updatePreview();
    }, [personName, occasion]);

    const updatePreview = async () => {
        // Simplified preview update (would ideally need the top words from parent)
        const words = await fetchWords();
        if (words.length === 0) {
            setPreviewText("Waiting for words...");
            return;
        }

        // Basic frequency count
        const freq: Record<string, number> = {};
        words.forEach(w => {
            const norm = w.toLowerCase();
            freq[norm] = (freq[norm] || 0) + 1;
        });

        const topWords = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1))
            .slice(0, 15)
            .join(', ');

        let text = "";
        if (!personName && !occasion) {
            text = `Create a song for a person. Their qualities are: ${topWords}`;
        } else if (!personName) {
            text = `Create a song for ${occasion}. Their qualities are: ${topWords}`;
        } else if (!occasion) {
            text = `Create a song for ${personName}. Their qualities are: ${topWords}`;
        } else {
            text = `Create a song for ${personName} for their ${occasion}. Their qualities are: ${topWords}`;
        }
        setPreviewText(text);
    };

    if (!isVisible) return null;

    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden mt-6 animate-[scaleIn_0.3s_ease]">
            {/* Blobs for internal depth */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32"></div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>⚙️</span> Create Personalized Song
                </h2>
                <button
                    onClick={() => {
                        if (confirm('Are you sure you want to clear ALL collected words?')) {
                            // Call clear API (need to implement in api.ts or component)
                            fetch('http://localhost:8000/api/words', { method: 'DELETE' }).then(() => window.location.reload());
                        }
                    }}
                    className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider rounded-lg border border-red-500/20 transition-all flex items-center gap-2">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Person Name</label>
                        <input
                            type="text"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="e.g., Anish Bhai"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Occasion</label>
                        <input
                            type="text"
                            value={occasion}
                            onChange={(e) => setOccasion(e.target.value)}
                            placeholder="e.g. Birthday Celebration"
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Prompt Preview</label>
                <div className="bg-black/20 rounded-xl p-4 text-white/80 font-mono text-sm leading-relaxed border border-white/5 min-h-[80px]">
                    {previewText}
                </div>
            </div>
        </div>
    );
};
