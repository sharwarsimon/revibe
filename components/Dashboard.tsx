
import React, { useState, useEffect } from 'react';
import { restoreImage } from '../services/geminiService';
import ComparisonSlider from './ComparisonSlider';
import { RestoredPhoto } from '../types';

// Fix: Moving AIStudio definition inside declare global to resolve "Subsequent property declarations" collision
declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredPhoto, setRestoredPhoto] = useState<RestoredPhoto | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(false);

  const steps = [
    "Analyzing image structure...",
    "Identifying scratches and noise...",
    "Applying neural colorization...",
    "Enhancing facial details...",
    "Finalizing high-res output..."
  ];

  useEffect(() => {
    let interval: any;
    if (isProcessing) {
      setProcessStep(0);
      interval = setInterval(() => {
        setProcessStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
      }, 3000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  useEffect(() => {
    const checkKey = async () => {
      if (process.env.API_KEY) {
        setHasKey(true);
        return;
      }
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Rule: Assume key selection was successful after triggering openSelectKey to avoid race conditions
        setHasKey(true);
        setError(null);
      } catch (err) {
        console.error("Key selection failed", err);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRestoredPhoto(null);
      setError(null);
    }
  };

  const handleRestore = async () => {
    if (!hasKey && !process.env.API_KEY) {
      setError("Please connect your Google AI Studio key first.");
      return;
    }
    if (!selectedFile || !previewUrl) return;

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        try {
          const restoredUrl = await restoreImage(base64, selectedFile.type);
          
          setRestoredPhoto({
            id: Date.now().toString(),
            originalUrl: previewUrl,
            restoredUrl: restoredUrl,
            timestamp: Date.now(),
            status: 'completed'
          });
        } catch (err: any) {
          setError(err.message || 'Restoration failed. Try another photo or check your connection.');
          if (err.message?.includes("API Key issue") || err.message?.includes("Invalid API Key")) {
            setHasKey(false);
          }
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Error reading file. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {!hasKey && !process.env.API_KEY && (
          <div className="mb-8 p-8 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl shadow-2xl text-white flex flex-col md:flex-row items-center gap-6 border border-white/10">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-400/30">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold mb-1">AI Engine Disconnected</h3>
              <p className="text-slate-400 text-sm">Connect your Google AI Studio key to enable the restoration engine.</p>
            </div>
            <button 
              onClick={handleConnectKey}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40"
            >
              Connect Now
            </button>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            Powered by Gemini 2.5 Flash
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Bring History <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">To Life</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            Professional AI photo restoration. Remove damage, restore clarity, and add color to your most precious memories.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden transition-all">
          {!previewUrl ? (
            <div className="p-12 text-center">
              <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-slate-200 rounded-[2rem] cursor-pointer bg-slate-50 hover:bg-indigo-50/30 hover:border-indigo-300 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="mb-2 text-xl font-bold text-slate-800">Upload your old photo</p>
                  <p className="text-sm text-slate-400">Click to browse or drag and drop</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="p-6 md:p-10">
              {!restoredPhoto ? (
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                  <div className="w-full lg:w-1/2 rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3] relative group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    {isProcessing && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <p className="text-xl font-bold mb-2 animate-pulse">{steps[processStep]}</p>
                        <p className="text-xs text-white/60">This may take up to 20 seconds</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full lg:w-1/2 space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Restoration Profile</h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-emerald-900">Scratch & Noise Removal</span>
                        </div>
                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-blue-900">Smart Face Enhancement</span>
                        </div>
                        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm font-bold text-indigo-900">Neural Colorization</span>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-bold animate-shake">
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-4">
                      <button 
                        onClick={handleRestore}
                        disabled={isProcessing}
                        className={`w-full py-5 rounded-2xl font-black text-lg text-white shadow-2xl transition-all flex items-center justify-center gap-3 ${
                          isProcessing ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-1 active:scale-[0.98] shadow-indigo-200'
                        }`}
                      >
                        {isProcessing ? 'Processing Memory...' : 'Revive Photo Now'}
                      </button>
                      <button 
                        onClick={() => {
                          setPreviewUrl(null);
                          setSelectedFile(null);
                          setError(null);
                        }}
                        disabled={isProcessing}
                        className="w-full py-3 px-6 rounded-2xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-10 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Success!</h3>
                      <p className="text-slate-500 text-sm font-medium">Your photo has been revived with Gemini AI.</p>
                    </div>
                    <div className="flex gap-3">
                      <button 
                         onClick={() => {
                            setRestoredPhoto(null);
                            setPreviewUrl(null);
                            setSelectedFile(null);
                         }}
                         className="px-6 py-3 border border-slate-200 bg-white text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors"
                      >
                        New Photo
                      </button>
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = restoredPhoto.restoredUrl;
                          link.download = 'revived-memory.png';
                          link.click();
                        }}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100"
                      >
                        Download HD
                      </button>
                    </div>
                  </div>
                  
                  <ComparisonSlider 
                    before={restoredPhoto.originalUrl}
                    after={restoredPhoto.restoredUrl}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">Enhancement</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">AI reconstructed missing pixel data to bring back textures and clarity lost over time.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">Colorization</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Neural layers analyzed shadows to determine realistic original skin tones and lighting.</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest mb-2">Cleanup</p>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">Scratches, dust spots, and film grain were intelligently identified and filled with context.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-20 text-center text-slate-400">
           <p className="text-xs font-medium">Privacy focused: Your images are processed securely and never stored on our servers.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
