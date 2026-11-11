import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Users, 
  FileText, 
  Dna
} from 'lucide-react';
import { AnimalSpecies } from '../types/pathology';

interface HomePageProps {
  onNavigate: (
    tab: 'home' | 'search' | 'ai-classify' | 'analytics', 
    filters?: {
      projectName?: string;
      species?: AnimalSpecies;
      animalType?: string;
      animalTypes?: string[];
      organ?: string;
      keyword?: string;
    }
  ) => void;
}

// 1. 真实动物病理相关的动物种属切片分布数据
const SPECIES_PROGRESS_DISTRIBUTION: {
  name: string;
  count: number;
  color: string;
  maxVal: number;
}[] = [
  { name: '小鼠', count: 1420, color: '#18446b', maxVal: 1500 },
  { name: '大鼠', count: 1080, color: '#4a386d', maxVal: 1500 },
  { name: '食蟹猴', count: 380, color: '#0f766e', maxVal: 1500 },
  { name: '比格犬', count: 260, color: '#047857', maxVal: 1500 },
  { name: '新西兰兔', count: 180, color: '#b45309', maxVal: 1500 },
  { name: '小型猪', count: 110, color: '#4338ca', maxVal: 1500 },
  { name: '豚鼠', count: 80, color: '#be123c', maxVal: 1500 },
  { name: '斑马鱼', count: 60, color: '#0e7490', maxVal: 1500 },
];

// 2. 项目概览数据集 (按照创建时间倒序排列，删除例/张单位，主要脏器显示系统/脏器)
const TOXICOLOGY_PROJECTS = [
  {
    moduleCode: '模块 06',
    title: '神经毒性试验',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    intro: '检测中枢与外周神经系统结构病理',
    createdAt: '2026-03-15',
    cases: '130',
    slides: '260',
    lesions: '61',
    lesionRate: '46.9%',
    primaryOrgans: ['神经系统/大脑皮质', '神经系统/海马', '神经系统/坐骨神经'],
    filterProjectName: '神经毒性试验',
  },
  {
    moduleCode: '模块 05',
    title: '局部刺激试验',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intro: '观察给药接触局部的组织炎性反应',
    createdAt: '2026-02-28',
    cases: '180',
    slides: '360',
    lesions: '88',
    lesionRate: '48.9%',
    primaryOrgans: ['骨骼组织/皮肤', '心血管系统/血管壁', '神经系统/眼黏膜'],
    filterProjectName: '局部刺激试验',
  },
  {
    moduleCode: '模块 04',
    title: '生殖毒性试验',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    intro: '评估生殖器官及胚胎发育病理损伤',
    createdAt: '2026-01-20',
    cases: '190',
    slides: '380',
    lesions: '78',
    lesionRate: '41.1%',
    primaryOrgans: ['生殖系统/睾丸', '生殖系统/卵巢', '生殖系统/子宫'],
    filterProjectName: '生殖毒性试验',
  },
  {
    moduleCode: '模块 03',
    title: '致癌性试验',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    intro: '筛查长期暴露的组织肿瘤病理潜能',
    createdAt: '2025-11-12',
    cases: '310',
    slides: '620',
    lesions: '186',
    lesionRate: '60.0%',
    primaryOrgans: ['呼吸系统/肺脏', '泌尿系统/膀胱', '内分泌系统/甲状腺'],
    filterProjectName: '致癌性试验',
  },
  {
    moduleCode: '模块 02',
    title: '急性毒性试验',
    badgeClass: 'bg-rose-50 text-rose-600 border-rose-200',
    intro: '评估单次超大剂量的急性病理损伤',
    createdAt: '2025-08-06',
    cases: '240',
    slides: '480',
    lesions: '142',
    lesionRate: '59.2%',
    primaryOrgans: ['消化系统/胃', '消化系统/肝脏', '消化系统/小肠'],
    filterProjectName: '急性毒性试验',
  },
  {
    moduleCode: '模块 01',
    title: '长期毒性试验',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    intro: '评估长期重复暴露的蓄积脏器毒性',
    createdAt: '2025-05-18',
    cases: '520',
    slides: '1040',
    lesions: '295',
    lesionRate: '56.7%',
    primaryOrgans: ['消化系统/肝脏', '泌尿系统/肾脏', '心血管系统/心脏'],
    filterProjectName: '长期毒性试验',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-10">
      {/* 1. Hero Overview Section: GDC Portal Atmospheric Blue Texture & Clean Typography */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#b4cce2] via-[#c6dcee] to-[#d8e7f5] border border-[#a4c3de] rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Subtle cloudy biological background depth */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Platform Banner & Core Summary */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl sm:text-[28px] font-black text-[#102a48] tracking-tight leading-snug">
                欢迎访问病理数据检索与分析平台
              </h1>
              <p className="font-mono text-xs sm:text-[13px] font-bold text-[#1d4f7c] tracking-wide mt-1.5 mb-3">
                Pathology Data Retrieval and Analysis Platform
              </p>
              <p className="text-xs sm:text-sm text-[#274667] leading-relaxed max-w-xl font-medium">
                本平台建于2026年，收录3,520+例高质量病理切片数据，支持多维智能检索、AI组织二分类与病理统计全景分析。
              </p>

              {/* Action Button: GDC Navy button style */}
              <div className="mt-5">
                <button
                  onClick={() => onNavigate('search')}
                  className="inline-flex items-center gap-2 bg-[#0e3b66] hover:bg-[#164a7c] text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow transition-all active:scale-[0.99] group cursor-pointer"
                >
                  <span>浏览平台数据</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            {/* 4 Stat Metric Cards in a Row: Clean white floating strip with GDC style circular icons */}
            <div className="mt-7">
              <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 shadow-sm grid grid-cols-2 sm:grid-cols-4 p-3 sm:p-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
                {/* 1. Projects */}
                <div className="flex items-center gap-3 p-1.5 sm:px-3">
                  <div className="w-9 h-9 rounded-full bg-[#fef3ee] border border-[#fcd8c7] flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-[#d9534f]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 leading-none font-mono">6</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">项目数</div>
                  </div>
                </div>

                {/* 2. 切片数 */}
                <div className="flex items-center gap-3 p-1.5 sm:px-3">
                  <div className="w-9 h-9 rounded-full bg-[#fef3ee] border border-[#fcd8c7] flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-[#d9534f]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 leading-none font-mono">3,520</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">切片数</div>
                  </div>
                </div>

                {/* 3. 动物数 (原样本数，移动至切片数后面) */}
                <div className="flex items-center gap-3 p-1.5 sm:px-3">
                  <div className="w-9 h-9 rounded-full bg-[#fef3ee] border border-[#fcd8c7] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-[#d9534f]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 leading-none font-mono">1,680</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">动物数</div>
                  </div>
                </div>

                {/* 4. Species */}
                <div className="flex items-center gap-3 p-1.5 sm:px-3">
                  <div className="w-9 h-9 rounded-full bg-[#fef3ee] border border-[#fcd8c7] flex items-center justify-center shrink-0">
                    <Dna className="w-4 h-4 text-[#d9534f]" />
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900 leading-none font-mono">8</div>
                    <div className="text-xs font-bold text-slate-700 mt-1">涵盖种属</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 动物种属切片分布 (高度为5条数据的高度，展示不下时滚动) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white/95 backdrop-blur-xs rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex-1 flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-extrabold text-[#102a48] tracking-tight">
                  动物种属切片分布
                </span>
              </div>

              {/* Progress Bar List: 高度设置为5条数据的高度(约188px)，超出5条时支持纵向滚动 */}
              <div className="space-y-2.5 my-3 max-h-[188px] overflow-y-auto pr-1">
                {SPECIES_PROGRESS_DISTRIBUTION.map((item) => {
                  const widthPercent = (item.count / item.maxVal) * 100;
                  return (
                    <div 
                      key={item.name}
                      onClick={() => onNavigate('search', { animalType: item.name })}
                      className="group cursor-pointer"
                      title={`点击筛选 ${item.name} 切片数据`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-slate-700 group-hover:text-[#18446b] transition-colors">
                          {item.name}
                        </span>
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${widthPercent}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Middle Section: 项目概览 */}
      <section className="bg-gradient-to-r from-[#453468] via-[#4d3b72] to-[#3f2f5f] rounded-2xl p-6 sm:p-7 text-white shadow-sm space-y-5">
        {/* Left-aligned Heading */}
        <div className="text-left">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            项目概览
          </h2>
        </div>

        {/* 6 Project Cards (3x2 Grid) - 按照创建时间倒序排列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOXICOLOGY_PROJECTS.map((proj, idx) => (
            <div
              key={proj.title}
              onClick={() => onNavigate('search', { projectName: proj.filterProjectName })}
              className="bg-white rounded-xl border border-slate-200/90 hover:border-purple-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between group cursor-pointer text-slate-800"
            >
              {/* Header row: Index, Title, and 创建时间 */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                    <span className="font-mono text-slate-400 mr-2">{String(idx + 1).padStart(2, '0')}</span>
                    {proj.title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 shrink-0">
                    创建时间: {proj.createdAt}
                  </div>
                </div>
                {/* Project Intro */}
                <p className="text-xs text-slate-500 leading-relaxed mt-2 mb-3.5">
                  {proj.intro}
                </p>
              </div>

              {/* 4 Metric Stats: 切片数, 动物数, 病变动物数, 病变率 (不含例、张单位) */}
              <div className="grid grid-cols-4 gap-1.5 text-center py-2">
                <div className="bg-slate-50/70 rounded-md py-1.5 px-0.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400">切片数</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5 truncate">{proj.slides}</div>
                </div>
                <div className="bg-slate-50/70 rounded-md py-1.5 px-0.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400">动物数</div>
                  <div className="text-xs font-bold text-slate-800 font-mono mt-0.5 truncate">{proj.cases}</div>
                </div>
                <div className="bg-slate-50/70 rounded-md py-1.5 px-0.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400">病变动物数</div>
                  <div className="text-xs font-bold text-[#0e3b66] font-mono mt-0.5 truncate">{proj.lesions}</div>
                </div>
                <div className="bg-slate-50/70 rounded-md py-1.5 px-0.5 border border-slate-100">
                  <div className="text-[10px] text-slate-400">病变率</div>
                  <div className="text-xs font-bold text-rose-600 font-mono mt-0.5 truncate">{proj.lesionRate}</div>
                </div>
              </div>

              {/* Primary Organs: 显示具体的消化系统及脏器，例如“消化系统/肝脏” */}
              <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-500 flex-wrap">
                <span className="text-slate-400 text-[10px]">主要脏器:</span>
                {proj.primaryOrgans.map((organ) => (
                  <span
                    key={organ}
                    className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-medium"
                  >
                    {organ}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
