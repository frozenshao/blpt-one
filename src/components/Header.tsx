import React from 'react';
import { Microscope, Search, Sparkles, BarChart3 } from 'lucide-react';

interface HeaderProps {
  activeTab: 'search' | 'ai-classify' | 'analytics';
  setActiveTab: (tab: 'search' | 'ai-classify' | 'analytics') => void;
  totalSamples?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-blue-400/30">
              <Microscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                病理数据检索与分析平台
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="tab-search"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'search'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>数据检索</span>
            </button>

            <button
              id="tab-ai-classify"
              onClick={() => setActiveTab('ai-classify')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === 'ai-classify'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/60'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeTab === 'ai-classify' ? 'text-amber-300' : 'text-amber-500'}`} />
              <span>AI组织识别</span>
            </button>

            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">统计分析</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
