import React from 'react';
import { Song } from '../types';
import { AudioPlayer } from './AudioPlayer';

interface SongGeneratorProps {
    songs: Song[];
    isLoading: boolean;
    loadingStatus: string;
    error: string | null;
}

export const SongGenerator: React.FC<SongGeneratorProps> = ({ songs, isLoading, loadingStatus, error }) => {
    return (
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden h-full flex flex-col min-h-[400px]">

            {/* Loading Overlay */}
            {isLoading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 rounded-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white font-bold animate-pulse">Creating Magic...</p>
                    <p className="text-white/60 text-sm mt-2 font-mono">{loadingStatus}</p>
                </div>
            )}

            {/* Error Overlay */}
            {error && (
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-50 rounded-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
                    <p className="text-white/70 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors"
                    >
                        Refresh
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-4 flex-shrink-0">
                <h2 className="text-xl font-bold mb-1 text-white">Anish Shah's Song</h2>
                <p className="text-sm text-white/60">Powered by your words</p>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {songs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative mb-6 group cursor-default">
                            <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden shadow-2xl relative">
                                <div className="absolute inset-0 bg-black/10"></div>
                                <div className="w-full h-full flex items-center justify-center relative z-10">
                                    <svg className="w-20 h-20 text-white/90 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 mt-4 text-center">Your Song Awaits</h3>
                            <p className="text-white/50 text-sm max-w-[200px] text-center mx-auto">
                                Click Generate to create a masterpiece from the collected words.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto playlist-scroll pr-2">
                        {songs.map(song => (
                            <AudioPlayer key={song.id} song={song} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

