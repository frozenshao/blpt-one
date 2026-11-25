import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { Header, NavigationTab } from './components/Header';
import { HomePage } from './components/HomePage';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { GdcCohortBar } from './components/GdcCohortBar';
import { SampleResultsView } from './components/SampleResultsView';
import { SampleDetailPage } from './components/SampleDetailPage';
import { AIClassificationView } from './components/AIClassificationView';
import { StatsDashboard } from './components/StatsDashboard';
import { UserManagementView } from './components/UserManagementView';
import { LoginPage } from './components/LoginPage';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { PathologySample, PathologyFilterParams, AnimalSpecies } from './types/pathology';
import { INITIAL_PATHOLOGY_SAMPLES } from './data/mockPathologyData';
import { User } from './types/user';
import { getCurrentUser, setCurrentUser as saveSessionUser } from './data/authService';

export default function App() {
  // Authentication session state
  const [currentUser, setCurrentUser] = useState<User | null>(() => getCurrentUser());
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [filters, setFilters] = useState<PathologyFilterParams>({
    page: 1,
    pageSize: 12,
    sortBy: 'samplingDate',
    sortOrder: 'desc'
  });
  const [samples, setSamples] = useState<PathologySample[]>(INITIAL_PATHOLOGY_SAMPLES);
  const [totalCount, setTotalCount] = useState<number>(INITIAL_PATHOLOGY_SAMPLES.length);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [facets, setFacets] = useState<{
    totalSamples: number;
    normalCount: number;
    lesionCount: number;
    organCounts: Record<string, number>;
    lesionTypeCounts: Record<string, number>;
    speciesCounts: Record<string, number>;
  }>({
    totalSamples: INITIAL_PATHOLOGY_SAMPLES.length,
    normalCount: INITIAL_PATHOLOGY_SAMPLES.filter(s => !s.isLesion).length,
    lesionCount: INITIAL_PATHOLOGY_SAMPLES.filter(s => s.isLesion).length,
    organCounts: {},
    lesionTypeCounts: {},
    speciesCounts: {}
  });

  // Selected sample for Detail Page (no modal popup)
  const [selectedSample, setSelectedSample] = useState<PathologySample | null>(null);
  
  // Sample transferred directly to AI model
  const [sampleForAI, setSampleForAI] = useState<PathologySample | null>(null);

  // Custom cohort samples passed from search selection to analytics
  const [customCohortSamples, setCustomCohortSamples] = useState<PathologySample[] | null>(null);

  const handleAnalyzeCohort = (selectedSamples: PathologySample[]) => {
    setCustomCohortSamples(selectedSamples);
    setActiveTab('analytics');
  };

  // Fetch samples from backend search API
  const fetchSearchResults = useCallback(async (currentFilters: PathologyFilterParams) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/pathology/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFilters)
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setSamples(json.data);
          setTotalCount(json.total);
          setTotalPages(json.totalPages);
          if (json.facets) {
            setFacets(json.facets);
          }
        }
      }
    } catch (err) {
      console.warn('Search API fallback to local in-memory dataset:', err);
      // Fallback to local filter in memory
      let filtered = [...INITIAL_PATHOLOGY_SAMPLES];
      const normalizeProject = (p?: string) => {
        if (!p) return '';
        if (p === '长期毒性试验') return '重复给药毒性试验';
        if (p === '生殖毒性试验') return '生殖与发育毒性试验';
        return p;
      };
      if (currentFilters.projectNames && currentFilters.projectNames.length > 0) {
        filtered = filtered.filter(s =>
          s.projectName && currentFilters.projectNames!.some(p => normalizeProject(s.projectName) === normalizeProject(p))
        );
      } else if (currentFilters.projectName && currentFilters.projectName !== '全部') {
        filtered = filtered.filter(s => normalizeProject(s.projectName) === normalizeProject(currentFilters.projectName));
      }

      const systemMatches = (sampleSys: string | undefined, filterSys: string) => {
        if (!sampleSys) return false;
        if (sampleSys === filterSys || sampleSys.includes(filterSys)) return true;
        if ((filterSys === '雄性生殖系统' || filterSys === '雌性生殖系统') && sampleSys === '生殖系统') return true;
        if (filterSys === '免疫系统' && (sampleSys.includes('淋巴') || sampleSys.includes('免疫'))) return true;
        if (filterSys === '肌肉骨骼系统' && sampleSys.includes('骨骼')) return true;
        return false;
      };
      if (currentFilters.systems && currentFilters.systems.length > 0) {
        filtered = filtered.filter(s =>
          currentFilters.systems!.some(sys => systemMatches(s.system, sys)) ||
          (s.systemOrgans && s.systemOrgans.some(so => currentFilters.systems!.some(sys => systemMatches(so.system, sys))))
        );
      }

      const ORGAN_SYNONYMS: Record<string, string[]> = {
        '肝': ['肝脏'],
        '胃': ['胃(前胃/腺胃)'],
        '空肠': ['空肠/回肠'],
        '回肠': ['空肠/回肠'],
        '结肠': ['结肠/直肠'],
        '直肠': ['结肠/直肠'],
        '肺': ['肺脏'],
        '肾': ['肾脏'],
        '脾': ['脾脏'],
        '脑': ['大脑', '小脑', '脑干'],
        '骨': ['股骨/关节'],
        '关节': ['股骨/关节'],
        '骨髓': ['骨髓(胸骨/股骨)'],
        '骨骼肌': ['骨骼肌(股四头肌)'],
        '唾液腺': ['唾液腺(颌下腺/腮腺)'],
        '哈氏腺': ['哈氏腺(Harderian gland)'],
        '鼻腔': ['鼻腔/鼻甲'],
        '周围神经': ['坐骨神经'],
        '精囊': ['精囊腺'],
        '皮肤': ['皮肤及皮下组织'],
        '皮下组织': ['皮肤及皮下组织']
      };
      const organMatches = (sampleOrgan: string, filterOrgan: string) => {
        if (sampleOrgan === filterOrgan) return true;
        const syns = ORGAN_SYNONYMS[filterOrgan];
        return Boolean(syns && syns.some(syn => sampleOrgan === syn || sampleOrgan.includes(syn)));
      };
      if (currentFilters.organs && currentFilters.organs.length > 0) {
        filtered = filtered.filter(s =>
          currentFilters.organs!.some(org =>
            organMatches(s.organ, org) ||
            (s.systemOrgans && s.systemOrgans.some(so => organMatches(so.organ, org)))
          )
        );
      }

      const selectedL1 = currentFilters.formulationCategories || [];
      const selectedL2 = currentFilters.testArticleCategories?.length
        ? currentFilters.testArticleCategories
        : (currentFilters.testArticleCategory && currentFilters.testArticleCategory !== '全部' ? [currentFilters.testArticleCategory] : []);
      const selectedL3 = currentFilters.testArticleSubCategories?.length
        ? currentFilters.testArticleSubCategories
        : (currentFilters.testArticleSubCategory && currentFilters.testArticleSubCategory !== '全部' ? [currentFilters.testArticleSubCategory] : []);
      if (selectedL1.length > 0 || selectedL2.length > 0 || selectedL3.length > 0) {
        filtered = filtered.filter(s => {
          const itemL1 = s.formulationCategory || (
            s.formulation === '溶媒' || s.testArticleCategory === '溶媒'
              ? '溶媒'
              : s.formulation === '空包LNP' || s.testArticleCategory === '空包LNP'
              ? '佐剂'
              : '受试物'
          );
          const itemL2 = s.testArticleCategory || (
            s.formulation === '溶媒' ? '溶媒' : s.formulation === '空包LNP' ? '空包LNP' : ''
          );
          const itemL3 = s.testArticleSubCategory || '';
          const matchL1 = selectedL1.length > 0 && selectedL1.includes(itemL1);
          const matchL2 = selectedL2.length > 0 && selectedL2.includes(itemL2);
          const matchL3 = selectedL3.length > 0 && selectedL3.includes(itemL3);
          return matchL1 || matchL2 || matchL3;
        });
      }
      if (currentFilters.isLesionFilter && currentFilters.isLesionFilter !== 'all') {
        if (currentFilters.isLesionFilter === 'normal') {
          filtered = filtered.filter(s => !s.isLesion);
        } else if (currentFilters.isLesionFilter === 'lesion') {
          filtered = filtered.filter(s => s.isLesion);
        }
      }
      if (currentFilters.species && currentFilters.species.length > 0) {
        filtered = filtered.filter(s => currentFilters.species!.includes(s.species));
      }
      if (currentFilters.animalTypes && currentFilters.animalTypes.length > 0) {
        filtered = filtered.filter(s => {
          return currentFilters.animalTypes!.some(at => {
            if (at === '小鼠') return s.species.includes('小鼠');
            if (at === '大鼠') return s.species.includes('大鼠');
            if (at === '猴') return s.species.includes('猴') || s.strain.includes('猴');
            if (at === '犬') return s.species.includes('犬') || s.strain.includes('犬');
            if (at === '兔') return s.species.includes('兔') || s.strain.includes('兔');
            if (at === '猪（小型猪）') return s.species.includes('猪') || s.strain.includes('猪');
            return s.species.includes(at) || at.includes(s.species) || s.strain.includes(at);
          });
        });
      }
      if (currentFilters.strains && currentFilters.strains.length > 0) {
        filtered = filtered.filter(s => {
          return currentFilters.strains!.some(st =>
            s.strain.toLowerCase() === st.toLowerCase() ||
            s.strain.toLowerCase().includes(st.toLowerCase()) && !['wistar'].includes(st.toLowerCase())
          );
        });
      }
      if (currentFilters.genderOptions && currentFilters.genderOptions.length > 0) {
        filtered = filtered.filter(s => currentFilters.genderOptions!.some(g => s.gender.includes(g)));
      }
      if (currentFilters.ageRanges && currentFilters.ageRanges.length > 0) {
        filtered = filtered.filter(s => {
          return currentFilters.ageRanges!.some(range => {
            if (range === '6–8周龄') return s.ageWeeks >= 6 && s.ageWeeks <= 8;
            if (range === '7-9周龄') return s.ageWeeks >= 7 && s.ageWeeks <= 9;
            if (range === '14-16周龄') return s.ageWeeks >= 14 && s.ageWeeks <= 16;
            if (range === '18-24周龄') return s.ageWeeks >= 18 && s.ageWeeks <= 24;
            if (range === '30-32周龄') return s.ageWeeks >= 30 && s.ageWeeks <= 32;
            if (range === '12–16周龄（3-4月龄）') return s.ageWeeks >= 12 && s.ageWeeks <= 16;
            if (range === '4–6月龄') return s.ageWeeks >= 16 && s.ageWeeks <= 27;
            if (range === '5-9月龄') return s.ageWeeks >= 20 && s.ageWeeks <= 40;
            if (range === '6-12月龄') return s.ageWeeks >= 24 && s.ageWeeks <= 52;
            if (range === '2–4岁') return s.ageWeeks >= 104 && s.ageWeeks <= 208;
            if (range === '5岁以上') return s.ageWeeks >= 260;
            if (range === '12-18岁') return s.ageWeeks >= 624 && s.ageWeeks <= 936;
            if (range === '8周龄及以下' || range === '8周及以下') return s.ageWeeks <= 8;
            if (range === '9 - 16周龄' || range === '9 - 16周') return s.ageWeeks >= 9 && s.ageWeeks <= 16;
            if (range === '17 - 24周龄' || range === '17 - 24周') return s.ageWeeks >= 17 && s.ageWeeks <= 24;
            if (range === '25 - 52周龄' || range === '25 - 52周') return s.ageWeeks >= 25 && s.ageWeeks <= 52;
            if (range === '52周龄以上' || range === '52周以上') return s.ageWeeks > 52;
            return true;
          });
        });
      }
      const ageUnitFactorMin = currentFilters.ageUnit === 'year' ? 52 : currentFilters.ageUnit === 'month' ? 4 : 1;
      const ageUnitFactorMax = currentFilters.ageUnit === 'year' ? 52 : currentFilters.ageUnit === 'month' ? 4.4 : 1;
      if (typeof currentFilters.ageMin === 'number' && !isNaN(currentFilters.ageMin)) {
        filtered = filtered.filter(s => s.ageWeeks >= currentFilters.ageMin! * ageUnitFactorMin);
      }
      if (typeof currentFilters.ageMax === 'number' && !isNaN(currentFilters.ageMax)) {
        filtered = filtered.filter(s => s.ageWeeks <= currentFilters.ageMax! * ageUnitFactorMax);
      }
      if (currentFilters.lesionSeverities && currentFilters.lesionSeverities.length > 0) {
        filtered = filtered.filter(s =>
          s.isLesion &&
          !!s.lesionSeverity &&
          currentFilters.lesionSeverities!.some(sev => s.lesionSeverity!.includes(sev))
        );
      }
      if (currentFilters.lesionDistributions && currentFilters.lesionDistributions.length > 0) {
        filtered = filtered.filter(s =>
          s.isLesion &&
          currentFilters.lesionDistributions!.some(dist =>
            (s.lesionSeverity && s.lesionSeverity.includes(dist)) ||
            (s.lesionDistribution && s.lesionDistribution.includes(dist))
          )
        );
      }
      if (currentFilters.sliceTypes && currentFilters.sliceTypes.length > 0) {
        filtered = filtered.filter(s => currentFilters.sliceTypes!.includes(s.sliceType));
      }
      if (currentFilters.keyword) {
        const q = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(s => 
          s.sampleCode.toLowerCase().includes(q) || 
          (s.animalId && s.animalId.toLowerCase().includes(q)) ||
          s.organ.toLowerCase().includes(q) || 
          (s.system && s.system.toLowerCase().includes(q)) ||
          (s.systemOrgans && s.systemOrgans.some(so => so.system.toLowerCase().includes(q) || so.organ.toLowerCase().includes(q))) ||
          s.testArticle.toLowerCase().includes(q) ||
          (s.formulation && s.formulation.toLowerCase().includes(q)) ||
          (s.experimentGroup && s.experimentGroup.toLowerCase().includes(q)) ||
          (s.lesionName && s.lesionName.toLowerCase().includes(q)) ||
          s.pathologyDiagnosis.toLowerCase().includes(q) ||
          s.species.toLowerCase().includes(q)
        );
      }
      setSamples(filtered);
      setTotalCount(filtered.length);
      setTotalPages(Math.ceil(filtered.length / (currentFilters.pageSize || 12)));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearchResults(filters);
  }, [filters, fetchSearchResults]);

  const handleFilterChange = (newFilters: PathologyFilterParams) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      pageSize: 12,
      sortBy: 'samplingDate',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleSendToAI = (sample: PathologySample) => {
    setSampleForAI(sample);
    setActiveTab('ai-classify');
  };

  const handleSaveToDatabase = async (newSampleData: Partial<PathologySample>) => {
    try {
      const res = await fetch('/api/pathology/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSampleData)
      });
      if (res.ok) {
        // Refresh search
        fetchSearchResults(filters);
      }
    } catch (e) {
      console.error('Save to db error:', e);
    }
  };

  // Navigate from Home Page to other views with optional pre-filters
  const handleNavigateFromHome = (
    tab: NavigationTab,
    presetFilters?: {
      projectName?: string;
      species?: AnimalSpecies;
      animalType?: string;
      animalTypes?: string[];
      organ?: string;
      keyword?: string;
    }
  ) => {
    if (presetFilters) {
      const animalTypes = presetFilters.animalTypes || (presetFilters.animalType ? [presetFilters.animalType] : undefined);
      setFilters(prev => ({
        ...prev,
        page: 1,
        ...(presetFilters.projectName ? { projectName: presetFilters.projectName, projectNames: [presetFilters.projectName] } : {}),
        ...(presetFilters.species ? { species: [presetFilters.species] } : {}),
        ...(animalTypes ? { animalTypes } : {}),
        ...(presetFilters.organ ? { organs: [presetFilters.organ as any] } : {}),
        ...(presetFilters.keyword ? { keyword: presetFilters.keyword } : {}),
      }));
    }
    setActiveTab(tab);
    setSelectedSample(null);
  };

  // Header quick global search
  const handleGlobalSearch = (keyword: string) => {
    setFilters(prev => ({
      ...prev,
      keyword: keyword || undefined,
      page: 1
    }));
    setActiveTab('search');
    setSelectedSample(null);
  };

  // Handle Logout
  const handleLogout = () => {
    saveSessionUser(null);
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Handle Login Success
  const handleLoginSuccess = (user: User) => {
    saveSessionUser(user);
    setCurrentUser(user);
  };

  // 1. If not logged in, render the clean full Login Page with graphical captcha
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const isAdmin = currentUser.role === 'admin' || currentUser.username === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          // If non-admin attempts to access user management, fallback to home
          if (tab === 'users' && !isAdmin) {
            setActiveTab('home');
            return;
          }
          setActiveTab(tab);
          if (tab === 'search') {
            setSelectedSample(null);
          }
          if (tab !== 'ai-classify') {
            setSampleForAI(null);
          }
        }}
        currentUser={currentUser}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onLogout={handleLogout}
        onSearch={handleGlobalSearch}
        totalSamples={facets.totalSamples || totalCount}
      />

      {/* Main App Container: Full Width Responsive */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Tab 0: Home Page Overview */}
        {activeTab === 'home' && (
          <HomePage onNavigate={handleNavigateFromHome} />
        )}

        {/* Tab 1: Data Search & Retrieval or Sample Detail Page */}
        {activeTab === 'search' && (
          selectedSample ? (
            /* Dedicated Full Detail Page without Modal */
            <SampleDetailPage
              sample={selectedSample}
              allSamples={samples}
              onBack={() => setSelectedSample(null)}
              onSelectSample={(s) => setSelectedSample(s)}
            />
          ) : (
            <div className="space-y-4 animate-in fade-in duration-150 w-full">
              {/* 独立页面标题 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18446b] to-[#0e3b66] text-white flex items-center justify-center shadow-xs">
                  <Search className="w-5 h-5 text-sky-200" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-[#102a48] tracking-tight">
                  多维检索
                </h1>
              </div>

              {/* 1. GDC Navy Cohort Bar and Active Filters Strip (Full Width) */}
              <GdcCohortBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                totalCount={totalCount}
              />

              {/* 2. GDC Portal Split Layout: Left Accordion Facets + Right Table */}
              <div className="flex flex-col lg:flex-row gap-4 items-start w-full">
                {/* Left Sidebar: GDC Accordion Facets */}
                <div className="w-full lg:w-[310px] lg:shrink-0">
                  <SearchFilterPanel
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                    facets={facets}
                  />
                </div>

                {/* Right Main Table & Actions */}
                <div className="w-full lg:flex-1 min-w-0">
                  <SampleResultsView
                    samples={samples}
                    total={totalCount}
                    page={filters.page || 1}
                    pageSize={filters.pageSize || 12}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    onSelectSample={(s) => setSelectedSample(s)}
                    onSendToAI={handleSendToAI}
                    onAnalyzeCohort={handleAnalyzeCohort}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>
          )
        )}

        {/* Tab 2: AI Binary Classification & Heatmap Studio */}
        {activeTab === 'ai-classify' && (
          <div className="animate-in fade-in duration-150">
            <AIClassificationView
              initialSampleForAI={sampleForAI}
              onSaveToDatabase={handleSaveToDatabase}
            />
          </div>
        )}

        {/* Tab 3: Statistics & Distribution Analytics */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-150">
            <StatsDashboard 
              samples={samples} 
              customCohortSamples={customCohortSamples}
              onClearCustomCohort={() => setCustomCohortSamples(null)}
            />
          </div>
        )}

        {/* Tab 4: System Management - Users (Admin only) */}
        {activeTab === 'users' && isAdmin && (
          <div className="animate-in fade-in duration-150">
            <UserManagementView currentUser={currentUser} />
          </div>
        )}
      </main>

      {/* Change Password Modal */}
      {isChangePasswordOpen && currentUser && (
        <ChangePasswordModal
          user={currentUser}
          onClose={() => setIsChangePasswordOpen(false)}
          onSuccess={() => {
            // Updated in authService, refresh current user if needed
            const fresh = getCurrentUser();
            if (fresh) setCurrentUser(fresh);
          }}
        />
      )}
    </div>
  );
}
