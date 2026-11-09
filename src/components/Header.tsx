import React, { useState } from 'react';
import { 
  Microscope, 
  Sparkles, 
  BarChart3, 
  LayoutGrid, 
  Search, 
  Settings, 
  Users, 
  User as UserIcon, 
  KeyRound, 
  LogOut, 
  ChevronDown,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types/user';

export type NavigationTab = 'home' | 'search' | 'ai-classify' | 'analytics' | 'users';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentUser?: User | null;
  onOpenChangePassword?: () => void;
  onLogout?: () => void;
  onSearch?: (keyword: string) => void;
  totalSamples?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab,
  currentUser,
  onOpenChangePassword,
  onLogout
}) => {
  const [isSystemMenuHovered, setIsSystemMenuHovered] = useState(false);
  const [isUserMenuHovered, setIsUserMenuHovered] = useState(false);

  const isAdmin = currentUser?.role === 'admin' || currentUser?.username === 'admin';

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

            {/* 5. 系统管理 (仅管理员账户显示，鼠标悬浮显示“用户管理”) */}
            {isAdmin && (
              <div
                className="relative"
                onMouseEnter={() => setIsSystemMenuHovered(true)}
                onMouseLeave={() => setIsSystemMenuHovered(false)}
              >
                <button
                  id="tab-system-manage"
                  onClick={() => setActiveTab('users')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    activeTab === 'users'
                      ? 'bg-[#0e3b66] text-white shadow-xs'
                      : 'text-[#204467] hover:text-[#0e3b66] hover:bg-[#edf4fb]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>系统管理</span>
                  <ChevronDown className="w-3 h-3 opacity-70" />
                </button>

                {/* Hover Dropdown Menu */}
                {isSystemMenuHovered && (
                  <div className="absolute top-full left-0 pt-1 z-50 min-w-[130px] animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="bg-white border border-[#bcd7ee] rounded-xl shadow-lg p-1.5">
                      <button
                        onClick={() => {
                          setActiveTab('users');
                          setIsSystemMenuHovered(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                          activeTab === 'users'
                            ? 'bg-[#0e3b66] text-white'
                            : 'text-slate-700 hover:bg-[#f0f6fc] hover:text-[#0e3b66]'
                        }`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>用户管理</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Section: 登录用户名显示，鼠标悬浮显示修改密码和退出登录 2 个操作 */}
          {currentUser && (
            <div 
              className="relative"
              onMouseEnter={() => setIsUserMenuHovered(true)}
              onMouseLeave={() => setIsUserMenuHovered(false)}
            >
              <div 
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-transparent hover:border-[#bcd7ee] hover:bg-[#f0f6fc] transition-all cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-lg bg-[#0e3b66] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  <UserIcon className="w-4 h-4 text-sky-200" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-[#102a48] leading-tight">
                    {currentUser.username}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* User Actions Dropdown Menu */}
              {isUserMenuHovered && (
                <div className="absolute top-full right-0 pt-1 z-50 min-w-[140px] animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white border border-[#bcd7ee] rounded-xl shadow-xl p-1.5">
                    <div className="space-y-0.5">
                      {/* 1. 修改密码 */}
                      <button
                        id="user-menu-change-pwd"
                        onClick={() => {
                          setIsUserMenuHovered(false);
                          onOpenChangePassword?.();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#f0f6fc] hover:text-[#0e3b66] transition-all cursor-pointer text-left"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                        <span>修改密码</span>
                      </button>

                      {/* 2. 退出登录 */}
                      <button
                        id="user-menu-logout"
                        onClick={() => {
                          setIsUserMenuHovered(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer text-left"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        <span>退出登录</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};
