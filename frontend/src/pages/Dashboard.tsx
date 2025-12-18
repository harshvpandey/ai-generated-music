
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Header } from '../components/Header';
import { WordCloud } from '../components/WordCloud';
import { QRDisplay } from '../components/QRDisplay';
import { SongGenerator } from '../components/SongGenerator';
import { AdvancedConfig } from '../components/AdvancedConfig';
import { fetchWords, generateSong, pollTaskStatus } from '../lib/api';
import { Song, GeneratePayload } from '../types';

export const Dashboard: React.FC = () => {
    // Word State
    const [words, setWords] = useState<string[]>([]);
    const [isWordPolling, setIsWordPolling] = useState(true);

    // Generation State
    const [songs, setSongs] = useState<Song[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingStatus, setLoadingStatus] = useState("Initializing...");
    const [error, setError] = useState<string | null>(null);

    // Config State
    const [showConfig, setShowConfig] = useState(false);
    const [config, setConfig] = useState({ personName: "Anish Bhai", occasion: "Birthday Celebration" });

    // Poll for words
    useEffect(() => {
        let interval: NodeJS.Timeout;
        const load = async () => {
            try {
                const newWords = await fetchWords();
                // Simple equality check logic could be here, but React state check handles it mostly
                setWords(newWords);
            } catch (e) { console.error(e); }
        };

        if (isWordPolling) {
            load();
            interval = setInterval(load, 2000);
        }
        return () => clearInterval(interval);
    }, [isWordPolling]);

    // Stats
    const totalWords = words.length;
    const uniqueCount = new Set(words.map(w => w.toLowerCase().trim())).size;

    // Generation Logic
    const handleGenerate = async () => {
        if (words.length === 0) {
            alert("No words collected yet!");
            return;
        }

        setError(null);
        setIsGenerating(true);
        setIsWordPolling(false); // Pause polling
        setLoadingStatus("Creating Prompt...");

        try {
            // Construct Prompt
            // Find top words for prompt
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

            let prompt = "";
            // Determine template
            const { personName, occasion } = config;
            if (!personName && !occasion) prompt = `Create a song with qualities: ${topWords}`;
            else if (!personName) prompt = `Create a song for ${occasion} with qualities: ${topWords}`;
            else if (!occasion) prompt = `Create a song for ${personName} with qualities: ${topWords}`;
            else prompt = `Create a song for ${personName} for their ${occasion}. Their qualities are: ${topWords}`;

            setLoadingStatus("Sending to AI...");

            const payload: GeneratePayload = {
                prompt,
                customMode: false,
                instrumental: false,
                model: "V5"
            };

            const taskId = await generateSong(payload);
            if (!taskId) throw new Error("Failed to start generation");

            setLoadingStatus("Queued...");

            // Start Polling Task
            const pollInterval = setInterval(async () => {
                try {
                    const taskData = await pollTaskStatus(taskId);
                    if (taskData.status && taskData.status !== 'SUCCESS' && taskData.status !== 'FAILED') {
                        setLoadingStatus(taskData.status.replace(/_/g, " "));
                    }

                    if (taskData.status === 'SUCCESS' || taskData.status === 'FIRST_SUCCESS') {
                        // Extract Songs
                        const rawSongs = taskData.sunoData || taskData.response?.sunoData || taskData.data?.response?.sunoData || [];
                        const newSongs: Song[] = rawSongs.map((s: any) => ({
                            id: s.id,
                            title: s.title || `Song for ${personName}`,
                            tags: s.tags,
                            imageUrl: s.imageUrl || s.image_url,
                            audioUrl: s.audioUrl || s.audio_url,
                            status: s.status || 'complete',
                            duration: s.duration
                        })).filter((s: Song) => s.audioUrl);

                        if (newSongs.length > 0) {
                            clearInterval(pollInterval);
                            setSongs(prev => [...newSongs, ...prev]);
                            setIsGenerating(false);
                            setIsWordPolling(true); // Resume
                        }
                    } else if (taskData.status === 'FAILED') {
                        clearInterval(pollInterval);
                        throw new Error(taskData.errorMessage || "Generation Failed");
                    }
                } catch (pollErr: any) {
                    console.error(pollErr);
                    if (pollErr.message.includes('failed')) {
                        clearInterval(pollInterval);
                        setError(pollErr.message);
                        setIsGenerating(false);
                        setIsWordPolling(true);
                    }
                }
            }, 3000);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
            setIsGenerating(false);
            setIsWordPolling(true);
        }
    };

    return (
        <Layout>
            <Header />

            <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0">

                {/* Left: Scan & Share (3 cols) */}
                <div className="lg:col-span-3 flex flex-col h-full">
                    <QRDisplay totalWords={totalWords} uniqueCount={uniqueCount} />
                </div>

                {/* Middle: Word Cloud (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full min-h-[500px] lg:min-h-0">
                    <WordCloud
                        words={words}
                        isConfigOpen={showConfig}
                        onGenerate={handleGenerate}
                        onToggleConfig={() => setShowConfig(!showConfig)}
                    />
                </div>

                {/* Right: Song Results (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full min-h-[400px]">
                    <SongGenerator
                        songs={songs}
                        isLoading={isGenerating}
                        loadingStatus={loadingStatus}
                        error={error}
                    />
                </div>

                {/* Bottom: Advanced Config (Toggleable) */}
                <div className="lg:col-span-12">
                    <AdvancedConfig
                        isVisible={showConfig}
                        onConfigChange={setConfig}
                    />
                </div>

            </div>
        </Layout>
    );
};
