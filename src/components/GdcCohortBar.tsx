import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  X,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { PathologyFilterParams } from '../types/pathology';

interface GdcCohortBarProps {
  filters: PathologyFilterParams;
  onFilterChange: (newFilters: PathologyFilterParams) => void;
  onReset: () => void;
  totalCount: number;
}

export const GdcCohortBar: React.FC<GdcCohortBarProps> = ({
  filters,
  onFilterChange,
  onReset
}) => {
  const [isFilterStripCollapsed, setIsFilterStripCollapsed] = useState(false);

  // Calculate active filter count
  const activeFilters: Array<{ label: string; clear: () => void }> = [];

  if (filters.keyword) {
    activeFilters.push({
      label: `关键词: ${filters.keyword}`,
      clear: () => onFilterChange({ ...filters, keyword: undefined, page: 1 })
    });
  }

  if (filters.projectNames && filters.projectNames.length > 0) {
    filters.projectNames.forEach(p => {
      activeFilters.push({
        label: `项目: ${p}`,
        clear: () => {
          const next = filters.projectNames!.filter(item => item !== p);
          onFilterChange({
            ...filters,
            projectNames: next.length > 0 ? next : undefined,
            projectName: next.length === 1 ? next[0] : undefined,
            page: 1
          });
        }
      });
    });
  } else if (filters.projectName && filters.projectName !== '全部') {
    activeFilters.push({
      label: `项目: ${filters.projectName}`,
      clear: () => onFilterChange({ ...filters, projectName: undefined, page: 1 })
    });
  }

  if (filters.systems && filters.systems.length > 0) {
    filters.systems.forEach(sys => {
      activeFilters.push({
        label: `系统: ${sys}`,
        clear: () => {
          const next = filters.systems!.filter(s => s !== sys);
          onFilterChange({ ...filters, systems: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.organs && filters.organs.length > 0) {
    filters.organs.forEach(org => {
      activeFilters.push({
        label: `脏器/腺体: ${org}`,
        clear: () => {
          const next = filters.organs!.filter(o => o !== org);
          onFilterChange({ ...filters, organs: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.testArticleCategory && filters.testArticleCategory !== '全部') {
    activeFilters.push({
      label: `受试物: ${filters.testArticleCategory}`,
      clear: () => onFilterChange({ ...filters, testArticleCategory: undefined, page: 1 })
    });
  }

  if (filters.testArticleSubCategory && filters.testArticleSubCategory !== '全部') {
    activeFilters.push({
      label: `受试物亚类: ${filters.testArticleSubCategory}`,
      clear: () => onFilterChange({ ...filters, testArticleSubCategory: undefined, page: 1 })
    });
  }

  if (filters.isLesionFilter && filters.isLesionFilter !== 'all') {
    activeFilters.push({
      label: `组织状态: ${filters.isLesionFilter === 'normal' ? '正常组织' : '病变组织'}`,
      clear: () => onFilterChange({ ...filters, isLesionFilter: 'all', page: 1 })
    });
  }

  if (filters.species && filters.species.length > 0) {
    filters.species.forEach(sp => {
      activeFilters.push({
        label: `动物种属: ${sp}`,
        clear: () => {
          const next = filters.species!.filter(s => s !== sp);
          onFilterChange({ ...filters, species: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.animalTypes && filters.animalTypes.length > 0) {
    filters.animalTypes.forEach(at => {
      activeFilters.push({
        label: `动物种属: ${at}`,
        clear: () => {
          const next = filters.animalTypes!.filter(t => t !== at);
          onFilterChange({ ...filters, animalTypes: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.strains && filters.strains.length > 0) {
    filters.strains.forEach(st => {
      activeFilters.push({
        label: `动物品系: ${st}`,
        clear: () => {
          const next = filters.strains!.filter(s => s !== st);
          onFilterChange({ ...filters, strains: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.genderOptions && filters.genderOptions.length > 0) {
    filters.genderOptions.forEach(g => {
      activeFilters.push({
        label: `性别: ${g}`,
        clear: () => {
          const next = filters.genderOptions!.filter(item => item !== g);
          onFilterChange({ ...filters, genderOptions: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  if (filters.ageRanges && filters.ageRanges.length > 0) {
    filters.ageRanges.forEach(r => {
      activeFilters.push({
        label: `周龄: ${r}`,
        clear: () => {
          const next = filters.ageRanges!.filter(item => item !== r);
          onFilterChange({ ...filters, ageRanges: next.length > 0 ? next : undefined, page: 1 });
        }
      });
    });
  }

  // 自定义周龄范围标签
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    let customAgeLabel = '周龄范围: ';
    if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
      customAgeLabel = `周龄: ${filters.ageMin} - ${filters.ageMax}周`;
    } else if (filters.ageMin !== undefined) {
      customAgeLabel = `周龄: ≥ ${filters.ageMin}周`;
    } else if (filters.ageMax !== undefined) {
      customAgeLabel = `周龄: ≤ ${filters.ageMax}周`;
    }

    activeFilters.push({
      label: customAgeLabel,
      clear: () => onFilterChange({ ...filters, ageMin: undefined, ageMax: undefined, page: 1 })
    });
  }

  return (
    <div className="w-full select-none">
      {/* 已筛选条件条 (已删除原“默认分析队列 队列未保存...”整行，将标题修改为“已筛选条件”) */}
      <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
        {/* 顶部标题栏 */}
        <div className="bg-[#12385c] text-white px-3 py-2 flex items-center justify-between text-xs font-bold">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-300" />
            <span>已筛选条件</span>
            {activeFilters.length > 0 && (
              <span className="text-[11px] font-normal text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded-full border border-sky-400/30">
                已生效 {activeFilters.length} 个维度
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sky-300">
            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1 text-[11px] text-sky-200 hover:text-white transition-colors cursor-pointer mr-2"
                title="清空所有已生效筛选"
              >
                <RotateCcw className="w-3 h-3" />
                <span>清空所有</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsFilterStripCollapsed(!isFilterStripCollapsed)}
              className="p-0.5 hover:text-white cursor-pointer"
              title="折叠/展开已筛选条件"
            >
              {isFilterStripCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 筛选标签展示区 */}
        {!isFilterStripCollapsed && (
          <div className="p-3 bg-white min-h-[46px] flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            {activeFilters.length === 0 ? (
              <div className="text-xs text-slate-500 italic flex items-center gap-2">
                <span>当前未应用任何筛选限制条件，展示全库数据</span>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                {activeFilters.map((af, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 bg-[#f0f6fc] text-[#18446b] border border-[#bcd7ee] px-2.5 py-1 rounded text-xs font-semibold"
                  >
                    <span>{af.label}</span>
                    <button
                      type="button"
                      onClick={af.clear}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
