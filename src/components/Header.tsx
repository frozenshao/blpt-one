import React from 'react';
import { Microscope, Sparkles, BarChart3, LayoutGrid, Search } from 'lucide-react';

export type NavigationTab = 'home' | 'search' | 'ai-classify' | 'analytics';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  onSearch?: (keyword: string) => void;
  totalSamples?: number;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#a4c3de]/70 text-slate-800 sticky top-0 z-40 shadow-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0e3b66] flex items-center justify-center shadow-xs text-white">
              <Microscope className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-[#102a48]">
                病理数据检索与分析平台
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Centered/Fluid) */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            {/* 1. 首页 */}
            <button
              id="tab-home"
              onClick={() => setActiveTab('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#204467] hover:text-[#0e3b66] hover:bg-[#edf4fb]'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>首页</span>
            </button>

            {/* 2. 多维检索 */}
            <button
              id="tab-search"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'search'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#204467] hover:text-[#0e3b66] hover:bg-[#edf4fb]'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>多维检索</span>
            </button>

            {/* 3. AI组织识别 */}
            <button
              id="tab-ai-classify"
              onClick={() => setActiveTab('ai-classify')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'ai-classify'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#204467] hover:text-[#0e3b66] hover:bg-[#edf4fb]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI组织识别</span>
            </button>

            {/* 4. 统计分析 */}
            <button
              id="tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#204467] hover:text-[#0e3b66] hover:bg-[#edf4fb]'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>统计分析</span>
            </button>
          </nav>

        </div>
      </div>
    </header>
  );
};
