export type OrganSystem = 
  | '消化系统' 
  | '心血管系统' 
  | '内分泌系统' 
  | '呼吸系统' 
  | '泌尿系统' 
  | '雄性生殖系统' 
  | '雌性生殖系统' 
  | '免疫系统' 
  | '神经系统' 
  | '肌肉骨骼系统' 
  | '皮肤及附属器' 
  | '特殊感觉器官';

export const ORGAN_SYSTEM_DATA: Record<OrganSystem, string[]> = {
  '消化系统': ['肝', '胃', '十二指肠', '空肠', '回肠', '盲肠', '结肠', '直肠', '胰腺', '胆囊', '食管', '唾液腺', '舌'],
  '心血管系统': ['心脏', '主动脉', '动脉', '静脉'],
  '内分泌系统': ['垂体', '甲状腺', '甲状旁腺', '肾上腺', '胰腺'],
  '呼吸系统': ['鼻腔', '鼻咽', '喉', '气管', '支气管', '肺', '胸膜'],
  '泌尿系统': ['肾', '输尿管', '膀胱', '尿道'],
  '雄性生殖系统': ['睾丸', '附睾', '前列腺', '精囊', '凝固腺', '输精管', '阴茎'],
  '雌性生殖系统': ['卵巢', '输卵管', '子宫', '子宫颈', '阴道'],
  '免疫系统': ['骨髓', '脾', '胸腺', '淋巴结'],
  '神经系统': ['脑', '脊髓', '周围神经', '神经节'],
  '肌肉骨骼系统': ['骨', '关节', '骨骼肌', '肌腱'],
  '皮肤及附属器': ['皮肤', '皮下组织', '乳腺'],
  '特殊感觉器官': ['眼球', '视神经', '哈氏腺', '泪腺', '耳']
};

export const ANIMAL_SPECIES_STRAIN_DATA: Record<string, string[]> = {
  '小鼠': [
    'C57BL/6J',
    'C57BL/6N',
    'BALB/c',
    'ICR',
    'CD-1',
    '昆明小鼠（KM）',
    'NOD/SCID'
  ],
  '大鼠': [
    'Sprague Dawley（SD）',
    'Wistar',
    'Wistar Han',
    'Fischer 344（F344）',
    'Brown Norway（BN）',
    'Lewis（LEW）'
  ],
  '猴': [
    '食蟹猴',
    '恒河猴'
  ],
  '犬': [
    '比格犬（Beagle）'
  ],
  '兔': [
    '新西兰白兔（New Zealand White）'
  ],
  '猪（小型猪）': [
    '哥廷根小型猪（Göttingen）',
    '巴马小型猪',
    '其他小型猪'
  ],
  '豚鼠': [
    'Hartley（哈特利）'
  ]
};

export type FormulationLevel1 = '受试物' | '溶媒' | '佐剂';

export type TestArticleCategory = '药品' | '医疗器械' | '化妆品' | '溶媒' | '空包LNP';

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

export interface FormulationLevel2Item {
  name: TestArticleCategory;
  children: string[];
}

export interface FormulationLevel1Item {
  name: FormulationLevel1;
  children: FormulationLevel2Item[];
}

export const FORMULATION_TREE_DATA: FormulationLevel1Item[] = [
  {
    name: '受试物',
    children: [
      {
        name: '药品',
        children: ['抗体', '细胞治疗产品', '基因治疗产品', '中药', '小分子化药']
      },
      {
        name: '医疗器械',
        children: []
      },
      {
        name: '化妆品',
        children: []
      }
    ]
  },
  {
    name: '溶媒',
    children: [
      {
        name: '溶媒',
        children: []
      }
    ]
  },
  {
    name: '佐剂',
    children: [
      {
        name: '空包LNP',
        children: []
      }
    ]
  }
];

export const TEST_ARTICLE_DATA: Record<string, string[]> = {
  '药品': ['抗体', '细胞治疗产品', '基因治疗产品', '中药', '小分子化药'],
  '医疗器械': [],
  '化妆品': [],
  '溶媒': [],
  '空包LNP': []
};

export type ProjectType = 
  | '神经毒性试验'
  | '局部刺激试验'
  | '生殖与发育毒性试验'
  | '致癌性试验'
  | '急性毒性试验'
  | '重复给药毒性试验';

export const ALL_PROJECT_TYPES: ProjectType[] = [
  '神经毒性试验',
  '局部刺激试验',
  '生殖与发育毒性试验',
  '致癌性试验',
  '急性毒性试验',
  '重复给药毒性试验'
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
  | '小鼠'
  | '大鼠'
  | '食蟹猴' 
  | '比格犬' 
  | '新西兰兔'
  | '豚鼠'
  | '小型猪'
  | '斑马鱼'
  | 'C57BL/6 小鼠' 
  | 'BALB/c 小鼠' 
  | 'SD 大鼠' 
  | 'Wistar 大鼠' 
  | '人源异种移植模型(PDX)' 
  | string;

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
  remarks?: string;
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
  experimentGroup: string; // 实验组别 (如 溶媒对照组、LNP组、低剂量组、高剂量组)
  testArticle: string; // 受试物名称
  formulation?: string; // 给药制剂展示名称 (如 溶媒、空包LNP、基因治疗产品，mRNA-LNP)
  formulationCategory?: string; // 给药制剂一级栏目: 受试物 | 溶媒 | 佐剂
  testArticleCategory?: TestArticleCategory; // 药品 | 医疗器械 | 化妆品 | 溶媒 | 空包LNP
  testArticleSubCategory?: TestArticleSubCategory; // 抗体 | 细胞治疗产品 等
  projectName?: string; // 研究类型: 重复给药毒性试验 | 急性毒性试验 | 致癌性试验 等
  pathologyDiagnosis: string; // 病理诊断
  system?: OrganSystem | string; // 消化系统、心血管系统等
  organ: string; // 具体脏器/腺体，如 肝、肾、甲状腺
  systemOrgans?: Array<{ system: string; organ: string }>; // 多个系统-脏器组合
  sliceType: SliceType;
  isLesion: boolean; // false = 正常组织, true = 病变组织
  lesionName: string;
  lesionSeverity?: string;
  lesionDistribution: string;
  species: AnimalSpecies;
  gender: GenderType;
  ageWeeks: number;
  ageDisplay?: string; // 年龄展示文案 (如 6–8周龄、7-9周龄、4–6月龄、2–4岁)
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
  projectName?: string; // 研究类型单选
  projectNames?: string[]; // 多选研究类型
  systems?: string[]; // 系统类型筛选 (12大系统)
  organs?: string[]; // 对应具体器官/组织
  formulationCategories?: string[]; // 给药制剂一级栏目: 受试物 | 溶媒 | 佐剂
  testArticleCategories?: string[]; // 给药制剂二级类别: 药品 | 医疗器械 | 化妆品 | 溶媒 | 空包LNP
  testArticleSubCategories?: string[]; // 给药制剂三级选项: 抗体 | 细胞治疗产品 | 基因治疗产品 | 中药 | 小分子化药
  testArticleCategory?: string; // 兼容单选
  testArticleSubCategory?: string; // 兼容单选
  sliceTypes?: SliceType[];
  isLesionFilter?: 'all' | 'normal' | 'lesion';
  species?: AnimalSpecies[];
  animalTypes?: string[]; // 动物种属 (如 小鼠, 大鼠, 食蟹猴, 比格犬, 人源异种移植模型(PDX), 斑马鱼)
  strains?: string[]; // 动物品系 (如 C57BL/6J, BALB/cAnN, Sprague-Dawley, Wistar等)
  genders?: GenderType[];
  genderOptions?: string[]; // 性别筛选: 雄性, 雌性
  ageRanges?: string[]; // 年龄筛选范围
  ageMin?: number;
  ageMax?: number;
  ageUnit?: 'week' | 'month' | 'year'; // 年龄自定义输入单位
  lesionSeverities?: string[]; // 病变程度分级: 轻微, 轻度, 中度, 重度, 严重
  lesionDistributions?: string[]; // 病灶分布: 单灶性, 多灶性
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
