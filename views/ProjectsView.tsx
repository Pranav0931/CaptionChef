
import React, { useState } from 'react';
import type { CaptionChefHook } from '../types';
import { FolderKanban, Copy, Hash, ClipboardCheck } from 'lucide-react';

export const ProjectsView: React.FC<{ captionChef: CaptionChefHook }> = ({ captionChef }) => {
  const { projects, addToast } = captionChef;
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        addToast("Copied to clipboard!", "success");
        setCopiedStates(prev => ({ ...prev, [key]: true }));
        setTimeout(() => setCopiedStates(prev => ({ ...prev, [key]: false })), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-dark-text-primary flex items-center gap-3">
          <FolderKanban />
          My Projects
        </h1>
        <p className="text-dark-text-secondary mt-1">
          All your saved captions and hashtags in one place.
        </p>
      </header>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-dark-surface rounded-lg border border-dark-border">
          <p className="text-dark-text-secondary">You haven't saved any projects yet.</p>
          <p className="text-sm text-gray-500 mt-2">Generate some content on the dashboard and save it!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-dark-surface p-6 rounded-lg border border-dark-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold capitalize">{project.topic}</h2>
                  <p className="text-xs text-dark-text-secondary">
                    Saved on {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                 {project.captions.length > 0 && 
                    <div className="space-y-3">
                        <h3 className="font-semibold text-dark-text-secondary">Captions</h3>
                        {project.captions.map((caption, index) => (
                           <div key={index} className="bg-dark-bg p-3 border border-dark-border rounded-md flex items-center gap-3">
                               <p className="flex-1 text-sm">{caption.text}</p>
                               <button onClick={() => handleCopy(`p-${project.id}-c-${index}`, caption.text)} className="p-2 rounded-md hover:bg-dark-border text-dark-text-secondary">
                                   {copiedStates[`p-${project.id}-c-${index}`] ? <ClipboardCheck size={16} className="text-green-400"/> : <Copy size={16} />}
                               </button>
                           </div>
                        ))}
                    </div>
                 }
                 {project.hashtags.length > 0 && 
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-dark-text-secondary">Hashtags</h3>
                             <button onClick={() => handleCopy(`p-${project.id}-h-all`, project.hashtags.map(h => `#${h.tag}`).join(' '))} className="flex items-center gap-1.5 text-xs text-brand-secondary hover:underline">
                                {copiedStates[`p-${project.id}-h-all`] ? <ClipboardCheck size={12} className="text-green-400"/> : <Copy size={12} />}
                                Copy All
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 p-3 bg-dark-bg border border-dark-border rounded-md">
                            {project.hashtags.map((hashtag, index) => (
                                <span key={index} className="bg-dark-border px-2 py-0.5 rounded-full text-xs text-dark-text-secondary">
                                    #{hashtag.tag}
                                </span>
                            ))}
                        </div>
                    </div>
                 }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
