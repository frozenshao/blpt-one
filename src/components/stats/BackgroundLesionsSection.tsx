import React, { useState, useEffect, useMemo } from 'react';
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
  Dna, 
  Filter, 
  Activity,
  ChevronDown,
  Check
} from 'lucide-react';
import { BACKGROUND_LESIONS_DATA } from '../../data/toxicologyStatsData';

interface BackgroundLesionsSectionProps {
  projectId?: string;
  timeRange?: 'all' | '1year' | '3years' | '5years' | 'custom';
}

export const BackgroundLesionsSection: React.FC<BackgroundLesionsSectionProps> = ({ 
  projectId = 'all',
  timeRange = 'all'
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('全部');
  const [selectedGender, setSelectedGender] = useState<string>('全部');

  // Sync selected species and gender when project changes
  useEffect(() => {
    setSelectedSpecies('全部');
    setSelectedGender('全部');
  }, [projectId]);

  // Project-adaptive baseline data (全库历史对照控制基线 HCD)
  const currentDataset = useMemo(() => {
    // Dynamically adjust counts based on timeRange
    const ratio = timeRange === '1year' ? 0.25 : timeRange === '3years' ? 0.6 : timeRange === '5years' ? 0.85 : 1;
    if (ratio === 1) return BACKGROUND_LESIONS_DATA;
    return BACKGROUND_LESIONS_DATA.map(item => {
      const maleParts = item.maleCountStr.split('/');
      const femaleParts = item.femaleCountStr.split('/');
      const mAff = Math.max(1, Math.round(parseInt(maleParts[0], 10) * ratio));
      const mTot = Math.max(10, Math.round(parseInt(maleParts[1], 10) * ratio));
      const fAff = Math.max(1, Math.round(parseInt(femaleParts[0], 10) * ratio));
      const fTot = Math.max(10, Math.round(parseInt(femaleParts[1], 10) * ratio));
      return {
        ...item,
        maleCountStr: `${mAff}/${mTot}`,
        femaleCountStr: `${fAff}/${fTot}`,
        maleRate: Number(((mAff / mTot) * 100).toFixed(1)),
        femaleRate: Number(((fAff / fTot) * 100).toFixed(1))
      };
    });
  }, [timeRange]);

  // Filter items
  const speciesList = ['全部', 'SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', 'BALB/c 小鼠'];
  const genderList = ['全部', '雄性', '雌性'];

  // Unique background lesions for multi-select
  const allBackgroundLesionNames = useMemo(() => {
    return Array.from(
      new Set(
        BACKGROUND_LESIONS_DATA.map(item =>
          item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim()
        )
      )
    );
  }, []);

  const [selectedLesions, setSelectedLesions] = useState<string[]>([]);
  const [isLesionDropdownOpen, setIsLesionDropdownOpen] = useState<boolean>(false);

  // Sync selected species and gender when project changes
  useEffect(() => {
    setSelectedSpecies('全部');
    setSelectedGender('全部');
    setSelectedLesions([]);
  }, [projectId]);

  const handleToggleLesion = (lesion: string) => {
    if (lesion === '全部') {
      if (selectedLesions.length === allBackgroundLesionNames.length) {
        setSelectedLesions([]);
      } else {
        setSelectedLesions([...allBackgroundLesionNames]);
      }
      return;
    }
    if (selectedLesions.includes(lesion)) {
      setSelectedLesions(selectedLesions.filter(l => l !== lesion));
    } else {
      setSelectedLesions([...selectedLesions, lesion]);
    }
  };

  const isAllLesionsSelected =
    selectedLesions.length === 0 ||
    selectedLesions.length === allBackgroundLesionNames.length;

  const filteredData = currentDataset.filter(item => {
    if (selectedSpecies !== '全部' && item.species !== selectedSpecies) return false;
    const cleanName = item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim();
    if (!isAllLesionsSelected && !selectedLesions.includes(cleanName)) return false;
    return true;
  });

  // Chart data formatting: comparing male and female rates
  const chartData = filteredData.map(item => {
    const cleanLesionName = item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim();
    return {
      name: `${item.species.replace(' ', '')}-${item.organ}`,
      shortLabel: cleanLesionName.split(' ')[0],
      fullName: `${item.species} · ${cleanLesionName}`,
      '雄性': item.maleRate,
      '雌性': item.femaleRate,
      maleRatio: item.maleCountStr,
      femaleRatio: item.femaleCountStr,
      hcdRange: item.hcdRange
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

  return (
    <div className="bg-white border border-[#a4c3de]/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#bcd7ee]/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#0e3b66]/10 text-[#0e3b66] border border-[#a4c3de]">
            <Dna className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-[#102a48] tracking-tight">
            背景性病变统计
          </h3>
        </div>

        {/* Filter Controls: 动物种属、性别、背景性病变 */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <Filter className="w-3.5 h-3.5 text-[#18446b]/60" />
            <span className="font-medium text-[#102a48]/70">动物种属:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              aria-label="筛选实验动物种属"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {speciesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">性别:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="筛选性别"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {genderList.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          {/* 在性别后增加”背景性病变“筛选条件，默认选中全部，支持多选 */}
          <div className="relative">
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setIsLesionDropdownOpen(!isLesionDropdownOpen)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsLesionDropdownOpen(!isLesionDropdownOpen); }}
              className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48] cursor-pointer hover:border-[#a4c3de] transition-colors"
            >
              <span className="font-medium text-[#102a48]/70">背景性病变:</span>
              <span className="font-semibold text-[#18446b] bg-white px-2 py-0.5 rounded border border-[#bcd7ee]">
                {isAllLesionsSelected ? '全部' : selectedLesions.length === 1 ? selectedLesions[0] : `已选 ${selectedLesions.length} 项`}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#18446b]/60" />
            </div>

            {isLesionDropdownOpen && (
              <div className="absolute z-20 top-full mt-1.5 right-0 w-64 bg-white border border-[#bcd7ee] rounded-xl shadow-lg p-2.5 space-y-2">
                <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between pb-1 border-b border-slate-100">
                  <span>多选背景性病变</span>
                  <span className="text-[#18446b] font-bold">
                    {isAllLesionsSelected ? '全部' : `${selectedLesions.length}/${allBackgroundLesionNames.length}`}
                  </span>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {/* 全部选项 */}
                  <div 
                    role="button"
                    tabIndex={0}
                    onClick={() => handleToggleLesion('全部')}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleLesion('全部'); }}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isAllLesionsSelected ? 'bg-[#f0f6fc] text-[#18446b] font-semibold' : 'text-slate-700 hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAllLesionsSelected}
                        readOnly
                        className="rounded text-[#0e3b66] focus:ring-[#0e3b66] pointer-events-none"
                      />
                      <span>全部</span>
                    </div>
                    {isAllLesionsSelected && <Check className="w-3.5 h-3.5 text-[#0e3b66]" />}
                  </div>

                  {allBackgroundLesionNames.map(lesion => {
                    const isChecked = isAllLesionsSelected || selectedLesions.includes(lesion);
                    return (
                      <div 
                        key={lesion}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleLesion(lesion)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleLesion(lesion); }}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                          isChecked ? 'bg-[#f0f6fc] text-[#18446b] font-semibold' : 'text-slate-700 hover:bg-[#f8fafc]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            readOnly
                            className="rounded text-[#0e3b66] focus:ring-[#0e3b66] pointer-events-none"
                          />
                          <span className="truncate">{lesion}</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#0e3b66]" />}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsLesionDropdownOpen(false)}
                    className="px-3 py-1 bg-[#0e3b66] text-white rounded text-xs font-medium hover:bg-[#12385c] cursor-pointer"
                  >
                    完成
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Chart: Male vs Female Background Lesion Incidence */}
      <div className="w-full bg-[#f8fafc] border border-[#bcd7ee]/60 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#102a48] flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-[#0e3b66]" />
            <span>病变率 (%)</span>
          </h4>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
              <XAxis 
                dataKey="shortLabel" 
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
                  const ratio = name === '雄性' ? item.payload.maleRatio : item.payload.femaleRatio;
                  return [`${value}% (${ratio})`, name];
                }}
                labelFormatter={(_label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.fullName;
                  }
                  return '';
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
              {(selectedGender === '全部' || selectedGender === '雄性') && (
                <Bar dataKey="雄性" fill="#2563eb" radius={[4, 4, 0, 0]} />
              )}
              {(selectedGender === '全部' || selectedGender === '雌性') && (
                <Bar dataKey="雌性" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Table: Complete List of Background Lesions - 无框格，统一黑色普通字体不加粗 */}
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
                <th className="py-2.5 px-3 font-bold text-[#102a48]">背景病变名称</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">动物种属</th>
                {(selectedGender === '全部' || selectedGender === '雄性') && (
                  <th className="py-2.5 px-3 font-bold text-[#102a48]">雄性动物病变率</th>
                )}
                {(selectedGender === '全部' || selectedGender === '雌性') && (
                  <th className="py-2.5 px-3 font-bold text-[#102a48]">雌性动物病变率</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-black font-normal">
                    {item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim()}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.species}
                  </td>
                  {(selectedGender === '全部' || selectedGender === '雄性') && (
                    <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                      {item.maleRate}% ({item.maleCountStr})
                    </td>
                  )}
                  {(selectedGender === '全部' || selectedGender === '雌性') && (
                    <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                      {item.femaleRate}% ({item.femaleCountStr})
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
