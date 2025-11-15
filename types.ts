// FIX: Removed prohibited and unused type-only import for `@google/genai`.
import type { Dispatch, SetStateAction } from 'react';

export interface Caption {
  text: string;
}

export interface Hashtag {
  tag: string;
  score: number;
  rationale: string;
}

export interface Project {
  id: string;
  topic: string;
  captions: Caption[];
  hashtags: Hashtag[];
  createdAt: string;
}

export interface Settings {
  voiceKeywords: string;
  bannedWords: string;
  defaultTone: string;
  defaultPlatform: string;
}

export type Platform = 'Instagram' | 'TikTok' | 'YouTube';
export type Tone = 'Casual' | 'Funny' | 'Serious' | 'Professional';
export type Length = 'Short' | 'Medium' | 'Long';
export type View = 'dashboard' | 'projects' | 'settings' | 'billing';


export interface GenerationOptions {
    topic: string;
    platform: Platform;
    tone: Tone;
    length: Length;
    settings: Settings;
}

export interface HashtagOptions {
    caption: string;
    niche: string;
}

export interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

export interface CaptionChefHook {
    credits: number;
    projects: Project[];
    settings: Settings;
    isGeneratingCaptions: boolean;
    isGeneratingHashtags: boolean;
    generatedCaptions: Caption[];
    generatedHashtags: Hashtag[];
    setSettings: Dispatch<SetStateAction<Settings>>;
    saveProject: (topic: string, captions: Caption[], hashtags: Hashtag[]) => void;
    addCredits: (amount: number) => void;
    generateCaptions: (options: GenerationOptions) => Promise<void>;
    generateHashtags: (options: HashtagOptions) => Promise<void>;
    clearGeneratedContent: () => void;
    toasts: ToastMessage[];
    addToast: (message: string, type?: 'success' | 'error') => void;
    removeToast: (id: number) => void;
}