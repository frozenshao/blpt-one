import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  Dna, 
  Layers, 
  ShieldCheck, 
  Filter, 
  FlaskConical, 
  Radio, 
  Activity,
  FileSpreadsheet
} from 'lucide-react';
import { PathologySample } from '../types/pathology';
import { RESEARCH_PROJECTS } from '../data/toxicologyStatsData';
import { BackgroundLesionsSection } from './stats/BackgroundLesionsSection';
import { ProjectLesionsSection } from './stats/ProjectLesionsSection';
import { CrossStrainSection } from './stats/CrossStrainSection';

interface StatsDashboardProps {
  samples: PathologySample[];
}

const COLORS = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#059669', '#d97706', '#dc2626'];
const BINARY_COLORS = ['#10b981', '#ef4444'];

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ samples }) => {
  // 1. 研究项目筛选条件，单选，默认为全部
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const currentProject = RESEARCH_PROJECTS.find(p => p.id === selectedProjectId) || RESEARCH_PROJECTS[0];

  const subProjects = RESEARCH_PROJECTS.filter(p => p.id !== 'all');
  const sumSubSamples = subProjects.reduce((sum, p) => sum + p.sampleCount, 0);
  const sumSubPositives = subProjects.reduce((sum, p) => sum + p.positiveCount, 0);

  // Dynamic Metrics based on selected project (全部下的样本数据量为子项目样本数量之和)
  const total = selectedProjectId === 'all' 
    ? sumSubSamples 
    : currentProject.sampleCount;

  const lesionCount = selectedProjectId === 'all' 
    ? sumSubPositives 
    : currentProject.positiveCount;

  const normalCount = total - lesionCount;
  const lesionRate = selectedProjectId === 'all'
    ? `${((lesionCount / total) * 100).toFixed(1)}%`
    : currentProject.positiveRate;

  // Organ distribution
  const organCounts: Record<string, number> = {};
  if (selectedProjectId === 'exp-2026001') {
    organCounts['肝'] = 180;
    organCounts['肾'] = 120;
    organCounts['肺'] = 80;
    organCounts['脾'] = 60;
    organCounts['心'] = 40;
  } else if (selectedProjectId === 'exp-2026002') {
    organCounts['肾'] = 140;
    organCounts['肝'] = 100;
    organCounts['心'] = 40;
    organCounts['胃'] = 25;
    organCounts['脾'] = 15;
  } else {
    organCounts['肝'] = 280;
    organCounts['肾'] = 260;
    organCounts['肺'] = 80;
    organCounts['心'] = 80;
    organCounts['脾'] = 75;
    organCounts['胃'] = 25;
  }
  const organData = Object.entries(organCounts).map(([name, count]) => ({ name, count }));

  // Binary data
  const binaryData = [
    { name: '正常组织 (Normal)', value: normalCount },
    { name: '病变组织 (Lesion)', value: lesionCount }
  ];

  // Species distribution
  const speciesData = selectedProjectId === 'exp-2026001'
    ? [{ name: 'C57BL/6J 小鼠', value: 160 }]
    : selectedProjectId === 'exp-2026002'
    ? [{ name: 'SD 大鼠 (Sprague-Dawley)', value: 100 }]
    : [
        { name: 'C57BL/6J 小鼠', value: 160 },
        { name: 'SD 大鼠 (Sprague-Dawley)', value: 100 }
      ];

  const tooltipStyle = { 
    backgroundColor: '#ffffff', 
    borderColor: '#e2e8f0', 
    borderRadius: 8, 
    fontSize: 12, 
    color: '#0f172a',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="space-y-6">
      {/* 1. 统计分析 */}
      <div className="bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
              <FlaskConical className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              统计分析
            </h2>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>当前筛选项目：<strong className="text-slate-900">{currentProject.name}</strong></span>
          </div>
        </div>

        {/* Radio Pill Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {RESEARCH_PROJECTS.map((proj) => {
            const isSelected = selectedProjectId === proj.id;
            return (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProjectId(proj.id)}
                className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-slate-100/70 hover:border-slate-300'
                }`}
              >
                {/* Radio Indicator */}
                <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-600' 
                    : 'border-slate-300 bg-white'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-800'}`}>
                      {proj.name}
                    </span>
                  </div>
                  {proj.id !== 'all' && (
                    <div className="text-[11px] text-slate-500 truncate">
                      {proj.duration} • {proj.studyCode}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="text-[11px] text-slate-400">
                      样本: {proj.id === 'all' ? sumSubSamples : proj.sampleCount}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Metric Cards: Responsive to Selected Project */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">
              病理切片样本总数
            </div>
            <div className="text-2xl font-black text-slate-900 font-mono">{total}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">正常组织切片基线</div>
            <div className="text-2xl font-black text-emerald-600 font-mono">{normalCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">
              病理异常/病变切片
            </div>
            <div className="text-2xl font-black text-rose-600 font-mono">{lesionCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">病变阳性检出率</div>
            <div className="text-2xl font-black text-amber-600 font-mono">{lesionRate}</div>
          </div>
        </div>
      </div>

      {/* 3. 背景性病变统计模块 (Always Shown as Requested: 雄性SD大鼠，病变-肝脏小肉芽肿，发生率XX。雌性的发生率X) */}
      <BackgroundLesionsSection />

      {/* 4. “研究项目”选中某一个具体项目时，增加显示“各类病变统计”模块 */}
      {selectedProjectId !== 'all' && (
        <ProjectLesionsSection projectId={selectedProjectId} />
      )}

      {/* 5. “研究项目”选中全部时，增加显示“不同品系动物病变统计”模块 */}
      {selectedProjectId === 'all' && (
        <CrossStrainSection />
      )}

      {/* General Pathology Distribution Charts (Note: “切片染色与制备技术分类” is completely deleted as requested!) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organ Distribution Bar Chart */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            <span>
              {selectedProjectId === 'all' ? '器官 / 组织类型样本分布统计' : `${currentProject.name} · 受检靶器官分布`}
            </span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={organData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Normal vs Lesion Binary Pie */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {selectedProjectId === 'all' ? '正常组织 vs 病变组织二分类比例' : `${currentProject.name} · 正常 vs 病变阳性构成`}
            </span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={binaryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {binaryData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={BINARY_COLORS[index % BINARY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Animal Species Breakdown */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Dna className="w-4 h-4 text-indigo-600" />
            <span>
              {selectedProjectId === 'all' ? '样本来源动物种属与品系构成' : `${currentProject.name} · 受试动物品系信息`}
            </span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={speciesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }: { name?: string; value?: number }) => `${name || ''}: ${value || 0}`}
                >
                  {speciesData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
