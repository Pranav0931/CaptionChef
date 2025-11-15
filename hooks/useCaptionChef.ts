import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react';
import type { Project, Settings, Caption, Hashtag, GenerationOptions, HashtagOptions, ToastMessage, CaptionChefHook } from '../types';
import { generateCaptionsFromGemini, generateHashtagsFromGemini } from '../services/geminiService';

// FIX: Updated the type signature of the useLocalStorage hook to correctly handle functional updates for state setters.
// This resolves the TypeScript errors when calling setCredits and setProjects with a function.
const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: Dispatch<SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

export const useCaptionChef = (): CaptionChefHook => {
    const [credits, setCredits] = useLocalStorage<number>('captionchef-credits', 20);
    const [projects, setProjects] = useLocalStorage<Project[]>('captionchef-projects', []);
    const [settings, setSettings] = useLocalStorage<Settings>('captionchef-settings', {
        voiceKeywords: 'authentic, engaging, value-driven',
        bannedWords: 'spam, clickbait',
        defaultTone: 'Casual',
        defaultPlatform: 'Instagram',
    });

    const [isGeneratingCaptions, setIsGeneratingCaptions] = useState(false);
    const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
    const [generatedCaptions, setGeneratedCaptions] = useState<Caption[]>([]);
    const [generatedHashtags, setGeneratedHashtags] = useState<Hashtag[]>([]);
    
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    
    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };


    const deductCredits = (amount: number) => {
        setCredits(prev => Math.max(0, prev - amount));
    };
    
    const addCredits = (amount: number) => {
        setCredits(prev => prev + amount);
        addToast(`${amount} credits added successfully!`, 'success');
    };

    const saveProject = (topic: string, captions: Caption[], hashtags: Hashtag[]) => {
        const newProject: Project = {
            id: `proj-${Date.now()}`,
            topic,
            captions,
            hashtags,
            createdAt: new Date().toISOString(),
        };
        setProjects(prev => [newProject, ...prev]);
        addToast('Project saved!', 'success');
    };
    
    const clearGeneratedContent = () => {
        setGeneratedCaptions([]);
        setGeneratedHashtags([]);
    };

    const generateCaptions = useCallback(async (options: GenerationOptions) => {
        if (credits < 1) {
            addToast("Not enough credits to generate captions.", 'error');
            return;
        }
        setIsGeneratingCaptions(true);
        clearGeneratedContent();
        try {
            const captions = await generateCaptionsFromGemini(options);
            setGeneratedCaptions(captions);
            deductCredits(1);
            addToast('Captions generated!', 'success');
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addToast(errorMessage, 'error');
        } finally {
            setIsGeneratingCaptions(false);
        }
    }, [credits]);

    const generateHashtags = useCallback(async (options: HashtagOptions) => {
        if (credits < 0.2) {
            addToast("Not enough credits to generate hashtags.", 'error');
            return;
        }
        setIsGeneratingHashtags(true);
        try {
            const hashtags = await generateHashtagsFromGemini(options);
            setGeneratedHashtags(hashtags);
            deductCredits(0.2);
            addToast('Hashtags generated!', 'success');
        } catch (error) {
            console.error(error);
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
            addToast(errorMessage, 'error');
        } finally {
            setIsGeneratingHashtags(false);
        }
    }, [credits]);


    return {
        credits,
        projects,
        settings,
        isGeneratingCaptions,
        isGeneratingHashtags,
        generatedCaptions,
        generatedHashtags,
        setSettings,
        saveProject,
        addCredits,
        generateCaptions,
        generateHashtags,
        clearGeneratedContent,
        toasts,
        addToast,
        removeToast,
    };
};