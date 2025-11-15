
import React, { useState, useEffect } from 'react';
import type { CaptionChefHook } from '../types';
import { Settings, Save } from 'lucide-react';

export const SettingsView: React.FC<{ captionChef: CaptionChefHook }> = ({ captionChef }) => {
  const [localSettings, setLocalSettings] = useState(captionChef.settings);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setLocalSettings(captionChef.settings);
  }, [captionChef.settings]);
  
  useEffect(() => {
    setIsDirty(JSON.stringify(localSettings) !== JSON.stringify(captionChef.settings));
  }, [localSettings, captionChef.settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    captionChef.setSettings(localSettings);
    captionChef.addToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-dark-text-primary flex items-center gap-3">
          <Settings />
          Settings
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Customize your content generation preferences.
        </p>
      </header>

      <div className="bg-dark-surface p-6 rounded-lg border border-dark-border space-y-6">
        <div>
          <label htmlFor="voiceKeywords" className="block text-sm font-medium text-dark-text-secondary mb-1">
            Voice Keywords
          </label>
          <p className="text-xs text-gray-500 mb-2">Words that define your brand's voice. Separate with commas.</p>
          <textarea
            id="voiceKeywords"
            name="voiceKeywords"
            value={localSettings.voiceKeywords}
            onChange={handleChange}
            className="w-full p-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="bannedWords" className="block text-sm font-medium text-dark-text-secondary mb-1">
            Banned Words
          </label>
          <p className="text-xs text-gray-500 mb-2">Words to exclude from generations. Separate with commas.</p>
          <textarea
            id="bannedWords"
            name="bannedWords"
            value={localSettings.bannedWords}
            onChange={handleChange}
            className="w-full p-2 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="defaultPlatform" className="block text-sm font-medium text-dark-text-secondary mb-1">
                Default Platform
              </label>
              <select
                id="defaultPlatform"
                name="defaultPlatform"
                value={localSettings.defaultPlatform}
                onChange={handleChange}
                className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              >
                <option>Instagram</option>
                <option>TikTok</option>
                <option>YouTube</option>
              </select>
            </div>
            <div>
              <label htmlFor="defaultTone" className="block text-sm font-medium text-dark-text-secondary mb-1">
                Default Tone
              </label>
              <select
                id="defaultTone"
                name="defaultTone"
                value={localSettings.defaultTone}
                onChange={handleChange}
                className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
              >
                <option>Casual</option>
                <option>Funny</option>
                <option>Serious</option>
                <option>Professional</option>
              </select>
            </div>
        </div>
      </div>
      
      <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className="flex items-center gap-2 bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-6 rounded-md transition disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            Save Changes
          </button>
      </div>
    </div>
  );
};
