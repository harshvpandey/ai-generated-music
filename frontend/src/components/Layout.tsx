import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="bg-black text-white relative min-h-screen">
            {/* Background Blobs */}
            <div className="bg-glowing-effect"></div>
            <div className="blob blob-1"></div>
            <div className="blob blob-2"></div>
            <div className="blob blob-3"></div>

            {/* Main Content */}
            <div className="min-h-screen w-full p-4 lg:p-6 flex flex-col relative z-10">
                {children}
            </div>
        </div>
    );
};
