import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { WordCloud } from '../components/WordCloud';
import { QRDisplay } from '../components/QRDisplay';
import { SongGenerator } from '../components/SongGenerator';

export const Dashboard: React.FC = () => {
    const [isWordPolling, setIsWordPolling] = useState(true);

    return (
        <Layout>
            <Header />

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

                {/* Left Column: Word Cloud (Dynamic Height) */}
                <div className="lg:col-span-8 flex flex-col gap-6 min-h-[500px] lg:min-h-0">
                    <WordCloud isPolling={isWordPolling} />
                </div>

                {/* Right Column: QR & Generator */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="h-auto">
                        <QRDisplay />
                    </div>
                    <div className="flex-grow min-h-[400px]">
                        <SongGenerator
                            onGenerationStart={() => setIsWordPolling(false)}
                            onGenerationEnd={() => setIsWordPolling(true)}
                        />
                    </div>
                </div>

            </div>
        </Layout>
    );
};
