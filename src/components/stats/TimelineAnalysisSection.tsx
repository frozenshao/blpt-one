import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  BarChart3,
  CalendarRange
} from 'lucide-react';

export type TimeRangeOption = '3years' | '5years' | '1year' | 'all';

interface TimePeriodData {
  period: string;
  year: number;
  totalSamples: number;
  normalCount: number;
  lesionCount: number;
  lesionRate: number;
  cumulative: number;
}

// Full chronological dataset from 2022 to 2026
const RAW_TIMELINE_DATA: TimePeriodData[] = [
  { period: '2022 Q1-Q2', year: 2022, totalSamples: 60, normalCount: 38, lesionCount: 22, lesionRate: 36.7, cumulative: 60 },
  { period: '2022 Q3-Q4', year: 2022, totalSamples: 110, normalCount: 68, lesionCount: 42, lesionRate: 38.2, cumulative: 170 },
  { period: '2023 Q1-Q2', year: 2023, totalSamples: 140, normalCount: 82, lesionCount: 58, lesionRate: 41.4, cumulative: 310 },
  { period: '2023 Q3-Q4', year: 2023, totalSamples: 180, normalCount: 104, lesionCount: 76, lesionRate: 42.2, cumulative: 490 },
  { period: '2024 Q1-Q2', year: 2024, totalSamples: 230, normalCount: 122, lesionCount: 108, lesionRate: 47.0, cumulative: 720 },
  { period: '2024 Q3-Q4', year: 2024, totalSamples: 290, normalCount: 146, lesionCount: 144, lesionRate: 49.7, cumulative: 1010 },
  { period: '2025 Q1-Q2', year: 2025, totalSamples: 320, normalCount: 148, lesionCount: 172, lesionRate: 53.8, cumulative: 1330 },
  { period: '2025 Q3-Q4', year: 2025, totalSamples: 220, normalCount: 102, lesionCount: 118, lesionRate: 53.6, cumulative: 1550 },
  { period: '2026 Q1-Q3', year: 2026, totalSamples: 130, normalCount: 56, lesionCount: 74, lesionRate: 56.9, cumulative: 1680 }
];

export const TimelineAnalysisSection: React.FC = () => {
  // Current time selection: 默认选择“三年内”
  const [timeRange, setTimeRange] = useState<TimeRangeOption>('3years');
  const [chartType, setChartType] = useState<'stackBar' | 'areaTrend'>('stackBar');

  // Filter dataset by selected time range (Current Year is 2026)
  const filteredData = useMemo(() => {
    switch (timeRange) {
      case '1year': // 2025 ~ 2026
        return RAW_TIMELINE_DATA.filter(d => d.year >= 2025);
      case '3years': // 2024 ~ 2026 (三年内)
        return RAW_TIMELINE_DATA.filter(d => d.year >= 2024);
      case '5years': // 2022 ~ 2026 (五年内)
      case 'all':
      default:
        return RAW_TIMELINE_DATA;
    }
  }, [timeRange]);

  // Derived summaries for selected range
  const summary = useMemo(() => {
    const total = filteredData.reduce((acc, cur) => acc + cur.totalSamples, 0);
    const normals = filteredData.reduce((acc, cur) => acc + cur.normalCount, 0);
    const lesions = filteredData.reduce((acc, cur) => acc + cur.lesionCount, 0);
    const rate = total > 0 ? ((lesions / total) * 100).toFixed(1) : '0.0';
    const periodCount = filteredData.length;
    const avgPerPeriod = periodCount > 0 ? Math.round(total / periodCount) : 0;

    return {
      total,
      normals,
      lesions,
      rate,
      avgPerPeriod
    };
  }, [filteredData]);

  const tooltipStyle = { 
    backgroundColor: '#ffffff', 
    borderColor: '#bcd7ee', 
    borderRadius: 8, 
    fontSize: 12, 
    color: '#102a48',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  return (
    <div className="bg-white border border-[#a4c3de]/80 p-5 rounded-2xl shadow-xs space-y-5">
      {/* 顶部标题与时间区间切换控制器 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#bcd7ee]/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0e3b66]/10 border border-[#a4c3de] flex items-center justify-center text-[#0e3b66] shrink-0">
            <CalendarRange className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#102a48] tracking-tight flex items-center gap-2">
              <span>切片收录时间分析</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f0f6fc] text-[#18446b] border border-[#bcd7ee]">
                2022 - 2026
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              可动态选择三年内、五年内等不同时间跨度，分析毒理病理切片归档趋势与病变检出动态
            </p>
          </div>
        </div>

        {/* 时间选择控制器 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[#102a48] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#18446b]/60" />
            <span>时间跨度:</span>
          </span>

          <div className="inline-flex rounded-lg border border-[#bcd7ee] p-0.5 bg-[#f0f6fc] text-xs">
            <button
              type="button"
              onClick={() => setTimeRange('3years')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === '3years'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#102a48]/70 hover:text-[#102a48] hover:bg-slate-200/60'
              }`}
            >
              三年内 (2024-2026)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('5years')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === '5years'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#102a48]/70 hover:text-[#102a48] hover:bg-slate-200/60'
              }`}
            >
              五年内 (2022-2026)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('1year')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === '1year'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#102a48]/70 hover:text-[#102a48] hover:bg-slate-200/60'
              }`}
            >
              近1年
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                timeRange === 'all'
                  ? 'bg-[#0e3b66] text-white shadow-xs'
                  : 'text-[#102a48]/70 hover:text-[#102a48] hover:bg-slate-200/60'
              }`}
            >
              全部时间
            </button>
          </div>
        </div>
      </div>

      {/* 该时间区间的 4 个核心汇总指标卡 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#f8fafc] border border-[#bcd7ee] rounded-xl p-3.5">
          <div className="text-[11px] text-[#102a48]/70 font-medium">选定期间收录总量</div>
          <div className="text-xl font-black font-mono text-[#0e3b66] mt-1">
            {summary.total} <span className="text-xs font-normal text-slate-400">例</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">平均每期收录 {summary.avgPerPeriod} 例</div>
        </div>

        <div className="bg-[#f8fafc] border border-[#bcd7ee] rounded-xl p-3.5">
          <div className="text-[11px] text-[#102a48]/70 font-medium">正常组织切片</div>
          <div className="text-xl font-black font-mono text-emerald-600 mt-1">
            {summary.normals} <span className="text-xs font-normal text-slate-400">例</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-1">
            占比 {summary.total > 0 ? ((summary.normals / summary.total) * 100).toFixed(1) : 0}%
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-[#bcd7ee] rounded-xl p-3.5">
          <div className="text-[11px] text-[#102a48]/70 font-medium">病变异常切片</div>
          <div className="text-xl font-black font-mono text-[#db2777] mt-1">
            {summary.lesions} <span className="text-xs font-normal text-slate-400">例</span>
          </div>
          <div className="text-[10px] text-[#db2777] mt-1">
            阳性率 {summary.rate}%
          </div>
        </div>

        <div className="bg-[#f8fafc] border border-[#bcd7ee] rounded-xl p-3.5">
          <div className="text-[11px] text-[#102a48]/70 font-medium">历史累计入库</div>
          <div className="text-xl font-black font-mono text-[#453468] mt-1">
            {filteredData[filteredData.length - 1]?.cumulative || 1680} <span className="text-xs font-normal text-slate-400">张切片</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">全库数字化 WSI 存档</div>
        </div>
      </div>

      {/* 图表展示区：切换柱状图与累积趋势图 */}
      <div className="border border-[#bcd7ee] rounded-xl p-4 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0e3b66]" />
            <span className="text-xs font-bold text-[#102a48]">
              {chartType === 'stackBar' ? '各时期正常组织与病变组织切片收录构成' : '切片入库累积增长曲线与病变检出率'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#f0f6fc] p-0.5 rounded border border-[#bcd7ee] text-[11px]">
            <button
              type="button"
              onClick={() => setChartType('stackBar')}
              className={`px-2 py-0.5 rounded cursor-pointer ${chartType === 'stackBar' ? 'bg-[#0e3b66] font-bold text-white shadow-2xs' : 'text-[#102a48]/70 hover:text-[#102a48]'}`}
            >
              分类堆叠图
            </button>
            <button
              type="button"
              onClick={() => setChartType('areaTrend')}
              className={`px-2 py-0.5 rounded cursor-pointer ${chartType === 'areaTrend' ? 'bg-[#0e3b66] font-bold text-white shadow-2xs' : 'text-[#102a48]/70 hover:text-[#102a48]'}`}
            >
              累积增长图
            </button>
          </div>
        </div>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'stackBar' ? (
              <BarChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="normalCount" name="正常组织 (Normal)" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="lesionCount" name="病变组织 (Lesion)" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={filteredData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0e3b66" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0e3b66" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area 
                  type="monotone" 
                  dataKey="cumulative" 
                  name="累计入库切片数" 
                  stroke="#0e3b66" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCumulative)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSamples" 
                  name="当期收录数" 
                  stroke="#0284c7" 
                  strokeWidth={2}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* 详细阶段收录数据表格 */}
      <div className="overflow-x-auto rounded-xl border border-[#bcd7ee]">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-[#f0f6fc] text-[#102a48] font-bold border-b border-[#bcd7ee]">
            <tr>
              <th className="py-2.5 px-3">收录时期</th>
              <th className="py-2.5 px-3 text-center">收录样本量</th>
              <th className="py-2.5 px-3 text-center text-emerald-700">正常组织</th>
              <th className="py-2.5 px-3 text-center text-[#db2777]">病变组织</th>
              <th className="py-2.5 px-3 text-center">阳性病变率</th>
              <th className="py-2.5 px-3 text-center font-mono text-[#453468]">历史累积切片</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] bg-white">
            {filteredData.map((row) => (
              <tr key={row.period} className="hover:bg-[#f8fafc] transition-colors">
                <td className="py-2 px-3 font-semibold text-[#102a48]">{row.period}</td>
                <td className="py-2 px-3 text-center font-mono font-bold text-[#0e3b66]">{row.totalSamples} 例</td>
                <td className="py-2 px-3 text-center font-mono text-emerald-600">{row.normalCount} 例</td>
                <td className="py-2 px-3 text-center font-mono text-[#db2777]">{row.lesionCount} 例</td>
                <td className="py-2 px-3 text-center font-mono font-semibold text-slate-700">{row.lesionRate}%</td>
                <td className="py-2 px-3 text-center font-mono text-[#453468] font-bold">{row.cumulative} 张</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
