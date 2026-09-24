import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { SampleResultsView } from './components/SampleResultsView';
import { SampleDetailPage } from './components/SampleDetailPage';
import { AIClassificationView } from './components/AIClassificationView';
import { StatsDashboard } from './components/StatsDashboard';
import { PathologySample, PathologyFilterParams } from './types/pathology';
import { INITIAL_PATHOLOGY_SAMPLES } from './data/mockPathologyData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'ai-classify' | 'analytics'>('search');
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
      if (currentFilters.keyword) {
        const q = currentFilters.keyword.toLowerCase();
        filtered = filtered.filter(s => s.sampleCode.toLowerCase().includes(q) || s.organ.includes(q) || s.lesionName.includes(q));
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'search') {
            setSelectedSample(null);
          }
          if (tab !== 'ai-classify') {
            setSampleForAI(null);
          }
        }}
        totalSamples={facets.totalSamples || totalCount}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 1. Multi-dimensional Filter Panel */}
              <SearchFilterPanel
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                facets={facets}
              />

              {/* 2. Search Results Display (Table & Grid) */}
              <SampleResultsView
                samples={samples}
                total={totalCount}
                page={filters.page || 1}
                pageSize={filters.pageSize || 12}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onSelectSample={(s) => setSelectedSample(s)}
                onSendToAI={handleSendToAI}
                isLoading={isLoading}
              />
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
            <StatsDashboard samples={INITIAL_PATHOLOGY_SAMPLES} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-medium text-slate-600">
            病理数据多维智能检索与分析平台 • Powered by PathoVision AI
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>数字切片格式：WSI / SVS / TIFF / JPG</span>
            <span>AI模型：正常/病变二分类 + Grad-CAM热力图</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
