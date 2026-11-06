export type OrganSystem = 
  | '消化系统' 
  | '心血管系统' 
  | '内分泌系统' 
  | '骨骼组织' 
  | '呼吸系统' 
  | '生殖系统' 
  | '泌尿系统' 
  | '神经系统' 
  | '淋巴系统';

export const ORGAN_SYSTEM_DATA: Record<OrganSystem, string[]> = {
  '消化系统': ['肝脏', '胃', '小肠', '大肠', '胰腺', '胆囊', '食管', '口腔/唾液腺'],
  '心血管系统': ['心脏', '主动脉', '外周血管'],
  '内分泌系统': ['甲状腺', '肾上腺', '垂体', '甲状旁腺', '胰岛'],
  '骨骼组织': ['骨骼', '骨髓', '关节软骨', '骨骼肌'],
  '呼吸系统': ['肺脏', '气管', '支气管', '鼻腔'],
  '生殖系统': ['睾丸', '附睾', '前列腺', '卵巢', '子宫', '阴道', '乳腺'],
  '泌尿系统': ['肾脏', '输尿管', '膀胱', '尿道'],
  '神经系统': ['大脑皮质', '海马', '小脑', '脑干', '脊髓', '坐骨神经'],
  '淋巴系统': ['脾脏', '胸腺', '淋巴结', '扁桃体']
};

export type TestArticleCategory = '药品' | '医疗器械' | '化妆品';

export type TestArticleSubCategory = 
  | '抗体' 
  | '细胞治疗产品' 
  | '基因治疗产品' 
  | '中药' 
  | '小分子化药' 
  | '医疗器械产品' 
  | '护肤类' 
  | '彩妆类' 
  | '特种化妆品'
  | '化妆品'
  | '化妆品原料/成品';

export const TEST_ARTICLE_DATA: Record<TestArticleCategory, string[]> = {
  '药品': ['抗体', '细胞治疗产品', '基因治疗产品', '中药', '小分子化药'],
  '医疗器械': ['医疗器械产品'],
  '化妆品': []
};

export type ProjectType = 
  | '长期毒性试验' 
  | '急性毒性试验' 
  | '致癌性试验' 
  | '生殖毒性试验' 
  | '局部刺激试验' 
  | '神经毒性试验' 
  | '其他';

export const ALL_PROJECT_TYPES: ProjectType[] = [
  '长期毒性试验',
  '急性毒性试验',
  '致癌性试验',
  '生殖毒性试验',
  '局部刺激试验',
  '神经毒性试验',
  '其他'
];

export type OrganType = string;

export type SliceType = 
  | 'HE染色' 
  | '免疫组化(IHC)' 
  | 'Masson三色染色' 
  | 'PAS糖原染色' 
  | '天狼星红染色' 
  | '冰冻切片' 
  | '石蜡切片';

export type LesionName = string;

export type LesionDistribution = string;

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
  testArticle: string; // 受试物名称
  testArticleCategory?: TestArticleCategory; // 药品 | 医疗器械 | 化妆品
  testArticleSubCategory?: TestArticleSubCategory; // 抗体 | 细胞治疗产品 等
  projectName?: string; // 长期毒性试验 | 急性毒性试验 | 致癌性试验 等
  pathologyDiagnosis: string; // 病理诊断
  system?: OrganSystem | string; // 消化系统、心血管系统等
  organ: string; // 具体脏器/腺体，如 肝脏、肾脏、甲状腺
  sliceType: SliceType;
  isLesion: boolean; // false = 正常组织, true = 病变组织
  lesionName: string;
  lesionDistribution: string;
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
  wsiFormat?: 'ndpi' | 'svs' | 'tif' | 'standard'; // 全切片数字病理格式支持
  structuredDescription: StructuredDescription;
  annotations: PathologyAnnotation[];
  heatmapPoints: HeatmapPoint[];
  customFields?: Record<string, string>;
}

export interface PathologyFilterParams {
  keyword?: string;
  projectName?: string; // '全部' | '长期毒性试验' | '急性毒性试验' | '致癌性试验' | '生殖毒性试验' | '局部刺激试验' | '神经毒性试验' | '其他'
  projectNames?: string[]; // 多选项目名称
  systems?: string[]; // 系统类型筛选 (9大系统)
  organs?: string[]; // 对应具体脏器/腺体
  testArticleCategory?: string; // 药品 | 医疗器械 | 化妆品
  testArticleSubCategory?: string; // 抗体 | 细胞治疗产品 ...
  sliceTypes?: SliceType[];
  isLesionFilter?: 'all' | 'normal' | 'lesion';
  species?: AnimalSpecies[];
  animalTypes?: string[]; // 动物种属 (如 小鼠, 大鼠, 食蟹猴, 比格犬, 人源异种移植模型(PDX), 斑马鱼)
  strains?: string[]; // 动物品系 (如 C57BL/6J, BALB/cAnN, Sprague-Dawley, Wistar等)
  genders?: GenderType[];
  genderOptions?: string[]; // 性别筛选: 雄性, 雌性
  ageRanges?: string[]; // 周龄筛选范围
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
  wsiInfo?: {
    format: 'ndpi' | 'svs' | 'standard';
    scannerBrand: string;
    originalDimensions: string;
    pyramidLevels: number;
    magFactor: string;
  };
}
