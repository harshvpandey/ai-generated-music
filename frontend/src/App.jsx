import { useState, useEffect } from 'react';
import GenerationForm from './components/GenerationForm';
import SongResult from './components/SongResult';
import { pollTaskStatus } from './api';

function App() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pollingTasks, setPollingTasks] = useState([]);
  const [colorScheme, setColorScheme] = useState('nebula');
  const [initialPrompt, setInitialPrompt] = useState('');

  // Read prompt from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const promptParam = urlParams.get('prompt');
    if (promptParam) {
      setInitialPrompt(decodeURIComponent(promptParam));
      // Clean URL after reading the parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Apply color scheme
  useEffect(() => {
    document.documentElement.setAttribute('data-scheme', colorScheme);
  }, [colorScheme]);

  // Polling effect
  useEffect(() => {
    if (pollingTasks.length === 0) return;

    const interval = setInterval(async () => {
      for (const taskId of pollingTasks) {
        try {
          const response = await pollTaskStatus(taskId);

          if (response.status === 'success' && response.data && response.data.data) {
            const taskData = response.data.data;
            // Check if task is complete
            if (taskData.status === 'SUCCESS' || taskData.status === 'FIRST_SUCCESS') {
              const songs = taskData.response?.sunoData || [];

              // Only add songs that are actually complete (not still processing)
              const completeSongs = songs.filter(song =>
                song.status === 'complete' || song.audio_url
              );

              if (completeSongs.length > 0) {
                setResults(prev => {
                  // Remove any existing songs with the same IDs to avoid duplicates
                  const existingIds = new Set(prev.map(s => s.id));
                  const newSongs = completeSongs.filter(s => !existingIds.has(s.id));
                  return [...newSongs, ...prev];
                });
              }

              // Stop polling when task status is SUCCESS (all songs complete)
              if (taskData.status === 'SUCCESS') {
                setPollingTasks(prev => prev.filter(id => id !== taskId));
              }
            }
          }
        } catch (err) {
          console.error(`Polling error for task ${taskId}:`, err);
          // Remove task from polling on error to prevent infinite loop
          setPollingTasks(prev => prev.filter(id => id !== taskId));
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [pollingTasks]);

  const handleSuccess = (response) => {
    setLoading(false);
    if (response.data && response.data.data) {
      const taskData = response.data.data;
      const taskId = taskData.taskId;
      if (taskId) {
        setPollingTasks(prev => [...prev, taskId]);
        setResults(prev => [{
          taskId,
          status: 'pending',
          title: 'Generating...',
          id: taskId
        }, ...prev]);
      }
    }
  };

  const handleError = (err) => {
    setError(err.message);
    setLoading(false);
  };

  const handleStart = () => {
    setLoading(true);
    setError(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      {/* Navbar */}
      <nav className="w-full flex items-center justify-between px-8 py-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg" style={{ backgroundImage: 'var(--primary-gradient)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">JioAIMusic</span>
        </div>

        <div className="glass-panel px-6 py-2 rounded-full flex gap-4 text-sm font-medium items-center">
          <span className="text-white/50 uppercase tracking-wider text-xs">Vibe</span>
          <div className="h-4 w-px bg-white/10"></div>
          <button
            onClick={() => setColorScheme('nebula')}
            className={`w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-pink-500 ring-2 ring-offset-2 ring-offset-black/50 transition-all ${colorScheme === 'nebula' ? 'ring-white scale-110' : 'ring-transparent opacity-50 hover:opacity-100'}`}
            title="Nebula"
          ></button>
          <button
            onClick={() => setColorScheme('aurora')}
            className={`w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 ring-2 ring-offset-2 ring-offset-black/50 transition-all ${colorScheme === 'aurora' ? 'ring-white scale-110' : 'ring-transparent opacity-50 hover:opacity-100'}`}
            title="Aurora"
          ></button>
          <button
            onClick={() => setColorScheme('sunset')}
            className={`w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 ring-2 ring-offset-2 ring-offset-black/50 transition-all ${colorScheme === 'sunset' ? 'ring-white scale-110' : 'ring-transparent opacity-50 hover:opacity-100'}`}
            title="Sunset"
          ></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center w-full px-6 py-8 z-10">
        <div className="glass-panel w-full max-w-6xl rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col">

          {/* Decor line */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundImage: 'var(--primary-gradient)' }}></div>

          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-white/60 tracking-tight leading-tight pb-2">What are we creating today?</h1>
            <p className="text-white/50 text-lg font-light tracking-wide">Describe your vibe, pick a genre, and let AI do the magic.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left Column: Form */}
            <div className="flex flex-col">
              <GenerationForm
                onStart={handleStart}
                onSuccess={handleSuccess}
                onError={handleError}
                isLoading={loading}
                initialPrompt={initialPrompt}
              />
              {error && (
                <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl text-sm">
                  Error: {error}
                </div>
              )}
            </div>

            {/* Right Column: Results */}
            <div className="flex flex-col h-full min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest">Recent Creations</h3>
                {pollingTasks.length > 0 && (
                  <span className="text-xs font-bold animate-pulse" style={{ color: 'var(--accent-color)' }}>GENERATING...</span>
                )}
              </div>

              <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar flex-grow">
                {results.length === 0 && !loading && (
                  <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl p-8 text-center">
                    <p className="text-white/30 font-medium">Your masterpieces will appear here</p>
                  </div>
                )}

                {results.map((song, index) => (
                  <SongResult key={song.id || index} song={song} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
