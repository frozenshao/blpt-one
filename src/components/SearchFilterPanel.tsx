import React, { useState } from 'react';
import { 
  Search, 
  RotateCcw, 
  SlidersHorizontal, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Dna,
  Layers,
  HeartPulse,
  Tag,
  Filter
} from 'lucide-react';
import { 
  OrganType, 
  SliceType, 
  AnimalSpecies, 
  GenderType, 
  PathologyFilterParams 
} from '../types/pathology';

interface SearchFilterPanelProps {
  filters: PathologyFilterParams;
  onFilterChange: (newFilters: PathologyFilterParams) => void;
  onReset: () => void;
  facets?: {
    totalSamples: number;
    normalCount: number;
    lesionCount: number;
    organCounts: Record<string, number>;
    lesionTypeCounts: Record<string, number>;
    speciesCounts: Record<string, number>;
  };
}

const ALL_ORGANS: OrganType[] = ['肝', '脾', '肺', '肾', '心', '脑', '胰腺', '胃肠', '淋巴结', '甲状腺', '骨髓', '皮肤'];

const ALL_SLICE_TYPES: SliceType[] = [
  'HE染色', 
  '免疫组化(IHC)', 
  'Masson三色染色', 
  'PAS糖原染色', 
  '天狼星红染色', 
  '冰冻切片', 
  '石蜡切片'
];

const ALL_LESION_NAMES = [
  '正常形态',
  '炎性细胞浸润',
  '间质纤维化',
  '细胞水肿/气球样变',
  '脂肪变性(脂肪肝)',
  '凝固性坏死',
  '腺癌组织浸润',
  '结节性增生',
  '微血管充血淤血',
  '肾小球硬化',
  '肺泡壁增厚与渗出'
];

const ALL_DISTRIBUTIONS = [
  '无病变(正常)',
  '弥漫性分布',
  '局灶性分布',
  '多灶性散在',
  '结节状聚集',
  '间质广泛浸润',
  '门管区/血管周围'
];

const ALL_SPECIES: AnimalSpecies[] = [
  'C57BL/6 小鼠',
  'BALB/c 小鼠',
  'SD 大鼠',
  'Wistar 大鼠',
  '食蟹猴',
  '比格犬',
  '人源异种移植模型(PDX)',
  '斑马鱼'
];

const ALL_GENDERS: GenderType[] = ['雄性 (Male)', '雌性 (Female)', '混合/未指定'];

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filters,
  onFilterChange,
  onReset,
  facets
}) => {
  // 多维筛选默认收起
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleOrgan = (organ: OrganType) => {
    const current = filters.organs || [];
    const next = current.includes(organ)
      ? current.filter(o => o !== organ)
      : [...current, organ];
    onFilterChange({ ...filters, organs: next.length > 0 ? next : undefined, page: 1 });
  };

  const toggleSliceType = (st: SliceType) => {
    const current = filters.sliceTypes || [];
    const next = current.includes(st)
      ? current.filter(s => s !== st)
      : [...current, st];
    onFilterChange({ ...filters, sliceTypes: next.length > 0 ? next : undefined, page: 1 });
  };

  const toggleLesionName = (lesion: string) => {
    const current = filters.lesionNames || [];
    const next = current.includes(lesion)
      ? current.filter(l => l !== lesion)
      : [...current, lesion];
    onFilterChange({ ...filters, lesionNames: next.length > 0 ? next : undefined, page: 1 });
  };

  const toggleDistribution = (dist: string) => {
    const current = filters.lesionDistributions || [];
    const next = current.includes(dist)
      ? current.filter(d => d !== dist)
      : [...current, dist];
    onFilterChange({ ...filters, lesionDistributions: next.length > 0 ? next : undefined, page: 1 });
  };

  const toggleSpecies = (spec: AnimalSpecies) => {
    const current = filters.species || [];
    const next = current.includes(spec)
      ? current.filter(s => s !== spec)
      : [...current, spec];
    onFilterChange({ ...filters, species: next.length > 0 ? next : undefined, page: 1 });
  };

  const toggleGender = (gender: GenderType) => {
    const current = filters.genders || [];
    const next = current.includes(gender)
      ? current.filter(g => g !== gender)
      : [...current, gender];
    onFilterChange({ ...filters, genders: next.length > 0 ? next : undefined, page: 1 });
  };

  const activeFiltersCount = 
    (filters.keyword ? 1 : 0) +
    (filters.organs?.length || 0) +
    (filters.sliceTypes?.length || 0) +
    (filters.isLesionFilter && filters.isLesionFilter !== 'all' ? 1 : 0) +
    (filters.lesionNames?.length || 0) +
    (filters.lesionDistributions?.length || 0) +
    (filters.species?.length || 0) +
    (filters.genders?.length || 0) +
    (filters.ageMin !== undefined || filters.ageMax !== undefined ? 1 : 0) +
    (filters.dateStart || filters.dateEnd ? 1 : 0);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs p-4 sm:p-5 text-slate-800 transition-all">
      {/* Search Input & Top Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-4 border-b border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="filter-keyword-input"
            type="text"
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange({ ...filters, keyword: e.target.value, page: 1 })}
            placeholder="快速搜索样本编号、器官、病变名称"
            className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {filters.keyword && (
            <button
              onClick={() => onFilterChange({ ...filters, keyword: undefined, page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded"
            >
              清除
            </button>
          )}
        </div>

        {/* Normal vs Lesion Quick Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 self-start md:self-auto">
          <button
            id="filter-state-all"
            onClick={() => onFilterChange({ ...filters, isLesionFilter: 'all', page: 1 })}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              !filters.isLesionFilter || filters.isLesionFilter === 'all'
                ? 'bg-white text-blue-700 font-semibold shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            全部状态
          </button>
          <button
            id="filter-state-normal"
            onClick={() => onFilterChange({ ...filters, isLesionFilter: 'normal', page: 1 })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.isLesionFilter === 'normal'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            正常组织
          </button>
          <button
            id="filter-state-lesion"
            onClick={() => onFilterChange({ ...filters, isLesionFilter: 'lesion', page: 1 })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              filters.isLesionFilter === 'lesion'
                ? 'bg-rose-50 text-rose-700 border border-rose-300 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            病变组织
          </button>
        </div>

        {/* Action Buttons: Reset & Collapse */}
        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              id="filter-reset-btn"
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重置条件 ({activeFiltersCount})</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>{isExpanded ? '收起多维筛选' : '展开多维筛选'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Multi-Dimensional Filter Body */}
      {isExpanded && (
        <div className="pt-4 space-y-4 text-xs">
          {/* Dimension 1: Organ / Tissue Type */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
                器官 / 组织类型：
              </span>
              {filters.organs && filters.organs.length > 0 && (
                <button
                  onClick={() => onFilterChange({ ...filters, organs: undefined, page: 1 })}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  清除已选器官 ({filters.organs.length})
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_ORGANS.map(organ => {
                const isSelected = filters.organs?.includes(organ);
                return (
                  <button
                    key={organ}
                    id={`filter-organ-${organ}`}
                    onClick={() => toggleOrgan(organ)}
                    className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700'
                    }`}
                  >
                    <span>{organ}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension 2: Slice / Staining Type */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" />
                切片 / 染色类型：
              </span>
              {filters.sliceTypes && filters.sliceTypes.length > 0 && (
                <button
                  onClick={() => onFilterChange({ ...filters, sliceTypes: undefined, page: 1 })}
                  className="text-[11px] text-blue-600 hover:underline"
                >
                  清除已选染色
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_SLICE_TYPES.map(st => {
                const isSelected = filters.sliceTypes?.includes(st);
                return (
                  <button
                    key={st}
                    onClick={() => toggleSliceType(st)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension 3 & 4: Lesion Name & Lesion Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-rose-600" />
                  标注标签 / 病变名称：
                </span>
                {filters.lesionNames && filters.lesionNames.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ ...filters, lesionNames: undefined, page: 1 })}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    清除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {ALL_LESION_NAMES.map(lesion => {
                  const isSelected = filters.lesionNames?.includes(lesion);
                  return (
                    <button
                      key={lesion}
                      onClick={() => toggleLesionName(lesion)}
                      className={`px-2 py-1 rounded text-xs transition-all ${
                        isSelected
                          ? 'bg-rose-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-700'
                      }`}
                    >
                      {lesion}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-amber-600" />
                  病变空间分布：
                </span>
                {filters.lesionDistributions && filters.lesionDistributions.length > 0 && (
                  <button
                    onClick={() => onFilterChange({ ...filters, lesionDistributions: undefined, page: 1 })}
                    className="text-[11px] text-blue-600 hover:underline"
                  >
                    清除
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_DISTRIBUTIONS.map(dist => {
                  const isSelected = filters.lesionDistributions?.includes(dist);
                  return (
                    <button
                      key={dist}
                      onClick={() => toggleDistribution(dist)}
                      className={`px-2 py-1 rounded text-xs transition-all ${
                        isSelected
                          ? 'bg-amber-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-700'
                      }`}
                    >
                      {dist}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dimension 5, 6, 7: Animal Species, Gender, Week Age & Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-200">
            {/* Animal Species */}
            <div>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Dna className="w-3.5 h-3.5 text-teal-600" />
                动物种属来源：
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SPECIES.map(spec => {
                  const isSelected = filters.species?.includes(spec);
                  return (
                    <button
                      key={spec}
                      onClick={() => toggleSpecies(spec)}
                      className={`px-2 py-1 rounded text-xs transition-all ${
                        isSelected
                          ? 'bg-teal-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-700'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender & Week Age */}
            <div>
              <div className="font-semibold text-slate-800 mb-2">性别与周龄范围：</div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                {ALL_GENDERS.map(g => {
                  const isSelected = filters.genders?.includes(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGender(g)}
                      className={`px-2 py-1 rounded text-xs transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-700'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>

              {/* Age Range Inputs */}
              <div className="flex items-center gap-2">
                <span className="text-slate-600">周龄：</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filters.ageMin !== undefined ? filters.ageMin : ''}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    ageMin: e.target.value ? Number(e.target.value) : undefined,
                    page: 1
                  })}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filters.ageMax !== undefined ? filters.ageMax : ''}
                  onChange={(e) => onFilterChange({
                    ...filters,
                    ageMax: e.target.value ? Number(e.target.value) : undefined,
                    page: 1
                  })}
                  className="w-16 px-2 py-1 bg-white border border-slate-300 rounded text-center text-slate-800 focus:outline-none focus:border-blue-500 text-xs"
                />
                <span className="text-slate-600">周</span>
              </div>
            </div>

            {/* Sampling Date Range */}
            <div>
              <div className="font-semibold text-slate-800 flex items-center gap-1.5 mb-2">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                采集时间范围：
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={filters.dateStart || ''}
                  onChange={(e) => onFilterChange({ ...filters, dateStart: e.target.value || undefined, page: 1 })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-slate-400">至</span>
                <input
                  type="date"
                  value={filters.dateEnd || ''}
                  onChange={(e) => onFilterChange({ ...filters, dateEnd: e.target.value || undefined, page: 1 })}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
