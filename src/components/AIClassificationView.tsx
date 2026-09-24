import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Sparkles, 
  FileWarning, 
  RefreshCw, 
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { ClassificationResult, PathologySample } from '../types/pathology';

// Use the high-fidelity microscopic pathology slide image and exact heatmap matching Picture 5
import sampleSlidePic4 from '../assets/images/pathology_pic4_slide_1790217459142.jpg';
import picture5ExactHeatmap from '../assets/images/picture5_exact_heatmap_1790220645022.jpg';

interface AIClassificationViewProps {
  initialSampleForAI?: PathologySample | null;
  onSaveToDatabase?: (sample: Partial<PathologySample>) => void;
}

export const AIClassificationView: React.FC<AIClassificationViewProps> = ({
  initialSampleForAI
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formatError, setFormatError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<string>('');
  const [result, setResult] = useState<ClassificationResult | null>(null);

  // Result Visual Controls matching Picture 3 & Picture 4
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.65); // 65% as shown in Picture 3/4
  const [isOriginalCompare, setIsOriginalCompare] = useState<boolean>(false); // "原图对比" toggle
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Picture 4 fixed data constants
  const fixedSlideUrl = sampleSlidePic4;
  const fixedFileName = 'liver_HE_0402.png';
  const fixedConfidence = '92.5%';
  const fixedModelVersion = 'patho-v2.1';
  const fixedCallTime = '2026-08-27 10:32:18';
  const fixedDuration = '1.24s';

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // If initial sample was passed, trigger analysis
  useEffect(() => {
    if (initialSampleForAI) {
      triggerAnalysis(initialSampleForAI.sampleCode || 'liver_HE_0402.png');
    }
  }, [initialSampleForAI]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Trigger analysis simulation that always outputs Picture 4 content
  const triggerAnalysis = (fileName: string) => {
    setIsAnalyzing(true);
    setFormatError(null);
    setResult(null);
    setAnalysisStage('切片色彩校准与图像编码中 (HE/IHC Standardizer)...');

    setTimeout(() => {
      setAnalysisStage('连接病理组织二分类AI模型推理引擎 (patho-v2.1)...');
      setTimeout(() => {
        setAnalysisStage('解析细胞异型性与Grad-CAM空间病灶激活热力图...');
        setTimeout(() => {
          setIsAnalyzing(false);
          setAnalysisStage('');
          // Fixed result matching Picture 4
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
            processingTimeMs: 1240,
            modelVersion: 'patho-v2.1',
            isFallback: false,
            timestamp: '2026-08-27T10:32:18.000Z'
          });
        }, 300);
      }, 350);
    }, 300);
  };

  // File Validation Handler & Auto Trigger
  const handleFileSelection = (file: File) => {
    setFormatError(null);

    // Rule 1: Special check for filename containing "不合格" or "unqualified"
    if (file.name.includes('不合格') || file.name.toLowerCase().includes('unqualified')) {
      setFormatError(`上传切片【${file.name}】格式校验不合格：检测到病理切片存在严重组织折叠、模糊、染色异常或不符合病理切片规范，无法进行AI二分类识别，请重新上传合格切片。`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Rule 2: File Type & Extension Check
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'tif', 'tiff', 'bmp'];
    const extension = file.name.split('.').pop()?.toLowerCase();
    const hasQualifiedName = file.name.includes('合格');

    if (!hasQualifiedName && (!extension || !validExtensions.includes(extension))) {
      setFormatError(`文件格式不符合要求：当前为 .${extension || '未知'} 格式。仅支持病理切片常见格式 (${validExtensions.join(', ').toUpperCase()})`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Rule 3: File Size Check (Max 30MB)
    const MAX_SIZE_BYTES = 30 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setFormatError(`文件体积过大 (${(file.size / (1024 * 1024)).toFixed(1)}MB)，已超过平台限制 (30MB)。请截取感兴趣区域(ROI)后重试。`);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFile(file);

    // Format validation passed -> Automatically trigger binary classification AI
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

  // Render Heatmap on Canvas (Grad-CAM Jet Colormap matching Picture 4 exactly)
  useEffect(() => {
    if (!result || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    if (isOriginalCompare) return;

    // Draw the characteristic Grad-CAM heatmap matching Picture 4:
    // Core intense focal center slightly to the right of middle-left (x: 45%, y: 50%)
    const centerX = width * 0.45;
    const centerY = height * 0.50;
    const radius = width * 0.38;

    const grad = ctx.createRadialGradient(
      centerX + width * 0.05,
      centerY + height * 0.01,
      radius * 0.04,
      centerX,
      centerY,
      radius
    );

    // Jet Colormap matching Picture 4 color scale:
    // Dark brown/red (core 1.0) -> Crimson -> Bright Orange -> Yellow -> Green -> Cyan -> Blue -> Transparent Blue
    grad.addColorStop(0, 'rgba(128, 0, 0, 0.98)');
    grad.addColorStop(0.20, 'rgba(230, 0, 0, 0.92)');
    grad.addColorStop(0.38, 'rgba(255, 140, 0, 0.88)');
    grad.addColorStop(0.52, 'rgba(255, 230, 0, 0.80)');
    grad.addColorStop(0.66, 'rgba(0, 230, 220, 0.65)');
    grad.addColorStop(0.82, 'rgba(0, 80, 240, 0.40)');
    grad.addColorStop(1, 'rgba(0, 0, 140, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }, [result, isOriginalCompare, heatmapOpacity]);

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="pathology-file-input"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.tif,.tiff,.bmp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
          }
        }}
      />

      {/* State 1: When no result is loaded yet, show the Clean Upload Box */}
      {!result && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs p-5 sm:p-6 text-slate-800">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>病理组织二分类AI识别模型 (正常 vs 病变)</span>
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {/* Spacious Drag & Drop Upload Zone */}
            <div
              id="upload-dropzone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/25 bg-slate-50/60 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-3.5 text-blue-600 shadow-xs group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <div className="font-bold text-base text-slate-900 mb-1.5">
                点击上传 或 将病理切片图像拖拽至此处
              </div>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                支持标准病理数字切片图像：<span className="text-blue-700 font-mono font-semibold">JPG, PNG, WEBP, TIFF, BMP</span>
              </p>
            </div>

            {/* Analysis Progress Loading State */}
            {isAnalyzing && (
              <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-3 text-center">
                <div className="flex items-center justify-center gap-2 text-blue-800 text-sm font-semibold">
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>{analysisStage || 'AI病理显微特征提取与分类模型推理中...'}</span>
                </div>
                <div className="w-full max-w-md mx-auto bg-blue-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-2/3 animate-pulse rounded-full" />
                </div>
                <p className="text-[11px] text-blue-600/80">
                  正常与病变组织特征提取 • Grad-CAM类激活热力分布生成
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
          {/* Main 2-Column Grid: Left Heatmap Card (lg:col-span-8), Right Results Sidebar (lg:col-span-4) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: 识别结果 · 热力图叠加 */}
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <div 
                ref={viewportRef}
                className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden"
              >
                {/* Card Header Bar */}
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-slate-800">
                    识别结果 · 热力图叠加
                  </span>

                  <button
                    onClick={toggleFullscreen}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-slate-100"
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

                {/* Card Content: 识别结果 · 热力图叠加模块的内容展示图片5 中的内容，颜色样式均一模一样 */}
                <div className="p-4 sm:p-6 bg-slate-50/40 flex items-center justify-center">
                  <div className="relative aspect-square w-full max-w-[580px] rounded-xl overflow-hidden shadow-xs flex items-center justify-center border border-slate-200/90 bg-white select-none">
                    {/* Picture 5 Image: Contains the microscopic slice, Grad-CAM heatmap, ABNORMAL badge, and right 1.0~0.0 colorbar */}
                    <img
                      src={picture5ExactHeatmap}
                      alt="识别结果 · 热力图叠加 (图片5)"
                      className="w-full h-full object-contain select-none"
                      style={{ opacity: isOriginalCompare ? (1 - heatmapOpacity * 0.8) : 1 }}
                      referrerPolicy="no-referrer"
                    />

                    {/* When user toggles 原图对比, show the base slide comparison */}
                    {isOriginalCompare && (
                      <div className="absolute inset-0 w-full h-full bg-black/5 pointer-events-none flex items-center justify-center">
                        <img
                          src={fixedSlideUrl}
                          alt="原图切片"
                          className="w-full h-full object-cover select-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Info Notice Banner below Left Card */}
              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-2.5 text-xs text-slate-600 shadow-2xs">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>红色区域为模型判断的高风险病变区域，可通过右侧面板调节热力图透明度。</span>
              </div>
            </div>

            {/* Right Column: Cards & Controls matching Picture 4 & 3 */}
            <div className="lg:col-span-4 space-y-4">
              {/* Top Verdict Card: large red "病变组织" */}
              <div className="py-6 px-4 rounded-2xl border text-center transition-all bg-red-50/80 border-red-200/90 shadow-2xs">
                <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-red-500">
                  病变组织
                </h1>
              </div>

              {/* Confidence Text below Verdict Card: 92.5% */}
              <div className="text-center py-1">
                <span className="text-xs text-slate-600 font-medium">模型预测置信度 </span>
                <span className="text-xl font-bold text-slate-900 font-mono ml-1">
                  {fixedConfidence}
                </span>
              </div>

              {/* Middle Card: 上传图片 Controls */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="text-sm font-bold text-slate-800">上传图片</div>
                
                {/* Filename matching Picture 3/4 */}
                <div className="text-xs text-slate-500 font-mono truncate" title={fixedFileName}>
                  {fixedFileName}
                </div>

                {/* Transparency Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>透明度</span>
                    <span className="font-mono text-slate-500">{Math.round(heatmapOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={heatmapOpacity}
                    onChange={(e) => setHeatmapOpacity(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Original Image Compare Switch */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-600">原图对比</span>
                  <button
                    type="button"
                    onClick={() => setIsOriginalCompare(!isOriginalCompare)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                      isOriginalCompare ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isOriginalCompare ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Bottom Card: 识别参数 */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                <div className="text-sm font-bold text-slate-800">识别参数</div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">模型版本</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {fixedModelVersion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">调用时间</span>
                    <span className="font-mono text-slate-800">
                      {fixedCallTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">耗时</span>
                    <span className="font-mono text-slate-800 font-semibold">
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
                className="w-full py-2.5 px-4 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
