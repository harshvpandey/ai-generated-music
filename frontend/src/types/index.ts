export interface Song {
    id: string;
    title?: string;
    tags?: string;
    imageUrl?: string;
    audioUrl?: string; // Standardized to camelCase
    status: 'complete' | 'streaming' | 'queued' | 'error';
    duration?: number;
    prompt?: string;
}

export interface TaskResponse {
    taskId: string;
    status: string;
    sunoData?: Song[];
    response?: {
        sunoData?: Song[];
    };
    data?: {
        response?: {
            sunoData?: Song[];
        }
    };
    errorMessage?: string;
    error_message?: string;
}

export interface GeneratePayload {
    prompt: string;
    customMode: boolean;
    instrumental: boolean;
    model: string;
}
