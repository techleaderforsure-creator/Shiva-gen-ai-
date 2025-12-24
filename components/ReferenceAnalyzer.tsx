
import React, { useState } from 'react';
import { analyzeReference, analyzeVideo } from '../services/geminiService';

interface ReferenceAnalyzerProps {
  onAnalysisComplete: (prompt: string) => void;
}

const ReferenceAnalyzer: React.FC<ReferenceAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const checkApiKey = async () => {
    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await (window as any).aistudio.openSelectKey();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    await checkApiKey();
    
    try {
      let analysis = "";
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        analysis = await analyzeReference(base64, file.type);
      } else if (file.type.startsWith('video/')) {
        analysis = await analyzeVideo(file);
      }
      setResult(analysis);
      onAnalysisComplete(analysis);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("permission") || err.message?.includes("403") || err.message?.includes("not found")) {
        alert("Studio API Key requires a paid GCP project. Please select one.");
        await (window as any).aistudio.openSelectKey();
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold mb-2 text-white">Analyze Reference</h2>
        <p className="text-slate-400 mb-6">Upload a screenshot of a viral AI video or image to extract its "DNA".</p>
        
        <div className="flex flex-col gap-6">
          <div className={`aspect-video w-full rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden bg-slate-800/20 ${file ? 'border-violet-500' : 'border-slate-700/50 hover:border-slate-500'}`}>
            {preview ? (
              file?.type.startsWith('video/') ? (
                <video src={preview} className="w-full h-full object-contain" controls />
              ) : (
                <img src={preview} className="w-full h-full object-contain" alt="Reference" />
              )
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                <svg className="w-12 h-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-slate-400 font-medium">Click to upload image or video</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
              </label>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || isAnalyzing}
            className="py-4 bg-white text-slate-900 hover:bg-violet-50 disabled:bg-slate-800 disabled:text-slate-500 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                Analyzing DNA...
              </>
            ) : (
              'Deconstruct Visual Style'
            )}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-slate-900/40 backdrop-blur-md border border-violet-500/20 rounded-2xl p-8 animate-in fade-in slide-in-from-top-4 duration-500 shadow-2xl">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
            <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Analysis & Optimized Prompt
          </h3>
          <div className="bg-black/40 p-6 rounded-xl border border-white/5 font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
            {result}
          </div>
          <p className="mt-4 text-xs text-violet-400/70 uppercase tracking-widest font-bold">Ready to generate with your persona</p>
        </div>
      )}
    </div>
  );
};

export default ReferenceAnalyzer;
