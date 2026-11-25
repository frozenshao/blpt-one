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
  ANIMAL_SPECIES_STRAIN_DATA,
  FORMULATION_TREE_DATA,
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
  '呼吸系统',
  '泌尿系统',
  '雄性生殖系统',
  '雌性生殖系统',
  '免疫系统',
  '神经系统',
  '肌肉骨骼系统',
  '皮肤及附属器',
  '特殊感觉器官'
];

// 动物种属 (按图片列表顺序)
const ALL_ANIMAL_TYPES = [
  '小鼠',
  '大鼠',
  '猴',
  '犬',
  '兔',
  '猪（小型猪）',
  '豚鼠'
];

// 性别选项
const ALL_GENDERS = ['雄性', '雌性'];

// 各类动物种属对应的快捷年龄区间 (按图片1)
const AGE_RANGES_BY_SPECIES: Record<string, string[]> = {
  '小鼠': ['6–8周龄', '7-9周龄', '18-24周龄'],
  '大鼠': ['6–8周龄', '14-16周龄', '30-32周龄'],
  '比格犬': ['4–6月龄', '6-12月龄', '5岁以上'],
  '食蟹猴': ['2–4岁', '5岁以上', '12-18岁'],
  '新西兰白兔': ['12–16周龄（3-4月龄）', '5-9月龄']
};

// 病变程度两类筛选条件
const ALL_LESION_SEVERITY_LEVELS = ['轻微', '轻度', '中度', '重度', '严重'];
const ALL_LESION_DISTRIBUTIONS = ['单灶性', '多灶性'];

const resolveActiveAgeSpeciesKey = (animalTypes?: string[], strains?: string[]): string | null => {
  const speciesSet = new Set<string>(animalTypes || []);
  (strains || []).forEach(st => {
    for (const [sp, list] of Object.entries(ANIMAL_SPECIES_STRAIN_DATA)) {
      if (list.includes(st)) {
        speciesSet.add(sp);
      }
    }
  });

  if (speciesSet.size !== 1) return null;
  const singleSpecies = Array.from(speciesSet)[0];
  if (singleSpecies === '小鼠') return '小鼠';
  if (singleSpecies === '大鼠') return '大鼠';
  if (singleSpecies === '犬') return '比格犬';
  if (singleSpecies === '兔') return '新西兰白兔';
  if (singleSpecies === '猴') {
    if (strains?.includes('恒河猴') && !strains?.includes('食蟹猴')) return null;
    if (strains?.includes('恒河猴')) return null;
    return '食蟹猴';
  }
  return null;
};

export const SearchFilterPanel: React.FC<SearchFilterPanelProps> = ({
  filters,
  onFilterChange
}) => {
  // Collapse states for individual facet cards (matching table column sequence)
  const [openFacets, setOpenFacets] = useState<Record<string, boolean>>({
    project: true,
    animal: true,
    system: true,
    testArticle: true,
    gender: true,
    age: true,
    pathology: true,
    lesionSeverity: true
  });

  // Expanded animals within animal species/strain facet (二级联动)
  const [expandedAnimals, setExpandedAnimals] = useState<Record<string, boolean>>({
    '小鼠': true,
    '大鼠': false,
    '猴': false,
    '犬': false,
    '兔': false,
    '猪（小型猪）': false,
    '豚鼠': false
  });

  // Expanded systems within system facet
  const [expandedSystems, setExpandedSystems] = useState<Record<string, boolean>>({
    '消化系统': true,
    '心血管系统': false,
    '内分泌系统': false,
    '呼吸系统': false,
    '泌尿系统': false,
    '雄性生殖系统': false,
    '雌性生殖系统': false,
    '免疫系统': false,
    '神经系统': false,
    '肌肉骨骼系统': false,
    '皮肤及附属器': false,
    '特殊感觉器官': false
  });

  // Expanded 给药制剂 Level 1 (受试物, 溶媒, 佐剂) & Level 2 (药品)
  const [expandedFormulationL1, setExpandedFormulationL1] = useState<Record<string, boolean>>({
    '受试物': true,
    '溶媒': false,
    '佐剂': false
  });
  const [expandedFormulationL2, setExpandedFormulationL2] = useState<Record<string, boolean>>({
    '药品': true
  });

  const toggleFacet = (facetKey: string) => {
    setOpenFacets(prev => ({ ...prev, [facetKey]: !prev[facetKey] }));
  };

  const toggleExpandedAnimal = (animalName: string) => {
    setExpandedAnimals(prev => ({ ...prev, [animalName]: !prev[animalName] }));
  };

  const toggleExpandedSystem = (sysName: string) => {
    setExpandedSystems(prev => ({ ...prev, [sysName]: !prev[sysName] }));
  };

  const toggleExpandedFormulationL1 = (l1Name: string) => {
    setExpandedFormulationL1(prev => ({ ...prev, [l1Name]: !prev[l1Name] }));
  };

  const toggleExpandedFormulationL2 = (l2Name: string) => {
    setExpandedFormulationL2(prev => ({ ...prev, [l2Name]: !prev[l2Name] }));
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
    const nextAnimalTypes = next.length > 0 ? next : undefined;
    const nextSpeciesKey = resolveActiveAgeSpeciesKey(nextAnimalTypes, filters.strains);
    const allowedAgeRanges = nextSpeciesKey ? AGE_RANGES_BY_SPECIES[nextSpeciesKey] : [];
    const nextAgeRanges = (filters.ageRanges || []).filter(r => allowedAgeRanges.includes(r));

    onFilterChange({
      ...filters,
      animalTypes: nextAnimalTypes,
      ageRanges: nextAgeRanges.length > 0 ? nextAgeRanges : undefined,
      page: 1
    });
  };

  // 3. 动物品系切换
  const handleToggleStrain = (st: string) => {
    const current = filters.strains || [];
    const next = current.includes(st)
      ? current.filter(s => s !== st)
      : [...current, st];
    const nextStrains = next.length > 0 ? next : undefined;
    const nextSpeciesKey = resolveActiveAgeSpeciesKey(filters.animalTypes, nextStrains);
    const allowedAgeRanges = nextSpeciesKey ? AGE_RANGES_BY_SPECIES[nextSpeciesKey] : [];
    const nextAgeRanges = (filters.ageRanges || []).filter(r => allowedAgeRanges.includes(r));

    onFilterChange({
      ...filters,
      strains: nextStrains,
      ageRanges: nextAgeRanges.length > 0 ? nextAgeRanges : undefined,
      page: 1
    });
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

  // 5. 给药制剂三级联动切换 (一级栏目 -> 二级类别 -> 三级选项)
  const handleToggleFormulationL1 = (l1: string) => {
    const current = filters.formulationCategories || [];
    const next = current.includes(l1)
      ? current.filter(item => item !== l1)
      : [...current, l1];
    onFilterChange({
      ...filters,
      formulationCategories: next.length > 0 ? next : undefined,
      page: 1
    });
  };

  const handleToggleFormulationL2 = (l2: string) => {
    const current = filters.testArticleCategories
      ? [...filters.testArticleCategories]
      : (filters.testArticleCategory ? [filters.testArticleCategory] : []);
    const next = current.includes(l2)
      ? current.filter(item => item !== l2)
      : [...current, l2];
    onFilterChange({
      ...filters,
      testArticleCategory: undefined,
      testArticleCategories: next.length > 0 ? next : undefined,
      page: 1
    });
  };

  const handleToggleFormulationL3 = (l3: string) => {
    const current = filters.testArticleSubCategories
      ? [...filters.testArticleSubCategories]
      : (filters.testArticleSubCategory ? [filters.testArticleSubCategory] : []);
    const next = current.includes(l3)
      ? current.filter(item => item !== l3)
      : [...current, l3];
    onFilterChange({
      ...filters,
      testArticleSubCategory: undefined,
      testArticleSubCategories: next.length > 0 ? next : undefined,
      page: 1
    });
  };

  // 6. 性别切换
  const handleToggleGender = (g: string) => {
    const current = filters.genderOptions || [];
    const next = current.includes(g)
      ? current.filter(item => item !== g)
      : [...current, g];
    onFilterChange({ ...filters, genderOptions: next.length > 0 ? next : undefined, page: 1 });
  };

  // 7. 年龄切换
  const handleToggleAgeRange = (range: string) => {
    const current = filters.ageRanges || [];
    const next = current.includes(range)
      ? current.filter(item => item !== range)
      : [...current, range];
    onFilterChange({ ...filters, ageRanges: next.length > 0 ? next : undefined, page: 1 });
  };

  // 9. 病变程度切换（两类条件：程度分级 + 病灶分布）
  const handleToggleLesionSeverity = (sev: string) => {
    const current = filters.lesionSeverities || [];
    const next = current.includes(sev)
      ? current.filter(item => item !== sev)
      : [...current, sev];
    onFilterChange({ ...filters, lesionSeverities: next.length > 0 ? next : undefined, page: 1 });
  };

  const handleToggleLesionDistribution = (dist: string) => {
    const current = filters.lesionDistributions || [];
    const next = current.includes(dist)
      ? current.filter(item => item !== dist)
      : [...current, dist];
    onFilterChange({ ...filters, lesionDistributions: next.length > 0 ? next : undefined, page: 1 });
  };

  const activeAgeSpeciesKey = resolveActiveAgeSpeciesKey(filters.animalTypes, filters.strains);
  const currentQuickAgeRanges = activeAgeSpeciesKey ? (AGE_RANGES_BY_SPECIES[activeAgeSpeciesKey] || []) : [];

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

      {/* 1. 研究类型 (支持多选) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('project')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.project ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>研究类型</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.projectName || filters.projectNames?.length) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, projectName: undefined, projectNames: undefined, page: 1 })}
                title="清空研究类型筛选"
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

      {/* 2. 动物种属/品系 (二级联动选择，与系统/脏器类型一致) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('animal')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.animal ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>动物种属/品系</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.animalTypes?.length || filters.strains?.length) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, animalTypes: undefined, strains: undefined, ageRanges: undefined, page: 1 })}
                title="清空种属/品系筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.animal && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
              {ALL_ANIMAL_TYPES.map((animal) => {
                const isAnimalChecked = filters.animalTypes?.includes(animal) || false;
                const isAnimalExpanded = expandedAnimals[animal] || false;
                const subStrains = ANIMAL_SPECIES_STRAIN_DATA[animal] || [];

                return (
                  <div key={animal} className="rounded border border-slate-200/60 bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-2 py-1.5 hover:bg-sky-50/60 transition-colors">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {subStrains.length > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleExpandedAnimal(animal)}
                            className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            {isAnimalExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                          </button>
                        ) : (
                          <div className="w-4" />
                        )}
                        <input
                          type="checkbox"
                          id={`filter-animal-${animal}`}
                          checked={isAnimalChecked}
                          onChange={() => handleToggleAnimalType(animal)}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                        />
                        <label
                          htmlFor={`filter-animal-${animal}`}
                          className={`text-xs font-bold cursor-pointer truncate ${isAnimalChecked ? 'text-[#18446b]' : 'text-slate-800'}`}
                        >
                          {animal}
                        </label>
                      </div>
                    </div>

                    {isAnimalExpanded && subStrains.length > 0 && (
                      <div className="bg-slate-50/80 px-2 py-1 pl-6 space-y-1 border-t border-slate-100">
                        {subStrains.map((strain) => {
                          const isStrainChecked = filters.strains?.includes(strain) || false;

                          return (
                            <div key={strain} className="flex items-center justify-between py-0.5 hover:bg-slate-100/80 rounded px-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <input
                                  type="checkbox"
                                  id={`filter-strain-${strain}`}
                                  checked={isStrainChecked}
                                  onChange={() => handleToggleStrain(strain)}
                                  className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                                />
                                <label
                                  htmlFor={`filter-strain-${strain}`}
                                  className={`text-[11px] cursor-pointer truncate ${isStrainChecked ? 'text-[#18446b] font-bold' : 'text-slate-700'}`}
                                >
                                  {strain}
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
                            <div key={`${sys}-${org}`} className="flex items-center justify-between py-0.5 hover:bg-slate-100/80 rounded px-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <input
                                  type="checkbox"
                                  id={`filter-org-${sys}-${org}`}
                                  checked={isOrgChecked}
                                  onChange={() => handleToggleOrgan(org)}
                                  className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                                />
                                <label
                                  htmlFor={`filter-org-${sys}-${org}`}
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

      {/* 5. 给药制剂 (三级筛选：一级栏目 -> 二级类别 -> 三级选项) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('testArticle')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.testArticle ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>给药制剂</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.formulationCategories?.length ||
              filters.testArticleCategories?.length ||
              filters.testArticleSubCategories?.length ||
              filters.testArticleCategory ||
              filters.testArticleSubCategory) ? (
              <button
                type="button"
                onClick={() =>
                  onFilterChange({
                    ...filters,
                    formulationCategories: undefined,
                    testArticleCategories: undefined,
                    testArticleSubCategories: undefined,
                    testArticleCategory: undefined,
                    testArticleSubCategory: undefined,
                    page: 1
                  })
                }
                title="清空给药制剂筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.testArticle && (
          <div className="p-2 space-y-1.5 bg-slate-50/50">
            {FORMULATION_TREE_DATA.map((l1Item) => {
              const isL1Checked = filters.formulationCategories?.includes(l1Item.name) || false;
              const isL1Expanded = expandedFormulationL1[l1Item.name] || false;

              return (
                <div key={l1Item.name} className="rounded border border-slate-200/80 bg-white overflow-hidden">
                  {/* 一级栏目 */}
                  <div className="flex items-center justify-between px-2 py-1.5 hover:bg-sky-50/60 transition-colors">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandedFormulationL1(l1Item.name)}
                        className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        {isL1Expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                      </button>
                      <input
                        type="checkbox"
                        id={`filter-formulation-l1-${l1Item.name}`}
                        checked={isL1Checked}
                        onChange={() => handleToggleFormulationL1(l1Item.name)}
                        className="w-3.5 h-3.5 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                      />
                      <label
                        htmlFor={`filter-formulation-l1-${l1Item.name}`}
                        className={`text-xs font-bold cursor-pointer ${isL1Checked ? 'text-[#18446b]' : 'text-slate-800'}`}
                      >
                        {l1Item.name}
                      </label>
                    </div>
                  </div>

                  {/* 二级类别 */}
                  {isL1Expanded && l1Item.children.length > 0 && (
                    <div className="bg-slate-50/80 px-2 py-1 pl-5 space-y-1 border-t border-slate-100">
                      {l1Item.children.map((l2Item) => {
                        const isL2Checked =
                          filters.testArticleCategories?.includes(l2Item.name) ||
                          filters.testArticleCategory === l2Item.name ||
                          false;
                        const hasL3 = l2Item.children.length > 0;
                        const isL2Expanded = expandedFormulationL2[l2Item.name] || false;

                        return (
                          <div key={`${l1Item.name}-${l2Item.name}`} className="rounded border border-slate-200/60 bg-white/80 overflow-hidden">
                            <div className="flex items-center justify-between px-1.5 py-1 hover:bg-slate-100/80 transition-colors">
                              <div className="flex items-center gap-1.5 min-w-0">
                                {hasL3 ? (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandedFormulationL2(l2Item.name)}
                                    className="p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                                  >
                                    {isL2Expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                                  </button>
                                ) : (
                                  <div className="w-4" />
                                )}
                                <input
                                  type="checkbox"
                                  id={`filter-formulation-l2-${l1Item.name}-${l2Item.name}`}
                                  checked={isL2Checked}
                                  onChange={() => handleToggleFormulationL2(l2Item.name)}
                                  className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                                />
                                <label
                                  htmlFor={`filter-formulation-l2-${l1Item.name}-${l2Item.name}`}
                                  className={`text-[11px] cursor-pointer truncate ${isL2Checked ? 'text-[#18446b] font-bold' : 'text-slate-700 font-semibold'}`}
                                >
                                  {l2Item.name}
                                </label>
                              </div>
                            </div>

                            {/* 三级选项 */}
                            {hasL3 && isL2Expanded && (
                              <div className="bg-slate-50 px-2 py-1 pl-6 space-y-0.5 border-t border-slate-100">
                                {l2Item.children.map((l3Name) => {
                                  const isL3Checked =
                                    filters.testArticleSubCategories?.includes(l3Name) ||
                                    filters.testArticleSubCategory === l3Name ||
                                    false;

                                  return (
                                    <div
                                      key={`${l2Item.name}-${l3Name}`}
                                      onClick={() => handleToggleFormulationL3(l3Name)}
                                      className={`flex items-center justify-between py-1 px-1.5 rounded text-[11px] cursor-pointer transition-colors ${
                                        isL3Checked ? 'bg-sky-100 text-[#18446b] font-bold' : 'hover:bg-slate-100 text-slate-700'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 min-w-0">
                                        <input
                                          type="checkbox"
                                          checked={isL3Checked}
                                          onChange={() => {}}
                                          className="w-3 h-3 rounded border-slate-300 text-[#18446b] focus:ring-[#18446b] cursor-pointer"
                                        />
                                        <span className="truncate">{l3Name}</span>
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

      {/* 7. 年龄 (顺序与表格一致，支持自定义范围与快捷区间) */}
      <div className="border-b border-slate-200">
        <div 
          onClick={() => toggleFacet('age')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.age ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>年龄</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.ageRanges?.length || filters.ageMin !== undefined || filters.ageMax !== undefined) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, ageRanges: undefined, ageMin: undefined, ageMax: undefined, page: 1 })}
                title="清空年龄筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.age && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            {/* 自定义年龄范围输入 */}
            <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>自定义年龄范围</span>
                {(filters.ageMin !== undefined || filters.ageMax !== undefined) && (
                  <span className="text-[10px] text-blue-600 font-mono">已启用</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="200"
                  placeholder="最小年龄"
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
                  placeholder="最大年龄"
                  value={filters.ageMax !== undefined ? filters.ageMax : ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                    onFilterChange({ ...filters, ageMax: val, page: 1 });
                  }}
                  className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-[#18446b] font-mono text-center"
                />
                <select
                  value={filters.ageUnit || 'week'}
                  onChange={(e) =>
                    onFilterChange({
                      ...filters,
                      ageUnit: e.target.value as 'week' | 'month' | 'year',
                      page: 1
                    })
                  }
                  aria-label="选择年龄单位"
                  className="px-1.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-[#18446b] text-slate-700 font-medium shrink-0 cursor-pointer"
                >
                  <option value="week">周</option>
                  <option value="month">月</option>
                  <option value="year">年</option>
                </select>
              </div>
            </div>

            {/* 快捷年龄区间：仅在选中对应单一种属时显示对应的快捷分段 */}
            {currentQuickAgeRanges.length > 0 && (
              <div className="space-y-1">
                {currentQuickAgeRanges.map((range) => {
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
            )}
          </div>
        )}
      </div>

      {/* 8. 组织状态 (顺序与表格一致) */}
      <div className="border-b border-slate-200">
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

      {/* 9. 病变程度 (最下方新增：分为轻微/轻度/中度/重度/严重 与 单灶性/多灶性 两类条件) */}
      <div>
        <div 
          onClick={() => toggleFacet('lesionSeverity')}
          className="bg-[#18446b] text-white px-3 py-2 flex items-center justify-between cursor-pointer hover:bg-[#1f5382] transition-colors"
        >
          <div className="flex items-center gap-2 font-bold text-xs">
            {openFacets.lesionSeverity ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>病变程度</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-200" onClick={(e) => e.stopPropagation()}>
            {(filters.lesionSeverities?.length || filters.lesionDistributions?.length) ? (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, lesionSeverities: undefined, lesionDistributions: undefined, page: 1 })}
                title="清空病变程度筛选"
                className="hover:text-white"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            ) : null}
          </div>
        </div>

        {openFacets.lesionSeverity && (
          <div className="p-2 space-y-2 bg-slate-50/50">
            {/* 类别一：程度分级 */}
            <div className="bg-white rounded border border-slate-200/80 p-1.5 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500 px-1.5 pt-0.5">
                程度分级
              </div>
              {ALL_LESION_SEVERITY_LEVELS.map((sev) => {
                const isChecked = filters.lesionSeverities?.includes(sev) || false;
                return (
                  <div
                    key={sev}
                    onClick={() => handleToggleLesionSeverity(sev)}
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
                      <span>{sev}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 类别二：分布特征 */}
            <div className="bg-white rounded border border-slate-200/80 p-1.5 space-y-1">
              <div className="text-[11px] font-semibold text-slate-500 px-1.5 pt-0.5">
                分布特征
              </div>
              {ALL_LESION_DISTRIBUTIONS.map((dist) => {
                const isChecked = filters.lesionDistributions?.includes(dist) || false;
                return (
                  <div
                    key={dist}
                    onClick={() => handleToggleLesionDistribution(dist)}
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
                      <span>{dist}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
