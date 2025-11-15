
import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { ProjectsView } from './views/ProjectsView';
import { SettingsView } from './views/SettingsView';
import { BillingView } from './views/BillingView';
import { useCaptionChef } from './hooks/useCaptionChef';
import type { View } from './types';
import { ToastProvider, Toast } from './components/Toast';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const captionChef = useCaptionChef();
  const { toasts, removeToast } = captionChef;

  const ActiveView = useMemo(() => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView captionChef={captionChef} />;
      case 'projects':
        return <ProjectsView captionChef={captionChef} />;
      case 'settings':
        return <SettingsView captionChef={captionChef} />;
      case 'billing':
        return <BillingView captionChef={captionChef} />;
      default:
        return <DashboardView captionChef={captionChef} />;
    }
  }, [currentView, captionChef]);

  return (
    <ToastProvider>
      <div className="flex h-screen bg-dark-bg text-dark-text-primary font-sans">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {ActiveView}
        </main>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
                <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
      </div>
    </ToastProvider>
  );
};

export default App;
