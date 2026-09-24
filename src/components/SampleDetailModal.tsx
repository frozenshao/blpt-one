import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  HeartPulse, 
  Tag, 
  Activity, 
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  Layers
} from 'lucide-react';
import { PathologySample } from '../types/pathology';

interface SampleDetailModalProps {
  sample: PathologySample | null;
  onClose: () => void;
  onSendToAI: (sample: PathologySample) => void;
}

export const SampleDetailModal: React.FC<SampleDetailModalProps> = ({
  sample,
  onClose,
  onSendToAI
}) => {
  if (!sample) return null;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.65);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [activeTab, setActiveTab] = useState<'structured' | 'annotations' | 'animal' | 'technical'>('structured');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Render Grad-CAM Heatmap onto Canvas
  useEffect(() => {
    if (!canvasRef.current || !showHeatmap) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    if (sample.heatmapPoints && sample.heatmapPoints.length > 0) {
      sample.heatmapPoints.forEach(pt => {
        const cx = (pt.x / 100) * width;
        const cy = (pt.y / 100) * height;
        const radius = (pt.radius / 100) * Math.min(width, height);

        const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        if (sample.isLesion) {
          radGrad.addColorStop(0, `rgba(239, 68, 68, ${pt.intensity})`);
          radGrad.addColorStop(0.4, `rgba(245, 158, 11, ${pt.intensity * 0.8})`);
          radGrad.addColorStop(0.7, `rgba(59, 130, 246, ${pt.intensity * 0.4})`);
          radGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        } else {
          radGrad.addColorStop(0, `rgba(16, 185, 129, ${pt.intensity})`);
          radGrad.addColorStop(0.6, `rgba(6, 182, 212, ${pt.intensity * 0.5})`);
          radGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        }

        ctx.fillStyle = radGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }, [sample, showHeatmap, zoom]);

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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        id="sample-detail-modal"
        className="bg-white border border-slate-200 rounded-2xl w-full max-w-7xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-blue-700">
                  {sample.sampleCode}
                </span>
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
              </div>
              <p className="text-xs text-slate-500">
                {sample.organ}组织 • {sample.sliceType} • 来源：{sample.species} ({sample.gender}, {sample.ageWeeks}周龄)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="detail-send-ai-btn"
              onClick={() => {
                onClose();
                onSendToAI(sample);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>调用AI二分类模型复检</span>
            </button>
            <button
              id="close-detail-modal-btn"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left Slide Viewer + Right Structured Info */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left Column: Interactive Digital Slide Microscope Viewer (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100/70 border-r border-slate-200 flex flex-col relative overflow-hidden">
            {/* Viewer Controls Toolbar */}
            <div className="p-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10 text-xs">
              {/* Magnification Presets */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <span className="text-[11px] text-slate-500 px-1 font-medium">倍率:</span>
                {[1, 2, 4, 10, 20].map((mag) => (
                  <button
                    key={mag}
                    onClick={() => setZoom(mag)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition-all ${
                      zoom === mag
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {mag}X
                  </button>
                ))}
              </div>

              {/* Zoom & Reset Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setZoom(prev => Math.min(30, prev + 0.5))}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 shadow-2xs"
                  title="放大"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.5))}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 shadow-2xs"
                  title="缩小"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetView}
                  className="p-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-300 shadow-2xs"
                  title="复位视野"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Layer Toggles: Annotations & Heatmap */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                    showAnnotations
                      ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  <span>标注图层</span>
                  {showAnnotations ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[11px] font-medium transition-all ${
                    showHeatmap
                      ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  <Flame className="w-3 h-3 text-amber-500" />
                  <span>Grad-CAM热力图</span>
                  {showHeatmap ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Main Stage / Image Canvas Viewport - Clinical Dark Stage for histological specimen optical clarity */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="flex-1 relative overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-slate-900 select-none"
            >
              {/* Transform Container */}
              <div
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`
                }}
                className="relative w-[560px] h-[420px] max-w-full max-h-full rounded-md shadow-2xl overflow-hidden bg-slate-950 flex-shrink-0 ring-1 ring-slate-700"
              >
                {/* Base Slide Image */}
                <img
                  src={sample.imageUrl}
                  alt={sample.sampleCode}
                  className="w-full h-full object-cover pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                {/* Heatmap Canvas Overlay */}
                {showHeatmap && (
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={420}
                    style={{ opacity: heatmapOpacity }}
                    className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen"
                  />
                )}

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
                            {ann.label} ({(ann.probability * 100).toFixed(0)}%)
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Viewport Scale Bar & Coordinates Indicator */}
              <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 flex items-center gap-3 shadow-md">
                <div className="flex items-center gap-1 font-mono font-semibold text-blue-700">
                  <div className="w-10 h-1 bg-blue-600 rounded"></div>
                  <span>{(100 / zoom).toFixed(0)} μm</span>
                </div>
                <span>当前视场: <strong className="text-slate-900">{zoom}X</strong></span>
                <span>分辨率: {sample.resolution}</span>
              </div>

              {/* Heatmap Opacity Control Slider */}
              {showHeatmap && (
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs p-2 rounded-lg border border-slate-200 text-xs flex items-center gap-2 shadow-md text-slate-700">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[11px] font-medium text-slate-600">热力浓度:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={heatmapOpacity}
                    onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                    className="w-20 accent-blue-600 h-1.5 bg-slate-200 rounded cursor-pointer"
                  />
                  <span className="font-mono text-[10px] text-blue-700 font-bold">{(heatmapOpacity * 100).toFixed(0)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Structured Pathology Findings & Clinical Records (5 cols) */}
          <div className="lg:col-span-5 bg-white flex flex-col overflow-hidden">
            {/* Sub Tabs */}
            <div className="p-2 border-b border-slate-200 bg-slate-50 flex items-center gap-1 text-xs">
              <button
                onClick={() => setActiveTab('structured')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'structured'
                    ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                结构化病理描述
              </button>
              <button
                onClick={() => setActiveTab('annotations')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'annotations'
                    ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                病变标注区 ({sample.annotations?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('animal')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'animal'
                    ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                动物实验信息
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'technical'
                    ? 'bg-white text-blue-700 font-semibold border border-slate-200 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                切片参数
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {activeTab === 'structured' && (
                <>
                  {/* Diagnosis Card */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      病理诊断结论 (Clinical Pathology Diagnosis)
                    </div>
                    <div className="text-sm font-bold text-slate-900 leading-snug mb-2">
                      {sample.structuredDescription.clinicalDiagnosis}
                    </div>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                      <span className="font-semibold text-blue-700">专家意见：</span>
                      {sample.structuredDescription.pathologistRemarks}
                    </div>
                  </div>

                  {/* Histopathological Quantitative Scores */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      病理形态定量评分指标
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[11px]">病理严重度评分</div>
                        <div className="text-base font-bold text-amber-600 font-mono">
                          {sample.structuredDescription.histopathologyScore} / 4 级
                        </div>
                      </div>
                      <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                        <div className="text-slate-500 text-[11px]">纤维化分级</div>
                        <div className="text-base font-bold text-indigo-600 font-mono">
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
                        <div className="text-base font-bold text-rose-600 font-mono">
                          {sample.structuredDescription.necrosisPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cellular & Architectural Morphology */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <div>
                      <div className="font-semibold text-blue-700 mb-1 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-blue-600" />
                        细胞学显微形态改变：
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5">
                        {sample.structuredDescription.cellularMorphology}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <div className="font-semibold text-indigo-700 mb-1 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        组织架构与基底改变：
                      </div>
                      <p className="text-slate-600 leading-relaxed pl-5">
                        {sample.structuredDescription.architecturalChanges}
                      </p>
                    </div>
                  </div>

                  {/* Sign-off Banner */}
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      采样/记录人：<span className="text-slate-800 font-medium">{sample.collectorName}</span>
                    </div>
                    <div>
                      审核病理师：<span className="text-blue-700 font-semibold">{sample.pathologistSign}</span>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'annotations' && (
                <div className="space-y-3">
                  <div className="text-slate-600 text-xs">
                    共标注 <span className="text-blue-700 font-bold">{sample.annotations.length}</span> 个病理感兴趣区域(ROI)。点击卡片可在左侧切片中高亮定位：
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
                          置信度: {(ann.probability * 100).toFixed(1)}%
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
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    实验动物及样本来源元数据
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500">动物种属：</span>
                      <div className="text-slate-800 font-medium">{sample.species}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">性别：</span>
                      <div className="text-slate-800 font-medium">{sample.gender}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">采样周龄：</span>
                      <div className="text-blue-700 font-bold">{sample.ageWeeks} 周</div>
                    </div>
                    <div>
                      <span className="text-slate-500">动物体重：</span>
                      <div className="text-slate-800">{sample.structuredDescription.bodyWeight || '未记录'}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">实验组别：</span>
                      <div className="text-slate-800 font-medium">{sample.structuredDescription.experimentGroup}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">给药剂量/处理：</span>
                      <div className="text-slate-800">{sample.structuredDescription.dosageCohort || '对照无给药'}</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'technical' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    切片制备与数字化扫描参数
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">切片与染色类型</span>
                      <span className="text-slate-800 font-medium">{sample.sliceType}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">染色试剂批号</span>
                      <span className="text-slate-800 font-mono">{sample.stainBatch}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">扫描光学分辨率</span>
                      <span className="text-blue-700 font-mono font-semibold">{sample.resolution}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-200">
                      <span className="text-slate-500">切片质量评级</span>
                      <span className="text-amber-600 font-bold">{sample.qualityGrade} 级标准</span>
                    </div>
                    {sample.customFields && Object.entries(sample.customFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between py-1.5 border-b border-slate-200">
                        <span className="text-slate-500">{k}</span>
                        <span className="text-slate-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">采集时间：{sample.samplingDate}</span>
              <button
                onClick={() => {
                  onClose();
                  onSendToAI(sample);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>进入AI热力图分析</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
