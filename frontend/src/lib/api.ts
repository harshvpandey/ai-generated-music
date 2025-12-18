import { GeneratePayload, TaskResponse, Song } from '../types';

const API_BASE = 'http://localhost:8000';

export async function fetchWords(): Promise<string[]> {
    try {
        const response = await fetch(`${API_BASE}/api/words`);
        const data = await response.json();
        return data.words || [];
    } catch (error) {
        console.error('Error fetching words:', error);
        return [];
    }
}

export async function submitWord(word: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/submit-word`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word })
        });
        return response.ok;
    } catch (error) {
        console.error('Error submitting word:', error);
        return false;
    }
}

export async function generateSong(payload: GeneratePayload): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok || data.status === 'error') {
            throw new Error(data.detail || data.errorMessage || 'Generation failed');
        }

        // Robust Task ID extraction
        return data.data?.data?.taskId || data.data?.taskId || data.taskId || data.id || null;
    } catch (error) {
        console.error("Generation API Error:", error);
        throw error;
    }
}

export async function pollTaskStatus(taskId: string): Promise<TaskResponse> {
    try {
        const response = await fetch(`${API_BASE}/api/status/${taskId}`);
        const data = await response.json();
        return data.data || { status: 'UNKNOWN' };
    } catch (error) {
        console.error("Polling API Error:", error);
        throw error;
    }
}
