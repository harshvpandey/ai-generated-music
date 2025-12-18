import React from 'react';

export const QRDisplay: React.FC = () => {
    // Using the host IP dynamically would be better, but for localhost dev:
    const submitUrl = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/submit`;

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10 w-full flex flex-col items-center">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                    Scan to Join
                </h3>

                <div className="p-3 bg-white rounded-xl shadow-xl shadow-indigo-500/20 qr-glow mb-4">
                    {/* Using a QR code generation service for simplicity, or could use a lib like qrcode.react */}
                    {/* For now, using size 150x150 */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(submitUrl)}&color=000000&bgcolor=FFFFFF`}
                        alt="Scan to submit words"
                        className="w-[150px] h-[150px] object-contain rounded-lg"
                    />
                </div>

                <p className="text-sm text-white/60 mb-2">or visit</p>
                <div className="py-2 px-4 rounded-lg bg-white/5 border border-white/10 text-indigo-300 font-mono text-sm break-all">
                    {submitUrl}
                </div>
            </div>
        </div>
    );
};
