import React from 'react';
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
import { HeartPulse, CheckCircle2, AlertCircle, Dna, Layers, ShieldCheck } from 'lucide-react';
import { PathologySample } from '../types/pathology';

interface StatsDashboardProps {
  samples: PathologySample[];
}

const COLORS = ['#2563eb', '#0284c7', '#4f46e5', '#7c3aed', '#059669', '#d97706', '#dc2626'];
const BINARY_COLORS = ['#10b981', '#ef4444'];

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ samples }) => {
  const total = samples.length;
  const lesionCount = samples.filter(s => s.isLesion).length;
  const normalCount = total - lesionCount;
  const lesionRate = total > 0 ? ((lesionCount / total) * 100).toFixed(1) : '0';

  // Organ distribution
  const organCounts: Record<string, number> = {};
  samples.forEach(s => {
    organCounts[s.organ] = (organCounts[s.organ] || 0) + 1;
  });
  const organData = Object.entries(organCounts).map(([name, count]) => ({ name, count }));

  // Species distribution
  const speciesCounts: Record<string, number> = {};
  samples.forEach(s => {
    speciesCounts[s.species] = (speciesCounts[s.species] || 0) + 1;
  });
  const speciesData = Object.entries(speciesCounts).map(([name, value]) => ({ name, value }));

  // Binary data
  const binaryData = [
    { name: '正常组织 (Normal)', value: normalCount },
    { name: '病变组织 (Lesion)', value: lesionCount }
  ];

  // Slice types
  const sliceCounts: Record<string, number> = {};
  samples.forEach(s => {
    sliceCounts[s.sliceType] = (sliceCounts[s.sliceType] || 0) + 1;
  });
  const sliceData = Object.entries(sliceCounts).map(([name, count]) => ({ name, count }));

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
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">病理切片样本总数</div>
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
            <div className="text-xs text-slate-500">病理异常/病变切片</div>
            <div className="text-2xl font-black text-rose-600 font-mono">{lesionCount}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 p-4 rounded-xl shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">病变阳性检出率</div>
            <div className="text-2xl font-black text-amber-600 font-mono">{lesionRate}%</div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Organ Distribution Bar Chart */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-blue-600" />
            <span>器官 / 组织类型样本分布统计</span>
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
            <span>正常组织 vs 病变组织二分类比例</span>
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
                  {binaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BINARY_COLORS[index % BINARY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Animal Species Breakdown */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Dna className="w-4 h-4 text-indigo-600" />
            <span>样本来源动物种属构成</span>
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
                >
                  {speciesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Slice & Staining Type Breakdown */}
        <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>切片染色与制备技术分类</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sliceData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} width={110} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
