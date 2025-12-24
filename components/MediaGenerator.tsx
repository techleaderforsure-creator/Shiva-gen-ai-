
import React, { useState, useEffect } from 'react';
import { generateImageWithPersona, generateVideoWithPersona, editImage } from '../services/geminiService';
import { GeneratedMedia } from '../types';

interface MediaGeneratorProps {
  initialPrompt: string;
  personaProfile: string;
  onMediaGenerated: (media: GeneratedMedia) => void;
}

const MediaGenerator: React.FC<MediaGeneratorProps> = ({ initialPrompt, personaProfile, onMediaGenerated }) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '3:4' | '4:3'>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const checkApiKey = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setLoadingMsg("Checking API Key...");
    await checkApiKey();
    
    try {
      setLoadingMsg(mediaType === 'image' ? "Generating with Gemini Image..." : "Preparing Veo 3.1 generation...");
      let url = "";
      
      if (mediaType === 'image') {
        url = await generateImageWithPersona(prompt, personaProfile, imageSize, aspectRatio as any);
      } else {
        url = await generateVideoWithPersona(prompt, personaProfile, (aspectRatio === '9:16' ? '9:16' : '16:9'));
      }

      onMediaGenerated({
        id: Math.random().toString(36).substr(2, 9),
        type: mediaType,
        url,
        prompt,
        timestamp: Date.now()
      });
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("permission") || err.message?.includes("403") || err.message?.includes("not found")) {
        alert("Studio API Key requires a paid GCP project. Please select one to continue.");
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsGenerating(false);
      setLoadingMsg("");
    }
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Generate Final Media</h2>
        <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => { setMediaType('image'); setAspectRatio('1:1'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'image' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Image
          </button>
          <button 
            onClick={() => { setMediaType('video'); setAspectRatio('16:9'); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mediaType === 'video' ? 'bg-violet-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Video
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2">Creative Direction</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-violet-500/50 outline-none resize-none transition-all placeholder:text-slate-600"
            placeholder="Describe the cinematic masterpiece..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mediaType === 'image' && (
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Resolution</label>
              <select 
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value as any)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-slate-200 outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                <option value="1K">1K Standard</option>
                <option value="2K">2K High Def</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Composition</label>
            <select 
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as any)}
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-slate-200 outline-none focus:ring-2 focus:ring-violet-500/50"
            >
              {mediaType === 'image' ? (
                <>
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:3">4:3 Ratio</option>
                  <option value="3:4">3:4 Ratio</option>
                </>
              ) : (
                <>
                  <option value="16:9">16:9 Widescreen</option>
                  <option value="9:16">9:16 Portrait</option>
                </>
              )}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className={`w-full py-5 rounded-xl font-bold text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
            isGenerating 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
              : 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:shadow-violet-500/30 hover:scale-[1.01] active:scale-[0.99] border border-white/10 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-2 border-slate-500/30 border-t-violet-400 rounded-full animate-spin" />
              {loadingMsg}
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate Studio {mediaType === 'image' ? 'Image' : 'Video'}
            </>
          )}
        </button>
        <div className="flex items-center justify-center gap-2 mt-4">
           <span className={`w-2 h-2 rounded-full ${personaProfile ? 'bg-violet-400 animate-pulse' : 'bg-slate-600'}`}></span>
           <p className="text-center text-xs text-slate-400 font-medium">
            {personaProfile ? "Identity Lock Active" : "No Persona Locked"}
          </p>
        </div>
        <div className="mt-4 text-center">
          <button 
            onClick={() => (window as any).aistudio.openSelectKey()}
            className="text-[10px] text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-widest font-bold"
          >
            Change Studio API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaGenerator;
