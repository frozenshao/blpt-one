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
import {
  formatFormulationDisplay,
  formatGenderDisplay,
  formatLesionDiagnosis,
  formatLesionSeverity,
  formatSampleYearMonth,
  formatSystemOrganDisplay
} from '../utils/sampleFormatters';

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
    : samples.filter(s => {
        const q = localSearch.toLowerCase();
        const sysOrgText = formatSystemOrganDisplay(s);
        const formulationText = formatFormulationDisplay(s);
        return (
          s.sampleCode.toLowerCase().includes(q) ||
          (s.animalId && s.animalId.toLowerCase().includes(q)) ||
          sysOrgText.toLowerCase().includes(q) ||
          (s.projectName && s.projectName.toLowerCase().includes(q)) ||
          formulationText.toLowerCase().includes(q) ||
          (s.testArticle && s.testArticle.toLowerCase().includes(q)) ||
          (s.experimentGroup && s.experimentGroup.toLowerCase().includes(q)) ||
          (s.lesionName && s.lesionName.toLowerCase().includes(q)) ||
          (s.lesionSeverity && s.lesionSeverity.toLowerCase().includes(q)) ||
          (s.strain && s.strain.toLowerCase().includes(q))
        );
      });

  const displayTotalCount = localSearch.trim() === '' ? total : displayedSamples.length;

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
            placeholder="快速搜索切片编号、动物号、病变诊断"
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
        /* 数据表格视图 */
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-[#f8fafc] text-slate-700 border-b border-slate-300 font-bold tracking-tight whitespace-nowrap">
              <tr>
                {/* 1. 研究类型 */}
                <th className="py-3 px-3 min-w-[110px]">
                  研究类型
                </th>

                {/* 2. 切片编号 */}
                <th className="py-3 px-3 min-w-[190px]">
                  切片编号
                </th>

                {/* 3. 动物种属/品系 */}
                <th className="py-3 px-3 min-w-[140px]">
                  动物种属/品系
                </th>

                {/* 4. 系统/脏器类型 */}
                <th className="py-3 px-3 min-w-[180px]">
                  系统/脏器类型
                </th>

                {/* 5. 给药制剂 */}
                <th className="py-3 px-3 min-w-[150px]">
                  给药制剂
                </th>

                {/* 6. 实验组别 */}
                <th className="py-3 px-3 min-w-[110px]">
                  实验组别
                </th>

                {/* 7. 动物号 */}
                <th className="py-3 px-3 min-w-[85px] text-center">
                  动物号
                </th>

                {/* 8. 性别 */}
                <th className="py-3 px-2 min-w-[65px] text-center">
                  性别
                </th>

                {/* 9. 年龄 */}
                <th className="py-3 px-2 min-w-[85px] text-center">
                  年龄
                </th>

                {/* 10. 组织状态 */}
                <th className="py-3 px-3 min-w-[95px] text-center">
                  组织状态
                </th>

                {/* 11. 病变诊断 */}
                <th className="py-3 px-3 min-w-[140px]">
                  病变诊断
                </th>

                {/* 12. 病变程度 */}
                <th className="py-3 px-3 min-w-[115px] text-center">
                  病变程度
                </th>

                {/* 13. 创建时间 */}
                <th className="py-3 px-3 min-w-[95px]">
                  创建时间
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {displayedSamples.map((sample) => {
                const displayCode = sample.sampleCode.replace(/\.[^/.]+$/, '');
                const genderText = formatGenderDisplay(sample.gender);
                const systemOrganText = formatSystemOrganDisplay(sample);
                const formulationText = formatFormulationDisplay(sample);
                const ageText = sample.ageDisplay || `${sample.ageWeeks}周龄`;
                const lesionNameText = formatLesionDiagnosis(sample);
                const lesionSeverityText = formatLesionSeverity(sample);
                const createdAtText = formatSampleYearMonth(sample.samplingDate);

                return (
                  <tr 
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    title="点击查看病理切片详细信息"
                    className="hover:bg-sky-50/50 transition-colors cursor-pointer bg-white"
                  >
                    {/* 1. 研究类型 */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 text-xs">
                        {sample.projectName || '重复给药毒性试验'}
                      </span>
                    </td>

                    {/* 2. 切片编号 */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-xs font-bold text-[#18446b]">
                      {displayCode}
                    </td>

                    {/* 3. 动物种属/品系 */}
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

                    {/* 4. 系统/脏器类型 (拼接显示，多个脏器用逗号拼接) */}
                    <td className="py-3 px-3 min-w-[180px] max-w-[260px]">
                      <span className="text-xs font-medium text-slate-800 leading-relaxed" title={systemOrganText}>
                        {systemOrganText}
                      </span>
                    </td>

                    {/* 5. 给药制剂 */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-medium text-slate-800 text-xs">
                        {formulationText}
                      </span>
                    </td>

                    {/* 6. 实验组别 */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-800 text-xs" title={sample.experimentGroup}>
                        {sample.experimentGroup || '高剂量组'}
                      </span>
                    </td>

                    {/* 7. 动物号 */}
                    <td className="py-3 px-3 text-center whitespace-nowrap font-mono text-xs font-semibold text-slate-700">
                      {sample.animalId || '-'}
                    </td>

                    {/* 8. 性别 */}
                    <td className="py-3 px-2 text-center whitespace-nowrap text-xs text-slate-700">
                      {genderText}
                    </td>

                    {/* 9. 年龄 */}
                    <td className="py-3 px-2 text-center whitespace-nowrap text-xs font-mono text-slate-700">
                      {ageText}
                    </td>

                    {/* 10. 组织状态 */}
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

                    {/* 11. 病变诊断 */}
                    <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-700">
                      {lesionNameText}
                    </td>

                    {/* 12. 病变程度 */}
                    <td className="py-3 px-3 text-center whitespace-nowrap text-xs text-slate-700">
                      {lesionSeverityText}
                    </td>

                    {/* 13. 创建时间 */}
                    <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {createdAtText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 底部翻页控制栏：与用户管理页面翻页样式一致 */}
      <div className="px-4 py-3 border-t border-[#bcd7ee]/60 bg-slate-50/70 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">
          共{displayTotalCount}条
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            title="上一页"
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-600 px-1">
            {page} / {Math.max(1, totalPages)}
          </span>
          <button
            type="button"
            disabled={page >= Math.max(1, totalPages)}
            onClick={() => onPageChange(page + 1)}
            title="下一页"
            className="p-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
