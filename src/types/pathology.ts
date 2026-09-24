export type OrganType = 
  | '肝' 
  | '脾' 
  | '肺' 
  | '肾' 
  | '心' 
  | '脑' 
  | '胰腺' 
  | '胃肠' 
  | '淋巴结' 
  | '甲状腺' 
  | '骨髓' 
  | '皮肤';

export type SliceType = 
  | 'HE染色' 
  | '免疫组化(IHC)' 
  | 'Masson三色染色' 
  | 'PAS糖原染色' 
  | '天狼星红染色' 
  | '冰冻切片' 
  | '石蜡切片';

export type LesionName = 
  | '正常形态'
  | '炎性细胞浸润' 
  | '间质纤维化' 
  | '细胞水肿/气球样变' 
  | '脂肪变性(脂肪肝)' 
  | '凝固性坏死' 
  | '腺癌组织浸润' 
  | '结节性增生' 
  | '微血管充血淤血' 
  | '肾小球硬化'
  | '肺泡壁增厚与渗出';

export type LesionDistribution = 
  | '无病变(正常)'
  | '弥漫性分布' 
  | '局灶性分布' 
  | '多灶性散在' 
  | '结节状聚集' 
  | '间质广泛浸润' 
  | '门管区/血管周围';

export type AnimalSpecies = 
  | 'C57BL/6 小鼠' 
  | 'BALB/c 小鼠' 
  | 'SD 大鼠' 
  | 'Wistar 大鼠' 
  | '食蟹猴' 
  | '比格犬' 
  | '人源异种移植模型(PDX)' 
  | '斑马鱼';

export type GenderType = '雄性 (Male)' | '雌性 (Female)' | '混合/未指定';

export interface PathologyAnnotation {
  id: string;
  label: string;
  category: 'lesion' | 'normal' | 'cell' | 'vessel';
  color: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  probability: number;
  description: string;
}

export interface HeatmapPoint {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  radius: number;
  intensity: number; // 0.0 - 1.0
  score?: number;
  label?: string;
}

export interface StructuredDescription {
  histopathologyScore: number; // 0-4
  cellularMorphology: string;
  architecturalChanges: string;
  inflammationScore: string; // 无 / 轻度 / 中度 / 重度
  necrosisPercentage: number; // %
  fibrosisStage: string; // S0 - S4
  clinicalDiagnosis: string;
  pathologistRemarks: string;
  experimentGroup: string;
  dosageCohort?: string;
  bodyWeight?: string;
}

export interface PathologySample {
  id: string;
  sampleCode: string; // e.g. PAT-2026-LV-008
  animalId: string; // 动物编号，支持同一动物多张切片关联 (如 ANIMAL-2026-M01)
  strain: string; // 品系 (如 C57BL/6J, BALB/c, Sprague-Dawley, Wistar, 恒河猴等)
  experimentGroup: string; // 组别 (如 高脂模型组、溶媒对照组、给药高剂量组)
  testArticle: string; // 受试物/溶媒 (如 高脂饲料HFD、0.9%生理盐水溶媒、LPS脂多糖等)
  pathologyDiagnosis: string; // 病理诊断 (明确病理诊断结论)
  organ: OrganType;
  sliceType: SliceType;
  isLesion: boolean; // false = 正常组织, true = 病变组织
  lesionName: LesionName;
  lesionDistribution: LesionDistribution;
  species: AnimalSpecies;
  gender: GenderType;
  ageWeeks: number;
  samplingDate: string; // YYYY-MM-DD
  collectorName: string;
  pathologistSign: string;
  qualityGrade: 'A' | 'B' | 'C';
  imageUrl: string;
  thumbnailUrl: string;
  resolution: string;
  stainBatch: string;
  structuredDescription: StructuredDescription;
  annotations: PathologyAnnotation[];
  heatmapPoints: HeatmapPoint[];
  customFields?: Record<string, string>;
}

export interface PathologyFilterParams {
  keyword?: string;
  organs?: OrganType[];
  sliceTypes?: SliceType[];
  isLesionFilter?: 'all' | 'normal' | 'lesion';
  lesionNames?: string[];
  lesionDistributions?: string[];
  species?: AnimalSpecies[];
  genders?: GenderType[];
  ageMin?: number;
  ageMax?: number;
  dateStart?: string;
  dateEnd?: string;
  customFilters?: Array<{
    field: string;
    operator: 'equals' | 'contains';
    value: string;
  }>;
  sortBy?: 'samplingDate' | 'sampleCode' | 'ageWeeks' | 'organ';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ClassificationResult {
  classification: '正常组织' | '病变组织';
  isLesion: boolean;
  confidence: number; // e.g. 98.4%
  confidenceScore: number; // 0.0 - 1.0
  normalProbability: number;
  lesionProbability: number;
  lesionTypePredicted?: string;
  lesionDistributionPredicted?: string;
  affectedAreaPercentage: number;
  cellularAnalysis: {
    nuclearAtypia: string;
    tissueArchitecture: string;
    inflammatoryInfiltration: string;
    stromalReaction: string;
    mitoticCount?: string;
  };
  hotspots: HeatmapPoint[];
  heatmapGrid?: number[][];
  processingTimeMs: number;
  modelVersion: string;
  isFallback: boolean;
  warningMessage?: string;
  timestamp: string;
  suggestedAction?: string;
}
