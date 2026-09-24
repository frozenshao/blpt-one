import { PathologySample } from '../types/pathology';

export const INITIAL_PATHOLOGY_SAMPLES: PathologySample[] = [
  {
    id: 'sample-001',
    sampleCode: 'PAT-2026-LV-0101',
    animalId: 'ANI-2026-C57-01',
    strain: 'C57BL/6J',
    experimentGroup: 'HFD高脂模型组',
    testArticle: '高脂饲料 (D12492-60% kcal)',
    pathologyDiagnosis: '重度弥漫性肝细胞大泡性脂肪变性伴轻度小叶性炎',
    organ: '肝',
    sliceType: 'HE染色',
    isLesion: true,
    lesionName: '脂肪变性(脂肪肝)',
    lesionDistribution: '弥漫性分布',
    species: 'C57BL/6 小鼠',
    gender: '雄性 (Male)',
    ageWeeks: 16,
    samplingDate: '2026-03-12',
    collectorName: '张敏 副研究员',
    pathologistSign: '王海川 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H03-08',
    structuredDescription: {
      histopathologyScore: 3,
      cellularMorphology: '肝细胞胞浆内可见大小不等圆形脂滴空泡，核被挤压向细胞边缘。胞界清晰度轻度下降。',
      architecturalChanges: '肝小叶中央静脉周围肝索结构紊乱，肝窦受压变窄，未见广泛纤维分隔。',
      inflammationScore: '轻度 (小叶内见散在散在单核细胞浸润)',
      necrosisPercentage: 2.5,
      fibrosisStage: 'S1 (中央静脉周微细纤维化)',
      clinicalDiagnosis: '重度肝细胞大泡性脂肪变性伴轻度非酒精性脂肪性肝炎(NASH)倾向',
      pathologistRemarks: '符合高脂饮食诱导模型表现，病灶弥漫累及>65%肝实质区域，建议对照血脂及ALT/AST指标。',
      experimentGroup: 'HFD高脂饲料模型组 (12周诱导)',
      dosageCohort: 'Model Group A-2',
      bodyWeight: '38.4g'
    },
    annotations: [
      {
        id: 'ann-1',
        label: '密集大泡性脂肪变区',
        category: 'lesion',
        color: '#ef4444',
        x: 32,
        y: 28,
        width: 38,
        height: 35,
        probability: 0.98,
        description: '肝实质细胞大量气球样脂滴融合蓄积'
      },
      {
        id: 'ann-2',
        label: '汇管区淋巴单核浸润',
        category: 'cell',
        color: '#f59e0b',
        x: 72,
        y: 54,
        width: 18,
        height: 22,
        probability: 0.89,
        description: '门管区局部可见炎性细胞灶性聚集'
      }
    ],
    heatmapPoints: [
      { x: 35, y: 30, radius: 45, intensity: 0.95, label: '重度脂肪蓄积中心' },
      { x: 48, y: 42, radius: 40, intensity: 0.88, label: '脂肪浸润扩散带' },
      { x: 74, y: 56, radius: 28, intensity: 0.72, label: '汇管区炎性热区' },
      { x: 22, y: 65, radius: 32, intensity: 0.65, label: '肝窦受压变形区' }
    ],
    customFields: {
      '实验批次': 'EXP-2026-NASH-04',
      '切片厚度': '4 μm',
      '封片介质': '中性树胶'
    }
  },
  {
    id: 'sample-002',
    sampleCode: 'PAT-2026-LU-0204',
    animalId: 'ANI-2026-PDX-03',
    strain: 'NOD/SCID/IL2rγ-/- (NCG)',
    experimentGroup: 'PDX靶向治疗试验组',
    testArticle: '奥希替尼 (Osimertinib, 10mg/kg)',
    pathologyDiagnosis: '肺浸润性腺癌移植瘤(高异型性腺管状增殖)',
    organ: '肺',
    sliceType: 'HE染色',
    isLesion: true,
    lesionName: '腺癌组织浸润',
    lesionDistribution: '多灶性散在',
    species: '人源异种移植模型(PDX)',
    gender: '雌性 (Female)',
    ageWeeks: 8,
    samplingDate: '2026-03-08',
    collectorName: '李伟 助理研究员',
    pathologistSign: '陈述 教授/主任病理师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H03-05',
    structuredDescription: {
      histopathologyScore: 4,
      cellularMorphology: '异型肿瘤细胞呈腺管状、乳头状及实性片状排列，细胞核大深染、核质比明显增大，核仁明显，核分裂象易见(>8/10 HPF)。',
      architecturalChanges: '肺泡结构被破坏，肿瘤细胞浸润支气管壁及周围肺间质，伴有广泛促结缔组织增生反应。',
      inflammationScore: '中度 (肿瘤间质淋巴细胞及巨噬细胞浸润)',
      necrosisPercentage: 12.0,
      fibrosisStage: 'S3 (间质硬化显著)',
      clinicalDiagnosis: '肺浸润性腺癌(PDX模型第3代)',
      pathologistRemarks: '移植瘤生长活跃，侵袭性强，未见大面积凝固性坏死，适用于靶向药效学评价。',
      experimentGroup: 'PDX靶向治疗试验组 (G3-IV)',
      dosageCohort: 'Dose-10mg/kg',
      bodyWeight: '22.1g'
    },
    annotations: [
      {
        id: 'ann-201',
        label: '高密度腺癌浸润灶',
        category: 'lesion',
        color: '#dc2626',
        x: 40,
        y: 35,
        width: 32,
        height: 30,
        probability: 0.99,
        description: '恶性异型腺上皮实性增殖区'
      },
      {
        id: 'ann-202',
        label: '微血管浸润边界',
        category: 'vessel',
        color: '#9333ea',
        x: 20,
        y: 60,
        width: 24,
        height: 20,
        probability: 0.91,
        description: '瘤周微淋巴管内见癌栓形成倾向'
      }
    ],
    heatmapPoints: [
      { x: 42, y: 38, radius: 50, intensity: 0.98, label: '肿瘤核心浸润高危区' },
      { x: 55, y: 48, radius: 35, intensity: 0.85, label: '腺管异型分化区' },
      { x: 25, y: 62, radius: 30, intensity: 0.79, label: '脉管侵袭前沿' }
    ],
    customFields: {
      '实验批次': 'EXP-2026-ONCO-L09',
      '切片厚度': '3.5 μm',
      '模型代数': 'F3代'
    }
  },
  {
    id: 'sample-003',
    sampleCode: 'PAT-2026-KD-0312',
    animalId: 'ANI-2026-SD-08',
    strain: 'Sprague-Dawley (SD)',
    experimentGroup: '溶媒对照组 (Vehicle Control)',
    testArticle: '0.9% 灭菌氯化钠注射液 (溶媒对照)',
    pathologyDiagnosis: '双肾皮质及髓质各级肾单位生理形态未见异常',
    organ: '肾',
    sliceType: 'HE染色',
    isLesion: false,
    lesionName: '正常形态',
    lesionDistribution: '无病变(正常)',
    species: 'SD 大鼠',
    gender: '雄性 (Male)',
    ageWeeks: 10,
    samplingDate: '2026-03-01',
    collectorName: '刘佳 实验师',
    pathologistSign: '赵德安 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_kidney_1789719245298.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_kidney_1789719245298.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H02-28',
    structuredDescription: {
      histopathologyScore: 0,
      cellularMorphology: '肾小球结构规整，毛细血管袢开放良好，内皮与系膜细胞无增生；近曲与远曲肾小管上皮细胞形态完整，刷状缘清晰。',
      architecturalChanges: '皮质与髓质交界清晰，肾间质未见水肿或充血，未见炎性浸润及基底膜增厚。',
      inflammationScore: '无 (未见异常炎细胞积聚)',
      necrosisPercentage: 0,
      fibrosisStage: 'S0 (正常间质无纤维化)',
      clinicalDiagnosis: '正常大鼠肾组织(生理对照组)',
      pathologistRemarks: '组织固定良好，各级肾单位形态均在正常生理参考范围内，可作为阴性对照金标准。',
      experimentGroup: '溶媒对照组 (Vehicle Control)',
      dosageCohort: 'Saline Control',
      bodyWeight: '265.0g'
    },
    annotations: [
      {
        id: 'ann-301',
        label: '正常肾小球结构',
        category: 'normal',
        color: '#10b981',
        x: 42,
        y: 45,
        width: 25,
        height: 25,
        probability: 0.99,
        description: '鲍曼囊腔清晰，无硬化及渗出'
      },
      {
        id: 'ann-302',
        label: '近曲小管上皮群',
        category: 'normal',
        color: '#06b6d4',
        x: 18,
        y: 22,
        width: 28,
        height: 26,
        probability: 0.97,
        description: '单层立方上皮排列整齐'
      }
    ],
    heatmapPoints: [
      { x: 50, y: 50, radius: 20, intensity: 0.05, label: '基底生理信号' }
    ],
    customFields: {
      '实验批次': 'EXP-2026-TOX-KD01',
      '切片厚度': '3 μm',
      '动物编号': 'RAT-M-08'
    }
  },
  {
    id: 'sample-004',
    sampleCode: 'PAT-2026-SP-0402',
    animalId: 'ANI-2026-BALB-05',
    strain: 'BALB/cAnN',
    experimentGroup: '新型佐剂疫苗免疫组',
    testArticle: '重组抗原结合铝佐剂 (50μg/kg)',
    pathologyDiagnosis: '反应性脾滤泡增生伴生发中心显著活化',
    organ: '脾',
    sliceType: '免疫组化(IHC)',
    isLesion: true,
    lesionName: '结节性增生',
    lesionDistribution: '结节状聚集',
    species: 'BALB/c 小鼠',
    gender: '雌性 (Female)',
    ageWeeks: 24,
    samplingDate: '2026-02-22',
    collectorName: '赵晨 助理实验师',
    pathologistSign: '王海川 主任医师',
    qualityGrade: 'B',
    imageUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'IHC-CD3-2026-02',
    structuredDescription: {
      histopathologyScore: 2,
      cellularMorphology: '脾白髓生发中心明显扩大，淋巴细胞分裂活跃，CD3/CD19阳性细胞呈强棕黄色胞膜着色。',
      architecturalChanges: '红髓与白髓界限变模糊，脾小体增生融合成片，边缘区增宽。',
      inflammationScore: '轻度',
      necrosisPercentage: 0,
      fibrosisStage: 'S0',
      clinicalDiagnosis: '脾脏反应性滤泡增生伴生发中心活化',
      pathologistRemarks: '抗原致敏免疫刺激应答反应，符合预期免疫原性表现。',
      experimentGroup: '新型佐剂疫苗免疫组',
      dosageCohort: 'Dose-50μg/kg',
      bodyWeight: '24.6g'
    },
    annotations: [
      {
        id: 'ann-401',
        label: '增生白髓生发中心',
        category: 'lesion',
        color: '#f59e0b',
        x: 35,
        y: 35,
        width: 30,
        height: 30,
        probability: 0.94,
        description: '生发中心细胞明显扩增'
      }
    ],
    heatmapPoints: [
      { x: 38, y: 38, radius: 45, intensity: 0.82, label: '免疫活化高表达区' }
    ],
    customFields: {
      '抗体指标': 'Anti-CD3 Rabbit mAb',
      '稀释比例': '1:200'
    }
  },
  {
    id: 'sample-005',
    sampleCode: 'PAT-2026-HT-0518',
    animalId: 'ANI-2026-NHP-02',
    strain: '食蟹猴 (Macaca fascicularis)',
    experimentGroup: '老年慢性毒理观察组',
    testArticle: '长毒对照组 (未给药自然衰老)',
    pathologyDiagnosis: '心肌间质弥漫性纤维化伴微小冠状动脉周围硬化',
    organ: '心',
    sliceType: 'Masson三色染色',
    isLesion: true,
    lesionName: '间质纤维化',
    lesionDistribution: '间质广泛浸润',
    species: '食蟹猴',
    gender: '雄性 (Male)',
    ageWeeks: 52,
    samplingDate: '2026-01-18',
    collectorName: '孙立宏 博士',
    pathologistSign: '陈述 教授/主任病理师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    resolution: '0.2 μm/pixel (40X)',
    stainBatch: 'MASSON-2026-01-A',
    structuredDescription: {
      histopathologyScore: 3,
      cellularMorphology: '心肌细胞肥大，横纹模糊，部分细胞变性萎缩；间质内大量胶原纤维蓝染沉积。',
      architecturalChanges: '心肌束间隙增宽，小血管壁增厚、管周胶原环状缠绕，心肌排列紊乱。',
      inflammationScore: '轻度 (少量组织细胞浸润)',
      necrosisPercentage: 1.0,
      fibrosisStage: 'S3 (显著心肌间质胶原沉积)',
      clinicalDiagnosis: '灵长类心肌间质纤维化伴血管周围硬化',
      pathologistRemarks: '老年灵长类心血管退行性病变特征，胶原容积分数(CVF)测算达18.5%。',
      experimentGroup: '老年慢性毒理观察组',
      dosageCohort: 'Group Age-52W',
      bodyWeight: '4.8kg'
    },
    annotations: [
      {
        id: 'ann-501',
        label: 'Masson蓝染胶原纤维区',
        category: 'lesion',
        color: '#2563eb',
        x: 25,
        y: 20,
        width: 45,
        height: 50,
        probability: 0.96,
        description: '心肌间质致密胶原沉积'
      }
    ],
    heatmapPoints: [
      { x: 45, y: 40, radius: 48, intensity: 0.91, label: '心肌胶原重度沉积带' },
      { x: 68, y: 30, radius: 35, intensity: 0.83, label: '小动脉管周纤维化' }
    ],
    customFields: {
      '胶原容积分数': '18.5%',
      '切片类型': '石蜡包埋Masson染色'
    }
  },
  {
    id: 'sample-006',
    sampleCode: 'PAT-2026-LV-0120',
    animalId: 'ANI-2026-C57-01', // 同一只C57小鼠关联的切片2 (解剖多层面取材)
    strain: 'C57BL/6J',
    experimentGroup: '标准对照组 (Standard Control)',
    testArticle: '普通标准啮齿类繁殖饲料',
    pathologyDiagnosis: '肝组织生理形态结构完整无变性坏死',
    organ: '肝',
    sliceType: 'HE染色',
    isLesion: false,
    lesionName: '正常形态',
    lesionDistribution: '无病变(正常)',
    species: 'C57BL/6 小鼠',
    gender: '雌性 (Female)',
    ageWeeks: 8,
    samplingDate: '2026-02-15',
    collectorName: '张敏 副研究员',
    pathologistSign: '王海川 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H02-12',
    structuredDescription: {
      histopathologyScore: 0,
      cellularMorphology: '肝细胞多边形，胞核居中圆润，染色质均匀分布，未见脂滴空泡或气球样肿胀。',
      architecturalChanges: '经典肝小叶结构清晰，肝索呈放射状由中央静脉向外伸展，肝窦无充血淤滞。',
      inflammationScore: '无',
      necrosisPercentage: 0,
      fibrosisStage: 'S0',
      clinicalDiagnosis: '正常小鼠肝实质组织',
      pathologistRemarks: '各级微细结构完整，无自溶及固定伪影，评级A级标准切片。',
      experimentGroup: '标准对照组 (Standard Control)',
      dosageCohort: 'Group NC-1',
      bodyWeight: '21.5g'
    },
    annotations: [
      {
        id: 'ann-601',
        label: '中央静脉正常结构',
        category: 'normal',
        color: '#10b981',
        x: 45,
        y: 42,
        width: 20,
        height: 20,
        probability: 0.99,
        description: '管壁完整，无充血出血'
      }
    ],
    heatmapPoints: [
      { x: 50, y: 50, radius: 15, intensity: 0.04, label: '正常背景' }
    ],
    customFields: {
      '实验批次': 'EXP-2026-BASE-01',
      '固定液': '4%多聚甲醛'
    }
  },
  {
    id: 'sample-007',
    sampleCode: 'PAT-2026-LU-0288',
    animalId: 'ANI-2026-WIS-04',
    strain: 'Wistar',
    experimentGroup: 'LPS急性肺损伤模型组',
    testArticle: '脂多糖 (LPS, 5mg/kg 气管滴入)',
    pathologyDiagnosis: '急性间质性肺炎伴弥漫性肺泡间隔增厚与中性粒细胞重度浸润',
    organ: '肺',
    sliceType: 'HE染色',
    isLesion: true,
    lesionName: '炎性细胞浸润',
    lesionDistribution: '弥漫性分布',
    species: 'Wistar 大鼠',
    gender: '雄性 (Male)',
    ageWeeks: 12,
    samplingDate: '2026-02-10',
    collectorName: '李伟 助理研究员',
    pathologistSign: '赵德安 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H02-05',
    structuredDescription: {
      histopathologyScore: 3,
      cellularMorphology: '肺泡间隔明显增宽充血，见大量中性粒细胞、单核巨噬细胞浸润；肺泡腔内充满嗜酸性蛋白渗出液及脱落上皮细胞。',
      architecturalChanges: '局灶性肺泡萎陷与过度膨胀并存，小支气管周围有致密炎细胞套套形成。',
      inflammationScore: '重度 (急性化脓性/纤维素性肺炎)',
      necrosisPercentage: 3.2,
      fibrosisStage: 'S1',
      clinicalDiagnosis: '急性间质性肺炎伴弥漫性肺泡渗出',
      pathologistRemarks: 'LPS脂多糖滴注刺激诱导急性肺损伤模型，符合典型ARDS病理改变。',
      experimentGroup: 'LPS急性肺损伤模型组 (24h时相点)',
      dosageCohort: 'LPS 5mg/kg',
      bodyWeight: '280.5g'
    },
    annotations: [
      {
        id: 'ann-701',
        label: '中性粒细胞聚集区',
        category: 'lesion',
        color: '#ef4444',
        x: 30,
        y: 40,
        width: 35,
        height: 30,
        probability: 0.97,
        description: '肺泡壁增厚伴炎性细胞密集浸润'
      }
    ],
    heatmapPoints: [
      { x: 35, y: 45, radius: 46, intensity: 0.94, label: '重度炎性渗出中心' },
      { x: 62, y: 35, radius: 38, intensity: 0.87, label: '小气道周炎性浸润' }
    ],
    customFields: {
      '造模方法': '气管内LPS灌注',
      '诱导时间': '24小时'
    }
  },
  {
    id: 'sample-008',
    sampleCode: 'PAT-2026-KD-0345',
    animalId: 'ANI-2026-BEA-01',
    strain: '比格犬 (Beagle)',
    experimentGroup: '糖尿病肾病干预组',
    testArticle: 'SGLT2抑制剂混悬液 (20mg/kg/d)',
    pathologyDiagnosis: '糖尿病性肾小球系膜基质结节样硬化伴PAS强阳性沉积',
    organ: '肾',
    sliceType: 'PAS糖原染色',
    isLesion: true,
    lesionName: '肾小球硬化',
    lesionDistribution: '多灶性散在',
    species: '比格犬',
    gender: '雌性 (Female)',
    ageWeeks: 36,
    samplingDate: '2026-01-25',
    collectorName: '孙立宏 博士',
    pathologistSign: '陈述 教授/主任病理师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_kidney_1789719245298.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_kidney_1789719245298.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'PAS-2026-01',
    structuredDescription: {
      histopathologyScore: 3,
      cellularMorphology: '系膜区增宽伴PAS阳性糖蛋白基质重度沉着，毛细血管基底膜节段性增厚并形成结节样病变(K-W结节)。',
      architecturalChanges: '部分肾小球呈球性或节段性硬化伴囊壁粘连；相应肾小管萎缩，间质伴有慢性淋巴细胞浸润。',
      inflammationScore: '轻-中度',
      necrosisPercentage: 0,
      fibrosisStage: 'S3 (皮质间质纤维硬化)',
      clinicalDiagnosis: '犬糖尿病肾病肾小球节段硬化症',
      pathologistRemarks: 'PAS强阳性紫红色物质充填系膜基质，病理分期为典型III期糖尿病肾损伤。',
      experimentGroup: '高血糖靶向治疗干预组',
      dosageCohort: 'Drug B 20mg/kg/d',
      bodyWeight: '11.2kg'
    },
    annotations: [
      {
        id: 'ann-801',
        label: 'PAS强阳性硬化结节',
        category: 'lesion',
        color: '#ec4899',
        x: 42,
        y: 40,
        width: 26,
        height: 28,
        probability: 0.95,
        description: '系膜基质显著增生紫红着色'
      }
    ],
    heatmapPoints: [
      { x: 45, y: 42, radius: 42, intensity: 0.93, label: '肾小球系膜硬化核心' },
      { x: 22, y: 30, radius: 30, intensity: 0.74, label: '萎缩肾小管管周硬化' }
    ],
    customFields: {
      '尿蛋白指标': '2.8 g/24h',
      '特殊染色试剂': '过碘酸雪夫氏试剂'
    }
  },
  {
    id: 'sample-009',
    sampleCode: 'PAT-2026-BR-0601',
    animalId: 'ANI-2026-C57-01', // 同一只C57小鼠的大脑组织切片3 (多器官切片联动)
    strain: 'C57BL/6J',
    experimentGroup: '神经退行性疾病基线对照组',
    testArticle: '0.9% 生理盐水原位灌注',
    pathologyDiagnosis: '大脑皮质及海马CA1区神经元形态规整无变性坏死',
    organ: '脑',
    sliceType: 'HE染色',
    isLesion: false,
    lesionName: '正常形态',
    lesionDistribution: '无病变(正常)',
    species: 'C57BL/6 小鼠',
    gender: '雄性 (Male)',
    ageWeeks: 10,
    samplingDate: '2026-02-18',
    collectorName: '张敏 副研究员',
    pathologistSign: '赵德安 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_lung_1789719230402.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H02-14',
    structuredDescription: {
      histopathologyScore: 0,
      cellularMorphology: '大脑皮质锥体神经元形态规则，胞质尼氏体丰富，核大而圆、核仁清晰。神经胶质细胞分布均匀。',
      architecturalChanges: '皮质分层清晰(I-VI层结构完整)，神经纤维网致密无空泡样水肿，微血管内皮平滑无出血。',
      inflammationScore: '无',
      necrosisPercentage: 0,
      fibrosisStage: 'S0',
      clinicalDiagnosis: '正常小鼠大脑皮层及海马结构',
      pathologistRemarks: '灌注固定完善，未见脑组织缺血性嗜酸性变或暗神经元人为伪影。',
      experimentGroup: '神经退行性疾病基线对照组',
      dosageCohort: 'Normal Saline',
      bodyWeight: '25.8g'
    },
    annotations: [
      {
        id: 'ann-901',
        label: '正常锥体神经元群',
        category: 'normal',
        color: '#10b981',
        x: 35,
        y: 35,
        width: 32,
        height: 30,
        probability: 0.98,
        description: '尼氏体清晰，胞核居中'
      }
    ],
    heatmapPoints: [
      { x: 50, y: 50, radius: 15, intensity: 0.03, label: '生理皮层基线' }
    ],
    customFields: {
      '取材部位': '前额叶及海马CA1区',
      '固定方式': '4% PFA心脏心脏原位灌流'
    }
  },
  {
    id: 'sample-010',
    sampleCode: 'PAT-2026-PA-0711',
    animalId: 'ANI-2026-SD-08', // 与 sample-003 来自同一只SD大鼠的胰腺病变切片 (动物多脏器对比)
    strain: 'Sprague-Dawley (SD)',
    experimentGroup: 'SAP重症急性胰腺炎模型组',
    testArticle: '雨蛙素 (Cerulein 50μg/kg) + 牛磺胆酸钠',
    pathologyDiagnosis: '重症急性出血坏死性胰腺炎伴小叶间脂肪坏死',
    organ: '胰腺',
    sliceType: 'HE染色',
    isLesion: true,
    lesionName: '凝固性坏死',
    lesionDistribution: '局灶性分布',
    species: 'SD 大鼠',
    gender: '雄性 (Male)',
    ageWeeks: 12,
    samplingDate: '2026-03-10',
    collectorName: '刘佳 实验师',
    pathologistSign: '王海川 主任医师',
    qualityGrade: 'A',
    imageUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    thumbnailUrl: '/src/assets/images/pathology_slide_liver_1789719219265.jpg',
    resolution: '0.25 μm/pixel (40X)',
    stainBatch: 'STAIN-2026-H03-09',
    structuredDescription: {
      histopathologyScore: 4,
      cellularMorphology: '胰腺腺泡细胞广泛崩解、细胞轮廓残存呈均质红染(影细胞)，胞核固缩、碎裂或溶解消失。',
      architecturalChanges: '小叶间结缔组织水肿充血，伴广泛酶性脂肪坏死(钙皂形成)及微血栓形成。',
      inflammationScore: '重度 (大量白细胞浸润)',
      necrosisPercentage: 28.5,
      fibrosisStage: 'S1',
      clinicalDiagnosis: '重症急性坏死性胰腺炎(SAP模型)',
      pathologistRemarks: '雨蛙素联合牛磺胆酸钠逆行注射诱导，病理呈现典型的出血坏死型胰腺损伤。',
      experimentGroup: 'SAP重症急性胰腺炎模型组',
      dosageCohort: 'Cerulein+Na-taurocholate',
      bodyWeight: '272.0g'
    },
    annotations: [
      {
        id: 'ann-1001',
        label: '腺泡凝固性坏死灶',
        category: 'lesion',
        color: '#b91c1c',
        x: 28,
        y: 25,
        width: 48,
        height: 42,
        probability: 0.99,
        description: '腺泡细胞崩解坏死伴嗜酸性均质化'
      }
    ],
    heatmapPoints: [
      { x: 38, y: 35, radius: 52, intensity: 0.99, label: '急性胰腺坏死中心' },
      { x: 65, y: 55, radius: 36, intensity: 0.88, label: '脂肪坏死钙皂灶' }
    ],
    customFields: {
      '造模试剂': '雨蛙素 50μg/kg',
      '淀粉酶检测': '8420 U/L'
    }
  }
];
