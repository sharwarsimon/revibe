
import React, { useState, useCallback } from 'react';
import { restoreImage } from '../services/geminiService';
import ComparisonSlider from './ComparisonSlider';
import { RestoredPhoto } from '../types';

const Dashboard: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [restoredPhoto, setRestoredPhoto] = useState<RestoredPhoto | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setError(err.message || 'Failed to restore image. Please try again.');
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
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Restore Your Memories
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Upload any old, damaged, or black & white photo. Our AI will bring it back to life in seconds.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {!previewUrl ? (
            <div className="p-12 text-center">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-slate-700 font-semibold">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500">JPG, PNG or WEBP (MAX. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>
          ) : (
            <div className="p-6 md:p-8 space-y-8">
              {!restoredPhoto ? (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-900">Restore Configuration</h3>
                      <p className="text-sm text-slate-500">Choose how you want to enhance your photo.</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">AI Colorization</span>
                        <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">Denoise & Sharpen</span>
                        <div className="w-10 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1">
                          <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {error && (
                      <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button 
                        onClick={() => setPreviewUrl(null)}
                        className="flex-1 py-3 px-6 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={handleRestore}
                        disabled={isProcessing}
                        className={`flex-[2] py-3 px-6 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 ${
                          isProcessing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </>
                        ) : 'Restore Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Restoration Result</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = restoredPhoto.restoredUrl;
                          link.download = 'restored-photo.png';
                          link.click();
                        }}
                        className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Download"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0L8 8m4-4v12" />
                        </svg>
                      </button>
                      <button 
                         onClick={() => {
                            setRestoredPhoto(null);
                            setPreviewUrl(null);
                            setSelectedFile(null);
                         }}
                         className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors"
                      >
                        New Restoration
                      </button>
                    </div>
                  </div>
                  <ComparisonSlider 
                    before={restoredPhoto.originalUrl}
                    after={restoredPhoto.restoredUrl}
                  />
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-start gap-3">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Successfully Restored</p>
                      <p className="text-xs text-emerald-700">We've removed noise, colorized, and sharpened your image using deep learning. Use the slider to compare.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Informational Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 font-bold">1</div>
            <h4 className="font-bold text-slate-900 mb-2">Upload Photo</h4>
            <p className="text-sm text-slate-500">Drop your old black and white or damaged photos into the dashboard.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 font-bold">2</div>
            <h4 className="font-bold text-slate-900 mb-2">AI Processing</h4>
            <h4 className="sr-only">AI Magic</h4>
            <p className="text-sm text-slate-500">Our neural networks analyze the structure and add missing pixels and color.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4 font-bold">3</div>
            <h4 className="font-bold text-slate-900 mb-2">Download Memory</h4>
            <p className="text-sm text-slate-500">Get your crystal clear, high-resolution restored photo instantly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
