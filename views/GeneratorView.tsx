
import React, { useState } from 'react';
import type { CaptionChefHook, Platform, Tone, Length } from '../types';
import { Sparkles, Copy, Save, Bot, Hash, ClipboardCheck } from 'lucide-react';
import { Spinner } from '../components/Spinner';

interface GeneratorViewProps {
  captionChef: CaptionChefHook;
}

const copyToClipboard = (text: string, onCopy: () => void) => {
    navigator.clipboard.writeText(text).then(() => {
        onCopy();
    });
};

export const GeneratorView: React.FC<GeneratorViewProps> = ({ captionChef }) => {
  const {
    settings,
    generateCaptions,
    generateHashtags,
    isGeneratingCaptions,
    isGeneratingHashtags,
    generatedCaptions,
    generatedHashtags,
    saveProject,
    addToast,
    clearGeneratedContent,
  } = captionChef;

  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>(settings.defaultPlatform as Platform);
  const [tone, setTone] = useState<Tone>(settings.defaultTone as Tone);
  const [length, setLength] = useState<Length>('Medium');
  
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (key: string, text: string) => {
    copyToClipboard(text, () => {
        addToast("Copied to clipboard!", "success");
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
    });
  };

  const handleGenerateCaptions = () => {
    if (!topic) {
      addToast("Please enter a topic.", "error");
      return;
    }
    generateCaptions({ topic, platform, tone, length, settings });
  };
  
  const handleGenerateHashtags = () => {
    if (generatedCaptions.length === 0) {
        addToast("Please generate captions first.", "error");
        return;
    }
    const firstCaption = generatedCaptions[0].text;
    generateHashtags({ caption: firstCaption, niche: topic });
  };
  
  const handleSaveProject = () => {
      saveProject(topic, generatedCaptions, generatedHashtags);
      clearGeneratedContent();
      setTopic('');
  }

  const isLoading = isGeneratingCaptions || isGeneratingHashtags;

  return (
    <div className="space-y-6">
      <div className="bg-dark-surface p-6 rounded-lg border border-dark-border space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Sparkles className="text-brand-secondary"/> Composer</h2>
        
        {/* Inputs */}
        <div className="space-y-4">
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic or brief for your content..."
            className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            rows={3}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select value={platform} onChange={e => setPlatform(e.target.value as Platform)} className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition">
              <option>Instagram</option>
              <option>TikTok</option>
              <option>YouTube</option>
            </select>
            <select value={tone} onChange={e => setTone(e.target.value as Tone)} className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition">
              <option>Casual</option>
              <option>Funny</option>
              <option>Serious</option>
              <option>Professional</option>
            </select>
            <select value={length} onChange={e => setLength(e.target.value as Length)} className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition">
              <option>Short</option>
              <option>Medium</option>
              <option>Long</option>
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleGenerateCaptions} disabled={isLoading} className="flex-1 flex justify-center items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-md transition disabled:bg-gray-500 disabled:cursor-not-allowed">
            {isGeneratingCaptions ? <Spinner size="sm"/> : <Bot size={18}/>}
            <span>Generate Captions</span>
          </button>
          <button onClick={handleGenerateHashtags} disabled={isLoading || generatedCaptions.length === 0} className="flex-1 flex justify-center items-center gap-2 bg-dark-border hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed">
             {isGeneratingHashtags ? <Spinner size="sm"/> : <Hash size={18}/>}
             <span>Generate Hashtags</span>
          </button>
        </div>
      </div>
      
      {/* Results */}
      {(generatedCaptions.length > 0 || isLoading) && (
        <div className="bg-dark-surface p-6 rounded-lg border border-dark-border space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Generated Content</h2>
                {generatedCaptions.length > 0 && 
                    <button onClick={handleSaveProject} className="flex items-center gap-2 text-sm bg-brand-primary/20 text-brand-secondary px-3 py-1.5 rounded-md hover:bg-brand-primary/40 transition">
                        <Save size={14}/>
                        Save to Projects
                    </button>
                }
            </div>
            
            {/* Captions */}
            {isGeneratingCaptions && <div className="flex justify-center p-8"><Spinner /></div>}
            {generatedCaptions.length > 0 && (
                 <div className="space-y-4">
                     <h3 className="font-semibold text-dark-text-secondary">Captions</h3>
                     {generatedCaptions.map((caption, index) => (
                        <div key={index} className="bg-dark-bg p-4 border border-dark-border rounded-md flex items-start gap-4">
                            <p className="flex-1 text-dark-text-primary">{caption.text}</p>
                            <button onClick={() => handleCopy(`caption-${index}`, caption.text)} className="p-2 rounded-md hover:bg-dark-border transition text-dark-text-secondary">
                                {copiedStates[`caption-${index}`] ? <ClipboardCheck size={18} className="text-green-400" /> : <Copy size={18} />}
                            </button>
                        </div>
                     ))}
                 </div>
            )}

            {/* Hashtags */}
            {isGeneratingHashtags && <div className="flex justify-center p-8"><Spinner /></div>}
            {generatedHashtags.length > 0 && (
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-dark-text-secondary">Hashtag Pack</h3>
                        <button onClick={() => handleCopy('hashtags', generatedHashtags.map(h => `#${h.tag}`).join(' '))} className="flex items-center gap-2 text-sm text-brand-secondary hover:underline">
                            {copiedStates['hashtags'] ? <ClipboardCheck size={14} className="text-green-400" /> : <Copy size={14} />}
                            Copy All
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 p-4 bg-dark-bg border border-dark-border rounded-md">
                        {generatedHashtags.map((hashtag, index) => (
                            <span key={index} className="bg-dark-border px-2.5 py-1 rounded-full text-sm text-dark-text-secondary cursor-pointer hover:bg-brand-primary/50">
                                #{hashtag.tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  );
};
