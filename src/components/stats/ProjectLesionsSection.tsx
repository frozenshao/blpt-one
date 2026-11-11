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
  PROJECT_TAG_LESIONS_DATA, 
  ProjectLesionStatItem
} from '../../data/toxicologyStatsData';

interface ProjectLesionsSectionProps {
  projectId: string; // '长期毒性试验' | '急性毒性试验' | '致癌性试验' | '生殖毒性试验' | '局部刺激试验' | '神经毒性试验' | '其他'
}

export const ProjectLesionsSection: React.FC<ProjectLesionsSectionProps> = ({ projectId }) => {
  const rawList: ProjectLesionStatItem[] = PROJECT_TAG_LESIONS_DATA[projectId] || PROJECT_TAG_LESIONS_DATA['长期毒性试验'] || [];

  const speciesList = ['SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', '食蟹猴'];
  const [selectedSpecies, setSelectedSpecies] = useState<string>(speciesList[0]);
  const [selectedCohort, setSelectedCohort] = useState<string>('全部');
  const [selectedGender, setSelectedGender] = useState<string>('全部');
  const [viewMetric, setViewMetric] = useState<'rate' | 'severity'>('rate');

  // Extract unique lesion names for current project
  const availableLesions = React.useMemo(() => {
    const list = Array.from(new Set(rawList.map(item => item.lesionName)));
    return list.length > 0 ? list : ['肝细胞脂肪变性'];
  }, [rawList]);

  const [selectedLesion, setSelectedLesion] = useState<string>(() => availableLesions[0] || '肝细胞脂肪变性');

  // Sync selectedLesion when project changes
  React.useEffect(() => {
    if (availableLesions.length > 0 && !availableLesions.includes(selectedLesion)) {
      setSelectedLesion(availableLesions[0]);
    }
  }, [availableLesions, selectedLesion]);

  // Extract cohorts for filter
  const cohortOptions = ['全部', ...Array.from(new Set(rawList.map(item => item.cohort)))];

  const filteredData = rawList.filter(item => {
    if (selectedLesion && item.lesionName !== selectedLesion) return false;
    if (selectedCohort !== '全部' && item.cohort !== selectedCohort) return false;
    if (selectedGender !== '全部' && item.gender !== selectedGender) return false;
    return true;
  });

  // Prepare chart data: 同一个剂量组的雌性和雄性展示在一起
  const cohortsToDisplay = selectedCohort === '全部'
    ? Array.from(new Set(rawList.filter(item => !selectedLesion || item.lesionName === selectedLesion).map(item => item.cohort)))
    : [selectedCohort];

  const chartData = cohortsToDisplay.map(cohortName => {
    const maleItem = rawList.find(item => item.cohort === cohortName && item.gender === '雄性' && (!selectedLesion || item.lesionName === selectedLesion));
    const femaleItem = rawList.find(item => item.cohort === cohortName && item.gender === '雌性' && (!selectedLesion || item.lesionName === selectedLesion));

    const maleG1 = maleItem?.severityDistribution.grade1Minimal || 0;
    const maleG2 = maleItem?.severityDistribution.grade2Mild || 0;
    const maleG3 = maleItem?.severityDistribution.grade3Moderate || 0;
    const maleG4 = maleItem?.severityDistribution.grade4Marked || 0;

    const femaleG1 = femaleItem?.severityDistribution.grade1Minimal || 0;
    const femaleG2 = femaleItem?.severityDistribution.grade2Mild || 0;
    const femaleG3 = femaleItem?.severityDistribution.grade3Moderate || 0;
    const femaleG4 = femaleItem?.severityDistribution.grade4Marked || 0;

    const shortCohort = cohortName.split(' ')[0];

    return {
      name: shortCohort,
      cohort: cohortName,
      lesion: maleItem?.lesionName || femaleItem?.lesionName || selectedLesion,
      // Incidence rate comparison
      '雄性': maleItem ? maleItem.incidenceRate : 0,
      '雌性': femaleItem ? femaleItem.incidenceRate : 0,
      maleRatio: maleItem ? `${maleItem.affectedAnimals}/${maleItem.totalAnimals}` : '0/20',
      femaleRatio: femaleItem ? `${femaleItem.affectedAnimals}/${femaleItem.totalAnimals}` : '0/20',
      // Male severity breakdown: 1级, 2级, 3级, 4级
      '雄性_1级': maleG1,
      '雄性_2级': maleG2,
      '雄性_3级': maleG3,
      '雄性_4级': maleG4,
      // Female severity breakdown: 1级, 2级, 3级, 4级
      '雌性_1级': femaleG1,
      '雌性_2级': femaleG2,
      '雌性_3级': femaleG3,
      '雌性_4级': femaleG4,
      maleTotal: maleItem ? maleItem.affectedAnimals : 0,
      femaleTotal: femaleItem ? femaleItem.affectedAnimals : 0
    };
  });

  const tooltipStyle = {
    backgroundColor: '#ffffff',
    borderColor: '#bcd7ee',
    borderRadius: 8,
    fontSize: 12,
    color: '#102a48',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const isMaleVisible = selectedGender === '全部' || selectedGender === '雄性';
  const isFemaleVisible = selectedGender === '全部' || selectedGender === '雌性';

  return (
    <div className="bg-white border border-[#a4c3de]/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#bcd7ee]/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#0e3b66]/10 text-[#0e3b66] border border-[#a4c3de]">
            <FlaskConical className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-[#102a48] tracking-tight">
            病变对照统计
          </h3>
        </div>

        {/* Filter Controls: 动物种属 -> 剂量组 -> 性别 -> 病变名称 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">动物种属:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              aria-label="筛选动物种属"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {speciesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <Layers className="w-3.5 h-3.5 text-[#18446b]/60" />
            <span className="font-medium text-[#102a48]/70">剂量组:</span>
            <select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              aria-label="筛选试验剂量组"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {cohortOptions.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">性别:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="筛选动物性别"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              <option value="全部">全部</option>
              <option value="雄性">雄性</option>
              <option value="雌性">雌性</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">病变名称:</span>
            <select
              value={selectedLesion}
              onChange={(e) => setSelectedLesion(e.target.value)}
              aria-label="筛选病变名称"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {availableLesions.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Chart: Incidence & Severity Grade Distribution */}
      <div className="w-full bg-[#f8fafc] border border-[#bcd7ee]/60 p-4 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 className="text-xs font-bold text-[#102a48] flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-[#0e3b66]" />
            <span>
              {viewMetric === 'rate'
                ? '病变率 (%)'
                : '病变动物数'}
            </span>
          </h4>

          {/* Rate vs Severity Toggle: 切换按钮移到统计图上 */}
          <div className="flex items-center gap-1 bg-[#f0f6fc] p-1 rounded-lg border border-[#bcd7ee]">
            <button
              type="button"
              onClick={() => setViewMetric('rate')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMetric === 'rate'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#102a48]'
              }`}
            >
              病变率
            </button>
            <button
              type="button"
              onClick={() => setViewMetric('severity')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMetric === 'severity'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#102a48]'
              }`}
            >
              病变程度
            </button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {viewMetric === 'rate' ? (
              /* Incidence Rate Bar Chart: 同一个剂量组的雌性和雄性展示在一起 */
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                />
                <YAxis stroke="#64748b" fontSize={11} unit="%" />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  formatter={(value: any, name: any, item: any) => {
                    const ratio = name === '雄性' ? item.payload.maleRatio : item.payload.femaleRatio;
                    return [`${value}% (${ratio})`, name];
                  }}
                  labelFormatter={(_label, payload) => {
                    if (payload && payload.length > 0) {
                      return `${payload[0].payload.cohort}`;
                    }
                    return '';
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
                {isMaleVisible && (
                  <Bar dataKey="雄性" fill="#2563eb" radius={[4, 4, 0, 0]} />
                )}
                {isFemaleVisible && (
                  <Bar dataKey="雌性" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                )}
              </BarChart>
            ) : (
              /* Severity Grade Breakdown Stacked Bar Chart: 1级, 2级, 3级, 4级 */
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={12} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={11} 
                  unit="只" 
                  allowDecimals={false}
                  label={{ value: '病变动物数', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b', dy: 40 }}
                />
                <Tooltip 
                  contentStyle={tooltipStyle}
                  formatter={(value: any, name: any) => {
                    if (Number(value) === 0) return null;
                    return [`${value} 只`, name];
                  }}
                  labelFormatter={(_label, payload) => {
                    if (payload && payload.length > 0) {
                      const d = payload[0].payload;
                      return `${d.cohort} (病变: 雄性${d.maleTotal}只 / 雌性${d.femaleTotal}只)`;
                    }
                    return '';
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
                {/* 雄性层叠柱条：1级 -> 2级 -> 3级 -> 4级 */}
                {isMaleVisible && (
                  <>
                    <Bar dataKey="雄性_1级" name="雄性 1级" stackId="male" fill="#93d5ed" />
                    <Bar dataKey="雄性_2级" name="雄性 2级" stackId="male" fill="#00a2e8" />
                    <Bar dataKey="雄性_3级" name="雄性 3级" stackId="male" fill="#2563eb" />
                    <Bar dataKey="雄性_4级" name="雄性 4级" stackId="male" fill="#4338ca" radius={[4, 4, 0, 0]} />
                  </>
                )}

                {/* 雌性层叠柱条：1级 -> 2级 -> 3级 -> 4级 */}
                {isFemaleVisible && (
                  <>
                    <Bar dataKey="雌性_1级" name="雌性 1级" stackId="female" fill="#fbcfe8" />
                    <Bar dataKey="雌性_2级" name="雌性 2级" stackId="female" fill="#f472b6" />
                    <Bar dataKey="雌性_3级" name="雌性 3级" stackId="female" fill="#db2777" />
                    <Bar dataKey="雌性_4级" name="雌性 4级" stackId="female" fill="#9d174d" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Lesion Statistics Table - 最多展示8条数据，展示不下时表头固定滚动内容 */}
      <div className="space-y-2">
        <div className="py-1 flex items-center justify-between">
          <span className="text-xs font-medium text-black">
            共{filteredData.length}条
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto overflow-x-auto border border-slate-200/60 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-[#f0f6fc] text-[#102a48] font-bold border-b border-[#bcd7ee] sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">组别</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">动物性别</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">病变数/总数</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">病变率</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">程度分级分布 (1/2/3/4级)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.cohort}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.gender}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.affectedAnimals} / {item.totalAnimals}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.incidenceRate.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap font-normal text-[11px]">
                    <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded mr-1" title="1级 极轻度">
                      G1:{item.severityDistribution.grade1Minimal}
                    </span>
                    <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded mr-1" title="2级 轻度">
                      G2:{item.severityDistribution.grade2Mild}
                    </span>
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded mr-1" title="3级 中度">
                      G3:{item.severityDistribution.grade3Moderate}
                    </span>
                    <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded" title="4级 重度">
                      G4:{item.severityDistribution.grade4Marked}
                    </span>
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
