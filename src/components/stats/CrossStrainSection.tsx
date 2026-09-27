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
  GitCompare, 
  Filter, 
  TrendingUp
} from 'lucide-react';
import { STRAIN_COMPARISON_DATA } from '../../data/toxicologyStatsData';

export const CrossStrainSection: React.FC = () => {
  const [selectedStrain1, setSelectedStrain1] = useState<string>('全部品系');
  const [selectedStrain2, setSelectedStrain2] = useState<string>('全部品系');
  const [selectedGender, setSelectedGender] = useState<string>('全部性别');

  const strainOptions = ['全部品系', 'SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', 'BALB/c 小鼠'];

  const filteredData = STRAIN_COMPARISON_DATA.filter(item => {
    // Strain 1 filter
    if (selectedStrain1 !== '全部品系') {
      const match1 = item.strainA.name === selectedStrain1 || item.strainB.name === selectedStrain1;
      if (!match1) return false;
    }
    // Strain 2 filter
    if (selectedStrain2 !== '全部品系') {
      const match2 = item.strainA.name === selectedStrain2 || item.strainB.name === selectedStrain2;
      if (!match2) return false;
    }
    // If both strains are specified and distinct, ensure they match the pair
    if (selectedStrain1 !== '全部品系' && selectedStrain2 !== '全部品系' && selectedStrain1 !== selectedStrain2) {
      const isPair = (item.strainA.name === selectedStrain1 && item.strainB.name === selectedStrain2) ||
                     (item.strainA.name === selectedStrain2 && item.strainB.name === selectedStrain1);
      if (!isPair) return false;
    }
    if (selectedGender !== '全部性别' && item.gender !== selectedGender) return false;
    return true;
  });

  // Chart data
  const chartData = filteredData.map(item => ({
    name: `${item.lesionName.split(' ')[0]} (${item.gender})`,
    shortLabel: `${item.lesionName.split(' ')[0]}`,
    strainAName: item.strainA.name,
    strainBName: item.strainB.name,
    [item.strainA.name]: item.strainA.rate,
    [item.strainB.name]: item.strainB.rate,
    rateA: item.strainA.rate,
    rateB: item.strainB.rate,
    countA: `${item.strainA.affected}/${item.strainA.total}`,
    countB: `${item.strainB.affected}/${item.strainB.total}`,
    ratio: item.rateRatio,
    pValue: item.pValue,
    fullName: `${item.lesionName} [${item.gender}动物]`
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
            <GitCompare className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            不同品系动物病变统计
          </h3>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 品系 1 */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">品系 1:</span>
            <select
              value={selectedStrain1}
              onChange={(e) => setSelectedStrain1(e.target.value)}
              aria-label="筛选对比品系 1"
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {strainOptions.map(s => (
                <option key={`s1-${s}`} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <span className="text-slate-400 font-bold text-xs">vs</span>

          {/* 品系 2 */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
            <span className="font-medium text-slate-500">品系 2:</span>
            <select
              value={selectedStrain2}
              onChange={(e) => setSelectedStrain2(e.target.value)}
              aria-label="筛选对比品系 2"
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {strainOptions.map(s => (
                <option key={`s2-${s}`} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 性别 */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
            <span className="font-medium text-slate-500">性别:</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              aria-label="筛选对比性别"
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="全部性别">全部性别</option>
              <option value="雄性">雄性</option>
              <option value="雌性">雌性</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visual Chart: Cross-Strain Bar Chart Comparison */}
      <div className="w-full bg-slate-50/60 border border-slate-200/70 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>不同品系动物病变发生率横向对比 (%)</span>
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
                  const count = name === item.payload.strainAName ? item.payload.countA : item.payload.countB;
                  return [`${value}% (${count})`, name];
                }}
                labelFormatter={(_label, payload) => {
                  if (payload && payload.length > 0) {
                    const d = payload[0].payload;
                    return `${d.fullName} (比值: ${d.ratio}, ${d.pValue})`;
                  }
                  return '';
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: 10 }} />
              {/* Dynamically render bars for the strains */}
              <Bar dataKey="rateA" name="品系 A (SD大鼠 / C57BL/6)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rateB" name="品系 B (Wistar大鼠 / BALB/c)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Strain Comparison Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            不同品系动物病变发生率比较明细表 (共 {filteredData.length} 项)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">CROSS-STRAIN-2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3" style={{ width: '3cm', minWidth: '3cm' }}>病变名称</th>
                <th className="py-2.5 px-3">靶器官</th>
                <th className="py-2.5 px-3">动物性别</th>
                <th className="py-2.5 px-3">品系 A 及发生率</th>
                <th className="py-2.5 px-3">品系 B 及发生率</th>
                <th className="py-2.5 px-3">发生率比值</th>
                <th className="py-2.5 px-3">统计学显著性 (P值)</th>
                <th className="py-2.5 px-3" style={{ width: '5cm', minWidth: '5cm' }}>病理学比较结论</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td 
                    className="py-2.5 px-3 font-semibold text-slate-900" 
                    style={{ width: '3cm', minWidth: '3cm' }}
                  >
                    {item.lesionName}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {item.organ}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                    <span className={item.gender === '雄性' ? 'text-blue-700' : 'text-rose-700'}>
                      {item.gender}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{item.strainA.name}: </span>
                    <strong className="text-blue-700">{item.strainA.rate}%</strong> ({item.strainA.affected}/{item.strainA.total})
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                    <span className="font-semibold text-slate-900">{item.strainB.name}: </span>
                    <strong className="text-emerald-700">{item.strainB.rate}%</strong> ({item.strainB.affected}/{item.strainB.total})
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-indigo-700 whitespace-nowrap">
                    {item.rateRatio}
                  </td>
                  <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                    <span className={item.pValue.includes('*') ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                      {item.pValue}
                    </span>
                  </td>
                  <td 
                    className="py-2.5 px-3 text-slate-500 text-[11px]" 
                    style={{ width: '5cm', minWidth: '5cm' }} 
                    title={item.findingSummary}
                  >
                    {item.findingSummary}
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
