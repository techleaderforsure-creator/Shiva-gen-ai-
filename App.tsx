
import React, { useState } from 'react';
import { AppView, GeneratedMedia } from './types';
import Layout from './components/Layout';
import PersonaManager from './components/PersonaManager';
import ReferenceAnalyzer from './components/ReferenceAnalyzer';
import MediaGenerator from './components/MediaGenerator';

const Home: React.FC<{ onStart: (view: AppView) => void }> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-in fade-in duration-700">
      <div className="max-w-4xl space-y-6">
        <h2 className="text-5xl md:text-8xl font-black tracking-tight text-white leading-[1.1]">
          Recreate The Visuals <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-orange-400">You Admire.</span>
        </h2>
        <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
          The ultimate AI companion for creators. Extract the DNA of any viral image and generate professional content featuring <span className="text-white font-medium italic underline decoration-violet-500 underline-offset-4">your own identity.</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => onStart('recreate')}
            className="px-8 py-4 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-violet-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Recreating
          </button>
          <button 
            onClick={() => onStart('persona')}
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold text-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
          >
            Define Persona
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <div className="group bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-4 hover:border-violet-500/30 transition-all hover:translate-y-[-4px]">
          <div className="w-12 h-12 bg-violet-500/20 rounded-xl flex items-center justify-center text-violet-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">1. Analyze DNA</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Upload any screenshot or video. Gemini 3 Pro deconstructs the style, lighting, and composition prompts instantly.
          </p>
        </div>

        <div className="group bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-4 hover:border-fuchsia-500/30 transition-all hover:translate-y-[-4px]">
          <div className="w-12 h-12 bg-fuchsia-500/20 rounded-xl flex items-center justify-center text-fuchsia-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">2. Lock Identity</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Create a "Physical Identity Lock." We ensure the person in the generated content maintains your exact likeness.
          </p>
        </div>

        <div className="group bg-slate-950/40 backdrop-blur-md border border-white/5 p-8 rounded-3xl space-y-4 hover:border-orange-500/30 transition-all hover:translate-y-[-4px]">
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center text-orange-400 mb-2 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">3. Studio Output</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Receive studio-quality 4K images or cinematic Veo videos featuring you in any artistic style you can imagine.
          </p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('home');
  const [personaDescription, setPersonaDescription] = useState<string>("");
  const [analyzedPrompt, setAnalyzedPrompt] = useState<string>("");
  const [gallery, setGallery] = useState<GeneratedMedia[]>([]);

  const handleMediaGenerated = (media: GeneratedMedia) => {
    setGallery(prev => [media, ...prev]);
    setActiveView('gallery');
  };

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'home' && (
        <Home onStart={setActiveView} />
      )}

      {activeView === 'recreate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-in fade-in zoom-in-95 duration-500">
          <ReferenceAnalyzer onAnalysisComplete={setAnalyzedPrompt} />
          <MediaGenerator 
            initialPrompt={analyzedPrompt} 
            personaProfile={personaDescription}
            onMediaGenerated={handleMediaGenerated}
          />
        </div>
      )}

      {activeView === 'persona' && (
        <PersonaManager 
          onProfileCreated={setPersonaDescription} 
          currentDescription={personaDescription} 
        />
      )}

      {activeView === 'gallery' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-white">Your Studio</h2>
            <button 
              onClick={() => setActiveView('recreate')}
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg font-bold transition-all shadow-lg shadow-violet-600/20"
            >
              Create New
            </button>
          </div>
          
          {gallery.length === 0 ? (
            <div className="bg-slate-950/40 backdrop-blur-md border border-white/10 rounded-3xl p-20 text-center">
              <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">The studio is empty</h3>
              <p className="text-slate-400 max-w-xs mx-auto">Your high-fidelity creations will be archived here for you to download anytime.</p>
              <button 
                onClick={() => setActiveView('recreate')}
                className="mt-8 px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-2xl font-black transition-all shadow-xl shadow-violet-600/30"
              >
                Let's Build Something
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map(media => (
                <div key={media.id} className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden group shadow-2xl transition-all hover:shadow-violet-600/10 hover:border-violet-500/50">
                  <div className="aspect-square bg-black overflow-hidden relative">
                    {media.type === 'video' ? (
                      <video src={media.url} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={media.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Generated" />
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] tracking-widest uppercase font-black px-3 py-1 rounded-full backdrop-blur-md border border-white/10 ${media.type === 'video' ? 'bg-violet-600/80 text-white' : 'bg-fuchsia-600/80 text-white'}`}>
                        {media.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-slate-300 line-clamp-2 italic font-light leading-relaxed">
                      "{media.prompt}"
                    </p>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-500 font-mono">
                        ID: {media.id} • {new Date(media.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <a 
                        href={media.url} 
                        download={`shivagenai-${media.id}`}
                        className="p-2 bg-slate-800 hover:bg-violet-600 rounded-lg transition-all text-white"
                        title="Download Asset"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default App;
