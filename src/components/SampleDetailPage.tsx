import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HeartPulse, 
  Tag, 
  Activity, 
  Eye, 
  EyeOff, 
  Layers, 
  Calendar,
  UserCheck,
  Dna,
  FileText,
  FlaskConical,
  Sparkles,
  ChevronRight,
  GitFork
} from 'lucide-react';
import { PathologySample } from '../types/pathology';

interface SampleDetailPageProps {
  sample: PathologySample;
  allSamples?: PathologySample[];
  onBack: () => void;
  onSelectSample?: (sample: PathologySample) => void;
}

export const SampleDetailPage: React.FC<SampleDetailPageProps> = ({
  sample,
  allSamples = [],
  onBack,
  onSelectSample
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [activeTab, setActiveTab] = useState<'structured' | 'annotations' | 'animal' | 'technical' | 'related'>('structured');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  // Find other slices related to the same animal (by animalId or species+strain+group)
  const relatedAnimalSlices = allSamples.filter(
    s => s.id !== sample.id && (
      (sample.animalId && s.animalId && s.animalId === sample.animalId) ||
      (sample.strain && s.strain && s.strain === sample.strain && s.experimentGroup === sample.experimentGroup)
    )
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setBrightness(100);
    setContrast(100);
  };

  return (
    <div id="sample-detail-page" className="space-y-5 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            id="back-to-search-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all hover:-translate-x-0.5 cursor-pointer"
            title="返回检索结果列表"
          >
            <ArrowLeft className="w-4 h-4 text-blue-600" />
            <span>返回数据检索</span>
          </button>

          <div className="h-6 w-px bg-slate-200 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-mono text-lg sm:text-xl font-extrabold text-blue-700">
                {sample.sampleCode}
              </span>
              {sample.animalId && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
                  <GitFork className="w-3 h-3 text-blue-600" />
                  动物编号: {sample.animalId}
                </span>
              )}
              {sample.isLesion ? (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  病变组织 • {sample.lesionName}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  正常生理形态
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                {sample.organ}组织
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                {sample.sliceType}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span>品系：<strong className="text-slate-800 font-semibold">{sample.strain || sample.species}</strong> ({sample.species})</span>
              <span>组别：<strong className="text-slate-800 font-semibold">{sample.experimentGroup}</strong></span>
              <span>受试物/溶媒：<strong className="text-slate-800 font-semibold">{sample.testArticle}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <div className="text-xs text-slate-500">切片质量评级</div>
            <div className="font-mono font-bold text-sm text-amber-600">{sample.qualityGrade}级标准 ({sample.resolution})</div>
          </div>
        </div>
      </div>

      {/* Banner: Pathology Diagnosis High Priority Display */}
      <div className="bg-gradient-to-r from-blue-50/80 via-white to-indigo-50/80 border border-blue-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>病理诊断结论 (Pathology Diagnosis)</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
              {sample.pathologyDiagnosis || sample.structuredDescription.clinicalDiagnosis}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 bg-white/90 px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs flex-shrink-0">
            <div>
              <span className="text-slate-400">审核病理医师:</span>{' '}
              <span className="font-semibold text-slate-800">{sample.pathologistSign}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-300" />
            <div>
              <span className="text-slate-400">采集日期:</span>{' '}
              <span className="font-mono text-slate-700">{sample.samplingDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left Microscope Stage + Right Structured Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Interactive Digital Slide Microscope Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Microscope Controls Bar */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            {/* Magnification Presets */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[11px] text-slate-500 px-1 font-medium">物镜倍率:</span>
              {[1, 2, 4, 10, 20].map((mag) => (
                <button
                  key={mag}
                  onClick={() => setZoom(mag)}
                  className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                    zoom === mag
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {mag}X
                </button>
              ))}
            </div>

            {/* Zoom / Pan Controls */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setZoom(prev => Math.min(30, prev + 0.5))}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                title="放大视野"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.5))}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                title="缩小视野"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-2xs transition-colors cursor-pointer"
                title="复位中心视野"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Annotations Toggle Only */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  showAnnotations
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-blue-600" />
                <span>病理标注图层</span>
                {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Slide Viewer Canvas Stage */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative h-[520px] sm:h-[580px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-slate-900 select-none"
          >
            {/* Slide Transform Plane */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                filter: `brightness(${brightness}%) contrast(${contrast}%)`
              }}
              className="relative w-[600px] h-[450px] max-w-full max-h-full rounded-md shadow-2xl overflow-hidden bg-slate-950 flex-shrink-0 ring-1 ring-slate-700"
            >
              {/* Base Slide Specimen */}
              <img
                src={sample.imageUrl}
                alt={sample.sampleCode}
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Annotation Overlays */}
              {showAnnotations && sample.annotations && (
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {sample.annotations.map((ann) => {
                    const isSelected = selectedAnnotationId === ann.id;
                    return (
                      <div
                        key={ann.id}
                        style={{
                          left: `${ann.x}%`,
                          top: `${ann.y}%`,
                          width: `${ann.width}%`,
                          height: `${ann.height}%`,
                          borderColor: ann.color,
                          backgroundColor: `${ann.color}22`
                        }}
                        className={`absolute border-2 rounded pointer-events-auto cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-white scale-[1.02] z-20' : 'hover:border-white'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAnnotationId(ann.id);
                        }}
                      >
                        <div 
                          style={{ backgroundColor: ann.color }}
                          className="absolute -top-5 left-0 px-1.5 py-0.2 text-[9px] font-bold text-white rounded shadow-sm whitespace-nowrap"
                        >
                          {ann.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Viewport Scale Bar & Coordinates Indicator */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center gap-3 shadow-md">
              <div className="flex items-center gap-1 font-mono font-semibold text-blue-700">
                <span>当前视场:</span>
                <span>{zoom.toFixed(1)}X 倍率</span>
              </div>
              <div className="h-3 w-px bg-slate-300" />
              <div className="font-mono text-slate-500">
                X: {Math.round(pan.x)}px | Y: {Math.round(pan.y)}px
              </div>
            </div>

            {/* Stage Tips */}
            <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white/80 px-2.5 py-1 rounded text-[10px] pointer-events-none">
              按住鼠标左键可平移视场 • 滚轮/倍率按钮可无极放大
            </div>
          </div>

          {/* Viewer Image Quality Adjustment Sub-bar */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">亮度:</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-20 accent-blue-600"
                />
                <span className="font-mono text-[10px] w-7">{brightness}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px]">对比度:</span>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-20 accent-blue-600"
                />
                <span className="font-mono text-[10px] w-7">{contrast}%</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              图像分辨率：<span className="font-mono font-semibold text-slate-700">{sample.resolution}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Structured Pathology Details & Related Slices (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-2 gap-1 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('structured')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'structured'
                  ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              结构化描述
            </button>
            <button
              onClick={() => setActiveTab('annotations')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'annotations'
                  ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>标注标签</span>
              <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                {sample.annotations?.length || 0}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('animal')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'animal'
                  ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              品系与实验动物
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'related'
                  ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>关联切片</span>
              {relatedAnimalSlices.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  {relatedAnimalSlices.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'technical'
                  ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              切片参数
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 text-xs max-h-[560px]">
            {activeTab === 'structured' && (
              <>
                {/* Clinical Pathology Diagnosis Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    病理诊断结论 (Clinical Pathology Diagnosis)
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {sample.pathologyDiagnosis || sample.structuredDescription.clinicalDiagnosis}
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                    <span className="font-semibold text-blue-700">病理专家审查意见：</span>
                    {sample.structuredDescription.pathologistRemarks}
                  </div>
                </div>

                {/* Histopathological Scores */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    病理形态定量评分指标
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[11px]">病理严重度评分</div>
                      <div className="text-base font-bold text-amber-600 font-mono mt-0.5">
                        {sample.structuredDescription.histopathologyScore} / 4 级
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[11px]">纤维化分级</div>
                      <div className="text-base font-bold text-indigo-600 font-mono mt-0.5">
                        {sample.structuredDescription.fibrosisStage}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[11px]">炎性浸润评分</div>
                      <div className="text-xs font-semibold text-slate-800 mt-1">
                        {sample.structuredDescription.inflammationScore}
                      </div>
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <div className="text-slate-500 text-[11px]">坏死面积比例</div>
                      <div className="text-base font-bold text-rose-600 font-mono mt-0.5">
                        {sample.structuredDescription.necrosisPercentage}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cellular & Architectural Morphology */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div>
                    <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-blue-600" />
                      细胞学显微形态改变：
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-5 bg-white p-2.5 rounded border border-slate-200">
                      {sample.structuredDescription.cellularMorphology}
                    </p>
                  </div>

                  <div className="pt-2">
                    <div className="font-semibold text-indigo-700 mb-1 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      组织架构与基底改变：
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-5 bg-white p-2.5 rounded border border-slate-200">
                      {sample.structuredDescription.architecturalChanges}
                    </p>
                  </div>
                </div>

                {/* Sign-off Information */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1">
                    <span>采样/记录人：</span>
                    <span className="text-slate-800 font-medium">{sample.collectorName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>审核病理师：</span>
                    <span className="text-blue-700 font-semibold">{sample.pathologistSign}</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'annotations' && (
              <div className="space-y-3">
                <div className="text-slate-600 text-xs">
                  共标注 <span className="text-blue-700 font-bold">{sample.annotations.length}</span> 个病理感兴趣区域 (ROI)。点击可在切片视场中定位：
                </div>
                {sample.annotations.map((ann) => (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnotationId(ann.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedAnnotationId === ann.id
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div 
                          style={{ backgroundColor: ann.color }}
                          className="w-3 h-3 rounded-full"
                        />
                        <span className="font-bold text-slate-900 text-xs">{ann.label}</span>
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-700">
                        标记置信度: {(ann.probability * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {ann.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'animal' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5 text-teal-600" />
                  <span>品系、组别与实验动物元数据</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">动物编号：</span>
                    <div className="text-blue-700 font-mono font-bold">{sample.animalId || '未特别分配'}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">实验品系 (Strain)：</span>
                    <div className="text-slate-900 font-bold">{sample.strain || sample.species}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">动物种属 (Species)：</span>
                    <div className="text-slate-800 font-medium">{sample.species}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">性别：</span>
                    <div className="text-slate-800 font-medium">{sample.gender}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">采样周龄：</span>
                    <div className="text-blue-700 font-bold font-mono">{sample.ageWeeks} 周</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-slate-500">动物体重：</span>
                    <div className="text-slate-800">{sample.structuredDescription.bodyWeight || '未特别记录'}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 col-span-2">
                    <span className="text-slate-500">实验组别 (Experiment Group)：</span>
                    <div className="text-slate-900 font-semibold text-xs mt-0.5">{sample.experimentGroup || sample.structuredDescription.experimentGroup}</div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 col-span-2">
                    <span className="text-slate-500">受试物 / 溶媒 (Test Article / Vehicle)：</span>
                    <div className="text-slate-900 font-medium text-xs mt-0.5">{sample.testArticle || '标准繁殖/维持饲养'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Related Slices Tab (Linked by animalId or Strain) */}
            {activeTab === 'related' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    同动物编号/实验组关联切片 (<strong className="text-blue-700">{relatedAnimalSlices.length}</strong> 张)：
                  </span>
                  {sample.animalId && (
                    <span className="font-mono text-[11px] text-slate-500">
                      动物ID: {sample.animalId}
                    </span>
                  )}
                </div>

                {relatedAnimalSlices.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 space-y-1">
                    <GitFork className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-xs text-slate-700">暂无同一动物或直接对照的关联切片记录</p>
                    <p className="text-[11px] text-slate-400">系统支持通过动物编号 (animalId) 快速串联该动物的多脏器或多时点连续切片</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {relatedAnimalSlices.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectSample && onSelectSample(rel)}
                        className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                            <img
                              src={rel.thumbnailUrl || rel.imageUrl}
                              alt={rel.sampleCode}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-blue-700 group-hover:text-blue-800 text-xs">
                                {rel.sampleCode}
                              </span>
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                                {rel.organ}
                              </span>
                              {rel.isLesion ? (
                                <span className="px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-700 text-[10px] font-semibold">
                                  病变
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                                  正常
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 truncate mt-0.5">
                              {rel.pathologyDiagnosis || rel.lesionName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {rel.sliceType} • 采集于 {rel.samplingDate}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 group-hover:text-blue-700 flex-shrink-0"
                        >
                          <span>查看切片</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'technical' && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>切片制备与数字化扫描技术参数</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">切片与染色类型</span>
                    <span className="text-slate-800 font-medium">{sample.sliceType}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">染色试剂批号</span>
                    <span className="text-slate-800 font-mono">{sample.stainBatch}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">扫描光学分辨率</span>
                    <span className="text-blue-700 font-mono font-semibold">{sample.resolution}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-200">
                    <span className="text-slate-500">切片质量评级</span>
                    <span className="text-amber-600 font-bold">{sample.qualityGrade} 级标准</span>
                  </div>
                  {sample.customFields && Object.entries(sample.customFields).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-slate-200">
                      <span className="text-slate-500">{k}</span>
                      <span className="text-slate-800">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Card Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>数字化切片归档编码：{sample.id}</span>
            <button
              onClick={onBack}
              className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              返回数据检索列表
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
