import React, { useState, useEffect } from 'react';
import { Song, GeneratePayload } from '../types';
import { generateSong, pollTaskStatus, fetchWords } from '../lib/api';
import { AudioPlayer } from './AudioPlayer';

interface SongGeneratorProps {
    onGenerationStart: () => void;
    onGenerationEnd: () => void;
}

export const SongGenerator: React.FC<SongGeneratorProps> = ({ onGenerationStart, onGenerationEnd }) => {
    const [songs, setSongs] = useState<Song[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("Initializing...");
    const [error, setError] = useState<string | null>(null);

    // Generate Prompt Logic
    const generatePrompt = (words: string[]) => {
        if (words.length === 0) return "";
        const coreTraits = words.join(", ");
        return `Create a song for Anish Bhai for their Birthday Celebration. Their qualities are: ${coreTraits}`;
    };

    const handleGenerate = async () => {
        setError(null);
        setIsLoading(true);
        setLoadingStatus("Collecting words...");
        onGenerationStart();

        try {
            const words = await fetchWords();
            if (words.length === 0) {
                throw new Error("No words collected yet! Submit some words first.");
            }

            const prompt = generatePrompt(words);
            setLoadingStatus("Sending to AI...");

            const payload: GeneratePayload = {
                prompt,
                customMode: false,
                instrumental: false,
                model: "V5" // Using V5 as per standard
            };

            const taskId = await generateSong(payload);

            if (!taskId) throw new Error("Failed to start generation");

            setLoadingStatus("Queued...");

            // Start Polling
            const pollInterval = setInterval(async () => {
                try {
                    const taskData = await pollTaskStatus(taskId);

                    if (taskData.status && taskData.status !== 'SUCCESS' && taskData.status !== 'FAILED') {
                        setLoadingStatus(taskData.status.replace(/_/g, " "));
                    }

                    if (taskData.status === 'SUCCESS' || taskData.status === 'FIRST_SUCCESS') {
                        // Robust song extraction
                        const rawSongs = taskData.sunoData || taskData.response?.sunoData || taskData.data?.response?.sunoData || [];

                        // Standardize keys (API inconsistent: audio_url vs audioUrl)
                        const standardizedSongs: Song[] = rawSongs.map((s: any) => ({
                            id: s.id,
                            title: s.title,
                            tags: s.tags,
                            // Handle both snake_case and camelCase
                            imageUrl: s.imageUrl || s.image_url,
                            audioUrl: s.audioUrl || s.audio_url,
                            status: s.status || 'complete',
                            duration: s.duration
                        }));

                        const completeSongs = standardizedSongs.filter(s => s.status === 'complete' || s.audioUrl);

                        if (completeSongs.length > 0) {
                            clearInterval(pollInterval);
                            setSongs(prev => [...completeSongs, ...prev]); // Add new songs to top
                            setIsLoading(false);
                            onGenerationEnd();
                        }
                    } else if (taskData.status === 'FAILED') {
                        clearInterval(pollInterval);
                        throw new Error(taskData.errorMessage || taskData.error_message || "Generation failed on server");
                    }
                } catch (pollErr: any) {
                    console.error("Polling error", pollErr);
                    // Don't stop polling on transient network errors, but stop on generation failure
                    if (pollErr.message.includes('failed')) {
                        clearInterval(pollInterval);
                        setError(pollErr.message);
                        setIsLoading(false);
                        onGenerationEnd();
                    }
                }
            }, 3000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
            setIsLoading(false);
            onGenerationEnd();
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 lg:p-8 relative overflow-hidden h-full flex flex-col">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none"></div>

            <div className="relative z-10 mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
                    AI Song Generator
                </h2>
                <p className="text-white/40 text-sm mt-1">Turn collected words into an anthem</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm">
                    {error}
                </div>
            )}

            {/* Generation Area */}
            <div className="mb-6">
                {!isLoading ? (
                    <button
                        onClick={handleGenerate}
                        className="w-full py-4 rounded-xl bg-gradient-primary font-bold text-lg text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Generate Anthem
                    </button>
                ) : (
                    <div className="w-full py-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center gap-3 text-indigo-300">
                        <svg className="animate-spin h-5 w-5 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="font-mono text-sm uppercase tracking-widest">{loadingStatus}</span>
                    </div>
                )}
            </div>

            {/* Results List */}
            <div className="flex-grow overflow-y-auto playlist-scroll pr-2 -mr-2">
                {songs.length === 0 && !isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20 min-h-[200px]">
                        <svg className="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                        <p>Songs will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {songs.map(song => (
                            <AudioPlayer key={song.id} song={song} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
