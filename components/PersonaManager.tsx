
import React, { useState } from 'react';
import { PersonaImage } from '../types';
import { createPersonaDescription } from '../services/geminiService';

interface PersonaManagerProps {
  onProfileCreated: (description: string) => void;
  currentDescription: string;
}

const EXAMPLE_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974&auto=format&fit=crop',
    label: 'Front View'
  },
  {
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    label: 'Profile View'
  },
  {
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    label: 'Three-Quarter'
  }
];

const PersonaManager: React.FC<PersonaManagerProps> = ({ onProfileCreated, currentDescription }) => {
  const [images, setImages] = useState<PersonaImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const checkApiKey = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files) as File[];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setImages(prev => [...prev, {
            id: Math.random().toString(36).substr(2, 9),
            url: reader.result as string,
            base64,
            angle: 'unknown'
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleCreateProfile = async () => {
    if (images.length === 0) return;
    setIsAnalyzing(true);
    await checkApiKey();
    
    try {
      const profile = await createPersonaDescription(images.map(img => ({ base64: img.base64, mimeType: 'image/jpeg' })));
      onProfileCreated(profile);
    } catch (error: any) {
      console.error("Failed to create profile", error);
      if (error.message?.includes("permission") || error.message?.includes("403") || error.message?.includes("not found")) {
        alert("Studio API Key requires a paid GCP project. Please select one.");
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      {/* Examples Section */}
      <div className="bg-violet-950/20 backdrop-blur-md border border-violet-500/20 rounded-3xl p-8">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recommended Example Set
        </h3>
        <p className="text-slate-400 text-sm mb-6">For the best results, upload at least 3 high-quality photos covering these angles:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXAMPLE_PHOTOS.map((ex, idx) => (
            <div key={idx} className="space-y-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-white/10 relative group">
                <img src={ex.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={ex.label} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                  <span className="text-xs font-bold text-white tracking-widest uppercase">{ex.label}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest">Ideal for {ex.label.toLowerCase()} reconstruction</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Identity Lock Studio</h2>
            <p className="text-slate-400 text-sm">Upload your personal photos to build your physical profile.</p>
          </div>
          <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full border border-white/5">
             <span className="text-xs font-mono text-violet-400">{images.length} / 5</span>
             <span className="text-[10px] uppercase text-slate-500 font-bold">Photos Added</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {images.map(img => (
            <div key={img.id} className="aspect-square bg-slate-800 rounded-2xl overflow-hidden relative group border border-white/5">
              <img src={img.url} className="w-full h-full object-cover" alt="Persona" />
              <button 
                onClick={() => setImages(prev => prev.filter(i => i.id !== img.id))}
                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          
          {images.length < 10 && (
            <label className="aspect-square border-2 border-dashed border-slate-700/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-500/5 transition-all group">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-slate-400 group-hover:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Add Asset</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>

        <button
          onClick={handleCreateProfile}
          disabled={images.length === 0 || isAnalyzing}
          className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl ${
            isAnalyzing 
              ? 'bg-slate-800 text-slate-600' 
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:shadow-violet-600/30 hover:scale-[1.01]'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              Processing Biological Data...
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V22m0-19.056c1.055 0 2.083.186 3.033.528m-6.066 0c.95-.342 1.978-.528 3.033-.528z" />
              </svg>
              Lock Physical Identity
            </>
          )}
        </button>
      </div>

      {currentDescription && (
        <div className="bg-violet-600/10 border border-violet-500/30 rounded-3xl p-8 animate-in slide-in-from-bottom-6 duration-700 shadow-2xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-violet-600 rounded-2xl shadow-lg shadow-violet-600/30">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Identity Profile Active</h3>
              <p className="text-xs text-violet-400 font-bold uppercase tracking-widest">Biometric Data Extracted</p>
            </div>
          </div>
          <div className="bg-black/60 p-8 rounded-2xl border border-white/5 whitespace-pre-wrap text-slate-300 font-light italic leading-relaxed text-sm md:text-base">
            {currentDescription}
          </div>
          <div className="mt-6 flex items-center gap-2 text-violet-400/80">
            <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-widest">Persona injection enabled for all new generations</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonaManager;
