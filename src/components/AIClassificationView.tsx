import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  FileWarning, 
  RefreshCw, 
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layers,
  Sliders,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';
import { ClassificationResult, PathologySample } from '../types/pathology';

import sampleSlidePic4 from '../assets/images/pathology_pic4_slide_1790217459142.jpg';
import picture5ExactHeatmap from '../assets/images/picture5_exact_heatmap_1790220645022.jpg';

interface AIClassificationViewProps {
  initialSampleForAI?: PathologySample | null;
  onSaveToDatabase?: (sample: Partial<PathologySample>) => void;
}

export const AIClassificationView: React.FC<AIClassificationViewProps> = ({
  initialSampleForAI
}) => {
  const [selectedFile, setSelectedFile] = useState<File | { name: string; size?: number } | null>(null);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [result, setResult] = useState<ClassificationResult | null>(null);

  // Result Visual Controls matching Picture 3 & Picture 4 and SampleDetailPage
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [isOriginalCompare, setIsOriginalCompare] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [failureState, setFailureState] = useState<{ isFailed: boolean; status: string; reason: string; fileName: string } | null>(null);

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
  };

  // slide display constants
  const currentFileName = selectedFile?.name || initialSampleForAI?.sampleCode || 'liver_HE_0402.png';
  const isWsiFile = currentFileName.toLowerCase().endsWith('.ndpi') || currentFileName.toLowerCase().endsWith('.svs');
  const wsiFormatType = currentFileName.toLowerCase().endsWith('.ndpi') ? 'ndpi' : currentFileName.toLowerCase().endsWith('.svs') ? 'svs' : 'standard';

  const fixedConfidence = '92.5%';
  const fixedModelVersion = 'patho-v2.1';
  const fixedCallTime = '2026-08-27 10:32:18';
  const fixedDuration = isWsiFile ? '1.86s (WSI分块解码)' : '1.24s';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // If initial sample was passed, trigger analysis
  useEffect(() => {
    if (initialSampleForAI) {
      setSelectedFile({ name: initialSampleForAI.sampleCode });
      triggerAnalysis(initialSampleForAI.sampleCode || 'liver_HE_0402.png');
    }
  }, [initialSampleForAI]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Trigger analysis simulation
  const triggerAnalysis = (fileName: string) => {
    setIsAnalyzing(true);
    setFormatError(null);
    setResult(null);
    setFailureState(null);

    // 上传文件名称为”失败“时，显示识别失败状态，失败原因为“模型推理异常”
    if (fileName.includes('失败')) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setFailureState({
          isFailed: true,
          status: '识别失败',
          reason: '模型推理异常',
          fileName
        });
      }, 900);
      return;
    }

    const isWsi = fileName.toLowerCase().endsWith('.ndpi') || fileName.toLowerCase().endsWith('.svs');

    // 仅显示“模型处理中”，不依次显示多阶段文案
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        classification: '病变组织',
        isLesion: true,
        confidence: 92.5,
        confidenceScore: 0.925,
        normalProbability: 0.075,
        lesionProbability: 0.925,
        lesionTypePredicted: '腺管异型性病变',
        lesionDistributionPredicted: '局灶性结节分布',
        affectedAreaPercentage: 42,
        cellularAnalysis: {
          nuclearAtypia: '细胞核轻-中度增大，染色质深染粗颗粒状，核仁隐约可见，部分极性丧失。',
          tissueArchitecture: '腺泡/腺管结构排列紊乱，局部管腔扩张呈不规则囊状，部分区域融合。',
          inflammatoryInfiltration: '间质可见散在慢性淋巴细胞浸润伴充血水肿。',
          stromalReaction: '病灶周围纤维结缔组织轻度反应性增生。',
          mitoticCount: '散在少见核分裂象 (1-2/10 HPF)'
        },
        hotspots: [
          { x: 44, y: 50, radius: 46, intensity: 1.0, label: '高风险异型病变核心区' }
        ],
        processingTimeMs: isWsi ? 1860 : 1240,
        modelVersion: 'patho-v2.1',
        isFallback: false,
        timestamp: '2026-08-27T10:32:18.000Z',
        wsiInfo: isWsi ? {
          format: fileName.toLowerCase().endsWith('.ndpi') ? 'ndpi' : 'svs',
          scannerBrand: fileName.toLowerCase().endsWith('.ndpi') ? 'Hamamatsu NanoZoomer S360' : 'Leica Aperio CS2',
          originalDimensions: '94,200 × 76,800 pixels (7.2 GPixels)',
          pyramidLevels: 8,
          magFactor: '40X (0.23 μm/px)'
        } : undefined
      });
    }, 1100);
  };

  // Requirement 10: File Validation Handler supporting ndpi and svs
  const handleFileSelection = (file: File) => {
    setFormatError(null);
    setFailureState(null);

    // Rule 1: Special check for filename containing "不合格"
    if (file.name.includes('不合格') || file.name.toLowerCase().includes('unqualified')) {
      setFormatError(`上传切片【${file.name}】格式校验不合格：检测到病理切片存在严重组织折叠、模糊、染色异常或不符合病理切片规范，无法进行AI二分类识别，请重新上传合格切片。`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Special allowance for failure simulation file
    const isFailureSimulation = file.name.includes('失败');

    // Rule 2: File Type & Extension Check (Explicitly supports ndpi and svs!)
    const validExtensions = ['ndpi', 'svs', 'tif', 'tiff', 'jpg', 'jpeg', 'png', 'webp', 'bmp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const hasQualifiedName = file.name.includes('合格');

    if (!isFailureSimulation && !hasQualifiedName && (!extension || !validExtensions.includes(extension))) {
      setFormatError(`文件格式不符合要求：当前为 .${extension || '未知'} 格式。本平台支持.ndpi/.svs/.tif/.mrxs格式`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Rule 3: File Size Check (Up to 500MB for WSI files, 50MB for regular images)
    const MAX_SIZE_BYTES = 500 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setFormatError(`文件体积过大 (${(file.size / (1024 * 1024)).toFixed(1)}MB)，已超过平台限制 (500MB)。请截取感兴趣区域(ROI)或选择轻量化全切片重试。`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);
    triggerAnalysis(file.name);
  };

  // Drag & Drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!viewportRef.current) return;
    if (!document.fullscreenElement) {
      viewportRef.current.requestFullscreen?.().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.error('Error attempting to exit fullscreen:', err);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 独立页面标题 */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#18446b] to-[#0e3b66] text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-5 h-5 text-sky-200" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#102a48] tracking-tight">
          AI组织识别
        </h1>
      </div>

      {/* Hidden File Input supporting ndpi, svs, tif, etc. */}
      <input
        ref={fileInputRef}
        id="pathology-file-input"
        type="file"
        accept=".ndpi,.svs,.tif,.tiff,.mrxs,.jpg,.jpeg,.png,.webp,.bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
          }
        }}
      />

      {/* State 1: When no result is loaded yet, show the Clean Upload Box styled with GDC blue gradient */}
      {!result && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#b4cce2] via-[#c6dcee] to-[#d8e7f5] border border-[#a4c3de] rounded-2xl shadow-xs p-6 sm:p-8 text-slate-800">
          {/* Subtle cloudy biological background depth */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px]" />

          <div className="relative z-10 space-y-5">
            <div className="pb-4 border-b border-[#a4c3de]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-[#102a48] flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#0e3b66] text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-4 h-4 text-sky-200" />
                  </div>
                  <span>病理组织二分类AI识别模型 (正常 vs 病变)</span>
                </h2>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              id="upload-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/95 backdrop-blur-xs border-2 border-dashed border-[#8bb2d4] hover:border-[#0e3b66] hover:bg-white rounded-2xl p-10 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[220px] shadow-xs"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0e3b66] text-white flex items-center justify-center mb-3.5 shadow-sm group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <div className="font-bold text-base sm:text-lg text-[#102a48] mb-1">
                点击上传 或 将病理切片图像拖拽至此处
              </div>
              <p className="text-xs text-[#274667] font-medium tracking-wide">
                支持.ndpi/.svs/.tif/.mrxs格式
              </p>
            </div>

            {/* Analysis Progress Loading State: 仅显示“模型处理中” */}
            {isAnalyzing && (
              <div className="p-5 bg-white/95 border border-[#a4c3de] rounded-xl space-y-3 text-center shadow-xs">
                <div className="flex items-center justify-center gap-2 text-[#0e3b66] text-sm font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0e3b66]" />
                  <span>模型处理中</span>
                </div>
                <div className="w-full max-w-md mx-auto bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-[#0e3b66] h-full w-2/3 animate-pulse rounded-full" />
                </div>
              </div>
            )}

            {/* 识别失败状态：显示文件名称、失败识别状态标签、失败原因。不显示”重新上传“按钮，不显示”错误码：ERR_MODEL_INFERENCE_EXCEPTION“ */}
            {failureState && !isAnalyzing && (
              <div 
                id="ai-inference-failure-card"
                className="p-5 bg-white border border-rose-200 rounded-xl shadow-xs space-y-2 animate-in fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                    <FileWarning className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-600">
                        文件名称：<strong className="text-slate-800 font-mono">{failureState.fileName}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                        {failureState.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      失败原因：<span className="text-rose-600 font-bold">{failureState.reason}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Format Validation Error Message */}
            {formatError && (
              <div 
                id="format-error-banner"
                className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs animate-in fade-in"
              >
                <FileWarning className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">上传校验提示：</span>
                  <span className="ml-1">{formatError}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* State 2: When result is loaded, display exactly the content and layout in Picture 4 & Picture 3 */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: 识别结果 · 热力图叠加 (样式与操作与数据详情页面左侧图片显示模块一致，图片不改动) */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div 
                ref={viewportRef}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden"
              >
                {/* 控制条：物镜倍率、缩放平移复位、全屏 */}
                <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  {/* 物镜倍率切换 */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-2xs">
                    <span className="text-[11px] text-slate-500 px-1 font-medium">物镜倍率:</span>
                    {[1, 2, 4, 10, 20].map((mag) => (
                      <button
                        key={mag}
                        onClick={() => setZoom(mag)}
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold transition-all cursor-pointer ${
                          zoom === mag
                            ? 'bg-[#18446b] text-white shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {mag}X
                      </button>
                    ))}
                  </div>

                  {/* 缩放/平移/复位控制 */}
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

                  {/* 全屏操作 */}
                  <div className="flex items-center gap-2">
                    <button
                      id="ai-fullscreen-btn"
                      onClick={toggleFullscreen}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                      title={isFullscreen ? '退出全屏' : '全屏显示'}
                    >
                      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                      <span>{isFullscreen ? '退出全屏' : '全屏'}</span>
                    </button>
                  </div>
                </div>

                {/* 纯净视场画布：1.0倍率不显示黑框，比例不匹配时仅左右留黑框 */}
                <div
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`relative ${isFullscreen ? 'h-screen w-screen' : 'h-[560px] sm:h-[620px]'} overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-black select-none`}
                >
                  {/* 切片画布变换层：高度填满视场，比例不匹配时仅左右留黑框 */}
                  <div
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                      transformOrigin: 'center center',
                      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    className="relative h-full aspect-[4/3] max-w-full flex items-center justify-center flex-shrink-0"
                  >
                    <img
                      src={picture5ExactHeatmap}
                      alt="识别结果 · 热力图叠加"
                      className="w-full h-full object-cover pointer-events-none"
                      style={{ opacity: isOriginalCompare ? (1 - heatmapOpacity * 0.8) : 1 }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Picture 4 exact styling with GDC theme */}
            <div className="lg:col-span-4 flex flex-col space-y-4">
              {/* Top Card: 识别结果与病变类型 */}
              <div className="bg-white border border-[#a4c3de]/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="text-xs font-semibold text-slate-500">切片名称</div>
                <div className="font-mono text-[#102a48] font-bold text-sm truncate" title={currentFileName}>
                  {currentFileName}
                </div>

                {/* Classification Banner */}
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-rose-600 font-medium">识别结果</div>
                    <div className="text-xl font-black text-rose-600">病变组织</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">置信度</div>
                    <div className="text-xl font-bold font-mono text-slate-900">{fixedConfidence}</div>
                  </div>
                </div>

                </div>

              {/* Bottom Card: 识别参数 */}
              <div className="bg-white border border-[#a4c3de]/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="text-sm font-bold text-[#102a48]">识别参数</div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">模型版本</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {fixedModelVersion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">调用时间</span>
                    <span className="font-mono text-slate-800 font-semibold">
                      {fixedCallTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">耗时</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {fixedDuration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Button: 重新上传 */}
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setResult(null);
                  setFormatError(null);
                  fileInputRef.current?.click();
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-[#0e3b66] hover:bg-[#164a7c] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>重新上传</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
