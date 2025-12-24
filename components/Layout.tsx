
import React from 'react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with glassmorphism and violet accents */}
      <header className="sticky top-0 z-50 bg-indigo-950/30 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-2xl">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange('home')}
        >
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Shiva <span className="text-violet-400">Gen AI</span></h1>
        </div>
        
        <nav className="flex gap-1 bg-black/40 p-1 rounded-full border border-white/5 overflow-x-auto max-w-[60vw] md:max-w-none">
          {(['home', 'recreate', 'persona', 'gallery'] as AppView[]).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                activeView === view 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 relative">
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/5 py-8 text-center text-slate-500 text-sm mt-auto">
        <p className="font-medium tracking-wide uppercase text-violet-400/80">Recreate. Personalize. Generate.</p>
        <p className="mt-2 opacity-60 font-light">&copy; 2024 Shiva Gen AI • Experience the Future of Visual Content</p>
      </footer>
    </div>
  );
};

export default Layout;
