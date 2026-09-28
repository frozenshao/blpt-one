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
  Activity
} from 'lucide-react';
import { BACKGROUND_LESIONS_DATA, BackgroundLesionItem } from '../../data/toxicologyStatsData';

interface BackgroundLesionsSectionProps {
  projectId?: string;
}

export const BackgroundLesionsSection: React.FC<BackgroundLesionsSectionProps> = ({ projectId = 'all' }) => {
  const [selectedSpecies, setSelectedSpecies] = useState<string>('全部品系');
  const [selectedOrgan, setSelectedOrgan] = useState<string>('全部脏器');

  // Sync selected species and organ when project changes
  useEffect(() => {
    setSelectedSpecies('全部品系');
    setSelectedOrgan('全部脏器');
  }, [projectId]);

  // Project-adaptive baseline data (随选中项目动态联动统计值)
  const currentDataset = useMemo(() => {
    if (projectId === 'exp-2026001') {
      // 试验编号-2026001 (小鼠长毒研究: C57BL/6J 小鼠对照组阴性背景数据)
      const projectMouseData: BackgroundLesionItem[] = [
        {
          id: 'bg-p1-1',
          species: 'C57BL/6 小鼠',
          organ: '肝脏',
          lesionName: '肝脏小肉芽肿',
          maleRate: 10.0,
          maleCountStr: '2/20',
          femaleRate: 5.0,
          femaleCountStr: '1/20',
          hcdRange: '5.0% ~ 15.0%',
          clinicalSignificance: '溶媒对照组自发背景',
          remark: '本试验对照组偶发性微肉芽肿基线，无毒理学意义。'
        },
        {
          id: 'bg-p1-2',
          species: 'C57BL/6 小鼠',
          organ: '肝脏',
          lesionName: '局灶性单个核细胞浸润',
          maleRate: 15.0,
          maleCountStr: '3/20',
          femaleRate: 10.0,
          femaleCountStr: '2/20',
          hcdRange: '8.0% ~ 20.0%',
          clinicalSignificance: '小鼠常见自发背景',
          remark: '门管区及小叶内生理性轻微炎细胞散在分布。'
        },
        {
          id: 'bg-p1-3',
          species: 'C57BL/6 小鼠',
          organ: '肺脏',
          lesionName: '肺泡巨噬细胞聚集',
          maleRate: 10.0,
          maleCountStr: '2/20',
          femaleRate: 5.0,
          femaleCountStr: '1/20',
          hcdRange: '5.0% ~ 12.0%',
          clinicalSignificance: '肺组织生理清除反应',
          remark: '肺泡腔偶见巨噬细胞灶性蓄积，属正常自发性改变。'
        },
        {
          id: 'bg-p1-4',
          species: 'C57BL/6 小鼠',
          organ: '脾脏',
          lesionName: '髓外造血',
          maleRate: 20.0,
          maleCountStr: '4/20',
          femaleRate: 15.0,
          femaleCountStr: '3/20',
          hcdRange: '12.0% ~ 25.0%',
          clinicalSignificance: '小鼠正常造血基线',
          remark: '红髓巨核细胞及幼红细胞局灶增多，为小鼠正常生理表现。'
        }
      ];
      return projectMouseData;
    } else if (projectId === 'exp-2026002') {
      // 试验编号-2026002 (重复给药毒性: SD 大鼠对照组阴性背景数据)
      const projectRatData: BackgroundLesionItem[] = [
        {
          id: 'bg-p2-1',
          species: 'SD 大鼠',
          organ: '肝脏',
          lesionName: '肝脏小肉芽肿',
          maleRate: 13.3,
          maleCountStr: '2/15',
          femaleRate: 6.7,
          femaleCountStr: '1/15',
          hcdRange: '5.0% ~ 18.0%',
          clinicalSignificance: '大鼠溶媒对照自发背景',
          remark: '肝实质内孤立性巨噬细胞小肉芽肿，与给药无关。'
        },
        {
          id: 'bg-p2-2',
          species: 'SD 大鼠',
          organ: '肾脏',
          lesionName: '肾小管嗜碱性变',
          maleRate: 20.0,
          maleCountStr: '3/15',
          femaleRate: 13.3,
          femaleCountStr: '2/15',
          hcdRange: '15.0% ~ 30.0%',
          clinicalSignificance: '雄性老龄自发慢性肾病变',
          remark: '皮质远端肾小管散在嗜碱性变，为大鼠老龄自发慢性肾病早期基线。'
        },
        {
          id: 'bg-p2-3',
          species: 'SD 大鼠',
          organ: '心肌',
          lesionName: '心肌单个核细胞浸润',
          maleRate: 13.3,
          maleCountStr: '2/15',
          femaleRate: 6.7,
          femaleCountStr: '1/15',
          hcdRange: '8.0% ~ 18.0%',
          clinicalSignificance: '大鼠自发心肌病早期',
          remark: '心室肌间质局灶性微小单个核细胞浸润。'
        },
        {
          id: 'bg-p2-4',
          species: 'SD 大鼠',
          organ: '脑/垂体',
          lesionName: '垂体前叶局灶性囊肿',
          maleRate: 6.7,
          maleCountStr: '1/15',
          femaleRate: 13.3,
          femaleCountStr: '2/15',
          hcdRange: '3.0% ~ 12.0%',
          clinicalSignificance: '胚胎发育生理残余',
          remark: 'Rathke囊残余扩展形成的局灶上皮性微囊。'
        }
      ];
      return projectRatData;
    }
    // 全部 (全库历史对照控制基线 HCD)
    return BACKGROUND_LESIONS_DATA;
  }, [projectId]);

  // Filter items
  const speciesList = projectId === 'all' 
    ? ['全部品系', 'SD 大鼠', 'Wistar 大鼠', 'C57BL/6 小鼠', 'BALB/c 小鼠']
    : projectId === 'exp-2026001'
    ? ['全部品系', 'C57BL/6 小鼠']
    : ['全部品系', 'SD 大鼠'];

  const organList = useMemo(() => {
    return ['全部脏器', ...Array.from(new Set(currentDataset.map(item => item.organ)))];
  }, [currentDataset]);

  const filteredData = currentDataset.filter(item => {
    if (selectedSpecies !== '全部品系' && item.species !== selectedSpecies) return false;
    if (selectedOrgan !== '全部脏器' && item.organ !== selectedOrgan) return false;
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
            <span className="font-medium text-slate-500">脏器:</span>
            <select
              value={selectedOrgan}
              onChange={(e) => setSelectedOrgan(e.target.value)}
              aria-label="筛选病理脏器类型"
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
                <th className="py-2.5 px-3">脏器</th>
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
