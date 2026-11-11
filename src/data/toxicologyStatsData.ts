// Toxicologic pathology dataset supporting research project tags, background lesions, strain comparison, longitudinal intake time analysis, and test article target organ vulnerability

export interface DatabaseSpeciesStat {
  species: string;
  count: number;
  percentage: number;
  color: string;
  iconName?: string;
  subType: string;
}

export interface DatabaseRepositoryStats {
  totalCases: number;
  totalAnimals: number;
  totalWsiSlides: number;
  updateDate: string;
  speciesBreakdown: DatabaseSpeciesStat[];
}

export const DATABASE_REPOSITORY_STATS: DatabaseRepositoryStats = {
  totalCases: 1280,
  totalAnimals: 430,
  totalWsiSlides: 1280,
  updateDate: '2026-10-29',
  speciesBreakdown: [
    { species: 'C57BL/6 小鼠', count: 420, percentage: 32.8, color: '#2563eb', subType: '近交系小鼠 / 基因修饰' },
    { species: 'SD 大鼠', count: 360, percentage: 28.1, color: '#0284c7', subType: '封闭群大鼠 / 经典长毒' },
    { species: 'Wistar 大鼠', count: 180, percentage: 14.1, color: '#059669', subType: '封闭群大鼠 / 药效与毒理' },
    { species: 'BALB/c 小鼠', count: 130, percentage: 10.2, color: '#10b981', subType: '近交系小鼠 / 免疫与抗体' },
    { species: '食蟹猴', count: 95, percentage: 7.4, color: '#f59e0b', subType: '非人灵长类 (NHP)' },
    { species: '比格犬', count: 65, percentage: 5.1, color: '#8b5cf6', subType: '大动物非啮齿类' },
    { species: '人源异种移植模型(PDX)', count: 20, percentage: 1.6, color: '#ec4899', subType: '重度免疫缺陷鼠荷瘤' },
    { species: '斑马鱼', count: 10, percentage: 0.8, color: '#06b6d4', subType: '水生模式生物毒性筛查' }
  ]
};

export interface ResearchProjectOption {
  id: string; // 'all' | '长期毒性试验' | '急性毒性试验' | '致癌性试验' | '生殖毒性试验' | '局部刺激试验' | '神经毒性试验' | '其他'
  name: string;
  category: string;
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
    category: '全库汇总',
    species: '全部实验品系动物汇总 (SD大鼠/Wistar大鼠/C57BL小鼠/食蟹猴/比格犬等)',
    duration: '全周期毒理学试验历史数据库',
    description: '全平台GLP毒理病理历史数字切片库与靶器官病变综合检出率分析',
    sampleCount: 1280,
    animalCount: 430,
    positiveCount: 382,
    positiveRate: '29.8%'
  },
  {
    id: '长期毒性试验',
    name: '长期毒性试验',
    category: '重复给药长毒',
    species: 'C57BL/6 小鼠, SD 大鼠, 食蟹猴',
    duration: '13周 / 26周 / 39周 重复给药试验 (含恢复期)',
    description: '评估受试物长期蓄积性脏器毒性反应、靶器官受累及停药可逆性病理评价',
    sampleCount: 420,
    animalCount: 140,
    positiveCount: 152,
    positiveRate: '36.2%'
  },
  {
    id: '急性毒性试验',
    name: '急性毒性试验',
    category: '单次超剂量',
    species: 'ICR/KM 小鼠, SD 大鼠',
    duration: '单次或24h内多次给药 (14天观察期)',
    description: '测定最大耐受剂量(MTD)及急性靶器官急性坏死、水肿、淤血病理变化',
    sampleCount: 210,
    animalCount: 70,
    positiveCount: 58,
    positiveRate: '27.6%'
  },
  {
    id: '致癌性试验',
    name: '致癌性试验',
    category: '终生给药致癌',
    species: 'C57BL/6 小鼠, rasH2 转基因小鼠, Wistar 大鼠',
    duration: '26周(转基因) 至 104周 (2年终生试验)',
    description: '评估药物长期暴露下良恶性肿瘤形成倾向及增生前病变演变规律',
    sampleCount: 260,
    animalCount: 85,
    positiveCount: 96,
    positiveRate: '36.9%'
  },
  {
    id: '生殖毒性试验',
    name: '生殖毒性试验',
    category: '三段生殖毒理',
    species: 'SD 大鼠, 新西兰白兔',
    duration: 'I段生育力、II段致畸性及III段围产期毒性',
    description: '性腺组织发育、胚胎骨骼与内脏畸形筛查、胎盘屏障病理学检测',
    sampleCount: 150,
    animalCount: 50,
    positiveCount: 32,
    positiveRate: '21.3%'
  },
  {
    id: '局部刺激试验',
    name: '局部刺激试验',
    category: '局部反应评价',
    species: '新西兰兔, 豚鼠, SD 大鼠',
    duration: '单次或连续给药 7~14 天',
    description: '注射部位组织刺激性、皮肤致敏性、眼刺激性及血管内皮损伤病理学评分',
    sampleCount: 90,
    animalCount: 35,
    positiveCount: 18,
    positiveRate: '20.0%'
  },
  {
    id: '神经毒性试验',
    name: '神经毒性试验',
    category: '神经病理评价',
    species: 'SD 大鼠, C57BL/6 小鼠',
    duration: '行为学毒性伴 28 天原位固定脑脊髓切片',
    description: '大脑皮层、海马、脑干、脊髓前角及坐骨神经轴突髓鞘脱失与空泡病理检测',
    sampleCount: 80,
    animalCount: 30,
    positiveCount: 16,
    positiveRate: '20.0%'
  },
  {
    id: '其他',
    name: '其他',
    category: '特殊专题研究',
    species: '比格犬, 食蟹猴, 斑马鱼, 人源化PDX',
    duration: '免疫毒性、光毒性、心血管安全药理等专题',
    description: '针对特殊给药系统、生物相容性及探索性毒理靶点专项切片评估',
    sampleCount: 70,
    animalCount: 20,
    positiveCount: 10,
    positiveRate: '14.3%'
  }
];

// Project-specific lesion statistics for each project type
export interface ProjectLesionStatItem {
  id: string;
  projectTag: string;
  cohort: string;
  gender: '雄性' | '雌性';
  organ: string;
  lesionName: string;
  totalAnimals: number;
  affectedAnimals: number;
  incidenceRate: number;
  severityDistribution: {
    grade1Minimal: number;
    grade2Mild: number;
    grade3Moderate: number;
    grade4Marked: number;
  };
  pathologyAssessment: string;
}

export const PROJECT_TAG_LESIONS_DATA: Record<string, ProjectLesionStatItem[]> = {
  '长期毒性试验': [
    // 1. 肝细胞脂肪变性 (默认第一项，呈明显剂量依赖递增关系)
    {
      id: 'lt-fat-1',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组极个别散在微泡脂滴，属正常生理波动范围。'
    },
    {
      id: 'lt-fat-2',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组雌性偶见轻微脂滴沉积，无毒理学意义。'
    },
    {
      id: 'lt-fat-3',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '低剂量组中央静脉周围少量微泡脂滴蓄积。'
    },
    {
      id: 'lt-fat-4',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '低剂量组雌性微量脂肪小滴，未见炎细胞聚集。'
    },
    {
      id: 'lt-fat-5',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 7,
      incidenceRate: 35.0,
      severityDistribution: { grade1Minimal: 3, grade2Mild: 3, grade3Moderate: 1, grade4Marked: 0 },
      pathologyAssessment: '中剂量呈现剂量相关的小泡性脂肪蓄积，提示脂质代谢负担增加。'
    },
    {
      id: 'lt-fat-6',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 5,
      incidenceRate: 25.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 2, grade3Moderate: 1, grade4Marked: 0 },
      pathologyAssessment: '轻度脂肪变性，停药恢复期组可见明显吸收改善。'
    },
    {
      id: 'lt-fat-7',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 15,
      incidenceRate: 75.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 4, grade3Moderate: 8, grade4Marked: 2 },
      pathologyAssessment: '弥漫性混合型脂肪变性伴肝索挤压，为明确的给药蓄积毒性靶器官改变。'
    },
    {
      id: 'lt-fat-8',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝细胞脂肪变性',
      totalAnimals: 20,
      affectedAnimals: 11,
      incidenceRate: 55.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 5, grade3Moderate: 4, grade4Marked: 0 },
      pathologyAssessment: '广泛小叶性脂滴蓄积，雌性受累程度略轻于雄性。'
    },

    // 2. 肝脏小肉芽肿 (自发性背景病变，各剂量组发生率相近且轻微)
    {
      id: 'lt-grn-1',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组偶发性微肉芽肿，属自发性背景改变。'
    },
    {
      id: 'lt-grn-2',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组雌性单发微小肉芽肿，无毒理学意义。'
    },
    {
      id: 'lt-grn-3',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '低剂量组偶见自发性单核巨噬细胞微小聚集灶。'
    },
    {
      id: 'lt-grn-4',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '散发微小肉芽肿，无剂量依赖性。'
    },
    {
      id: 'lt-grn-5',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '微小炎性肉芽结节，与对照组水平无统计学显著差异。'
    },
    {
      id: 'lt-grn-6',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '属啮齿类常规组织学自发背景改变。'
    },
    {
      id: 'lt-grn-7',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 2, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '高剂量组肉芽结节略增，但整体发生率与历史背景吻合。'
    },
    {
      id: 'lt-grn-8',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '肝脏小肉芽肿',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '散发肉芽肿伴少量枯否细胞增生活化。'
    },

    // 3. 局灶性坏死伴炎细胞浸润
    {
      id: 'lt-nec-1',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 0,
      incidenceRate: 0.0,
      severityDistribution: { grade1Minimal: 0, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组未见局灶坏死灶。'
    },
    {
      id: 'lt-nec-2',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 0,
      incidenceRate: 0.0,
      severityDistribution: { grade1Minimal: 0, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组雌性未见局灶坏死灶。'
    },
    {
      id: 'lt-nec-3',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '偶见单个点状微坏死，单核细胞聚集。'
    },
    {
      id: 'lt-nec-4',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '单个微坏死灶。'
    },
    {
      id: 'lt-nec-5',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 4,
      incidenceRate: 20.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 2, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '多发灶性凝固性坏死伴中性粒细胞及淋巴细胞浸润。'
    },
    {
      id: 'lt-nec-6',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '点状坏死伴小叶内炎性反应。'
    },
    {
      id: 'lt-nec-7',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雄性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 9,
      incidenceRate: 45.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 3, grade3Moderate: 4, grade4Marked: 1 },
      pathologyAssessment: '局灶性及融合性肝实质坏死，提示给药毒性损伤。'
    },
    {
      id: 'lt-nec-8',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雌性',
      organ: '肝脏',
      lesionName: '局灶性坏死伴炎细胞浸润',
      totalAnimals: 20,
      affectedAnimals: 7,
      incidenceRate: 35.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 3, grade3Moderate: 2, grade4Marked: 0 },
      pathologyAssessment: '中重度灶性坏死灶伴窦周纤维母细胞反应。'
    },

    // 4. 肾小管嗜碱性变
    {
      id: 'lt-bas-1',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组散在单个嗜碱性再生小管，属啮齿类背景变性。'
    },
    {
      id: 'lt-bas-2',
      projectTag: '长期毒性试验',
      cohort: '对照组 (0 mg/kg)',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 0,
      incidenceRate: 0.0,
      severityDistribution: { grade1Minimal: 0, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '对照组雌性未见明显小管嗜碱性变。'
    },
    {
      id: 'lt-bas-3',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 2,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '偶见小管上皮胞质嗜碱增深。'
    },
    {
      id: 'lt-bas-4',
      projectTag: '长期毒性试验',
      cohort: '低剂量组 (50 mg/kg)',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 1,
      incidenceRate: 5.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '微灶性小管基底膜轻微增厚伴嗜碱性。'
    },
    {
      id: 'lt-bas-5',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 5,
      incidenceRate: 25.0,
      severityDistribution: { grade1Minimal: 3, grade2Mild: 2, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '皮质远曲及近曲小管灶性再生嗜碱改变。'
    },
    {
      id: 'lt-bas-6',
      projectTag: '长期毒性试验',
      cohort: '中剂量组 (150 mg/kg)',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 3,
      incidenceRate: 15.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '小管上皮修复性嗜碱反应。'
    },
    {
      id: 'lt-bas-7',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 11,
      incidenceRate: 55.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 4, grade3Moderate: 4, grade4Marked: 1 },
      pathologyAssessment: '肾小管上皮广泛损伤后代偿性再生嗜碱化，基底膜多发褶皱。'
    },
    {
      id: 'lt-bas-8',
      projectTag: '长期毒性试验',
      cohort: '高剂量组 (450 mg/kg)',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾小管嗜碱性变',
      totalAnimals: 20,
      affectedAnimals: 8,
      incidenceRate: 40.0,
      severityDistribution: { grade1Minimal: 3, grade2Mild: 3, grade3Moderate: 2, grade4Marked: 0 },
      pathologyAssessment: '多灶小管细胞核增大嗜碱，符合排泄性肾负荷毒性表现。'
    }
  ],
  '急性毒性试验': [
    {
      id: 'at-1',
      projectTag: '急性毒性试验',
      cohort: '溶媒对照组',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾间质血管充血',
      totalAnimals: 15,
      affectedAnimals: 1,
      incidenceRate: 6.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '灌注取材生理性轻度充血。'
    },
    {
      id: 'at-2',
      projectTag: '急性毒性试验',
      cohort: '溶媒对照组',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾间质血管充血',
      totalAnimals: 15,
      affectedAnimals: 1,
      incidenceRate: 6.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '生理性轻度微血管扩张。'
    },
    {
      id: 'at-3',
      projectTag: '急性毒性试验',
      cohort: '中剂量组 (1000 mg/kg)',
      gender: '雄性',
      organ: '胃',
      lesionName: '胃粘膜充血与点状糜烂',
      totalAnimals: 15,
      affectedAnimals: 6,
      incidenceRate: 40.0,
      severityDistribution: { grade1Minimal: 3, grade2Mild: 2, grade3Moderate: 1, grade4Marked: 0 },
      pathologyAssessment: '单次高浓度口服对胃上皮物理化学刺激引起表层脱落。'
    },
    {
      id: 'at-4',
      projectTag: '急性毒性试验',
      cohort: '中剂量组 (1000 mg/kg)',
      gender: '雌性',
      organ: '胃',
      lesionName: '胃粘膜充血与点状糜烂',
      totalAnimals: 15,
      affectedAnimals: 4,
      incidenceRate: 26.7,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 2, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '浅表腺管充血伴局部粘膜下水肿。'
    },
    {
      id: 'at-5',
      projectTag: '急性毒性试验',
      cohort: '极量极限组 (2000 mg/kg)',
      gender: '雄性',
      organ: '肾脏',
      lesionName: '肾近曲小管急性浊肿坏死',
      totalAnimals: 15,
      affectedAnimals: 10,
      incidenceRate: 66.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 3, grade3Moderate: 5, grade4Marked: 1 },
      pathologyAssessment: '高浓度排泄导致肾小管上皮急性凝固坏死及刷状缘脱落。'
    },
    {
      id: 'at-6',
      projectTag: '急性毒性试验',
      cohort: '极量极限组 (2000 mg/kg)',
      gender: '雌性',
      organ: '肾脏',
      lesionName: '肾近曲小管急性浊肿坏死',
      totalAnimals: 15,
      affectedAnimals: 8,
      incidenceRate: 53.3,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 3, grade3Moderate: 3, grade4Marked: 0 },
      pathologyAssessment: '急性排泄负担引发小管刷状缘广泛脱落及管型堵塞。'
    }
  ],
  '致癌性试验': [
    {
      id: 'ca-1',
      projectTag: '致癌性试验',
      cohort: '阴性对照组',
      gender: '雄性',
      organ: '肺',
      lesionName: '细支气管上皮增生',
      totalAnimals: 25,
      affectedAnimals: 2,
      incidenceRate: 8.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '老龄小鼠自然自发增生背景。'
    },
    {
      id: 'ca-2',
      projectTag: '致癌性试验',
      cohort: '阴性对照组',
      gender: '雌性',
      organ: '肺',
      lesionName: '细支气管上皮增生',
      totalAnimals: 25,
      affectedAnimals: 1,
      incidenceRate: 4.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '老龄小鼠呼吸道自发性局灶上皮增厚。'
    },
    {
      id: 'ca-3',
      projectTag: '致癌性试验',
      cohort: '高剂量终生组',
      gender: '雄性',
      organ: '肺',
      lesionName: '肺腺瘤/异型腺瘤样增生(AAH)',
      totalAnimals: 25,
      affectedAnimals: 8,
      incidenceRate: 32.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 3, grade3Moderate: 3, grade4Marked: 1 },
      pathologyAssessment: '肺泡上皮细胞呈乳头状或管状异型增生，界限清楚，未见浸润性生长。'
    },
    {
      id: 'ca-4',
      projectTag: '致癌性试验',
      cohort: '高剂量终生组',
      gender: '雌性',
      organ: '肺',
      lesionName: '肺腺瘤/异型腺瘤样增生(AAH)',
      totalAnimals: 25,
      affectedAnimals: 6,
      incidenceRate: 24.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 2, grade3Moderate: 2, grade4Marked: 0 },
      pathologyAssessment: '多灶性细支气管肺泡上皮异型增生灶。'
    }
  ],
  '生殖毒性试验': [
    {
      id: 'rp-1',
      projectTag: '生殖毒性试验',
      cohort: '溶媒对照组',
      gender: '雄性',
      organ: '睾丸',
      lesionName: '生精小管轻度生精阻滞',
      totalAnimals: 15,
      affectedAnimals: 1,
      incidenceRate: 6.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '偶见个别生精小管精子细胞成熟延迟，属生理允许范围。'
    },
    {
      id: 'rp-2',
      projectTag: '生殖毒性试验',
      cohort: '溶媒对照组',
      gender: '雌性',
      organ: '卵巢',
      lesionName: '卵泡闭锁微囊肿',
      totalAnimals: 15,
      affectedAnimals: 1,
      incidenceRate: 6.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '正常发情周期黄体与闭锁卵泡生理遗留。'
    },
    {
      id: 'rp-3',
      projectTag: '生殖毒性试验',
      cohort: '给药高剂量组',
      gender: '雄性',
      organ: '睾丸',
      lesionName: '曲细精管生精上皮脱落变性',
      totalAnimals: 15,
      affectedAnimals: 7,
      incidenceRate: 46.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 2, grade3Moderate: 3, grade4Marked: 1 },
      pathologyAssessment: '高剂量受试物跨血睾屏障损害支持细胞，导致成熟精子减退。'
    },
    {
      id: 'rp-4',
      projectTag: '生殖毒性试验',
      cohort: '给药高剂量组',
      gender: '雌性',
      organ: '子宫',
      lesionName: '子宫内膜上皮变薄伴间质水肿',
      totalAnimals: 15,
      affectedAnimals: 5,
      incidenceRate: 33.3,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 2, grade3Moderate: 1, grade4Marked: 0 },
      pathologyAssessment: '雌激素反馈受阻引起的子宫内膜发育迟缓。'
    }
  ],
  '局部刺激试验': [
    {
      id: 'st-1',
      projectTag: '局部刺激试验',
      cohort: '生理盐水对照侧',
      gender: '雄性',
      organ: '皮肤/肌肉',
      lesionName: '针道周围微小充血',
      totalAnimals: 12,
      affectedAnimals: 1,
      incidenceRate: 8.3,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '注射创伤机械性微小充血。'
    },
    {
      id: 'st-2',
      projectTag: '局部刺激试验',
      cohort: '受试制剂注射侧',
      gender: '雄性',
      organ: '皮肤/肌肉',
      lesionName: '肌纤维水肿变性伴中性粒细胞浸润',
      totalAnimals: 12,
      affectedAnimals: 5,
      incidenceRate: 41.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 2, grade3Moderate: 2, grade4Marked: 0 },
      pathologyAssessment: '局部制剂辅料刺激引发的急性无菌性炎性浸润，未见骨骼肌广泛坏死。'
    }
  ],
  '神经毒性试验': [
    {
      id: 'nt-1',
      projectTag: '神经毒性试验',
      cohort: '对照组',
      gender: '雄性',
      organ: '大脑',
      lesionName: '皮层暗神经元 (人为伪影)',
      totalAnimals: 15,
      affectedAnimals: 1,
      incidenceRate: 6.7,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '取材轻微牵拉导致的局灶暗神经元人为改变。'
    },
    {
      id: 'nt-2',
      projectTag: '神经毒性试验',
      cohort: '神经毒性给药组',
      gender: '雄性',
      organ: '坐骨神经',
      lesionName: '轴突肿胀伴髓鞘空泡样变',
      totalAnimals: 15,
      affectedAnimals: 5,
      incidenceRate: 33.3,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 2, grade3Moderate: 2, grade4Marked: 0 },
      pathologyAssessment: '周围神经轴突纤维轻-中度肿胀，有髓纤维髓鞘散在裂解。'
    }
  ],
  '其他': [
    {
      id: 'ot-1',
      projectTag: '其他',
      cohort: '对照组',
      gender: '雄性',
      organ: '脾脏',
      lesionName: '红髓生理性含铁血黄素沉着',
      totalAnimals: 10,
      affectedAnimals: 1,
      incidenceRate: 10.0,
      severityDistribution: { grade1Minimal: 1, grade2Mild: 0, grade3Moderate: 0, grade4Marked: 0 },
      pathologyAssessment: '衰老红细胞正常代谢生理色素沉积。'
    },
    {
      id: 'ot-2',
      projectTag: '其他',
      cohort: '免疫反应组',
      gender: '雄性',
      organ: '脾脏',
      lesionName: '白髓淋巴滤泡反应性增生',
      totalAnimals: 10,
      affectedAnimals: 4,
      incidenceRate: 40.0,
      severityDistribution: { grade1Minimal: 2, grade2Mild: 1, grade3Moderate: 1, grade4Marked: 0 },
      pathologyAssessment: '生发中心明显扩大，属于大分子抗原刺激引起的体液免疫反应性改变。'
    }
  ]
};

// 7. 收录时间分析 (Database Longitudinal Ingestion Analysis)
export interface IntakeTimePeriodData {
  periodLabel: string; // '三年内 (2024-2026)' | '五年内 (2022-2026)' | '全部历史 (近10年)'
  totalIngested: number;
  averageMonthly: number;
  wsiCoverageRate: string;
  yearlyTrend: Array<{
    year: string;
    totalCount: number;
    normalCount: number;
    lesionCount: number;
    positiveRate: number;
    mouseCount: number;
    ratCount: number;
    otherSpeciesCount: number;
  }>;
  milestoneEvents: Array<{
    date: string;
    title: string;
    description: string;
  }>;
}

export const INTAKE_TIME_DATA: Record<string, IntakeTimePeriodData> = {
  'three_years': {
    periodLabel: '三年内 (2024 - 2026)',
    totalIngested: 860,
    averageMonthly: 25.3,
    wsiCoverageRate: '98.5%',
    yearlyTrend: [
      { year: '2024年', totalCount: 220, normalCount: 160, lesionCount: 60, positiveRate: 27.3, mouseCount: 105, ratCount: 85, otherSpeciesCount: 30 },
      { year: '2025年', totalCount: 360, normalCount: 250, lesionCount: 110, positiveRate: 30.6, mouseCount: 160, ratCount: 140, otherSpeciesCount: 60 },
      { year: '2026年 (至今)', totalCount: 280, normalCount: 190, lesionCount: 90, positiveRate: 32.1, mouseCount: 135, ratCount: 105, otherSpeciesCount: 40 }
    ],
    milestoneEvents: [
      { date: '2024-03', title: '数字病理 WSI 全切片扫描标准实施', description: '全面推行 .ndpi 和 .svs 40X 高分辨率数字化入库' },
      { date: '2025-06', title: 'AI 二分类预审模型 patho-v2.1 上线', description: '实现病变组织与正常组织自动化初筛与Grad-CAM空间定位' },
      { date: '2026-02', title: '全系统9大脏器解剖规范与历史对照库打通', description: '建立啮齿类自发背景病变与受试物靶器官关联标准库' }
    ]
  },
  'five_years': {
    periodLabel: '五年内 (2022 - 2026)',
    totalIngested: 1120,
    averageMonthly: 19.4,
    wsiCoverageRate: '92.4%',
    yearlyTrend: [
      { year: '2022年', totalCount: 110, normalCount: 88, lesionCount: 22, positiveRate: 20.0, mouseCount: 50, ratCount: 45, otherSpeciesCount: 15 },
      { year: '2023年', totalCount: 150, normalCount: 115, lesionCount: 35, positiveRate: 23.3, mouseCount: 70, ratCount: 60, otherSpeciesCount: 20 },
      { year: '2024年', totalCount: 220, normalCount: 160, lesionCount: 60, positiveRate: 27.3, mouseCount: 105, ratCount: 85, otherSpeciesCount: 30 },
      { year: '2025年', totalCount: 360, normalCount: 250, lesionCount: 110, positiveRate: 30.6, mouseCount: 160, ratCount: 140, otherSpeciesCount: 60 },
      { year: '2026年 (至今)', totalCount: 280, normalCount: 190, lesionCount: 90, positiveRate: 32.1, mouseCount: 135, ratCount: 105, otherSpeciesCount: 40 }
    ],
    milestoneEvents: [
      { date: '2022-08', title: 'GLP 毒理病理档案数字系统立项', description: '首次建立电子化切片登记与组织取材管理机制' },
      { date: '2023-11', title: '引入 Aperio CS2 / 滨松 NanoZoomer 扫描仪', description: '启动历史石蜡切片向数字切片库全面回溯转录' },
      { date: '2024-03', title: '数字病理 WSI 全切片扫描标准实施', description: '全面推行 .ndpi 和 .svs 40X 高分辨率数字化入库' },
      { date: '2025-06', title: 'AI 二分类预审模型 patho-v2.1 上线', description: '实现病变组织与正常组织自动化初筛与Grad-CAM空间定位' }
    ]
  },
  'all_time': {
    periodLabel: '全部历史 (近10年, 2017 - 2026)',
    totalIngested: 1280,
    averageMonthly: 11.2,
    wsiCoverageRate: '86.0%',
    yearlyTrend: [
      { year: '2017-2020年', totalCount: 80, normalCount: 68, lesionCount: 12, positiveRate: 15.0, mouseCount: 40, ratCount: 35, otherSpeciesCount: 5 },
      { year: '2021年', totalCount: 80, normalCount: 65, lesionCount: 15, positiveRate: 18.8, mouseCount: 40, ratCount: 35, otherSpeciesCount: 5 },
      { year: '2022年', totalCount: 110, normalCount: 88, lesionCount: 22, positiveRate: 20.0, mouseCount: 50, ratCount: 45, otherSpeciesCount: 15 },
      { year: '2023年', totalCount: 150, normalCount: 115, lesionCount: 35, positiveRate: 23.3, mouseCount: 70, ratCount: 60, otherSpeciesCount: 20 },
      { year: '2024年', totalCount: 220, normalCount: 160, lesionCount: 60, positiveRate: 27.3, mouseCount: 105, ratCount: 85, otherSpeciesCount: 30 },
      { year: '2025年', totalCount: 360, normalCount: 250, lesionCount: 110, positiveRate: 30.6, mouseCount: 160, ratCount: 140, otherSpeciesCount: 60 },
      { year: '2026年 (至今)', totalCount: 280, normalCount: 190, lesionCount: 90, positiveRate: 32.1, mouseCount: 135, ratCount: 105, otherSpeciesCount: 40 }
    ],
    milestoneEvents: [
      { date: '2017-05', title: '国家GLP实验室病理学数据库初始化', description: '第一批SD大鼠及比格犬长期毒性切片建档入库' },
      { date: '2023-11', title: '数字病理工程全面铺开', description: '建立全自动化组织病理信息云端检索网络' },
      { date: '2026-10', title: '数字切片总例数突破 1,280 例', description: '涵盖9大系统、8种模式生物实验动物与全受试物谱系' }
    ]
  }
};

// Legacy target organ interfaces
export interface TargetOrganStat {
  organ: string;
  system: string;
  incidenceRate: number; // %
  caseCount: number;
  predominantLesions: string;
  severityGrade: '轻度' | '轻至中度' | '中度' | '中至重度';
}

export interface TestArticleTargetAnalysis {
  category: '药品' | '医疗器械' | '化妆品';
  description: string;
  sampleCount: number;
  animalCount: number;
  subCategories: Array<{
    name: string;
    sampleCount: number;
    topOrgan: string;
  }>;
  targetOrgans: TargetOrganStat[];
  toxicityMechanismSummary: string;
}


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
    organ: '肾脏',
    lesionName: '肾小管嗜碱性变',
    maleRate: 5.0,
    maleCountStr: '6/120',
    femaleRate: 3.3,
    femaleCountStr: '4/120',
    hcdRange: '2.0% ~ 8.0%',
    clinicalSignificance: '品系偶发背景',
    remark: 'BALB/c小鼠肾脏自发性小管嗜碱性病变发生率远低于SD大鼠。'
  },
  {
    id: 'bg-8',
    species: 'BALB/c 小鼠',
    organ: '脑/垂体',
    lesionName: '垂体前叶局灶性囊肿',
    maleRate: 5.8,
    maleCountStr: '7/120',
    femaleRate: 10.0,
    femaleCountStr: '12/120',
    hcdRange: '3.0% ~ 12.0%',
    clinicalSignificance: '胚胎发育生理遗迹',
    remark: 'Rathke囊残余扩展形成的局灶上皮性微囊，雌性小鼠检出率略高。'
  }
];

// 4. 不同品系动物病变统计 (Cross-Strain Comparison Data)
export interface StrainComparisonItem {
  id: string;
  lesionName: string;
  organ: string;
  gender: '雄性' | '雌性';
  strainA: {
    name: string;
    affected: number;
    total: number;
    rate: number; // %
  };
  strainB: {
    name: string;
    affected: number;
    total: number;
    rate: number; // %
  };
  rateRatio: string;
  pValueText: string;
  remark: string;
}

export const STRAIN_COMPARISON_DATA: StrainComparisonItem[] = [
  {
    id: 'sc-1',
    lesionName: '肝脏小肉芽肿',
    organ: '肝脏',
    gender: '雄性',
    strainA: { name: 'SD 大鼠', affected: 17, total: 120, rate: 14.2 },
    strainB: { name: 'Wistar 大鼠', affected: 8, total: 120, rate: 6.7 },
    rateRatio: '2.12x',
    pValueText: 'P = 0.048 *',
    remark: '雄性SD大鼠肝脏背景性微肉芽肿发生率显著高于同龄Wistar大鼠。'
  },
  {
    id: 'sc-2',
    lesionName: '肝脏小肉芽肿',
    organ: '肝脏',
    gender: '雌性',
    strainA: { name: 'SD 大鼠', affected: 7, total: 120, rate: 5.8 },
    strainB: { name: 'Wistar 大鼠', affected: 4, total: 120, rate: 3.3 },
    rateRatio: '1.76x',
    pValueText: 'P = 0.352 (NS)',
    remark: '雌性大鼠两品系间微肉芽肿发生率差异不显著。'
  },
  {
    id: 'sc-3',
    lesionName: '肾小管嗜碱性变',
    organ: '肾脏',
    gender: '雄性',
    strainA: { name: 'SD 大鼠', affected: 27, total: 120, rate: 22.5 },
    strainB: { name: 'Wistar 大鼠', affected: 11, total: 120, rate: 9.2 },
    rateRatio: '2.45x',
    pValueText: 'P = 0.004 **',
    remark: 'SD大鼠雄性对慢性进行性肾病早期小管嗜碱性病变具极高遗传自发易感性。'
  },
  {
    id: 'sc-4',
    lesionName: '肾小管嗜碱性变',
    organ: '肾脏',
    gender: '雌性',
    strainA: { name: 'SD 大鼠', affected: 14, total: 120, rate: 11.7 },
    strainB: { name: 'Wistar 大鼠', affected: 5, total: 120, rate: 4.2 },
    rateRatio: '2.79x',
    pValueText: 'P = 0.029 *',
    remark: '雌性大鼠肾小管嗜碱性变整体低于雄性，但SD大鼠仍高于Wistar大鼠。'
  },
  {
    id: 'sc-5',
    lesionName: '心肌单个核细胞浸润',
    organ: '心肌',
    gender: '雄性',
    strainA: { name: 'SD 大鼠', affected: 18, total: 120, rate: 15.0 },
    strainB: { name: 'Wistar 大鼠', affected: 11, total: 120, rate: 9.2 },
    rateRatio: '1.63x',
    pValueText: 'P = 0.165 (NS)',
    remark: '自发性心肌病早期单个核浸润在雄性SD大鼠略多于Wistar大鼠。'
  },
  {
    id: 'sc-6',
    lesionName: '心肌单个核细胞浸润',
    organ: '心肌',
    gender: '雌性',
    strainA: { name: 'SD 大鼠', affected: 9, total: 120, rate: 7.5 },
    strainB: { name: 'Wistar 大鼠', affected: 5, total: 120, rate: 4.2 },
    rateRatio: '1.79x',
    pValueText: 'P = 0.271 (NS)',
    remark: '雌性心肌炎性细胞散在浸润两品系均处自发低水平。'
  },
  {
    id: 'sc-7',
    lesionName: '肝细胞脂肪变性',
    organ: '肝脏',
    gender: '雄性',
    strainA: { name: 'C57BL/6 小鼠', affected: 15, total: 120, rate: 12.5 },
    strainB: { name: 'BALB/c 小鼠', affected: 6, total: 120, rate: 5.0 },
    rateRatio: '2.50x',
    pValueText: 'P = 0.038 *',
    remark: '雄性C57BL小鼠基础脂质代谢活跃，自发肝脂肪变检出率高于BALB/c小鼠。'
  },
  {
    id: 'sc-8',
    lesionName: '肝细胞脂肪变性',
    organ: '肝脏',
    gender: '雌性',
    strainA: { name: 'C57BL/6 小鼠', affected: 8, total: 120, rate: 6.7 },
    strainB: { name: 'BALB/c 小鼠', affected: 4, total: 120, rate: 3.3 },
    rateRatio: '2.03x',
    pValueText: 'P = 0.231 (NS)',
    remark: '雌性小鼠两品系肝细胞轻度脂滴蓄积未见统计学显著差异。'
  }
];

// ==========================================
// 7. 收录时间分析数据 (Ingestion Time Analysis)
// ==========================================
export type IngestionTimeRange = 'threeYears' | 'fiveYears' | 'oneYear' | 'all';

export interface TimeTrendDataPoint {
  period: string; // e.g. "2024 Q1" or "2024年"
  totalSlides: number; // 入库数字切片
  lesionSlides: number; // 检出病理切片
  normalSlides: number; // 正常切片
  positiveRate: number; // 检出率 %
  growthRate?: number; // 环比增长 %
  majorProject: string; // 当期主力项目
}

export interface IngestionTimeStatSummary {
  rangeKey: IngestionTimeRange;
  rangeName: string;
  timeSpan: string;
  totalSlides: number;
  totalAnimals: number;
  totalProjects: number;
  avgMonthlyIngestion: number;
  avgPositiveRate: string;
  glpComplianceRate: string;
  trend: TimeTrendDataPoint[];
  yearlyBreakdown: {
    year: string;
    total: number;
    positive: number;
    rate: number;
    topOrgan: string;
    topProject: string;
  }[];
}

export const INGESTION_TIME_STATS: Record<IngestionTimeRange, IngestionTimeStatSummary> = {
  threeYears: {
    rangeKey: 'threeYears',
    rangeName: '三年内 (2024~2026)',
    timeSpan: '2024-01-01 至 2026-11-01',
    totalSlides: 1980,
    totalAnimals: 640,
    totalProjects: 7,
    avgMonthlyIngestion: 58.2,
    avgPositiveRate: '35.4%',
    glpComplianceRate: '100%',
    trend: [
      { period: '2024 Q1', totalSlides: 110, lesionSlides: 36, normalSlides: 74, positiveRate: 32.7, majorProject: '长期毒性试验' },
      { period: '2024 Q2', totalSlides: 125, lesionSlides: 41, normalSlides: 84, positiveRate: 32.8, majorProject: '急性毒性试验' },
      { period: '2024 Q3', totalSlides: 130, lesionSlides: 43, normalSlides: 87, positiveRate: 33.1, majorProject: '致癌性试验' },
      { period: '2024 Q4', totalSlides: 145, lesionSlides: 48, normalSlides: 97, positiveRate: 33.1, majorProject: '长期毒性试验' },
      { period: '2025 Q1', totalSlides: 155, lesionSlides: 54, normalSlides: 101, positiveRate: 34.8, majorProject: '长期毒性试验' },
      { period: '2025 Q2', totalSlides: 170, lesionSlides: 60, normalSlides: 110, positiveRate: 35.3, majorProject: '生殖毒性试验' },
      { period: '2025 Q3', totalSlides: 180, lesionSlides: 64, normalSlides: 116, positiveRate: 35.6, majorProject: '致癌性试验' },
      { period: '2025 Q4', totalSlides: 195, lesionSlides: 71, normalSlides: 124, positiveRate: 36.4, majorProject: '长期毒性试验' },
      { period: '2026 Q1', totalSlides: 220, lesionSlides: 81, normalSlides: 139, positiveRate: 36.8, majorProject: '长期毒性试验' },
      { period: '2026 Q2', totalSlides: 240, lesionSlides: 88, normalSlides: 152, positiveRate: 36.7, majorProject: '神经毒性试验' },
      { period: '2026 Q3', totalSlides: 260, lesionSlides: 96, normalSlides: 164, positiveRate: 36.9, majorProject: '局部刺激试验' },
      { period: '2026 Q4', totalSlides: 50, lesionSlides: 19, normalSlides: 31, positiveRate: 38.0, majorProject: '长期毒性试验' }
    ],
    yearlyBreakdown: [
      { year: '2024年', total: 510, positive: 168, rate: 32.9, topOrgan: '肝脏 (145例)', topProject: '长期毒性试验' },
      { year: '2025年', total: 700, positive: 249, rate: 35.6, topOrgan: '肾脏 (188例)', topProject: '致癌性试验' },
      { year: '2026年', total: 770, positive: 284, rate: 36.9, topOrgan: '肝脏 (220例)', topProject: '长期毒性试验' }
    ]
  },
  fiveYears: {
    rangeKey: 'fiveYears',
    rangeName: '五年内 (2022~2026)',
    timeSpan: '2022-01-01 至 2026-11-01',
    totalSlides: 3120,
    totalAnimals: 1020,
    totalProjects: 7,
    avgMonthlyIngestion: 52.0,
    avgPositiveRate: '33.8%',
    glpComplianceRate: '100%',
    trend: [
      { period: '2022年', totalSlides: 420, lesionSlides: 122, normalSlides: 298, positiveRate: 29.0, majorProject: '长期毒性试验' },
      { period: '2023年', totalSlides: 720, lesionSlides: 224, normalSlides: 496, positiveRate: 31.1, majorProject: '急性毒性试验' },
      { period: '2024年', totalSlides: 510, lesionSlides: 168, normalSlides: 342, positiveRate: 32.9, majorProject: '致癌性试验' },
      { period: '2025年', totalSlides: 700, lesionSlides: 249, normalSlides: 451, positiveRate: 35.6, majorProject: '长期毒性试验' },
      { period: '2026年', totalSlides: 770, lesionSlides: 284, normalSlides: 486, positiveRate: 36.9, majorProject: '神经毒性试验' }
    ],
    yearlyBreakdown: [
      { year: '2022年', total: 420, positive: 122, rate: 29.0, topOrgan: '肝脏 (120例)', topProject: '长期毒性试验' },
      { year: '2023年', total: 720, positive: 224, rate: 31.1, topOrgan: '胃肠道 (195例)', topProject: '急性毒性试验' },
      { year: '2024年', total: 510, positive: 168, rate: 32.9, topOrgan: '肝脏 (145例)', topProject: '长期毒性试验' },
      { year: '2025年', total: 700, positive: 249, rate: 35.6, topOrgan: '肾脏 (188例)', topProject: '致癌性试验' },
      { year: '2026年', total: 770, positive: 284, rate: 36.9, topOrgan: '肝脏 (220例)', topProject: '长期毒性试验' }
    ]
  },
  oneYear: {
    rangeKey: 'oneYear',
    rangeName: '近一年 (2025~2026)',
    timeSpan: '2025-11-01 至 2026-11-01',
    totalSlides: 920,
    totalAnimals: 310,
    totalProjects: 7,
    avgMonthlyIngestion: 76.7,
    avgPositiveRate: '37.1%',
    glpComplianceRate: '100%',
    trend: [
      { period: '2025 Q4', totalSlides: 195, lesionSlides: 71, normalSlides: 124, positiveRate: 36.4, majorProject: '长期毒性试验' },
      { period: '2026 Q1', totalSlides: 220, lesionSlides: 81, normalSlides: 139, positiveRate: 36.8, majorProject: '致癌性试验' },
      { period: '2026 Q2', totalSlides: 240, lesionSlides: 88, normalSlides: 152, positiveRate: 36.7, majorProject: '生殖毒性试验' },
      { period: '2026 Q3', totalSlides: 260, lesionSlides: 96, normalSlides: 164, positiveRate: 36.9, majorProject: '局部刺激试验' },
      { period: '2026 Q4', totalSlides: 50, lesionSlides: 19, normalSlides: 31, positiveRate: 38.0, majorProject: '长期毒性试验' }
    ],
    yearlyBreakdown: [
      { year: '2025后半期', total: 195, positive: 71, rate: 36.4, topOrgan: '肾脏 (58例)', topProject: '长期毒性试验' },
      { year: '2026全年', total: 725, positive: 270, rate: 37.2, topOrgan: '肝脏 (210例)', topProject: '致癌性试验' }
    ]
  },
  all: {
    rangeKey: 'all',
    rangeName: '全部时间 (历史全集)',
    timeSpan: '2020-01-01 至 2026-11-01',
    totalSlides: 3520,
    totalAnimals: 1180,
    totalProjects: 7,
    avgMonthlyIngestion: 48.9,
    avgPositiveRate: '33.2%',
    glpComplianceRate: '100%',
    trend: [
      { period: '2020年', totalSlides: 150, lesionSlides: 42, normalSlides: 108, positiveRate: 28.0, majorProject: '长期毒性试验' },
      { period: '2021年', totalSlides: 250, lesionSlides: 72, normalSlides: 178, positiveRate: 28.8, majorProject: '急性毒性试验' },
      { period: '2022年', totalSlides: 420, lesionSlides: 122, normalSlides: 298, positiveRate: 29.0, majorProject: '长期毒性试验' },
      { period: '2023年', totalSlides: 720, lesionSlides: 224, normalSlides: 496, positiveRate: 31.1, majorProject: '致癌性试验' },
      { period: '2024年', totalSlides: 510, lesionSlides: 168, normalSlides: 342, positiveRate: 32.9, majorProject: '长期毒性试验' },
      { period: '2025年', totalSlides: 700, lesionSlides: 249, normalSlides: 451, positiveRate: 35.6, majorProject: '生殖毒性试验' },
      { period: '2026年', totalSlides: 770, lesionSlides: 284, normalSlides: 486, positiveRate: 36.9, majorProject: '神经毒性试验' }
    ],
    yearlyBreakdown: [
      { year: '2020~2021年', total: 400, positive: 114, rate: 28.5, topOrgan: '肝脏 (110例)', topProject: '长期毒性试验' },
      { year: '2022~2023年', total: 1140, positive: 346, rate: 30.4, topOrgan: '肾脏 (310例)', topProject: '急性毒性试验' },
      { year: '2024~2026年', total: 1980, positive: 701, rate: 35.4, topOrgan: '肝脏 (540例)', topProject: '致癌性试验' }
    ]
  }
};

// ==========================================
// 8. 不同受试物的靶器官分析数据 (Target Organ Vulnerability by Test Article)
// ==========================================
export interface TargetOrganVulnerabilityItem {
  organ: string;
  system: string;
  totalSlides: number;
  lesionSlides: number;
  vulnerabilityRate: number; // 易感率 %
  riskLevel: '高易感靶器官' | '中等易感' | '基础低风险';
  typicalLesions: string; // 常见典型病理改变
  toxicologyNote: string; // 毒理学病理机制提示
}

export interface TestArticleTargetOrganProfile {
  category: string;
  subCategory: string;
  description: string;
  totalEvaluatedSlides: number;
  overallVulnerability: string;
  targetOrgans: TargetOrganVulnerabilityItem[];
}

export const TEST_ARTICLE_TARGET_ORGAN_DATA: Record<string, TestArticleTargetOrganProfile> = {
  '全部受试物': {
    category: '全部受试物',
    subCategory: '全库受试物汇总',
    description: '涵盖化药、生物药(抗体/细胞/基因)、中药、医疗器械与化妆品在全靶器官的易感性综合分布',
    totalEvaluatedSlides: 1680,
    overallVulnerability: '34.6%',
    targetOrgans: [
      { organ: '肝脏', system: '消化系统', totalSlides: 430, lesionSlides: 252, vulnerabilityRate: 58.6, riskLevel: '高易感靶器官', typicalLesions: '肝细胞大泡/小泡性脂肪变性、微肉芽肿、局灶水肿坏死', toxicologyNote: '首过效应与代谢排泄核心实质脏器，极易受各类异源物代谢累积负荷影响。' },
      { organ: '肾脏', system: '泌尿系统', totalSlides: 310, lesionSlides: 164, vulnerabilityRate: 52.9, riskLevel: '高易感靶器官', typicalLesions: '近曲小管上皮嗜碱性变、小管扩张管型、肾小球基底膜增厚', toxicologyNote: '主要清除与浓缩器官，高浓度重吸收易引发皮质小管上皮细胞损伤。' },
      { organ: '心脏', system: '心血管系统', totalSlides: 240, lesionSlides: 86, vulnerabilityRate: 35.8, riskLevel: '中等易感', typicalLesions: '心肌间质灶性水肿、单个核炎细胞浸润、肌纤维断裂', toxicologyNote: '长毒及刺激性试验中易见血流动力学或能量代谢相关微病灶。' },
      { organ: '脾脏', system: '淋巴系统', totalSlides: 160, lesionSlides: 68, vulnerabilityRate: 42.5, riskLevel: '中等易感', typicalLesions: '反应性白髓滤泡增生、生发中心扩大、红髓充血髓外造血', toxicologyNote: '免疫原性大分子及纳米载体易被网状内皮吞噬系统蓄积激活。' },
      { organ: '肺脏', system: '呼吸系统', totalSlides: 200, lesionSlides: 74, vulnerabilityRate: 37.0, riskLevel: '中等易感', typicalLesions: '肺泡壁增厚伴巨噬细胞聚集、间质纤维化早期充血', toxicologyNote: '气道暴露或微栓塞过滤第一道滤网，易产生局部异物与炎性反应。' },
      { organ: '皮肤', system: '骨骼/表皮', totalSlides: 110, lesionSlides: 42, vulnerabilityRate: 38.2, riskLevel: '中等易感', typicalLesions: '表皮角化过度、真皮浅层毛细血管扩张伴炎细胞浸润', toxicologyNote: '外用涂抹制剂与局部植入性器械的高发接触性刺激靶器官。' },
      { organ: '脑/神经', system: '神经系统', totalSlides: 90, lesionSlides: 22, vulnerabilityRate: 24.4, riskLevel: '基础低风险', typicalLesions: '局灶性神经毡空泡变性、海马神经元水肿、髓鞘稀疏', toxicologyNote: '受血脑屏障严格保护，神经毒性多发生于特定中枢蓄积化合物或缺血缺氧。' },
      { organ: '睾丸/生殖', system: '生殖系统', totalSlides: 80, lesionSlides: 20, vulnerabilityRate: 25.0, riskLevel: '基础低风险', typicalLesions: '生精小管上皮空泡样变、曲细精管精子生成减少', toxicologyNote: '具有血睾屏障，化疗药物或内分泌干扰物暴露下出现特定损伤。' }
    ]
  },
  '抗体': {
    category: '药品',
    subCategory: '抗体 (单抗/双抗/ADC)',
    description: '单抗、双特异性抗体及抗体偶联药物(ADC)易累及网状内皮清除器官与高代谢实质',
    totalEvaluatedSlides: 380,
    overallVulnerability: '43.2%',
    targetOrgans: [
      { organ: '肝脏', system: '消化系统', totalSlides: 115, lesionSlides: 71, vulnerabilityRate: 61.7, riskLevel: '高易感靶器官', typicalLesions: 'Kupffer细胞活化、窦周脂肪变性、汇管区轻度淋巴浸润', toxicologyNote: 'Fc受体介导内吞与肝窦清除增加，ADC载荷脱落可引起局部旁观者坏死。' },
      { organ: '脾脏', system: '淋巴系统', totalSlides: 65, lesionSlides: 38, vulnerabilityRate: 58.5, riskLevel: '高易感靶器官', typicalLesions: '脾滤泡增生伴生发中心增大、红髓巨噬细胞吞噬含铁血黄素', toxicologyNote: '外源性蛋白免疫反应及免疫复合物沉积激活脾脏网状内皮系统。' },
      { organ: '肾脏', system: '泌尿系统', totalSlides: 75, lesionSlides: 31, vulnerabilityRate: 41.3, riskLevel: '中等易感', typicalLesions: '肾小球内皮微血栓、系膜区轻度基质增生', toxicologyNote: '大剂量抗体在肾小球滤过阻滞，部分ADC片段经小管重吸收产生毒性。' },
      { organ: '肺脏', system: '呼吸系统', totalSlides: 45, lesionSlides: 15, vulnerabilityRate: 33.3, riskLevel: '中等易感', typicalLesions: '肺泡间隔微血管充血、少量淋巴细胞聚集', toxicologyNote: '部分细胞因子释放或靶向肺表达抗原后的靶向/脱靶局部免疫反应。' },
      { organ: '心脏', system: '心血管系统', totalSlides: 50, lesionSlides: 11, vulnerabilityRate: 22.0, riskLevel: '基础低风险', typicalLesions: '心肌间质极轻度单个核浸润', toxicologyNote: '非HER2类抗体通常缺乏心肌直接特异性结合毒性。' }
    ]
  },
  '小分子化药': {
    category: '药品',
    subCategory: '小分子化药 (激酶抑制剂/细胞毒/抗感染)',
    description: '低分子量合成化学药物，典型呈现肝微粒体代谢负担与肾小管排泄清除损伤',
    totalEvaluatedSlides: 240,
    overallVulnerability: '48.8%',
    targetOrgans: [
      { organ: '肝脏', system: '消化系统', totalSlides: 85, lesionSlides: 57, vulnerabilityRate: 67.1, riskLevel: '高易感靶器官', typicalLesions: '中央静脉周肝细胞凝固性坏死、微泡性脂肪变、胆小管增生', toxicologyNote: 'CYP450酶介导生物转化产生反应性亲电代谢物，攻击线粒体与膜脂质。' },
      { organ: '肾脏', system: '泌尿系统', totalSlides: 70, lesionSlides: 43, vulnerabilityRate: 61.4, riskLevel: '高易感靶器官', typicalLesions: '近曲小管上皮嗜碱性水肿坏死、管型阻塞、间质淋巴细胞浸润', toxicologyNote: '管腔高浓度浓缩重吸收，转运体(OAT/OCT)介导小管细胞内大量蓄积。' },
      { organ: '心脏', system: '心血管系统', totalSlides: 35, lesionSlides: 11, vulnerabilityRate: 31.4, riskLevel: '中等易感', typicalLesions: '心肌纤维波浪状走行、局灶横纹肌溶解', toxicologyNote: '线粒体呼吸链或离子通道(hERG等)抑制引起的能量代谢或兴奋收缩偶联异常。' },
      { organ: '胃肠道', system: '消化系统', totalSlides: 30, lesionSlides: 9, vulnerabilityRate: 30.0, riskLevel: '中等易感', typicalLesions: '胃黏膜糜烂、十二指肠绒毛萎缩脱落', toxicologyNote: '口服给药直接高浓度局部刺激与黏膜屏障合成更新受抑。' },
      { organ: '骨髓', system: '骨骼/淋巴', totalSlides: 20, lesionSlides: 6, vulnerabilityRate: 30.0, riskLevel: '中等易感', typicalLesions: '造血细胞增生低下、脂肪细胞增多', toxicologyNote: '快速增殖期造血祖细胞核酸合成或有丝分裂受化学药物抑制。' }
    ]
  },
  '中药': {
    category: '药品',
    subCategory: '中药 (复方中药/提取物/注射液)',
    description: '多成分、多靶点天然产物，易呈慢性隐匿性肝肾代谢蓄积及局部刺激',
    totalEvaluatedSlides: 150,
    overallVulnerability: '32.7%',
    targetOrgans: [
      { organ: '肝脏', system: '消化系统', totalSlides: 55, lesionSlides: 22, vulnerabilityRate: 40.0, riskLevel: '高易感靶器官', typicalLesions: '胆汁淤积性肝损害、汇管区嗜酸性粒细胞浸润、轻度纤维化', toxicologyNote: '某些生物碱、鞣质类或皂苷多成分在肝微粒体竞争代谢与胆汁酸排泄受阻。' },
      { organ: '肾脏', system: '泌尿系统', totalSlides: 45, lesionSlides: 16, vulnerabilityRate: 35.6, riskLevel: '中等易感', typicalLesions: '皮质小管萎缩、肾间质轻度胶原纤维沉积', toxicologyNote: '含马兜铃酸样复合物或重金属杂质对肾间质微血管及小管细胞的慢性毒性。' },
      { organ: '脾脏', system: '淋巴系统', totalSlides: 25, lesionSlides: 6, vulnerabilityRate: 24.0, riskLevel: '基础低风险', typicalLesions: '脾白髓生发中心轻度反应性活跃', toxicologyNote: '多糖类免疫调节成分引起的生理反应性淋巴滤泡扩增。' },
      { organ: '胃肠道', system: '消化系统', totalSlides: 25, lesionSlides: 5, vulnerabilityRate: 20.0, riskLevel: '基础低风险', typicalLesions: '胃腺黏膜充血、黏液分泌增多', toxicologyNote: '苦寒辛辣中药提取物对胃壁保护屏障的轻度理化刺激。' }
    ]
  },
  '医疗器械': {
    category: '医疗器械',
    subCategory: '医疗器械产品 (植入物/导管/覆膜支架/敷料)',
    description: '评估材料物理接触、降解微粒溶出物及生物相容性反应',
    totalEvaluatedSlides: 380,
    overallVulnerability: '37.4%',
    targetOrgans: [
      { organ: '局部血管/心脏', system: '心血管系统', totalSlides: 130, lesionSlides: 74, vulnerabilityRate: 56.9, riskLevel: '高易感靶器官', typicalLesions: '新生内膜过度增生、支架小梁周异物巨细胞反应、内皮化延迟', toxicologyNote: '金属/聚合物器械刚度不匹配或药物涂层局部长期机械与化学缓释反应。' },
      { organ: '骨骼/肌肉', system: '骨骼组织', totalSlides: 90, lesionSlides: 36, vulnerabilityRate: 40.0, riskLevel: '中等易感', typicalLesions: '植入界面纤维包裹囊腔形成、骨整合不全、微骨折碎屑反应', toxicologyNote: '骨科植入物应力遮挡及磨损微粒引起的局部破骨激活吸收。' },
      { organ: '局部皮肤', system: '骨骼/表皮', totalSlides: 80, lesionSlides: 26, vulnerabilityRate: 32.5, riskLevel: '中等易感', typicalLesions: '真皮浅层异物肉芽肿形成、巨噬细胞吞噬微粒', toxicologyNote: '贴片或缝合线降解过程中的局部炎性吸收与胶原修复。' },
      { organ: '脾脏/淋巴', system: '淋巴系统', totalSlides: 50, lesionSlides: 11, vulnerabilityRate: 22.0, riskLevel: '基础低风险', typicalLesions: '引流区域淋巴结微粒滤过沉积、窦组织细胞增生', toxicologyNote: '微纳米磨损碎屑经淋巴道引流并被淋巴结巨噬细胞吞噬清除。' },
      { organ: '肝脏', system: '消化系统', totalSlides: 30, lesionSlides: 4, vulnerabilityRate: 13.3, riskLevel: '基础低风险', typicalLesions: '偶见Kupffer细胞内微粒吞噬', toxicologyNote: '全身吸收毒性低，仅降解颗粒经循环清除时偶发轻微沉积。' }
    ]
  },
  '化妆品': {
    category: '化妆品',
    subCategory: '化妆品 (护肤类/彩妆/原料)',
    description: '以经皮长期暴露为主，重点监测表皮通透屏障、皮肤致敏及眼刺激反应',
    totalEvaluatedSlides: 250,
    overallVulnerability: '38.0%',
    targetOrgans: [
      { organ: '皮肤', system: '消化/表皮系统', totalSlides: 110, lesionSlides: 78, vulnerabilityRate: 70.9, riskLevel: '高易感靶器官', typicalLesions: '角化过度、棘层肥厚、真皮乳头水肿伴嗜酸性粒细胞浸润', toxicologyNote: '表面活性剂破坏角质层脂质双分子层屏障，诱发接触性皮炎或光敏反应。' },
      { organ: '眼黏膜/角膜', system: '感觉器官', totalSlides: 60, lesionSlides: 26, vulnerabilityRate: 43.3, riskLevel: '中等易感', typicalLesions: '角膜上皮缺损、基质水肿基底膜混浊、结膜充血', toxicologyNote: '眼部接触刺激性防腐剂、香精或极性溶剂引起的蛋白变性。' },
      { organ: '肝脏', system: '消化系统', totalSlides: 45, lesionSlides: 7, vulnerabilityRate: 15.6, riskLevel: '基础低风险', typicalLesions: '肝细胞轻微浊肿，未见实质坏死', toxicologyNote: '仅极少量高脂溶性防腐剂或抗衰原料经皮微量吸收经肝脏代谢。' },
      { organ: '肾脏', system: '泌尿系统', totalSlides: 35, lesionSlides: 4, vulnerabilityRate: 11.4, riskLevel: '基础低风险', typicalLesions: '肾皮质生理结构完好，未见病理性蛋白管型', toxicologyNote: '无显著经皮全身蓄积性肾毒性证据。' }
    ]
  }
};

