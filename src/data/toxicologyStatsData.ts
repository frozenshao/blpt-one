// Toxicologic pathology dataset supporting research projects, background lesions, strain comparison, and project-specific dose-response lesions

export interface ResearchProjectOption {
  id: string;
  name: string;
  studyCode: string;
  species: string;
  duration: string;
  description: string;
  sampleCount: number;
  animalCount: number;
  positiveCount: number;
  positiveRate: string;
}

export const RESEARCH_PROJECTS: ResearchProjectOption[] = [
  {
    id: 'all',
    name: '全部',
    studyCode: '',
    species: '全部品系动物汇总 (SD大鼠/Wistar大鼠/C57BL小鼠/BALB/c等)',
    duration: '',
    description: '全平台GLP毒理病理历史切片数据库与阳性病变综合检出率分析',
    sampleCount: 800,
    animalCount: 260,
    positiveCount: 102,
    positiveRate: '12.8%'
  },
  {
    id: 'exp-2026001',
    name: '小鼠长毒研究（试验编号-2026001）',
    studyCode: '试验编号-2026001',
    species: 'C57BL/6J 小鼠',
    duration: '26周长期重复给药毒性试验 (伴4周恢复期)',
    description: '受试新药口服灌胃给药26周长期毒性及致癌性筛查病理学评价',
    sampleCount: 480,
    animalCount: 160,
    positiveCount: 58,
    positiveRate: '36.3%'
  },
  {
    id: 'exp-2026002',
    name: '重复给药毒性（试验编号-2026002）',
    studyCode: '试验编号-2026002',
    species: 'SD 大鼠 (Sprague-Dawley)',
    duration: '4周 (28天) 重复给药静脉注射毒性试验 (伴2周恢复期)',
    description: '候选化合物静脉给药脏器毒性反应、无毒性反应剂量(NOAEL)及可逆性病理评价',
    sampleCount: 320,
    animalCount: 100,
    positiveCount: 44,
    positiveRate: '44.0%'
  }
];

// 3. 背景性病变统计 (Background / Spontaneous Lesions HCD)
export interface BackgroundLesionItem {
  id: string;
  species: string;
  organ: string;
  lesionName: string;
  maleRate: number; // %
  maleCountStr: string; // e.g. "17/120"
  femaleRate: number; // %
  femaleCountStr: string; // e.g. "7/120"
  hcdRange: string; // e.g. "5.0% ~ 18.0%"
  clinicalSignificance?: string;
  remark: string;
}

export const BACKGROUND_LESIONS_DATA: BackgroundLesionItem[] = [
  {
    id: 'bg-1',
    species: 'SD 大鼠',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    maleRate: 14.2,
    maleCountStr: '17/120',
    femaleRate: 5.8,
    femaleCountStr: '7/120',
    hcdRange: '5.0% ~ 18.0%',
    clinicalSignificance: '自发性背景病变',
    remark: '啮齿类动物极常见自发背景病灶，库普弗细胞及单个核吞噬反应，通常无毒理学意义。'
  },
  {
    id: 'bg-2',
    species: 'SD 大鼠',
    organ: '肾脏',
    lesionName: '肾小管嗜碱性变',
    maleRate: 22.5,
    maleCountStr: '27/120',
    femaleRate: 11.7,
    femaleCountStr: '14/120',
    hcdRange: '10.0% ~ 25.0%',
    clinicalSignificance: '品系特异性高发',
    remark: '老龄雄性SD大鼠慢性进行性肾病(CPN)早期自发改变，雄性显著多于雌性。'
  },
  {
    id: 'bg-3',
    species: 'Wistar 大鼠',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    maleRate: 6.7,
    maleCountStr: '8/120',
    femaleRate: 3.3,
    femaleCountStr: '4/120',
    hcdRange: '2.0% ~ 9.0%',
    clinicalSignificance: '自发性背景病变',
    remark: 'Wistar大鼠肝脏背景性微肉芽肿发生率显著低于SD大鼠。'
  },
  {
    id: 'bg-4',
    species: 'Wistar 大鼠',
    organ: '心肌',
    lesionName: '心肌单个核细胞浸润',
    maleRate: 9.2,
    maleCountStr: '11/120',
    femaleRate: 4.2,
    femaleCountStr: '5/120',
    hcdRange: '3.0% ~ 12.0%',
    clinicalSignificance: '自发性背景病变',
    remark: '局灶性心肌单个核细胞浸润伴极微纤维修复，大鼠心肌常见自发性心肌病早期变化。'
  },
  {
    id: 'bg-5',
    species: 'C57BL/6 小鼠',
    organ: '肝脏',
    lesionName: '局灶性单个核细胞浸润',
    maleRate: 11.7,
    maleCountStr: '14/120',
    femaleRate: 9.2,
    femaleCountStr: '11/120',
    hcdRange: '6.0% ~ 15.0%',
    clinicalSignificance: '自发性背景病变',
    remark: 'C57BL小鼠肝小叶内零星散在小圆细胞浸润灶，生理常态无需定性为毒性损伤。'
  },
  {
    id: 'bg-6',
    species: 'C57BL/6 小鼠',
    organ: '肺脏',
    lesionName: '肺泡巨噬细胞聚集',
    maleRate: 8.3,
    maleCountStr: '10/120',
    femaleRate: 7.5,
    femaleCountStr: '9/120',
    hcdRange: '4.0% ~ 12.0%',
    clinicalSignificance: '环境与饲养应激',
    remark: '吸入性微粒清除引起的生理性肺泡腔巨噬细胞局限增生，无纤维化及间质损伤。'
  },
  {
    id: 'bg-7',
    species: 'BALB/c 小鼠',
    organ: '脾脏',
    lesionName: '髓外造血',
    maleRate: 18.3,
    maleCountStr: '22/120',
    femaleRate: 20.0,
    femaleCountStr: '24/120',
    hcdRange: '12.0% ~ 25.0%',
    clinicalSignificance: '生理衰老相关',
    remark: '啮齿类红系及巨核系生理性代偿，脾脏红髓红细胞前体集落。'
  },
  {
    id: 'bg-8',
    species: 'SD 大鼠',
    organ: '脑/垂体',
    lesionName: '垂体前叶局灶性囊肿',
    maleRate: 4.2,
    maleCountStr: '5/120',
    femaleRate: 7.5,
    femaleCountStr: '9/120',
    hcdRange: '2.0% ~ 10.0%',
    clinicalSignificance: '自发性背景病变',
    remark: '拉氏囊胚胎发育残余自发性微囊，多见于中老龄雌鼠。'
  }
];

// 4. 各类病变统计 (Project-specific Dose-Response Lesion Statistics)
export interface ProjectLesionStatItem {
  id: string;
  studyCode: string;
  studyTitle: string;
  cohort: string; // 剂量组 e.g. 溶媒对照组, 低剂量组, 中剂量组, 高剂量组
  gender: '雄性' | '雌性';
  organ: string;
  lesionName: string;
  totalAnimals: number;
  affectedAnimals: number;
  incidenceRate: number; // %
  severityDistribution: {
    grade1Minimal: number; // 极轻度 (1级)
    grade2Mild: number;    // 轻度 (2级)
    grade3Moderate: number;// 中度 (3级)
    grade4Marked: number;  // 重度 (4级)
  };
  dominantSeverity: string;
  pValueVsControl?: string; // 统计学显著性检验
  pathologyAssessment: string;
}

export const PROJECT_2026001_LESIONS: ProjectLesionStatItem[] = [
  {
    id: 'p1-1',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '溶媒对照组 (0 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 2,
    incidenceRate: 10.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: '-',
    pathologyAssessment: '本品系自然自发背景基线水平。'
  },
  {
    id: 'p1-2',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '溶媒对照组 (0 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 1,
    incidenceRate: 5.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: '-',
    pathologyAssessment: '本品系雌性偶发自发微肉芽肿基线。'
  },
  {
    id: 'p1-3',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '低剂量组 (50 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 3,
    incidenceRate: 15.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度至轻度 (Grade 1~2)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '发生率及病变程度与溶媒对照组及历史背景基线相当，属非给药相关的自发性背景病变。'
  },
  {
    id: 'p1-4',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '低剂量组 (50 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 1,
    incidenceRate: 5.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '散发单只动物局限性微肉芽肿，与药物暴露无量效关系。'
  },
  {
    id: 'p1-5',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '中剂量组 (150 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝细胞脂肪变性',
    totalAnimals: 20,
    affectedAnimals: 7,
    incidenceRate: 35.0,
    severityDistribution: { grade1Minimal: 3, grade2Mild: 4, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '轻度 (Grade 2)',
    pValueVsControl: 'P < 0.05 *',
    pathologyAssessment: '小叶中央区轻度小泡性脂滴积聚，呈现初步脂代谢适应性改变。'
  },
  {
    id: 'p1-6',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '中剂量组 (150 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝细胞脂肪变性',
    totalAnimals: 20,
    affectedAnimals: 4,
    incidenceRate: 20.0,
    severityDistribution: { grade1Minimal: 3, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度至轻度 (Grade 1~2)',
    pValueVsControl: 'P < 0.05 *',
    pathologyAssessment: '小叶中央区散在轻微脂滴蓄积，雌性敏感度略低于雄性。'
  },
  {
    id: 'p1-7',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '高剂量组 (450 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝细胞脂肪变性',
    totalAnimals: 20,
    affectedAnimals: 14,
    incidenceRate: 70.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 4, grade3Moderate: 7, grade4Marked: 2 },
    dominantSeverity: '中度至重度 (Grade 3~4)',
    pValueVsControl: 'P < 0.01 **',
    pathologyAssessment: '呈显著量效关系的弥漫大泡性脂肪变伴肝索结构受压，为明确的受试物脏器毒性反应。'
  },
  {
    id: 'p1-8',
    studyCode: '试验编号-2026001',
    studyTitle: '小鼠长毒研究（试验编号-2026001）',
    cohort: '高剂量组 (450 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝细胞脂肪变性',
    totalAnimals: 20,
    affectedAnimals: 10,
    incidenceRate: 50.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 5, grade3Moderate: 3, grade4Marked: 0 },
    dominantSeverity: '轻度至中度 (Grade 2~3)',
    pValueVsControl: 'P < 0.01 **',
    pathologyAssessment: '肝小叶弥漫性脂滴蓄积伴轻度气球样变，证实为给药剂量相关的脏器毒性改变。'
  }
];

export const PROJECT_2026002_LESIONS: ProjectLesionStatItem[] = [
  {
    id: 'p2-1',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '溶媒对照组 (0 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 3,
    incidenceRate: 15.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度至轻度 (Grade 1~2)',
    pValueVsControl: '-',
    pathologyAssessment: '阴性溶媒对照组自发背景基线。'
  },
  {
    id: 'p2-2',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '溶媒对照组 (0 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 1,
    incidenceRate: 5.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: '-',
    pathologyAssessment: '阴性溶媒对照组雌性自发背景基线。'
  },
  {
    id: 'p2-3',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '低剂量组 (25 mg/kg)',
    gender: '雄性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 2,
    incidenceRate: 10.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '与溶媒对照组一致，无剂量依赖性增高，确认为SD大鼠常见背景微肉芽肿。'
  },
  {
    id: 'p2-4',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '低剂量组 (25 mg/kg)',
    gender: '雌性',
    organ: '肝脏',
    lesionName: '肝脏小肉芽肿',
    totalAnimals: 20,
    affectedAnimals: 1,
    incidenceRate: 5.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '低剂量雌性散在微小炎细胞簇，属典型背景改变。'
  },
  {
    id: 'p2-5',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '中剂量组 (100 mg/kg)',
    gender: '雄性',
    organ: '肾脏',
    lesionName: '肾小管上皮变性',
    totalAnimals: 20,
    affectedAnimals: 5,
    incidenceRate: 25.0,
    severityDistribution: { grade1Minimal: 3, grade2Mild: 2, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度至轻度 (Grade 1~2)',
    pValueVsControl: 'P < 0.05 *',
    pathologyAssessment: '肾小管轻度水肿与浊肿，处于代偿可耐受范围。'
  },
  {
    id: 'p2-6',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '中剂量组 (100 mg/kg)',
    gender: '雌性',
    organ: '肾脏',
    lesionName: '肾小管上皮变性',
    totalAnimals: 20,
    affectedAnimals: 3,
    incidenceRate: 15.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1~2)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '散在轻度近端肾小管上皮浊肿。'
  },
  {
    id: 'p2-7',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '高剂量组 (300 mg/kg)',
    gender: '雄性',
    organ: '肾脏',
    lesionName: '肾小管变性坏死与蛋白管型',
    totalAnimals: 20,
    affectedAnimals: 12,
    incidenceRate: 60.0,
    severityDistribution: { grade1Minimal: 1, grade2Mild: 4, grade3Moderate: 5, grade4Marked: 2 },
    dominantSeverity: '中度至重度 (Grade 3~4)',
    pValueVsControl: 'P < 0.01 **',
    pathologyAssessment: '皮质及髓质交界部肾小管上皮脱落及强嗜酸性管型，肾脏为明确主要毒性脏器。'
  },
  {
    id: 'p2-8',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '高剂量组 (300 mg/kg)',
    gender: '雌性',
    organ: '肾脏',
    lesionName: '肾小管变性坏死与蛋白管型',
    totalAnimals: 20,
    affectedAnimals: 8,
    incidenceRate: 40.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 3, grade3Moderate: 3, grade4Marked: 0 },
    dominantSeverity: '轻度至中度 (Grade 2~3)',
    pValueVsControl: 'P < 0.01 **',
    pathologyAssessment: '肾小管上皮部分脱落与管型形成，病损严重度略轻于雄性。'
  },
  {
    id: 'p2-9',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '恢复期高剂量组 (300 mg/kg + 2W恢复)',
    gender: '雄性',
    organ: '肾脏',
    lesionName: '肾小管再生修复伴间质纤维化',
    totalAnimals: 10,
    affectedAnimals: 4,
    incidenceRate: 40.0,
    severityDistribution: { grade1Minimal: 3, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度至轻度 (Grade 1~2)',
    pValueVsControl: 'P < 0.05 *',
    pathologyAssessment: '停药2周后见显著上皮细胞核分裂与再生重构，急性坏死已大幅吸收逆转。'
  },
  {
    id: 'p2-10',
    studyCode: '试验编号-2026002',
    studyTitle: '重复给药毒性（试验编号-2026002）',
    cohort: '恢复期高剂量组 (300 mg/kg + 2W恢复)',
    gender: '雌性',
    organ: '肾脏',
    lesionName: '肾小管再生修复伴间质纤维化',
    totalAnimals: 10,
    affectedAnimals: 2,
    incidenceRate: 20.0,
    severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
    dominantSeverity: '极轻度 (Grade 1)',
    pValueVsControl: 'P > 0.05',
    pathologyAssessment: '上皮再生修复活跃，病理损伤基本消退。'
  }
];

// 5. 不同品系动物病变统计 (Cross-Strain Lesion Incidence Comparison)
export interface StrainComparisonItem {
  id: string;
  lesionName: string;
  organ: string;
  gender: '雄性' | '雌性';
  strainA: {
    name: string;
    total: number;
    affected: number;
    rate: number; // %
  };
  strainB: {
    name: string;
    total: number;
    affected: number;
    rate: number; // %
  };
  rateRatio: string; // e.g. "2.12x"
  pValue: string; // e.g. "P = 0.038 *"
  findingSummary: string;
}

export const STRAIN_COMPARISON_DATA: StrainComparisonItem[] = [
  {
    id: 'sc-1',
    lesionName: '肝脏小肉芽肿',
    organ: '肝脏',
    gender: '雄性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 17,
      rate: 14.2
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 8,
      rate: 6.7
    },
    rateRatio: '2.12x',
    pValue: 'P = 0.038 *',
    findingSummary: '雄性动物中，病变-肝脏小肉芽肿在SD大鼠的发生率（14.2%）显著高于Wistar大鼠（6.7%），提示SD大鼠对肝脏巨噬免疫反应背景易感性更高。'
  },
  {
    id: 'sc-1f',
    lesionName: '肝脏小肉芽肿',
    organ: '肝脏',
    gender: '雌性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 7,
      rate: 5.8
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 4,
      rate: 3.3
    },
    rateRatio: '1.76x',
    pValue: 'P = 0.358 (NS)',
    findingSummary: '雌性动物中，SD大鼠肝脏微肉芽肿发生率（5.8%）略高于Wistar大鼠（3.3%），整体发生率低于同品系雄性。'
  },
  {
    id: 'sc-2',
    lesionName: '肾小管嗜碱性变',
    organ: '肾脏',
    gender: '雄性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 27,
      rate: 22.5
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 13,
      rate: 10.8
    },
    rateRatio: '2.08x',
    pValue: 'P = 0.012 *',
    findingSummary: '雄性大鼠中，SD大鼠自发性进行性肾小管嗜碱性变发生率高达22.5%，显著高于Wistar大鼠(10.8%)，在毒理试验肾毒性判读时须结合对照组背景校正。'
  },
  {
    id: 'sc-2f',
    lesionName: '肾小管嗜碱性变',
    organ: '肾脏',
    gender: '雌性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 14,
      rate: 11.7
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 6,
      rate: 5.0
    },
    rateRatio: '2.34x',
    pValue: 'P = 0.048 *',
    findingSummary: '雌性大鼠中，SD大鼠肾小管嗜碱性变发生率为11.7%，高于Wistar大鼠(5.0%)。'
  },
  {
    id: 'sc-3',
    lesionName: '肝细胞脂肪变性',
    organ: '肝脏',
    gender: '雄性',
    strainA: {
      name: 'C57BL/6 小鼠',
      total: 120,
      affected: 34,
      rate: 28.3
    },
    strainB: {
      name: 'BALB/c 小鼠',
      total: 120,
      affected: 14,
      rate: 11.7
    },
    rateRatio: '2.42x',
    pValue: 'P = 0.001 **',
    findingSummary: '雄性小鼠中，C57BL/6小鼠对代谢及饲料诱导的肝脂肪蓄积高度敏感(发生率28.3%)，而BALB/c小鼠表现出较强的代谢抗性(11.7%)。'
  },
  {
    id: 'sc-3f',
    lesionName: '肝细胞脂肪变性',
    organ: '肝脏',
    gender: '雌性',
    strainA: {
      name: 'C57BL/6 小鼠',
      total: 120,
      affected: 22,
      rate: 18.3
    },
    strainB: {
      name: 'BALB/c 小鼠',
      total: 120,
      affected: 10,
      rate: 8.3
    },
    rateRatio: '2.20x',
    pValue: 'P = 0.019 *',
    findingSummary: '雌性小鼠中，C57BL/6小鼠肝细胞脂肪变性发生率(18.3%)明显高于BALB/c小鼠(8.3%)。'
  },
  {
    id: 'sc-4',
    lesionName: '间质炎性细胞浸润',
    organ: '肝脏',
    gender: '雄性',
    strainA: {
      name: 'C57BL/6 小鼠',
      total: 120,
      affected: 22,
      rate: 18.3
    },
    strainB: {
      name: 'BALB/c 小鼠',
      total: 120,
      affected: 11,
      rate: 9.2
    },
    rateRatio: '1.99x',
    pValue: 'P = 0.035 *',
    findingSummary: '雄性C57BL/6小鼠呈偏Th1优势炎症微环境，间质炎性细胞浸润发生率明显偏高。'
  },
  {
    id: 'sc-4f',
    lesionName: '间质炎性细胞浸润',
    organ: '肝脏',
    gender: '雌性',
    strainA: {
      name: 'C57BL/6 小鼠',
      total: 120,
      affected: 15,
      rate: 12.5
    },
    strainB: {
      name: 'BALB/c 小鼠',
      total: 120,
      affected: 8,
      rate: 6.7
    },
    rateRatio: '1.87x',
    pValue: 'P = 0.118 (NS)',
    findingSummary: '雌性C57BL/6小鼠间质炎性浸润发生率(12.5%)高于BALB/c小鼠(6.7%)。'
  },
  {
    id: 'sc-5',
    lesionName: '心肌单个核细胞浸润',
    organ: '心脏',
    gender: '雄性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 16,
      rate: 13.3
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 11,
      rate: 9.2
    },
    rateRatio: '1.45x',
    pValue: 'P = 0.302 (NS)',
    findingSummary: '雄性SD大鼠与Wistar大鼠的心肌自发性单个核细胞浸润发生率差异无统计学显著性，均属啮齿类常见背景自发改变。'
  },
  {
    id: 'sc-5f',
    lesionName: '心肌单个核细胞浸润',
    organ: '心脏',
    gender: '雌性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 8,
      rate: 6.7
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 5,
      rate: 4.2
    },
    rateRatio: '1.60x',
    pValue: 'P = 0.385 (NS)',
    findingSummary: '雌性大鼠心肌单个核细胞浸润发生率整体较低，品系间无显著差异。'
  },
  {
    id: 'sc-6m',
    lesionName: '垂体前叶局灶性增生/囊肿',
    organ: '垂体',
    gender: '雄性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 4,
      rate: 3.3
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 2,
      rate: 1.7
    },
    rateRatio: '1.94x',
    pValue: 'P = 0.408 (NS)',
    findingSummary: '雄性大鼠垂体前叶自发改变发生率极低，SD大鼠略高于Wistar大鼠。'
  },
  {
    id: 'sc-6',
    lesionName: '垂体前叶局灶性增生/囊肿',
    organ: '垂体',
    gender: '雌性',
    strainA: {
      name: 'SD 大鼠',
      total: 120,
      affected: 10,
      rate: 8.3
    },
    strainB: {
      name: 'Wistar 大鼠',
      total: 120,
      affected: 3,
      rate: 2.5
    },
    rateRatio: '3.32x',
    pValue: 'P = 0.046 *',
    findingSummary: '雌性动物中，SD大鼠随周龄增加垂体自发病变检出率(8.3%)高于Wistar大鼠(2.5%)。'
  }
];
