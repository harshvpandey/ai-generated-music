import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex flex-col md:flex-row items-center justify-center mb-6 gap-4 md:gap-0">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-4xl font-extrabold tracking-wide">JioAI Music</h1>
                    <p className="text-lg text-white/60 font-medium tracking-wider">Birthday Celebration</p>
                </div>
            </div>
        </header>
    );
};
