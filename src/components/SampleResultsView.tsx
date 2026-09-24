import React from 'react';
import { 
  Eye, 
  Calendar, 
  HeartPulse, 
  Tag, 
  Dna, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2, 
  AlertCircle, 
  Layers,
  FlaskConical
} from 'lucide-react';
import { PathologySample } from '../types/pathology';

interface SampleResultsViewProps {
  samples: PathologySample[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onSelectSample: (sample: PathologySample) => void;
  onSendToAI?: (sample: PathologySample) => void;
  isLoading: boolean;
}

export const SampleResultsView: React.FC<SampleResultsViewProps> = ({
  samples,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSelectSample,
  isLoading
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Table Toolbar: Only shows "共x条" */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-800">
            共{total}条
          </span>
        </div>
      </div>

      {/* Content Area - Only Table View */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">正在检索多维病理切片数据库...</p>
        </div>
      ) : samples.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Tag className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">未找到符合当前多维组合条件的病理样本</p>
          <p className="text-xs text-slate-500 max-w-md">
            请尝试调整器官类型、病变名称或扩大周龄范围；或点击顶部的“重置条件”查看全部数据。
          </p>
        </div>
      ) : (
        /* Table View with Horizontal Scroll & Fixed Sample Code Column */
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1200px] text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100/90 text-slate-600 border-b border-slate-200 font-semibold uppercase tracking-wider whitespace-nowrap">
              <tr>
                {/* 样本编号列固定在左侧，加宽列宽且蓝色字不换行展示 */}
                <th className="py-3 px-4 sticky left-0 z-20 bg-slate-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] border-r border-slate-200/80 min-w-[220px] whitespace-nowrap">
                  样本编号
                </th>
                <th className="py-3 px-3 min-w-[110px]">器官/切片</th>
                {/* 表头修改为“病变名称/分布” */}
                <th className="py-3 px-3 min-w-[140px]">病变名称/分布</th>
                {/* 病理诊断 单独为一列 */}
                <th className="py-3 px-3 min-w-[260px] max-w-[360px]">病理诊断</th>
                <th className="py-3 px-3 min-w-[130px]">品系 / 动物种属</th>
                <th className="py-3 px-3 min-w-[170px] max-w-[220px]">组别 / 受试物(溶媒)</th>
                <th className="py-3 px-3 min-w-[90px]">性别/周龄</th>
                <th className="py-3 px-3 min-w-[110px]">采集时间</th>
                <th className="py-3 px-4 min-w-[100px] text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {samples.map((sample) => (
                <tr 
                  key={sample.id}
                  id={`sample-row-${sample.id}`}
                  className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                  onClick={() => onSelectSample(sample)}
                >
                  {/* Fixed Sample Code + Thumbnail: 不显示灰色字，拉宽列宽蓝色字不换行展示 */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-blue-50/90 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.08)] border-r border-slate-200/80 transition-colors whitespace-nowrap min-w-[220px]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative group-hover:border-blue-500 transition-colors">
                        <img 
                          src={sample.thumbnailUrl || sample.imageUrl} 
                          alt={sample.sampleCode}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {sample.isLesion && (
                          <div className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-rose-500 shadow-xs" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono font-bold text-blue-600 group-hover:text-blue-700 whitespace-nowrap text-xs sm:text-sm">
                          {sample.sampleCode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Organ & Slice Type */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        <HeartPulse className="w-3 h-3 text-blue-600" />
                        {sample.organ}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{sample.sliceType}</div>
                  </td>

                  {/* Lesion Name & Distribution: 下方灰色字不显示括号 */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    {sample.isLesion ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        {sample.lesionName}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        正常组织
                      </span>
                    )}
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {sample.lesionDistribution}
                    </div>
                  </td>

                  {/* Pathology Diagnosis - Separate Dedicated Column */}
                  <td className="py-3 px-3 min-w-[260px] max-w-[360px]">
                    <div 
                      className="text-[11px] text-slate-800 font-medium leading-relaxed line-clamp-2" 
                      title={sample.pathologyDiagnosis || sample.structuredDescription?.clinicalDiagnosis}
                    >
                      {sample.pathologyDiagnosis || sample.structuredDescription?.clinicalDiagnosis || '未见明显组织学异型性或病理损伤'}
                    </div>
                  </td>

                  {/* Strain & Species */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-800 flex items-center gap-1">
                      <Dna className="w-3 h-3 text-teal-600" />
                      <span>{sample.strain || sample.species}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {sample.species}
                    </div>
                  </td>

                  {/* Group & Test Article */}
                  <td className="py-3 px-3 min-w-[170px] max-w-[220px]">
                    <div className="font-medium text-slate-800 flex items-center gap-1 text-[11px]">
                      <Layers className="w-3 h-3 text-indigo-500 flex-shrink-0" />
                      <span className="truncate" title={sample.experimentGroup}>{sample.experimentGroup || sample.structuredDescription?.experimentGroup}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <FlaskConical className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="truncate" title={sample.testArticle}>{sample.testArticle || '标准饲养'}</span>
                    </div>
                  </td>

                  {/* Gender & Age */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="text-slate-700">{sample.gender}</div>
                    <div className="text-[11px] text-blue-700 font-mono font-semibold">{sample.ageWeeks} 周龄</div>
                  </td>

                  {/* Sampling Date */}
                  <td className="py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-700">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {sample.samplingDate}
                    </div>
                    <div className="text-[10px] text-slate-500">{sample.collectorName}</div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        id={`view-detail-${sample.id}`}
                        onClick={() => onSelectSample(sample)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-lg transition-colors border border-blue-200 text-xs font-semibold shadow-2xs"
                        title="查看切片高倍图像与结构化病理描述"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>查看详情</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            显示第 <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}</span> 至{' '}
            <span className="font-semibold text-slate-900">{Math.min(page * pageSize, total)}</span> 条，共{' '}
            <span className="font-semibold text-slate-900">{total}</span> 条病理切片记录
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    page === p
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium flex items-center gap-1 transition-colors"
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
