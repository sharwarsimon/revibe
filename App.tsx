
import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      
      <main>
        {/* Simple Hero Background */}
        <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute top-40 left-20 w-72 h-72 bg-violet-200/20 rounded-full blur-3xl -z-10 animate-pulse delay-700" />
        
        <Dashboard />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 px-4 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">ReviveAI</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
            <a href="#" className="hover:text-indigo-600">Contact Support</a>
          </div>
          <div className="text-sm text-slate-400">
            © {new Date().getFullYear()} ReviveAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
