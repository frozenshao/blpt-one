import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  FolderKanban, 
  FlaskConical, 
  X,
  Calendar
} from 'lucide-react';

import { PathologySample } from '../types/pathology';
import { RESEARCH_PROJECTS } from '../data/toxicologyStatsData';
import { BackgroundLesionsSection } from './stats/BackgroundLesionsSection';
import { ProjectLesionsSection } from './stats/ProjectLesionsSection';
import { CrossStrainSection } from './stats/CrossStrainSection';
import { TestArticleTargetOrgansSection } from './stats/TestArticleTargetOrgansSection';

interface StatsDashboardProps {
  samples: PathologySample[];
  customCohortSamples?: PathologySample[] | null;
  onClearCustomCohort?: () => void;
}

export type TimeRange = 'all' | '1year' | '3years' | '5years' | 'custom';

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ 
  samples, 
  customCohortSamples, 
  onClearCustomCohort 
}) => {
  // 项目标签筛选（单选，默认为全部）
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const getTodayStr = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };
  const getOneYearAgoStr = () => {
    const now = new Date();
    const y = now.getFullYear() - 1;
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 时间筛选条件：全部，近1年，近3年，近5年，自定义。默认选中全部
  const [timeFilter, setTimeFilter] = useState<TimeRange>('all');
  // 自定义时间范围默认显示当日时间及向前推的近一年日期
  const [customStartDate, setCustomStartDate] = useState<string>(getOneYearAgoStr);
  const [customEndDate, setCustomEndDate] = useState<string>(getTodayStr);

  const currentProject = RESEARCH_PROJECTS.find(p => p.id === selectedProjectId) || RESEARCH_PROJECTS[0];

  const subProjects = RESEARCH_PROJECTS.filter(p => p.id !== 'all');
  const sumSubSamples = subProjects.reduce((sum, p) => sum + p.sampleCount, 0);
  const sumSubPositives = subProjects.reduce((sum, p) => sum + p.positiveCount, 0);

  // Dynamic Metrics based on selected project
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

  // Time-based statistics when selectedProjectId === 'all'
  const timeStats = useMemo(() => {
    switch (timeFilter) {
      case '1year': // 2026
        return { total: 130, normals: 56, lesions: 74, cumulative: 1680 };
      case '3years': // 2024-2026
        return { total: 980, normals: 446, lesions: 534, cumulative: 1680 };
      case '5years': // 2022-2026
        return { total: 1190, normals: 574, lesions: 616, cumulative: 1680 };
      case 'custom':
        return { total: 720, normals: 350, lesions: 370, cumulative: 1680 };
      case 'all':
      default:
        return { total: 1680, normals: 864, lesions: 816, cumulative: 1680 };
    }
  }, [timeFilter]);

  const currentTotal = selectedProjectId === 'all' ? timeStats.total : total;
  const currentNormal = selectedProjectId === 'all' ? timeStats.normals : normalCount;
  const currentLesion = selectedProjectId === 'all' ? timeStats.lesions : lesionCount;
  const normalPercentage = currentTotal > 0 ? ((currentNormal / currentTotal) * 100).toFixed(1) : '0';
  const lesionPercentage = currentTotal > 0 ? ((currentLesion / currentTotal) * 100).toFixed(1) : '0';

  // Custom cohort statistics for user custom cohort
  const isCustomCohortActive = !!(customCohortSamples && customCohortSamples.length > 0);

  const cohortTotal = customCohortSamples ? customCohortSamples.length : 0;
  const cohortLesionCount = customCohortSamples ? customCohortSamples.filter(s => s.isLesion).length : 0;
  const cohortNormalCount = cohortTotal - cohortLesionCount;
  const cohortRate = cohortTotal > 0 ? `${((cohortLesionCount / cohortTotal) * 100).toFixed(1)}%` : '0%';

  // Cohort species counts
  const cohortOrganMap: Record<string, number> = {};
  const cohortTestArticleMap: Record<string, number> = {};

  if (customCohortSamples) {
    customCohortSamples.forEach(s => {
      if (s.organ) cohortOrganMap[s.organ] = (cohortOrganMap[s.organ] || 0) + 1;
      const cat = s.testArticleCategory || '其他';
      cohortTestArticleMap[cat] = (cohortTestArticleMap[cat] || 0) + 1;
    });
  }

  const cohortOrganData = Object.entries(cohortOrganMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }));

  const cohortTestData = Object.entries(cohortTestArticleMap)
    .map(([name, count]) => ({ name, count }));

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#bcd7ee',
    borderRadius: 8,
    fontSize: 12,
    color: '#102a48',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="space-y-6">
      {/* Custom Cohort Active Bar */}
      {isCustomCohortActive && (
        <div className="bg-gradient-to-r from-[#18446b] via-[#245887] to-[#18446b] text-white p-5 rounded-2xl shadow-md border border-[#0e3b66] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#18446b] tracking-wider uppercase">
                  已启用自定义分析队列
                </span>
                <span className="text-xs text-sky-200">
                  当前统计视图已锁定为勾选的样本集
                </span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>自定义勾选切片样本统计分析</span>
                <span className="font-mono text-white text-base">({cohortTotal})</span>
              </h3>
            </div>

            <button
              type="button"
              onClick={onClearCustomCohort}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold backdrop-blur-xs border border-white/30 transition-all cursor-pointer self-start sm:self-auto"
            >
              <X className="w-4 h-4" />
              <span>退出勾选统计 • 查看全库</span>
            </button>
          </div>

          {/* Quick Metrics of Selected Cohort */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-900">
            <div className="bg-white/95 rounded-xl p-3 shadow-2xs border border-white/50">
              <div className="text-[11px] text-slate-500 font-medium">已选切片总量</div>
              <div className="text-xl font-bold font-mono text-[#102a48]">{cohortTotal}</div>
            </div>
            <div className="bg-white/95 rounded-xl p-3 shadow-2xs border border-white/50">
              <div className="text-[11px] text-slate-500 font-medium">正常切片数</div>
              <div className="text-xl font-bold font-mono text-emerald-600">{cohortNormalCount}</div>
            </div>
            <div className="bg-white/95 rounded-xl p-3 shadow-2xs border border-white/50">
              <div className="text-[11px] text-slate-500 font-medium">病变切片数</div>
              <div className="text-xl font-bold font-mono text-rose-600">{cohortLesionCount}</div>
            </div>
            <div className="bg-white/95 rounded-xl p-3 shadow-2xs border border-white/50">
              <div className="text-[11px] text-slate-500 font-medium">占比</div>
              <div className="text-xl font-bold font-mono text-[#0e3b66]">{cohortRate}</div>
            </div>
          </div>

          {/* Custom Cohort Visual Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="bg-white rounded-xl p-4 shadow-2xs text-slate-900 border border-slate-100">
              <h4 className="text-xs font-bold text-[#102a48] mb-2">勾选样本各系统/脏器分布</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortOrganData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" name="切片例数" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-2xs text-slate-900 border border-slate-100">
              <h4 className="text-xs font-bold text-[#102a48] mb-2">勾选样本受试物分类构成</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cohortTestData}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" name="样本数" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1) 独立页面标题：不与筛选条件在一个框内 */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18446b] to-[#0e3b66] text-white flex items-center justify-center shadow-xs">
          <FlaskConical className="w-5 h-5 text-sky-200" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102a48] tracking-tight">
          统计分析
        </h1>
      </div>

      {/* 2) 筛选条件栏：项目名称下拉框与时间范围在同一行显示 */}
      <div className="bg-[#f0f6fc] border border-[#bcd7ee] p-4 rounded-xl shadow-2xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* 项目名称下拉框：不显示数据量 */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#102a48] shrink-0">
              项目名称:
            </span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              aria-label="选择项目名称"
              className="bg-white border border-[#bcd7ee] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#102a48] shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-[#18446b] cursor-pointer min-w-[160px]"
            >
              {RESEARCH_PROJECTS.map((proj) => (
                <option key={proj.id} value={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
          </div>

          {/* 时间范围筛选 */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#102a48]">
              <Calendar className="w-3.5 h-3.5 text-[#0e3b66]" />
              <span>时间范围:</span>
            </div>
            <div className="inline-flex items-center bg-white p-0.5 rounded-lg border border-[#bcd7ee] text-xs">
              {(['all', '1year', '3years', '5years', 'custom'] as const).map((key) => {
                const labels: Record<TimeRange, string> = {
                  all: '全部',
                  '1year': '近1年',
                  '3years': '近3年',
                  '5years': '近5年',
                  custom: '自定义'
                };
                const isSelected = timeFilter === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTimeFilter(key)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0e3b66] text-white shadow-xs font-semibold'
                        : 'text-[#102a48]/70 hover:text-[#102a48] hover:bg-slate-100'
                    }`}
                  >
                    {labels[key]}
                  </button>
                );
              })}
            </div>

            {/* 自定义时间范围输入框 */}
            {timeFilter === 'custom' && (
              <div className="flex items-center gap-2 text-xs bg-white border border-[#bcd7ee] px-2.5 py-1 rounded-lg shadow-2xs">
                <span className="text-slate-500">从:</span>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="bg-transparent border-b border-slate-300 focus:outline-hidden text-[#102a48] text-xs"
                />
                <span className="text-slate-500">至:</span>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="bg-transparent border-b border-slate-300 focus:outline-hidden text-[#102a48] text-xs"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Project Lesions Analytics */}
      <div className="space-y-6">
        {/* Top Metric Cards: GDC Unified Summary Bar from reference image */}
        <div className="bg-white border border-[#a4c3de] rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#bcd7ee]/60">
          <div className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#f0f6fc] border border-[#bcd7ee] flex items-center justify-center text-[#0e3b66] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">
                切片总数
              </div>
              <div className="text-2xl font-black text-[#102a48] font-mono tracking-tight">{currentTotal}</div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">正常切片数</div>
              <div className="text-2xl font-black text-emerald-600 font-mono tracking-tight">{currentNormal}</div>
              <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                占比 {normalPercentage}%
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fff1f2] border border-[#fecdd3] flex items-center justify-center text-[#f43f5e] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">
                病变切片数
              </div>
              <div className="text-2xl font-black text-[#f43f5e] font-mono tracking-tight">{currentLesion}</div>
              <div className="text-[10px] text-[#f43f5e] font-medium mt-0.5">
                占比 {lesionPercentage}%
              </div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-amber-600 shrink-0">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">
                项目数
              </div>
              <div className="text-2xl font-black text-amber-600 font-mono tracking-tight">
                {selectedProjectId === 'all' ? subProjects.length : 1}
              </div>
            </div>
          </div>
        </div>

        {/* 背景性病变统计模块 */}
        <BackgroundLesionsSection projectId={selectedProjectId} timeRange={timeFilter} />

        {/* “项目筛选”选中具体项目时显示“病变对照统计”模块 */}
        {selectedProjectId !== 'all' && (
          <ProjectLesionsSection projectId={selectedProjectId} />
        )}

        {/* “项目筛选”选中“全部”时显示“不同动物种属病变对比统计”模块 */}
        {selectedProjectId === 'all' && (
          <CrossStrainSection timeRange={timeFilter} />
        )}

        {/* 不同受试物的靶器官分析 */}
        <TestArticleTargetOrgansSection timeRange={timeFilter} />
      </div>
    </div>
  );
};
