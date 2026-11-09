import React, { useState, useMemo } from 'react';
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
  GitCompare, 
  Filter, 
  TrendingUp,
  ChevronDown,
  Check
} from 'lucide-react';
import { STRAIN_COMPARISON_DATA } from '../../data/toxicologyStatsData';

interface CrossStrainSectionProps {
  timeRange?: 'all' | '1year' | '3years' | '5years' | 'custom';
}

export const CrossStrainSection: React.FC<CrossStrainSectionProps> = ({ 
  timeRange = 'all' 
}) => {
  const availableStrains = ['SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', 'BALB/c 小鼠'];
  const [selectedStrains, setSelectedStrains] = useState<string[]>(['SD 大鼠', 'Wistar 大鼠']);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [selectedLesion, setSelectedLesion] = useState<string>('全部');
  const [selectedGender, setSelectedGender] = useState<string>('全部');

  const lesionOptions = [
    '全部',
    '肝脏小肉芽肿',
    '肾小管嗜碱性变',
    '肝细胞脂肪变性',
    '间质炎性细胞浸润',
    '心肌单个核细胞浸润',
    '垂体前叶局灶性增生/囊肿'
  ];

  const handleToggleStrain = (strain: string) => {
    if (selectedStrains.includes(strain)) {
      if (selectedStrains.length > 1) {
        setSelectedStrains(selectedStrains.filter(s => s !== strain));
      }
    } else {
      if (selectedStrains.length < 2) {
        setSelectedStrains([...selectedStrains, strain]);
      } else {
        // Keep 2 by replacing the older one
        setSelectedStrains([selectedStrains[1], strain]);
      }
    }
  };

  const currentDataset = useMemo(() => {
    const ratio = timeRange === '1year' ? 0.25 : timeRange === '3years' ? 0.6 : timeRange === '5years' ? 0.85 : 1;
    if (ratio === 1) return STRAIN_COMPARISON_DATA;
    return STRAIN_COMPARISON_DATA.map(item => {
      const aAff = Math.max(1, Math.round(item.strainA.affected * ratio));
      const aTot = Math.max(10, Math.round(item.strainA.total * ratio));
      const bAff = Math.max(1, Math.round(item.strainB.affected * ratio));
      const bTot = Math.max(10, Math.round(item.strainB.total * ratio));
      return {
        ...item,
        strainA: {
          ...item.strainA,
          affected: aAff,
          total: aTot,
          rate: Number(((aAff / aTot) * 100).toFixed(1))
        },
        strainB: {
          ...item.strainB,
          affected: bAff,
          total: bTot,
          rate: Number(((bAff / bTot) * 100).toFixed(1))
        }
      };
    });
  }, [timeRange]);

  const filteredData = currentDataset.filter(item => {
    // 1. Strain filter (two selected strains in single box)
    if (selectedStrains.length === 2) {
      const hasA = item.strainA.name === selectedStrains[0] || item.strainB.name === selectedStrains[0];
      const hasB = item.strainA.name === selectedStrains[1] || item.strainB.name === selectedStrains[1];
      if (!hasA || !hasB) return false;
    } else if (selectedStrains.length === 1) {
      const hasA = item.strainA.name === selectedStrains[0] || item.strainB.name === selectedStrains[0];
      if (!hasA) return false;
    }

    // 2. Lesion Name Filter
    if (selectedLesion !== '全部') {
      if (!item.lesionName.includes(selectedLesion)) return false;
    }

    // 3. Gender Filter
    if (selectedGender !== '全部' && item.gender !== selectedGender) return false;

    return true;
  });

  // Chart data: 区分雌性、雄性展示（参考 image.png: 雄性蓝色系，雌性粉色系）
  const distinctLesions = Array.from(new Set(filteredData.map(item => item.lesionName)));

  const chartData = distinctLesions.map(lesion => {
    const maleItem = filteredData.find(item => item.lesionName === lesion && item.gender === '雄性');
    const femaleItem = filteredData.find(item => item.lesionName === lesion && item.gender === '雌性');
    const anyItem = maleItem || femaleItem || filteredData[0];
    const sAName = anyItem?.strainA.name || (selectedStrains[0] || '动物种属A');
    const sBName = anyItem?.strainB.name || (selectedStrains[1] || '动物种属B');

    return {
      name: lesion,
      shortLabel: lesion.split(' ')[0],
      strainAName: sAName,
      strainBName: sBName,
      // 雄性 (参考 image.png: 蓝色系)
      maleRateA: maleItem?.strainA.rate || 0,
      maleRateB: maleItem?.strainB.rate || 0,
      maleCountA: maleItem ? `${maleItem.strainA.affected}/${maleItem.strainA.total}` : '-',
      maleCountB: maleItem ? `${maleItem.strainB.affected}/${maleItem.strainB.total}` : '-',
      maleRatio: maleItem?.rateRatio || '-',
      // 雌性 (参考 image.png: 粉色系)
      femaleRateA: femaleItem?.strainA.rate || 0,
      femaleRateB: femaleItem?.strainB.rate || 0,
      femaleCountA: femaleItem ? `${femaleItem.strainA.affected}/${femaleItem.strainA.total}` : '-',
      femaleCountB: femaleItem ? `${femaleItem.strainB.affected}/${femaleItem.strainB.total}` : '-',
      femaleRatio: femaleItem?.rateRatio || '-'
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#bcd7ee]/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#0e3b66]/10 text-[#0e3b66] border border-[#a4c3de]">
            <GitCompare className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-[#102a48] tracking-tight">
            不同动物种属病变对比统计
          </h3>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 动物种属的选择在一个框中选择2个品种 */}
          <div className="relative">
            <div 
              role="button"
              tabIndex={0}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsDropdownOpen(!isDropdownOpen); }}
              className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48] cursor-pointer hover:border-[#a4c3de] transition-colors"
            >
              <Filter className="w-3.5 h-3.5 text-[#18446b]/60" />
              <span className="font-medium text-[#102a48]/70">动物种属:</span>
              <span className="font-semibold text-[#18446b] bg-white px-2 py-0.5 rounded border border-[#bcd7ee]">
                {selectedStrains.length === 2 ? `${selectedStrains[0]} vs ${selectedStrains[1]}` : (selectedStrains[0] || '选择动物种属')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#18446b]/60" />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-20 top-full mt-1.5 left-0 w-64 bg-white border border-[#bcd7ee] rounded-xl shadow-lg p-2.5 space-y-2">
                <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between pb-1 border-b border-slate-100">
                  <span>选择 2 个对比动物种属</span>
                  <span className="text-[#18446b] font-bold">{selectedStrains.length}/2</span>
                </div>
                <div className="space-y-1">
                  {availableStrains.map(strain => {
                    const isChecked = selectedStrains.includes(strain);
                    return (
                      <div 
                        key={strain}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleToggleStrain(strain)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleToggleStrain(strain); }}
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
                          <span>{strain}</span>
                        </div>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#0e3b66]" />}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-1.5 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(false)}
                    className="px-3 py-1 bg-[#0e3b66] text-white rounded text-xs font-medium hover:bg-[#12385c] cursor-pointer"
                  >
                    完成
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 性别 */}
          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">性别:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="筛选对比性别"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              <option value="全部">全部</option>
              <option value="雄性">雄性</option>
              <option value="雌性">雌性</option>
            </select>
          </div>

          {/* 病变名称筛选条件：移动至性别后面 */}
          <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
            <span className="font-medium text-[#102a48]/70">病变名称:</span>
            <select
              value={selectedLesion}
              onChange={(e) => setSelectedLesion(e.target.value)}
              aria-label="筛选病变名称"
              className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
            >
              {lesionOptions.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Chart: Cross-Strain Bar Chart Comparison */}
      <div className="w-full bg-[#f8fafc] border border-[#bcd7ee]/60 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#102a48] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#0e3b66]" />
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
                  const isMale = name.includes('雄性');
                  const isA = name.includes(item.payload.strainAName);
                  const count = isMale 
                    ? (isA ? item.payload.maleCountA : item.payload.maleCountB)
                    : (isA ? item.payload.femaleCountA : item.payload.femaleCountB);
                  return [`${value}% (${count})`, name];
                }}
                labelFormatter={(_label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.name;
                  }
                  return '';
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
              {/* 雄性柱条：蓝色系 */}
              {(selectedGender === '全部' || selectedGender === '雄性') && (
                <>
                  <Bar dataKey="maleRateA" name={`${selectedStrains[0] || '动物种属A'} (雄性)`} fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maleRateB" name={`${selectedStrains[1] || '动物种属B'} (雄性)`} fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </>
              )}
              {/* 雌性柱条：粉色系 */}
              {(selectedGender === '全部' || selectedGender === '雌性') && (
                <>
                  <Bar dataKey="femaleRateA" name={`${selectedStrains[0] || '动物种属A'} (雌性)`} fill="#db2777" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="femaleRateB" name={`${selectedStrains[1] || '动物种属B'} (雌性)`} fill="#f472b6" radius={[4, 4, 0, 0]} />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Strain Comparison Table - 无框格，统一黑色普通字体不加粗 */}
      <div className="space-y-2">
        <div className="py-1 flex items-center justify-between">
          <span className="text-xs font-medium text-black">
            共{filteredData.length}条
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#f0f6fc] text-[#102a48] font-bold border-b border-[#bcd7ee]">
              <tr>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">病变名称</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">动物性别</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">动物种属 A 及病变率</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">动物种属 B 及病变率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-black font-normal">
                    {item.lesionName}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.gender}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.strainA.name}: {item.strainA.rate}% ({item.strainA.affected}/{item.strainA.total})
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal whitespace-nowrap">
                    {item.strainB.name}: {item.strainB.rate}% ({item.strainB.affected}/{item.strainB.total})
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
