import React from 'react';
import { Leaf, Scale, ShieldCheck, Sparkles, LayoutDashboard, Compass, QrCode, RotateCcw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'journey' | 'dashboard' | 'passports';
  setActiveTab: (tab: 'journey' | 'dashboard' | 'passports') => void;
  onResetDemo: () => void;
  passportsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetDemo,
  passportsCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('journey')}>
            <div className="w-10 h-10 rounded-xl bg-[#0a2e24] flex items-center justify-center text-[#10b981] shadow-md shadow-[#0a2e24]/15 ring-1 ring-emerald-600/30">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xl tracking-tight text-slate-900 font-serif">
                  Carbon<span className="text-[#0a2e24]">Commerce</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 mr-1 text-emerald-600" />
                  AI-Powered B2B
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium hidden md:block truncate max-w-md">
                Procurement decisions that optimize Cost, Carbon and Reliability — together.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              id="nav-btn-journey"
              onClick={() => setActiveTab('journey')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'journey'
                  ? 'bg-[#0a2e24] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Sourcing Flow</span>
            </button>

            <button
              id="nav-btn-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#0a2e24] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Dashboard</span>
            </button>

            <button
              id="nav-btn-passports"
              onClick={() => setActiveTab('passports')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all relative ${
                activeTab === 'passports'
                  ? 'bg-[#0a2e24] text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Passports</span>
              {passportsCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0a2e24] border border-emerald-300">
                  {passportsCount}
                </span>
              )}
            </button>

            {/* Quick Demo Reset */}
            <button
              id="btn-reset-demo"
              onClick={onResetDemo}
              title="Reset to 10,000 kg Aluminium Worked Example"
              className="hidden lg:flex items-center space-x-1 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0a2e24] hover:bg-emerald-50/70 rounded-xl border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Worked Demo</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
