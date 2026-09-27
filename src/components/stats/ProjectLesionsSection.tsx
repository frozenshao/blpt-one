import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  FlaskConical, 
  Layers, 
  ShieldAlert
} from 'lucide-react';
import { 
  PROJECT_2026001_LESIONS, 
  PROJECT_2026002_LESIONS, 
  ProjectLesionStatItem,
  RESEARCH_PROJECTS
} from '../../data/toxicologyStatsData';

interface ProjectLesionsSectionProps {
  projectId: string; // 'exp-2026001' | 'exp-2026002'
}

export const ProjectLesionsSection: React.FC<ProjectLesionsSectionProps> = ({ projectId }) => {
  const currentProject = RESEARCH_PROJECTS.find(p => p.id === projectId) || RESEARCH_PROJECTS[1];
  const rawList: ProjectLesionStatItem[] = projectId === 'exp-2026002' 
    ? PROJECT_2026002_LESIONS 
    : PROJECT_2026001_LESIONS;

  const [selectedCohort, setSelectedCohort] = useState<string>('全部剂量组');
  const [selectedGender, setSelectedGender] = useState<string>('全部性别');

  // Extract cohorts for filter
  const cohortOptions = ['全部剂量组', ...Array.from(new Set(rawList.map(item => item.cohort)))];
  const genderOptions = ['全部性别', '雄性', '雌性'];

  const filteredData = rawList.filter(item => {
    if (selectedCohort !== '全部剂量组' && item.cohort !== selectedCohort) return false;
    if (selectedGender !== '全部性别' && item.gender !== selectedGender) return false;
    return true;
  });

  // Prepare chart data: incidence rate & severity grades by group
  const chartData = filteredData.map(item => ({
    name: `${item.cohort.split(' ')[0]}·${item.gender}`,
    cohort: item.cohort,
    gender: item.gender,
    lesion: item.lesionName,
    '发生率 (%)': item.incidenceRate,
    '1级 极轻度': item.severityDistribution.grade1Minimal,
    '2级 轻度': item.severityDistribution.grade2Mild,
    '3级 中度': item.severityDistribution.grade3Moderate,
    '4级 重度': item.severityDistribution.grade4Marked,
    totalAnimals: item.totalAnimals,
    affectedAnimals: item.affectedAnimals,
    dominantSeverity: item.dominantSeverity
  }));

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 8,
    fontSize: 12,
    color: '#0f172a',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        {/* Row 1: Title */}
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
            <FlaskConical className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            各类病变统计 • {currentProject.name}
          </h3>
        </div>

        {/* Row 2: Filter Controls on the right */}
        <div className="flex justify-end">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-500">剂量组:</span>
              <select
                value={selectedCohort}
                onChange={(e) => setSelectedCohort(e.target.value)}
                aria-label="筛选试验剂量组"
                className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {cohortOptions.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
              <span className="font-medium text-slate-500">性别:</span>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                aria-label="筛选动物性别"
                className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
              >
                {genderOptions.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Chart: Incidence & Severity Grade Distribution */}
      <div className="w-full bg-slate-50/60 border border-slate-200/70 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-indigo-600" />
            <span>各剂量组病变发生率与病变程度分级构成</span>
          </h4>
          <span className="text-[11px] text-slate-400">单位: 发生率 % (柱状高)</span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={11} 
                angle={-15} 
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip 
                contentStyle={tooltipStyle}
                formatter={(value: any, name: any, item: any) => {
                  if (name === '发生率 (%)') {
                    return [`${value}% (${item.payload.affectedAnimals}/${item.payload.totalAnimals})`, '病变发生率'];
                  }
                  return [`${value} 只`, name];
                }}
                labelFormatter={(_label, payload) => {
                  if (payload && payload.length > 0) {
                    const d = payload[0].payload;
                    return `${d.cohort} · ${d.gender} · ${d.lesion} (主导严重度: ${d.dominantSeverity})`;
                  }
                  return '';
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
              <Bar dataKey="发生率 (%)" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Lesion Statistics Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            {currentProject.name} · 各类病变发生率与病变程度明细表 (共 {filteredData.length} 项)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">GLP-TOX-REP-2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">试验剂量组</th>
                <th className="py-2.5 px-3">动物性别</th>
                <th className="py-2.5 px-3">靶器官</th>
                <th className="py-2.5 px-3">病变名称</th>
                <th className="py-2.5 px-3">受累/总数</th>
                <th className="py-2.5 px-3">发生率 (%)</th>
                <th className="py-2.5 px-3">病变程度</th>
                <th className="py-2.5 px-3">程度分级分布 (1/2/3/4级)</th>
                <th className="py-2.5 px-3">显著性(P值)</th>
                <th className="py-2.5 px-3" style={{ width: '5cm', minWidth: '5cm' }}>病理学评价与毒理学意义</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      item.cohort.includes('对照') 
                        ? 'bg-slate-100 text-slate-700'
                        : item.cohort.includes('低剂量')
                        ? 'bg-blue-50 text-blue-700'
                        : item.cohort.includes('中剂量')
                        ? 'bg-amber-50 text-amber-800'
                        : 'bg-rose-50 text-rose-700'
                    }`}>
                      {item.cohort}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                    <span className={item.gender === '雄性' ? 'text-blue-700' : 'text-rose-700'}>
                      {item.gender}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {item.organ}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">
                    {item.lesionName}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                    {item.affectedAnimals} / {item.totalAnimals}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {item.incidenceRate.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                    {item.dominantSeverity}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded mr-1" title="1级 极轻度">
                      G1:{item.severityDistribution.grade1Minimal}
                    </span>
                    <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded mr-1" title="2级 轻度">
                      G2:{item.severityDistribution.grade2Mild}
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded mr-1" title="3级 中度">
                      G3:{item.severityDistribution.grade3Moderate}
                    </span>
                    <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded" title="4级 重度">
                      G4:{item.severityDistribution.grade4Marked}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                    <span className={item.pValueVsControl?.includes('*') ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {item.pValueVsControl || '-'}
                    </span>
                  </td>
                  <td 
                    className="py-2.5 px-3 text-slate-500 text-[11px]" 
                    style={{ width: '5cm', minWidth: '5cm' }} 
                    title={item.pathologyAssessment}
                  >
                    {item.pathologyAssessment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
