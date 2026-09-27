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
  Dna, 
  Filter, 
  Activity
} from 'lucide-react';
import { BACKGROUND_LESIONS_DATA } from '../../data/toxicologyStatsData';

export const BackgroundLesionsSection: React.FC = () => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('全部品系');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('全部器官');

  // Filter items
  const speciesList = ['全部品系', 'SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', 'BALB/c 小鼠'];
  const organList = ['全部器官', '肝脏', '肾脏', '心肌', '肺脏', '脾脏', '脑/垂体'];

  const filteredData = BACKGROUND_LESIONS_DATA.filter(item => {
    if (selectedSpecies !== '全部品系' && item.species !== selectedSpecies) return false;
    if (selectedOrgan !== '全部器官' && item.organ !== selectedOrgan) return false;
    return true;
  });

  // Chart data formatting: comparing male and female rates
  const chartData = filteredData.map(item => {
    const cleanLesionName = item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim();
    return {
      name: `${item.species.replace(' ', '')}-${item.organ}`,
      shortLabel: cleanLesionName.split(' ')[0],
      fullName: `${item.species} · ${item.organ} · ${cleanLesionName}`,
      '雄性发生率 (%)': item.maleRate,
      '雌性发生率 (%)': item.femaleRate,
      maleRatio: item.maleCountStr,
      femaleRatio: item.femaleCountStr,
      hcdRange: item.hcdRange
    };
  });

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
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Dna className="w-5 h-5" />
          </span>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            背景性病变统计
          </h3>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-500">品系:</span>
            <select
              value={selectedSpecies}
              onChange={(e) => setSelectedSpecies(e.target.value)}
              aria-label="筛选实验动物品系"
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {speciesList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs text-slate-600">
            <span className="font-medium text-slate-500">器官:</span>
            <select
              value={selectedOrgan}
              onChange={(e) => setSelectedOrgan(e.target.value)}
              aria-label="筛选病理器官类型"
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {organList.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visual Chart: Male vs Female Background Lesion Incidence */}
      <div className="w-full bg-slate-50/60 border border-slate-200/70 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>常见背景病变雌雄发生率对比图 (%)</span>
          </h4>
          <span className="text-[11px] text-slate-400">蓝: 雄性 (Male) | 粉: 雌性 (Female)</span>
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
                  const ratio = name === '雄性发生率 (%)' ? item.payload.maleRatio : item.payload.femaleRatio;
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
              <Bar dataKey="雄性发生率 (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="雌性发生率 (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Structured Table: Complete List of Background Lesions */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            实验动物自发背景病变历史对照数据库 (共 {filteredData.length} 项记录)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">GLP-HCD-REF-2026</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">动物品系</th>
                <th className="py-2.5 px-3">靶器官</th>
                <th className="py-2.5 px-3">背景病变名称</th>
                <th className="py-2.5 px-3">雄性动物发生率</th>
                <th className="py-2.5 px-3">雌性动物发生率</th>
                <th className="py-2.5 px-3">病理学诊断说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                    {item.species}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {item.organ}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">
                    {item.lesionName.replace(/\s*\([a-zA-Z\s'\-_/]+\)/g, '').trim()}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {item.maleRate}% <span className="text-[11px] font-normal text-slate-500">({item.maleCountStr})</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-700 whitespace-nowrap">
                    {item.femaleRate}% <span className="text-[11px] font-normal text-slate-500">({item.femaleCountStr})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px] max-w-xs truncate" title={item.remark}>
                    {item.remark}
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
