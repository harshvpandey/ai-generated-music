import React, { useRef, useState } from 'react';
import { Song } from '../types';

interface AudioPlayerProps {
    song: Song;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ song }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Pause all other audios? (Optional enhancement)
            document.querySelectorAll('audio').forEach(el => {
                if (el !== audioRef.current) (el as HTMLAudioElement).pause();
            });
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleEnded = () => setIsPlaying(false);

    const title = song.title || "Untitled Song";
    const tags = song.tags || "Custom Song";
    const image = song.imageUrl; // Assumes standardized by parent
    const audioSrc = song.audioUrl;

    return (
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 bg-white/5 border border-white/5 transition-all hover:bg-white/10 relative group mb-3">
            {/* Art */}
            <div
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex-shrink-0 overflow-hidden relative border border-white/10 cursor-pointer"
                onClick={togglePlay}
            >
                {image ? (
                    <img src={image} className="w-full h-full object-cover" alt={title} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                )}

                {/* Play/Pause Overlay */}
                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                        {isPlaying ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="flex-grow min-w-0">
                <h4 className="font-bold text-white truncate pr-8">{title}</h4>
                <p className="text-xs text-indigo-300 truncate">{tags}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                {audioSrc && (
                    <a
                        href={audioSrc}
                        download
                        className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        title="Download"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </a>
                )}
            </div>

            {audioSrc && (
                <audio
                    ref={audioRef}
                    src={audioSrc}
                    onEnded={handleEnded}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            )}
        </div>
    );
};
