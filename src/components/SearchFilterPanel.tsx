import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  RotateCcw, 
  SlidersHorizontal
} from 'lucide-react';
import { 
  PathologyFilterParams, 
  OrganSystem, 
  ORGAN_SYSTEM_DATA, 
  TestArticleCategory, 
  TEST_ARTICLE_DATA,
  ProjectType,
  ALL_PROJECT_TYPES
} from '../types/pathology';

interface SearchFilterPanelProps {
  filters: PathologyFilterParams;
  onFilterChange: (newFilters: PathologyFilterParams) => void;
  onReset: () => void;
  facets?: {
    totalSamples: number;
    normalCount: number;
    lesionCount: number;
    organCounts?: Record<string, number>;
    speciesCounts?: Record<string, number>;
  };
}

const ALL_SYSTEMS: OrganSystem[] = [
  '消化系统',
  '心血管系统',
  '内分泌系统',
  '骨骼组织',
  '呼吸系统',
  '生殖系统',
  '泌尿系统',
  '神经系统',
  '淋巴系统'
];

// 动物种属
const ALL_ANIMAL_TYPES = [
  '小鼠',
  '大鼠',
  '食蟹猴',
  '比格犬',
  '人源异种移植模型(PDX)',
  '斑马鱼'
];

// 动物品系
const ALL_STRAINS = [
  'C57BL/6J',
  'BALB/cAnN',
  'Sprague-Dawley (SD)',
  'Wistar 大鼠',
  '食蟹猴 (Macaca fascicularis)',
  '比格犬 (Beagle Dog)',
  'NOD/SCID/IL2rγ-/- (NCG)',
  'AB/Wildtype 斑马鱼'
];

// 性别选项
const ALL_GENDERS = ['雄性', '雌性'];

// 周龄区间
const ALL_AGE_RANGES = [
  '8周及以下',
  '9 - 16周',
  '17 - 24周',
  '25 - 52周',
  '52周以上'
];

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filters,
  onFilterChange
}) => {
  // Collapse states for individual facet cards (matching table column sequence)
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    project: true,
    animalType: true,
    strain: true,
    system: true,
    testArticle: true,
    gender: true,
    age: true,
    pathology: true
  });

  // Expanded systems within system facet
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({
    '消化系统': true,
    '心血管系统': false,
    '内分泌系统': false,
    '骨骼组织': false,
    '呼吸系统': false,
    '生殖系统': false,
    '泌尿系统': false,
    '神经系统': false,
    '淋巴系统': false
  });

  // Expanded test article categories (药品, 医疗器械, 化妆品)
  const [expandedTestArticles, setExpandedTestArticles] = useState<Record<string, boolean>>({
    '药品': true,
    '医疗器械': false,
    '化妆品': false
  });

  const toggleFacet = (facetKey: string) => {
    setOpenFacets(prev => ({ ...prev, [facetKey]: !prev[facetKey] }));
  };

  const toggleExpandedSystem = (sysName: string) => {
    setExpandedSystems(prev => ({ ...prev, [sysName]: !prev[sysName] }));
  };

  const toggleExpandedTestArticle = (catName: string) => {
    setExpandedTestArticles(prev => ({ ...prev, [catName]: !prev[catName] }));
  };

  const collapseAllFacets = () => {
    const allClosed: Record<string, boolean> = {};
    Object.keys(openFacets).forEach(k => { allClosed[k] = false; });
    setOpenFacets(allClosed);
  };

  const expandAllFacets = () => {
    const allOpen: Record<string, boolean> = {};
    Object.keys(openFacets).forEach(k => { allOpen[k] = true; });
    setOpenFacets(allOpen);
  };

  // 1. 项目名称支持多选
  const handleToggleProject = (proj: ProjectType) => {
    const current = filters.projectNames 
      ? [...filters.projectNames] 
      : (filters.projectName ? [filters.projectName] : []);
    const next = current.includes(proj)
      ? current.filter(p => p !== proj)
      : [...current, proj];
    onFilterChange({
      ...filters,
      projectName: next.length === 1 ? next[0] : undefined,
      projectNames: next.length > 0 ? next : undefined,
      page: 1
    });
  };

  // 2. 动物种属切换
  const handleToggleAnimalType = (at: string) => {
    const current = filters.animalTypes || [];
    const next = current.includes(at)
      ? current.filter(t => t !== at)
      : [...current, at];
    onFilterChange({ ...filters, animalTypes: next.length > 0 ? next : undefined, page: 1 });
  };

  // 3. 动物品系切换
  const handleToggleStrain = (st: string) => {
    const current = filters.strains || [];
    const next = current.includes(st)
      ? current.filter(s => s !== st)
      : [...current, st];
    onFilterChange({ ...filters, strains: next.length > 0 ? next : undefined, page: 1 });
  };

  // 4. 系统/脏器类型切换
  const handleToggleSystem = (sys: OrganSystem) => {
    const current = filters.systems || [];
    const next = current.includes(sys)
      ? current.filter(s => s !== sys)
      : [...current, sys];
    onFilterChange({ ...filters, systems: next.length > 0 ? next : undefined, page: 1 });
  };

  const handleToggleOrgan = (organ: string) => {
    const current = filters.organs || [];
    const next = current.includes(organ)
      ? current.filter(o => o !== organ)
      : [...current, organ];
    onFilterChange({ ...filters, organs: next.length > 0 ? next : undefined, page: 1 });
  };

  // 5. 受试物分类与亚类切换
  const handleToggleTestArticleCat = (cat: TestArticleCategory) => {
    const next = filters.testArticleCategory === cat ? undefined : cat;
    onFilterChange({ ...filters, testArticleCategory: next, testArticleSubCategory: undefined, page: 1 });
  };

  const handleToggleTestArticleSubCat = (subCat: string) => {
    const next = filters.testArticleSubCategory === subCat ? undefined : subCat;
    onFilterChange({ ...filters, testArticleSubCategory: next, page: 1 });
  };

  // 6. 性别切换
  const handleToggleGender = (g: string) => {
    const current = filters.genderOptions || [];
    const next = current.includes(g)
      ? current.filter(item => item !== g)
      : [...current, g];
    onFilterChange({ ...filters, genderOptions: next.length > 0 ? next : undefined, page: 1 });
  };

  // 7. 周龄切换
  const handleToggleAgeRange = (range: string) => {
    const current = filters.ageRanges || [];
    const next = current.includes(range)
      ? current.filter(item => item !== range)
      : [...current, range];
    onFilterChange({ ...filters, ageRanges: next.length > 0 ? next : undefined, page: 1 });
  };

  return (
    <div className="w-full bg-white rounded-lg border border-slate-300 shadow-xs overflow-hidden select-none">
      {/* 顶部标题栏：已修改为“筛选” */}
      <div className="bg-slate-100 px-3.5 py-2.5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs tracking-wide">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#18446b]" />
          <span>筛选</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={collapseAllFacets}
            className="text-[11px] text-[#18446b] hover:underline font-medium cursor-pointer"
          >
            全部折叠
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={expandAllFacets}
            className="text-[11px] text-[#18446b] hover:underline font-medium cursor-pointer"
          >
            全部展开
          </button>
        </div>
      </div>

      {/* 1. 项目名称 (支持多选) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('project')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.project ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>项目名称</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.projectName || filters.projectNames?.length) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, projectName: undefined, projectNames: undefined, page: 1 })}
                title="清空项目筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.project && (
          <div className="p-2 space-y-1 bg-slate-50/50">
            {ALL_PROJECT_TYPES.map((proj) => {
              const isChecked = filters.projectNames?.includes(proj) || filters.projectName === proj;

              return (
                <div 
                  key={proj}
                  onClick={() => handleToggleProject(proj)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                    />
                    <span>{proj}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. 动物种属 (顺序与表格一致) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('animalType')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.animalType ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>动物种属</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {filters.animalTypes?.length ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, animalTypes: undefined, page: 1 })}
                title="清空种属筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.animalType && (
          <div className="p-2 space-y-1 bg-slate-50/50 max-h-48 overflow-y-auto">
            {ALL_ANIMAL_TYPES.map((at) => {
              const isChecked = filters.animalTypes?.includes(at) || false;

              return (
                <div 
                  key={at}
                  onClick={() => handleToggleAnimalType(at)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                    />
                    <span>{at}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. 动物品系 (顺序与表格一致) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('strain')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.strain ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>动物品系</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {filters.strains?.length ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, strains: undefined, page: 1 })}
                title="清空品系筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.strain && (
          <div className="p-2 space-y-1 bg-slate-50/50 max-h-48 overflow-y-auto">
            {ALL_STRAINS.map((st) => {
              const isChecked = filters.strains?.includes(st) || false;

              return (
                <div 
                  key={st}
                  onClick={() => handleToggleStrain(st)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                    />
                    <span>{st}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. 系统/脏器类型 (顺序与表格一致) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('system')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.system ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>系统/脏器类型</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.systems?.length || filters.organs?.length) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, systems: undefined, organs: undefined, page: 1 })}
                title="清空脏器筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.system && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
              {ALL_SYSTEMS.map((sys) => {
                const isSysChecked = filters.systems?.includes(sys) || false;
                const isSysExpanded = expandedSystems[sys] || false;
                const subOrgans = ORGAN_SYSTEM_DATA[sys] || [];

                return (
                  <div key={sys} className="rounded border border-slate-200/60 bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-2 py-1.5 hover:bg-sky-50/60 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleExpandedSystem(sys)}
                          className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isSysExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </button>
                        <input
                          type="checkbox"
                          id={`filter-sys-${sys}`}
                          checked={isSysChecked}
                          onChange={() => handleToggleSystem(sys)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-sys-${sys}`}
                          className={`text-xs font-bold cursor-pointer truncate ${isSysChecked ? 'text-[#18446b]' : 'text-slate-800'}`}
                        >
                          {sys}
                        </label>
                      </div>
                    </div>

                    {isSysExpanded && subOrgans.length > 0 && (
                      <div className="bg-slate-50/80 px-2 py-1 pl-6 space-y-1 border-t border-slate-100">
                        {subOrgans.map((org) => {
                          const isOrgChecked = filters.organs?.includes(org) || false;

                          return (
                            <div key={org} className="flex items-center justify-between py-0.5 hover:bg-slate-100/80 rounded px-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <input
                                  type="checkbox"
                                  id={`filter-org-${org}`}
                                  checked={isOrgChecked}
                                  onChange={() => handleToggleOrgan(org)}
                                  className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                                />
                                <label
                                  htmlFor={`filter-org-${org}`}
                                  className={`text-[11px] cursor-pointer truncate ${isOrgChecked ? 'text-[#18446b] font-bold' : 'text-slate-700'}`}
                                >
                                  {org}
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 5. 受试物 (名称已修改为“受试物”，支持展开收起，化妆品无二级分类) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('testArticle')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.testArticle ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>受试物</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.testArticleCategory || filters.testArticleSubCategory) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, testArticleCategory: undefined, testArticleSubCategory: undefined, page: 1 })}
                title="清空受试物筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.testArticle && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            {(['药品', '医疗器械', '化妆品'] as TestArticleCategory[]).map((cat) => {
              const isCatChecked = filters.testArticleCategory === cat;
              const subTypes = TEST_ARTICLE_DATA[cat] || [];
              const hasSub = subTypes.length > 0;
              const isExpanded = expandedTestArticles[cat] || false;

              return (
                <div key={cat} className="rounded border border-slate-200/80 bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-2 py-1.5 hover:bg-sky-50/60 transition-colors">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {hasSub ? (
                        <button
                          type="button"
                          onClick={() => toggleExpandedTestArticle(cat)}
                          className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                        </button>
                      ) : (
                        <div className="w-4" />
                      )}
                      <input
                        type="checkbox"
                        id={`filter-cat-${cat}`}
                        checked={isCatChecked}
                        onChange={() => handleToggleTestArticleCat(cat)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                      />
                      <label
                        htmlFor={`filter-cat-${cat}`}
                        className={`text-xs font-bold cursor-pointer ${isCatChecked ? 'text-[#18446b]' : 'text-slate-800'}`}
                      >
                        {cat}
                      </label>
                    </div>
                  </div>

                  {/* 仅在有二级分类且展开时显示二级分类 (化妆品无二级分类) */}
                  {hasSub && isExpanded && (
                    <div className="bg-slate-50/80 px-2 py-1 pl-6 space-y-1 border-t border-slate-100">
                      {subTypes.map((sub) => {
                        const isSubChecked = filters.testArticleSubCategory === sub;

                        return (
                          <div 
                            key={sub}
                            onClick={() => handleToggleTestArticleSubCat(sub)}
                            className={`flex items-center justify-between py-1 px-1 rounded text-[11px] cursor-pointer transition-colors ${
                              isSubChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <input
                                type="checkbox"
                                checked={isSubChecked}
                                onChange={() => {}}
                                className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                              />
                              <span className="truncate">{sub}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. 性别 (顺序与表格一致) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('gender')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.gender ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>性别</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {filters.genderOptions?.length ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, genderOptions: undefined, page: 1 })}
                title="清空性别筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.gender && (
          <div className="p-2 space-y-1 bg-slate-50/50">
            {ALL_GENDERS.map((g) => {
              const isChecked = filters.genderOptions?.includes(g) || false;

              return (
                <div 
                  key={g}
                  onClick={() => handleToggleGender(g)}
                  className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                    isChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                    />
                    <span>{g}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. 周龄 (顺序与表格一致，支持自定义范围与快捷区间) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('age')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.age ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>周龄</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.ageRanges?.length || filters.ageMin !== undefined || filters.ageMax !== undefined) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, ageRanges: undefined, ageMin: undefined, ageMax: undefined, page: 1 })}
                title="清空周龄筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.age && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            {/* 自定义周龄范围输入 */}
            <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>自定义周龄范围</span>
                {(filters.ageMin !== undefined || filters.ageMax !== undefined) && (
                  <span className="text-[10px] text-blue-600 font-mono">已启用</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="200"
                  placeholder="最小周龄"
                  value={filters.ageMin !== undefined ? filters.ageMin : ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    onFilterChange({ ...filters, ageMin: val, page: 1 });
                  }}
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-[#18446b] font-mono text-center"
                />
                <span className="text-slate-400 text-xs shrink-0">至</span>
                <input
                  type="number"
                  min="0"
                  max="200"
                  placeholder="最大周龄"
                  value={filters.ageMax !== undefined ? filters.ageMax : ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    onFilterChange({ ...filters, ageMax: val, page: 1 });
                  }}
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-[#18446b] font-mono text-center"
                />
                <span className="text-slate-500 text-xs shrink-0 font-medium">周</span>
              </div>
            </div>

            {/* 快捷周龄区间 */}
            <div className="space-y-1">
              {ALL_AGE_RANGES.map((range) => {
                const isChecked = filters.ageRanges?.includes(range) || false;

                return (
                  <div 
                    key={range}
                    onClick={() => handleToggleAgeRange(range)}
                    className={`flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                      isChecked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                      />
                      <span>{range}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 8. 组织状态 (顺序与表格一致) */}
      <div>
        <div 
          onClick={() => toggleFacet('pathology')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.pathology ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>组织状态</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {filters.isLesionFilter && filters.isLesionFilter !== 'all' ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, isLesionFilter: 'all', page: 1 })}
                title="清空组织状态筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.pathology && (
          <div className="p-2 space-y-1 bg-slate-50/50">
            <div 
              onClick={() => onFilterChange({ ...filters, isLesionFilter: filters.isLesionFilter === 'normal' ? 'all' : 'normal', page: 1 })}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                filters.isLesionFilter === 'normal' ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isLesionFilter === 'normal'}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
                <span>正常组织</span>
              </div>
            </div>

            <div 
              onClick={() => onFilterChange({ ...filters, isLesionFilter: filters.isLesionFilter === 'lesion' ? 'all' : 'lesion', page: 1 })}
              className={`flex items-center justify-between px-2 py-1.5 rounded text-xs cursor-pointer transition-colors ${
                filters.isLesionFilter === 'lesion' ? 'bg-rose-50 text-rose-800 font-bold border border-rose-200' : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.isLesionFilter === 'lesion'}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-rose-600 focus:ring-rose-600 cursor-pointer"
                />
                <span>病变组织</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
