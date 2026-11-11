import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Tag
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
  onSendToAI: (sample: PathologySample) => void;
  onAnalyzeCohort?: (selectedSamples: PathologySample[]) => void;
  isLoading?: boolean;
}

export const SampleResultsView: React.FC<SampleResultsViewProps> = ({
  samples,
  total,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onSelectSample,
  onSendToAI,
  isLoading
}) => {
  const [localSearch, setLocalSearch] = useState<string>('');

  // Filter local samples if local search typed
  const displayedSamples = localSearch.trim() === ''
    ? samples
    : samples.filter(s => 
        s.sampleCode.toLowerCase().includes(localSearch.toLowerCase()) ||
        s.organ.toLowerCase().includes(localSearch.toLowerCase()) ||
        (s.projectName && s.projectName.toLowerCase().includes(localSearch.toLowerCase())) ||
        (s.testArticle && s.testArticle.toLowerCase().includes(localSearch.toLowerCase())) ||
        (s.pathologyDiagnosis && s.pathologyDiagnosis.toLowerCase().includes(localSearch.toLowerCase())) ||
        (s.strain && s.strain.toLowerCase().includes(localSearch.toLowerCase()))
      );

  return (
    <div className="w-full bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden select-none">
      {/* 顶部操作工具栏：快速搜索靠左 */}
      <div className="p-3 sm:px-4 sm:py-2.5 border-b border-slate-200 flex items-center justify-start bg-white">
        {/* 快速搜索输入框 */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="快速搜索切片编号、诊断"
            className="pl-8 pr-3 py-1.5 rounded text-xs border border-slate-300 focus:outline-none focus:border-[#18446b] w-56 sm:w-72 bg-slate-50 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 主数据展示区 */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">正在检索病理数据库...</p>
        </div>
      ) : displayedSamples.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Tag className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">未找到符合当前筛选条件的病理数据</p>
        </div>
      ) : (
        /* 数据表格视图 - 严格按照列顺序，无排序箭头，切片编号纯文本 */
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-300 font-bold tracking-tight whitespace-nowrap">
              <tr>
                {/* 1. 项目名称 */}
                <th className="py-3 px-3 min-w-[120px]">
                  项目名称
                </th>

                {/* 2. 切片编号 */}
                <th className="py-3 px-3 min-w-[200px]">
                  切片编号
                </th>

                {/* 3. 动物种属/品系 */}
                <th className="py-3 px-3 min-w-[140px]">
                  动物种属/品系
                </th>

                {/* 5. 系统/脏器类型 (显示在动物品系列后) */}
                <th className="py-3 px-3 min-w-[130px]">
                  系统/脏器类型
                </th>

                {/* 6. 受试物 (显示在系统/脏器类型列后) */}
                <th className="py-3 px-3 min-w-[130px]">
                  受试物
                </th>

                {/* 7. 组别 */}
                <th className="py-3 px-3 min-w-[150px]">
                  组别
                </th>

                {/* 8. 性别 (拆分为独立列) */}
                <th className="py-3 px-2 min-w-[65px] text-center">
                  性别
                </th>

                {/* 9. 周龄 (拆分为独立列) */}
                <th className="py-3 px-2 min-w-[65px] text-center">
                  周龄
                </th>

                {/* 10. 病理诊断 (移动至采集时间列前) */}
                <th className="py-3 px-3 min-w-[240px] max-w-[320px]">
                  病理诊断
                </th>

                {/* 11. 组织状态 (移动至病理诊断列后) */}
                <th className="py-3 px-3 min-w-[95px] text-center">
                  组织状态
                </th>

                {/* 12. 采集时间 */}
                <th className="py-3 px-3 min-w-[95px]">
                  采集时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {displayedSamples.map((sample) => {
                const displayCode = sample.sampleCode.replace(/\.[^/.]+$/, '');
                const genderText = sample.gender.includes('雌') ? '雌性' : '雄性';

                return (
                  <tr 
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    title="点击查看病理切片详细信息"
                    className="hover:bg-sky-50/50 transition-colors cursor-pointer bg-white"
                  >
                    {/* 1. 项目名称 */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 text-xs">
                        {sample.projectName || '长期毒性试验'}
                      </span>
                    </td>

                    {/* 2. 切片编号 (不显示任何图标和原点，纯文本) */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs font-bold text-[#18446b]">
                      {displayCode}
                    </td>

                    {/* 3. 动物种属/品系 (动物种属在第一行，动物品系在第二行) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs leading-tight">
                          {sample.species}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {sample.strain || sample.species}
                        </span>
                      </div>
                    </td>

                    {/* 5. 系统/脏器类型 (系统名显示在第一行，脏器显示在第二行，不显示蓝色点) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs leading-tight">
                          {sample.system || '消化系统'}
                        </span>
                        <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          {sample.organ}
                        </span>
                      </div>
                    </td>

                    {/* 6. 受试物 ("/"前的数据显示在第一行，"/"后的数据显示在第二行) */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs leading-tight">
                          {sample.testArticleCategory || '药品'}
                        </span>
                        {sample.testArticleSubCategory ? (
                          <span className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            {sample.testArticleSubCategory}
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* 7. 组别 (仅显示现有第一行数据) */}
                    <td className="py-3 px-3 min-w-[150px]">
                      <div className="font-semibold text-slate-800 text-xs truncate max-w-[200px]" title={sample.experimentGroup}>
                        {sample.experimentGroup || '高剂量给药组'}
                      </div>
                    </td>

                    {/* 8. 性别 (独立列) */}
                    <td className="py-3 px-2 text-center whitespace-nowrap text-xs text-slate-700">
                      {genderText}
                    </td>

                    {/* 9. 周龄 (独立列) */}
                    <td className="py-3 px-2 text-center whitespace-nowrap text-xs font-mono text-slate-700">
                      {sample.ageWeeks}周
                    </td>

                    {/* 10. 病理诊断 */}
                    <td className="py-3 px-3 min-w-[240px] max-w-[320px]">
                      <div 
                        className="text-[11px] text-slate-800 line-clamp-2 leading-relaxed" 
                        title={sample.pathologyDiagnosis || sample.structuredDescription?.clinicalDiagnosis}
                      >
                        {sample.pathologyDiagnosis || sample.structuredDescription?.clinicalDiagnosis || '未见明显组织学病变或细胞异型性'}
                      </div>
                    </td>

                    {/* 11. 组织状态 (在病理诊断后) */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {sample.isLesion ? (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          病变组织
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          正常组织
                        </span>
                      )}
                    </td>

                    {/* 12. 采集时间 */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {sample.samplingDate}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 底部翻页控制栏 (不显示任何数字与样本数计数) */}
      <div className="p-3 sm:px-4 border-t border-slate-200 flex items-center justify-end bg-slate-50/60">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            title="上一页"
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            title="下一页"
            className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
