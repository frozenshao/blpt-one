import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Tag, 
  Eye, 
  EyeOff, 
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

interface DetailAnnotationItem {
  id: string;
  colorName: string;
  color: string;
  type: string;
  organ: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RelatedSliceItem {
  id: string;
  sampleCode: string;
  organ: string;
  system: string;
  isLesion: boolean;
  lesionName: string;
  pathologyDiagnosis: string;
  samplingDate: string;
  sliceType: string;
  thumbnailUrl: string;
  imageUrl: string;
  species: string;
  strain: string;
  projectName: string;
  experimentGroup: string;
  testArticle: string;
  testArticleCategory: string;
  testArticleSubCategory?: string;
  gender: string;
  ageWeeks: number;
}

const DETAIL_ANNOTATIONS: DetailAnnotationItem[] = [
  {
    id: 'ann-new-1',
    colorName: '黄色',
    color: '#eab308',
    type: '器官轮廓',
    organ: '肺脏',
    description: '肺脏器官',
    x: 20,
    y: 22,
    width: 32,
    height: 32
  },
  {
    id: 'ann-new-2',
    colorName: '蓝色',
    color: '#2563eb',
    type: '正常组织',
    organ: '肝脏',
    description: '正常肝脏-中央静脉区',
    x: 55,
    y: 26,
    width: 30,
    height: 28
  },
  {
    id: 'ann-new-3',
    colorName: '红色',
    color: '#dc2626',
    type: '病变组织',
    organ: '肾脏',
    description: '皮质/髓质，单形核细胞浸润；多灶性, 轻微',
    x: 32,
    y: 56,
    width: 38,
    height: 30
  }
];

// 为用户指定的三条核心数据配置高质量的同动物/同组别关联切片
const SPECIFIC_RELATED_SLICES: Record<string, RelatedSliceItem[]> = {
  // 1. E02_Mou_C57_MA103_S02_Liv (C57小鼠 肝脏长毒 -> 关联同实验动物的肾脏与脾脏切片)
  'E02_Mou_C57_MA103_S02_Liv': [
    {
      id: 'rel-c57-01',
      sampleCode: 'E02_Mou_C57_MA103_S01_Kid',
      organ: '肾脏',
      system: '泌尿系统',
      isLesion: true,
      lesionName: '近端肾小管上皮空泡变性',
      pathologyDiagnosis: '近曲小管轻度脂质沉着伴微量蛋白管型',
      samplingDate: '2026-03-12',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_kidney_1789719241512.jpg',
      imageUrl: '/images/pathology_slide_kidney_1789719241512.jpg',
      species: 'C57BL/6 小鼠',
      strain: 'C57BL/6J',
      projectName: '长期毒性试验',
      experimentGroup: '给药高剂量组',
      testArticle: '抗PD-1/VEGF双特异性抗体 (100mg/kg)',
      testArticleCategory: '药品',
      testArticleSubCategory: '抗体',
      gender: '雄性',
      ageWeeks: 16
    },
    {
      id: 'rel-c57-02',
      sampleCode: 'E02_Mou_C57_MA103_S03_Spl',
      organ: '脾脏',
      system: '淋巴系统',
      isLesion: false,
      lesionName: '正常白髓小体形态',
      pathologyDiagnosis: '脾实质小体清晰，生发中心未见萎缩或坏死',
      samplingDate: '2026-03-12',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_spleen_1789719252319.jpg',
      imageUrl: '/images/pathology_slide_spleen_1789719252319.jpg',
      species: 'C57BL/6 小鼠',
      strain: 'C57BL/6J',
      projectName: '长期毒性试验',
      experimentGroup: '给药高剂量组',
      testArticle: '抗PD-1/VEGF双特异性抗体 (100mg/kg)',
      testArticleCategory: '药品',
      testArticleSubCategory: '抗体',
      gender: '雄性',
      ageWeeks: 16
    }
  ],

  // 2. E03_NHP_CR_LG021_S02_Lng (食蟹猴/犬 肺切片 -> 关联同实验动物的气管与心脏切片)
  'E03_NHP_CR_LG021_S02_Lng': [
    {
      id: 'rel-nhp-01',
      sampleCode: 'E03_NHP_CR_LG021_S01_Tra',
      organ: '气管/支气管',
      system: '呼吸系统',
      isLesion: false,
      lesionName: '黏膜纤毛上皮完整',
      pathologyDiagnosis: '支气管假复层纤毛柱状上皮结构完好，未见异型增殖与炎性浸润',
      samplingDate: '2026-02-18',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_lung_1789719230402.jpg',
      imageUrl: '/images/pathology_slide_lung_1789719230402.jpg',
      species: '比格犬',
      strain: '比格犬 (Beagle Dog)',
      projectName: '生殖毒性试验',
      experimentGroup: 'AAV基因治疗产品高剂量组',
      testArticle: 'AAV9靶向基因治疗载体制剂',
      testArticleCategory: '药品',
      testArticleSubCategory: '基因治疗产品',
      gender: '雌性',
      ageWeeks: 36
    },
    {
      id: 'rel-nhp-02',
      sampleCode: 'E03_NHP_CR_LG021_S03_Hrt',
      organ: '心脏',
      system: '心血管系统',
      isLesion: true,
      lesionName: '心肌间质局灶轻微纤维化',
      pathologyDiagnosis: '左心室肌层局灶性胶原纤维沉积伴轻度微血管壁增厚',
      samplingDate: '2026-02-18',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_heart_1789719246101.jpg',
      imageUrl: '/images/pathology_slide_heart_1789719246101.jpg',
      species: '比格犬',
      strain: '比格犬 (Beagle Dog)',
      projectName: '生殖毒性试验',
      experimentGroup: 'AAV基因治疗产品高剂量组',
      testArticle: 'AAV9靶向基因治疗载体制剂',
      testArticleCategory: '药品',
      testArticleSubCategory: '基因治疗产品',
      gender: '雌性',
      ageWeeks: 36
    }
  ],

  // 3. E02_Mou_C57_MA101_S01_Liv-Kid (人源PDX模型 肝肾联合浸润切片 -> 关联同动物的原发肺瘤与外周淋巴结切片)
  'E02_Mou_C57_MA101_S01_Liv-Kid': [
    {
      id: 'rel-pdx-01',
      sampleCode: 'E02_Mou_C57_MA101_S02_Lng',
      organ: '肺脏',
      system: '呼吸系统',
      isLesion: true,
      lesionName: '浸润性腺癌原发瘤灶',
      pathologyDiagnosis: '原发性异型腺管状瘤细胞密集排列，可见间质浸润与纤维反应',
      samplingDate: '2026-03-08',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_lung_1789719230402.jpg',
      imageUrl: '/images/pathology_slide_lung_1789719230402.jpg',
      species: '人源异种移植模型(PDX)',
      strain: 'NOD/SCID/IL2rγ-/- (NCG)',
      projectName: '致癌性试验',
      experimentGroup: '靶向治疗致癌性监测组',
      testArticle: '小分子激酶抑制剂 TKI-988',
      testArticleCategory: '药品',
      testArticleSubCategory: '小分子化药',
      gender: '雌性',
      ageWeeks: 8
    },
    {
      id: 'rel-pdx-02',
      sampleCode: 'E02_Mou_C57_MA101_S03_Lym',
      organ: '淋巴结',
      system: '淋巴系统',
      isLesion: false,
      lesionName: '反应性增生',
      pathologyDiagnosis: '淋巴窦扩张伴巨噬细胞反应，未见转移瘤细胞巢累及',
      samplingDate: '2026-03-08',
      sliceType: 'HE染色',
      thumbnailUrl: '/images/pathology_slide_spleen_1789719252319.jpg',
      imageUrl: '/images/pathology_slide_spleen_1789719252319.jpg',
      species: '人源异种移植模型(PDX)',
      strain: 'NOD/SCID/IL2rγ-/- (NCG)',
      projectName: '致癌性试验',
      experimentGroup: '靶向治疗致癌性监测组',
      testArticle: '小分子激酶抑制剂 TKI-988',
      testArticleCategory: '药品',
      testArticleSubCategory: '小分子化药',
      gender: '雌性',
      ageWeeks: 8
    }
  ]
};

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
  const [activeTab, setActiveTab] = useState<'details' | 'annotations' | 'related'>('details');
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>('ann-new-1');

  const displayCode = sample.sampleCode.replace(/\.[^/.]+$/, '');
  const genderText = sample.gender.includes('雌') ? '雌性' : '雄性';

  // 优先匹配当前样本是否有配置的专属关联切片数据
  const specificSlices = SPECIFIC_RELATED_SLICES[displayCode] || SPECIFIC_RELATED_SLICES[sample.sampleCode];

  // 默认由 allSamples 提取关联切片
  const fallbackSlices = allSamples.filter(
    s => s.id !== sample.id && (
      (sample.animalId && s.animalId && s.animalId === sample.animalId) ||
      (sample.strain && s.strain && s.strain === sample.strain && s.experimentGroup === sample.experimentGroup)
    )
  );

  const activeRelatedSlices = (specificSlices && specificSlices.length > 0) ? specificSlices : fallbackSlices;

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

  const handleFocusAnnotation = (ann: DetailAnnotationItem) => {
    setSelectedAnnotationId(ann.id);
    setZoom(1.8);
    const targetX = (50 - (ann.x + ann.width / 2)) * 3;
    const targetY = (50 - (ann.y + ann.height / 2)) * 3;
    setPan({ x: targetX, y: targetY });
  };

  const handleNavigateToSlice = (item: any) => {
    if (!onSelectSample) return;
    // 如果是现有 allSamples 中的样本直接传递
    const existing = allSamples.find(s => s.id === item.id || s.sampleCode.includes(item.sampleCode));
    if (existing) {
      onSelectSample(existing);
    } else {
      // 构造完整样本对象供详情展示
      const constructedSample: PathologySample = {
        ...sample,
        id: item.id,
        sampleCode: item.sampleCode,
        organ: item.organ,
        system: item.system as any,
        isLesion: item.isLesion,
        lesionName: item.lesionName,
        pathologyDiagnosis: item.pathologyDiagnosis,
        samplingDate: item.samplingDate,
        sliceType: item.sliceType as any,
        thumbnailUrl: item.thumbnailUrl,
        imageUrl: item.imageUrl,
        species: (item.species || sample.species) as any,
        strain: item.strain || sample.strain,
        projectName: (item.projectName || sample.projectName) as any,
        experimentGroup: item.experimentGroup || sample.experimentGroup,
        testArticle: item.testArticle || sample.testArticle,
        testArticleCategory: (item.testArticleCategory || sample.testArticleCategory) as any,
        testArticleSubCategory: item.testArticleSubCategory || sample.testArticleSubCategory,
        gender: (item.gender || sample.gender) as any,
        ageWeeks: item.ageWeeks || sample.ageWeeks,
        structuredDescription: {
          ...sample.structuredDescription,
          clinicalDiagnosis: item.pathologyDiagnosis
        }
      };
      onSelectSample(constructedSample);
    }
  };

  return (
    <div id="sample-detail-page" className="space-y-4 animate-in fade-in duration-200">
      {/* 顶部操作条：仅展示“返回”按钮、项目名称和样本编号 */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            id="back-to-search-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition-all hover:-translate-x-0.5 cursor-pointer"
            title="返回检索结果列表"
          >
            <ArrowLeft className="w-4 h-4 text-[#18446b]" />
            <span>返回</span>
          </button>

          <div className="h-5 w-px bg-slate-200" />

          {/* 项目名称 */}
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {sample.projectName || '长期毒性试验'}
          </span>

          {/* 样本编号 */}
          <span className="font-mono text-base sm:text-lg font-bold text-[#18446b]">
            {displayCode}
          </span>
        </div>
      </div>

      {/* 主工作区：左侧显微镜视场 + 右侧详细信息与标注标签 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 左侧：数字病理切片视场 (7 cols) - 已删除视场倍率/坐标/鼠标说明/画质调节栏 */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* 控制条 */}
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

            {/* 标注图层切换 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnnotations(!showAnnotations)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  showAnnotations
                    ? 'bg-sky-50 text-[#18446b] border-sky-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#18446b]" />
                <span>病理标注图层</span>
                {showAnnotations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 纯净视场画布 (已彻底删除倍率、坐标、操作提示与画质栏) */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative h-[560px] sm:h-[620px] overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing bg-slate-900 select-none"
          >
            {/* 切片画布变换层 */}
            <div
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              className="relative w-[600px] h-[450px] max-w-full max-h-full rounded-md shadow-2xl overflow-hidden bg-slate-950 flex-shrink-0 ring-1 ring-slate-700"
            >
              <img
                src={sample.imageUrl}
                alt={displayCode}
                className="w-full h-full object-cover pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* 3条新病理标注区域 */}
              {showAnnotations && (
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  {DETAIL_ANNOTATIONS.map((ann) => {
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
                          backgroundColor: `${ann.color}25`
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
                          {ann.type} · {ann.organ}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：详细信息、标注标签与关联切片 (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/90 shadow-xs flex flex-col overflow-hidden">
          {/* Tab 导航栏：详细信息、标注标签、关联切片 */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-2 gap-1 text-xs">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'details'
                  ? 'bg-white text-[#18446b] font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              详细信息
            </button>
            <button
              onClick={() => setActiveTab('annotations')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'annotations'
                  ? 'bg-white text-[#18446b] font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>标注标签</span>
              <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-[#18446b] text-[10px] font-bold">
                {DETAIL_ANNOTATIONS.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('related')}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'related'
                  ? 'bg-white text-[#18446b] font-bold border border-slate-200 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>关联切片</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                {activeRelatedSlices.length}
              </span>
            </button>
          </div>

          {/* Tab 内容区 */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3 text-xs max-h-[580px]">
            {/* 1. 详细信息 Tab：展示指定10大字段 */}
            {activeTab === 'details' && (
              <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-2xs">
                {/* 1) 动物种属 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">动物种属</span>
                  <span className="font-bold text-slate-800 text-right">{sample.species}</span>
                </div>

                {/* 2) 动物品系 */}
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">动物品系</span>
                  <span className="font-medium text-slate-800 text-right">{sample.strain || sample.species}</span>
                </div>

                {/* 3) 系统/脏器类型 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">系统/脏器类型</span>
                  <span className="font-bold text-slate-800 text-right">
                    {sample.system || '消化系统'} / {sample.organ}
                  </span>
                </div>

                {/* 4) 受试物 */}
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">受试物</span>
                  <span className="font-semibold text-slate-800 text-right">
                    {sample.testArticleCategory || '药品'}
                    {sample.testArticleSubCategory ? ` / ${sample.testArticleSubCategory}` : ''}
                  </span>
                </div>

                {/* 5) 组别 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">组别</span>
                  <span className="font-medium text-slate-800 text-right">{sample.experimentGroup || '高剂量给药组'}</span>
                </div>

                {/* 6) 性别 */}
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">性别</span>
                  <span className="font-medium text-slate-800 text-right">{genderText}</span>
                </div>

                {/* 7) 周龄 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">周龄</span>
                  <span className="font-mono font-bold text-slate-800 text-right">{sample.ageWeeks}周</span>
                </div>

                {/* 8) 病理诊断 */}
                <div className="flex items-start justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-28 shrink-0 pt-0.5">病理诊断</span>
                  <span className="font-medium text-slate-800 text-right leading-relaxed max-w-[280px]">
                    {sample.pathologyDiagnosis || sample.structuredDescription.clinicalDiagnosis || '未见明显组织学病变或细胞异型性'}
                  </span>
                </div>

                {/* 9) 组织状态 */}
                <div className="flex items-center justify-between p-2.5 bg-slate-50/50">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">组织状态</span>
                  <span className="text-right">
                    {sample.isLesion ? (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        病变组织
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        正常组织
                      </span>
                    )}
                  </span>
                </div>

                {/* 10) 采集时间 */}
                <div className="flex items-center justify-between p-2.5">
                  <span className="font-semibold text-slate-500 w-28 shrink-0">采集时间</span>
                  <span className="font-mono text-slate-700 text-right">{sample.samplingDate}</span>
                </div>
              </div>
            )}

            {/* 2. 标注标签 Tab：展示指定的3条新数据，无置信度 */}
            {activeTab === 'annotations' && (
              <div className="space-y-2.5">
                <div className="text-slate-600 text-xs font-medium">
                  共标注 <span className="text-[#18446b] font-bold">{DETAIL_ANNOTATIONS.length}</span> 个区域，点击可定位：
                </div>

                {DETAIL_ANNOTATIONS.map((ann) => {
                  const isSelected = selectedAnnotationId === ann.id;

                  return (
                    <div
                      key={ann.id}
                      onClick={() => handleFocusAnnotation(ann)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/80 border-[#18446b] shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div 
                          style={{ backgroundColor: ann.color }}
                          className="w-3 h-3 rounded-full shrink-0 ring-1 ring-black/10"
                        />
                        <span className="font-bold text-slate-900 text-xs">
                          {ann.type} · {ann.organ}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-5">
                        {ann.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. 关联切片 Tab：支持 E02_Mou_C57_MA103_S02_Liv、E03_NHP_CR_LG021_S02_Lng、E02_Mou_C57_MA101_S01_Liv-Kid 以及其它样本的关联记录 */}
            {activeTab === 'related' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-600 flex items-center justify-between">
                  <span>
                    同动物关联切片（<strong className="text-[#18446b]">{activeRelatedSlices.length}</strong> 张）：
                  </span>
                </div>

                {activeRelatedSlices.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500 space-y-1">
                    <GitFork className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-xs text-slate-700">暂无同一动物或直接对照的关联切片记录</p>
                    <p className="text-[11px] text-slate-400">系统支持通过动物编号串联该动物的多脏器或多时点连续切片</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {activeRelatedSlices.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => handleNavigateToSlice(rel)}
                        className="p-3 bg-white border border-slate-200 hover:border-[#18446b] rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          {/* 样本编号与组织状态 */}
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-[#18446b] text-xs">
                              {rel.sampleCode.replace(/\.[^/.]+$/, '')}
                            </span>
                            {rel.isLesion ? (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-semibold">
                                <AlertCircle className="w-3 h-3 text-rose-600" />
                                病变组织
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-semibold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                正常组织
                              </span>
                            )}
                          </div>

                          {/* 系统/脏器类型 */}
                          <div className="text-[11px] text-slate-600 flex items-center gap-1">
                            <span className="text-slate-400">系统/脏器类型:</span>
                            <span className="font-semibold text-slate-800">
                              {rel.system ? `${rel.system} / ${rel.organ}` : rel.organ}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center gap-1 text-[11px] font-semibold text-[#18446b] group-hover:text-[#0e3b66] shrink-0"
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
          </div>
        </div>
      </div>
    </div>
  );
};
