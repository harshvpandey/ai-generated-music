import React from 'react';

interface QRDisplayProps {
    totalWords: number;
    uniqueCount: number;
}

export const QRDisplay: React.FC<QRDisplayProps> = ({ totalWords, uniqueCount }) => {


    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center h-full">
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold mb-1 text-white">Scan & Share</h2>
                <p className="text-lg text-white/60">Describe Anish Bhai in one word</p>
            </div>

            <div className="flex-1 flex items-center justify-center relative pt-4 pb-4">
                <div className="qr-glow rounded-2xl p-1 bg-gradient-to-br from-indigo-500 to-purple-500 relative z-10">
                    <div className="bg-white p-4 rounded-xl">
                        <img
                            src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://jioaimusic.netlify.app/word-submit.html&color=4f46e5"
                            alt="QR Code"
                            className="w-48 h-48 block object-contain"
                        />
                    </div>
                </div>
            </div>

            <div className="w-full mt-auto pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                    <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-indigo-400">{totalWords}</p>
                        <p className="text-xs text-white/50 font-medium uppercase tracking-wide">Responses</p>
                    </div>
                    <div className="h-8 w-px bg-white/10"></div>
                    <div className="text-center flex-1">
                        <p className="text-2xl font-bold text-purple-400">{uniqueCount}</p>
                        <p className="text-xs text-white/50 font-medium uppercase tracking-wide">Unique Words</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
