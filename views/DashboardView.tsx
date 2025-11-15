
import React from 'react';
import { GeneratorView } from './GeneratorView';
import type { CaptionChefHook } from '../types';

interface DashboardViewProps {
  captionChef: CaptionChefHook;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ captionChef }) => {
  const { credits } = captionChef;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-dark-text-primary">Welcome to CaptionChef</h1>
        <p className="text-dark-text-secondary mt-1">Your AI-powered content creation assistant.</p>
      </header>
      
      <div className="bg-dark-surface p-6 rounded-lg border border-dark-border flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Your Credits</h2>
          <p className="text-dark-text-secondary text-sm">Use these to generate captions and hashtags.</p>
        </div>
        <div className="text-3xl font-bold text-brand-primary">
          {credits.toFixed(1)}
        </div>
      </div>

      <GeneratorView captionChef={captionChef} />
    </div>
  );
};
