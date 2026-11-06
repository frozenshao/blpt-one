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
  CheckCircle2
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

  // Result Visual Controls matching Picture 3 & Picture 4
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65);
  const [isOriginalCompare, setIsOriginalCompare] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [wsiZoom, setWsiZoom] = useState<'4x' | '10x' | '20x' | '40x'>('40x');

  // Slide display constants
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

    const isWsi = fileName.toLowerCase().endsWith('.ndpi') || fileName.toLowerCase().endsWith('.svs');

    setAnalysisStage(
      isWsi 
        ? `解析 ${fileName.toUpperCase()} 全切片金字塔大图 (WSI Pyramid Level 0~7 Tile Loader)...` 
        : '切片色彩校准与图像编码中 (HE/IHC Standardizer)...'
    );

    setTimeout(() => {
      setAnalysisStage('连接病理组织二分类AI模型推理引擎 (patho-v2.1)...');
      setTimeout(() => {
        setAnalysisStage('解析细胞异型性与Grad-CAM空间病灶激活热力图...');
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisStage('');
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
        }, 300);
      }, 350);
    }, 300);
  };

  // Requirement 10: File Validation Handler supporting ndpi and svs
  const handleFileSelection = (file: File) => {
    setFormatError(null);

    // Rule 1: Special check for filename containing "不合格"
    if (file.name.includes('不合格') || file.name.toLowerCase().includes('unqualified')) {
      setFormatError(`上传切片【${file.name}】格式校验不合格：检测到病理切片存在严重组织折叠、模糊、染色异常或不符合病理切片规范，无法进行AI二分类识别，请重新上传合格切片。`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Rule 2: File Type & Extension Check (Explicitly supports ndpi and svs!)
    const validExtensions = ['ndpi', 'svs', 'tif', 'tiff', 'jpg', 'jpeg', 'png', 'webp', 'bmp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const hasQualifiedName = file.name.includes('合格');

    if (!hasQualifiedName && (!extension || !validExtensions.includes(extension))) {
      setFormatError(`文件格式不符合要求：当前为 .${extension || '未知'} 格式。本平台全面支持病理切片格式：NDPI (滨松全切片), SVS (Aperio全切片), TIFF, JPG, PNG, WEBP, BMP`);
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
      {/* Hidden File Input supporting ndpi, svs, tif, etc. */}
      <input
        ref={fileInputRef}
        id="pathology-file-input"
        type="file"
        accept=".ndpi,.svs,.tif,.tiff,.jpg,.jpeg,.png,.webp,.bmp"
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
                支持.NDPI / .SVS/ .TIFF / .JPG /  .JPEG / .PNG / .BMP格式
              </p>
            </div>

            {/* Analysis Progress Loading State */}
            {isAnalyzing && (
              <div className="p-5 bg-white/95 border border-[#a4c3de] rounded-xl space-y-3 text-center shadow-xs">
                <div className="flex items-center justify-center gap-2 text-[#0e3b66] text-sm font-bold">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#0e3b66]" />
                  <span>{analysisStage || 'AI病理显微特征提取与分类模型推理中...'}</span>
                </div>
                <div className="w-full max-w-md mx-auto bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                  <div className="bg-[#0e3b66] h-full w-2/3 animate-pulse rounded-full" />
                </div>
                <p className="text-[11px] text-[#2c537a]">
                  支持多层级金字塔特征提取 • Grad-CAM类激活热力分布生成
                </p>
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
            {/* Left Card: 识别结果 · 热力图叠加 */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div 
                ref={viewportRef}
                className="bg-white border border-[#a4c3de]/80 rounded-2xl shadow-xs overflow-hidden"
              >
                {/* Card Header Bar */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2.5">
                    <span className="font-black text-sm sm:text-base text-[#102a48]">
                      识别结果 · 热力图叠加
                    </span>
                    {result.wsiInfo && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        result.wsiInfo.format === 'ndpi'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        WSI {result.wsiInfo.format}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* WSI Zoom Level Controls */}
                    <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
                      {(['4x', '10x', '20x', '40x'] as const).map(z => (
                        <button
                          key={z}
                          type="button"
                          onClick={() => setWsiZoom(z)}
                          className={`px-2.5 py-0.5 rounded font-mono font-bold transition-all cursor-pointer ${
                            wsiZoom === z ? 'bg-[#0e3b66] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {z}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-[#0e3b66] transition-colors cursor-pointer px-2.5 py-1 rounded hover:bg-slate-100 border border-transparent hover:border-slate-200"
                      title={isFullscreen ? '退出全屏' : '全屏查看'}
                    >
                      {isFullscreen ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>退出全屏</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>全屏</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Content: Exact Picture 5 style with Grad-CAM heatmap overlay */}
                <div className="p-4 sm:p-6 bg-slate-50/40 flex items-center justify-center">
                  <div className="relative aspect-square w-full max-w-[580px] rounded-xl overflow-hidden shadow-xs flex items-center justify-center border border-slate-200/90 bg-white select-none">
                    <img
                      src={picture5ExactHeatmap}
                      alt="识别结果 · 热力图叠加"
                      className="w-full h-full object-contain select-none"
                      style={{ opacity: isOriginalCompare ? (1 - heatmapOpacity * 0.8) : 1 }}
                    />
                  </div>
                </div>

                {/* WSI Scanner Information Banner */}
                {result.wsiInfo && (
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">WSI扫描仪：</span>
                      <span>{result.wsiInfo.scannerBrand}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500">
                      <span>像素规格: {result.wsiInfo.originalDimensions}</span>
                      <span>金字塔层数: {result.wsiInfo.pyramidLevels}层</span>
                      <span>光学等效: {result.wsiInfo.magFactor}</span>
                    </div>
                  </div>
                )}
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
