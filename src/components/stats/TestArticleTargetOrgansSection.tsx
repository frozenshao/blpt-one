import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  CartesianGrid
} from 'recharts';
import { 
  HeartPulse, 
  Activity
} from 'lucide-react';
import { TestArticleCategory } from '../../types/pathology';

interface TargetOrganStat {
  organ: string;
  total: number;
  lesions: number;
  rate: number;
  primaryPathology: string;
  system: string;
}

interface TestArticleProfile {
  id: string;
  category: TestArticleCategory;
  subCategory: string;
  name: string;
  sampleCount: number;
  overallLesionRate: number;
  primaryTargetOrgans: string[];
  targetOrganStats: TargetOrganStat[];
  summaryNote: string;
}

// Comprehensive realistic dataset for nonclinical toxicopathology target organs
const BASE_TEST_ARTICLE_DATASETS: TestArticleProfile[] = [
  {
    id: 'antibody',
    category: '药品',
    subCategory: '抗体',
    name: '抗体类药物 (单抗/双抗/ADC)',
    sampleCount: 380,
    overallLesionRate: 54.2,
    primaryTargetOrgans: ['肝脏', '脾脏', '肾脏', '骨髓'],
    summaryNote: '免疫清除负担与靶向介导的微循环改变，易在单核-吞噬细胞系统（肝、脾、骨髓）富集',
    targetOrganStats: [
      { organ: '肝脏', system: '消化系统', total: 140, lesions: 86, rate: 61.4, primaryPathology: '大泡性脂肪变性、枯否细胞增生及汇管区炎性浸润' },
      { organ: '脾脏', system: '淋巴系统', total: 80, lesions: 46, rate: 57.5, primaryPathology: '滤泡反应性增生伴生发中心活化、巨噬细胞吞噬增加' },
      { organ: '肾脏', system: '泌尿系统', total: 70, lesions: 34, rate: 48.6, primaryPathology: '肾小球系膜基质增宽、肾小管上皮微滴状蛋白蓄积' },
      { organ: '骨髓', system: '骨骼组织', total: 40, lesions: 18, rate: 45.0, primaryPathology: '造血细胞增生反应、网状内皮反应增强' },
      { organ: '心脏', system: '心血管系统', total: 30, lesions: 8, rate: 26.7, primaryPathology: '心肌间质偶见轻度微血管扩张充血' },
      { organ: '肺脏', system: '呼吸系统', total: 20, lesions: 4, rate: 20.0, primaryPathology: '肺泡壁毛细血管轻微充血' }
    ]
  },
  {
    id: 'small_molecule',
    category: '药品',
    subCategory: '小分子化药',
    name: '小分子化药 (激酶抑制剂/细胞毒药)',
    sampleCount: 240,
    overallLesionRate: 62.5,
    primaryTargetOrgans: ['肝脏', '肾脏', '胃肠道', '心肌'],
    summaryNote: '代谢清除与排泄器官为主要靶向受损靶器官，呈现显著的剂量依赖性代谢性损伤',
    targetOrganStats: [
      { organ: '肝脏', system: '消化系统', total: 90, lesions: 64, rate: 71.1, primaryPathology: '中央静脉周围肝细胞嗜酸性变、灶性点状坏死' },
      { organ: '肾脏', system: '泌尿系统', total: 70, lesions: 48, rate: 68.6, primaryPathology: '近曲小管上皮空泡变性、刷状缘脱落坏死' },
      { organ: '胃肠道', system: '消化系统', total: 40, lesions: 22, rate: 55.0, primaryPathology: '胃黏膜表层上皮轻度脱落变薄伴炎性充血' },
      { organ: '心脏', system: '心血管系统', total: 25, lesions: 11, rate: 44.0, primaryPathology: '局灶性心肌肌浆溶解、微小局灶性纤维化' },
      { organ: '脑/神经', system: '神经系统', total: 15, lesions: 5, rate: 33.3, primaryPathology: '脑实质偶见轻度血管周水肿' }
    ]
  },
  {
    id: 'tcm',
    category: '药品',
    subCategory: '中药',
    name: '中药及复方提取物',
    sampleCount: 150,
    overallLesionRate: 46.7,
    primaryTargetOrgans: ['肝脏', '肾脏', '胃'],
    summaryNote: '长期大剂量暴露以慢蓄积性脏器反应为主，停药恢复期具有较好的组织代偿修复能力',
    targetOrganStats: [
      { organ: '肝脏', system: '消化系统', total: 60, lesions: 32, rate: 53.3, primaryPathology: '轻度肝细胞肿胀、色素颗粒沉积' },
      { organ: '肾脏', system: '泌尿系统', total: 50, lesions: 25, rate: 50.0, primaryPathology: '肾小管间质轻度单核细胞浸润' },
      { organ: '胃', system: '消化系统', total: 25, lesions: 8, rate: 32.0, primaryPathology: '黏膜刺激性充血、腺体分泌亢进' },
      { organ: '心脏', system: '心血管系统', total: 15, lesions: 5, rate: 33.3, primaryPathology: '未见明显组织实质结构缺损' }
    ]
  },
  {
    id: 'cell_therapy',
    category: '药品',
    subCategory: '细胞治疗产品',
    name: '细胞治疗产品 (CAR-T/干细胞)',
    sampleCount: 160,
    overallLesionRate: 41.2,
    primaryTargetOrgans: ['肺脏', '脾脏', '肝脏', '脑'],
    summaryNote: '静脉回流首过效应使得肺脏微血管易受累，并可引起宿主免疫组织活化',
    targetOrganStats: [
      { organ: '肺脏', system: '呼吸系统', total: 60, lesions: 28, rate: 46.7, primaryPathology: '肺毛细血管局灶性充血、肺泡隔轻度增厚' },
      { organ: '脾脏', system: '淋巴系统', total: 45, lesions: 21, rate: 46.7, primaryPathology: '红髓充血及外源细胞暂态滞留' },
      { organ: '肝脏', system: '消化系统', total: 35, lesions: 12, rate: 34.3, primaryPathology: '窦状隙内散在单个核炎细胞浸润' },
      { organ: '脑/神经', system: '神经系统', total: 20, lesions: 5, rate: 25.0, primaryPathology: '未见神经实质变性坏死' }
    ]
  },
  {
    id: 'medical_device',
    category: '医疗器械',
    subCategory: '医疗器械产品',
    name: '植入与介入医疗器械 (血管支架/补片/耗材)',
    sampleCount: 380,
    overallLesionRate: 48.9,
    primaryTargetOrgans: ['局部血管/心脏', '皮肤', '肌肉软组织', '局部淋巴结'],
    summaryNote: '以器械接触部位与邻近宿主组织的急慢性异物反应、纤维囊包裹与微血栓为主',
    targetOrganStats: [
      { organ: '心血管', system: '心血管系统', total: 160, lesions: 88, rate: 55.0, primaryPathology: '新生内膜增生、支架小梁周围异物巨细胞反应' },
      { organ: '皮肤', system: '体表组织', total: 90, lesions: 44, rate: 48.9, primaryPathology: '表皮局灶接触性炎、真皮浅层毛细血管扩张充血' },
      { organ: '肌肉软组织', system: '骨骼组织', total: 70, lesions: 34, rate: 48.6, primaryPathology: '假包膜形成、纤维组织局灶性致密增生' },
      { organ: '淋巴结', system: '淋巴系统', total: 60, lesions: 20, rate: 33.3, primaryPathology: '窦组织细胞反应性增生' }
    ]
  },
  {
    id: 'cosmetics',
    category: '化妆品',
    subCategory: '护肤类',
    name: '化妆品 (护肤类/彩妆/特种化妆品)',
    sampleCount: 250,
    overallLesionRate: 42.8,
    primaryTargetOrgans: ['皮肤', '眼角膜/结膜', '耳廓皮下'],
    summaryNote: '表皮通透性屏障与黏膜接触局部刺激性为核心关注靶标，未见明显全身器官毒性',
    targetOrganStats: [
      { organ: '皮肤', system: '体表组织', total: 130, lesions: 62, rate: 47.7, primaryPathology: '表皮角化过度、棘层肥厚伴轻度皮脂腺增生' },
      { organ: '眼角膜/结膜', system: '感官组织', total: 80, lesions: 34, rate: 42.5, primaryPathology: '结膜轻度充血水肿、角膜上皮轻微粗糙' },
      { organ: '耳廓组织', system: '体表组织', total: 40, lesions: 11, rate: 27.5, primaryPathology: '耳廓真皮浅层微血管反应性扩张' }
    ]
  }
];

interface TestArticleTargetOrgansSectionProps {
  timeRange?: 'all' | '1year' | '3years' | '5years' | 'custom';
}

export const TestArticleTargetOrgansSection: React.FC<TestArticleTargetOrgansSectionProps> = ({ 
  timeRange = 'all' 
}) => {
  const [selectedId, setSelectedId] = useState<string>('antibody');

  const testArticleDatasets = useMemo(() => {
    const ratio = timeRange === '1year' ? 0.25 : timeRange === '3years' ? 0.6 : timeRange === '5years' ? 0.85 : 1;
    if (ratio === 1) return BASE_TEST_ARTICLE_DATASETS;
    return BASE_TEST_ARTICLE_DATASETS.map(profile => {
      const scaledStats = profile.targetOrganStats.map(stat => {
        const sTotal = Math.max(8, Math.round(stat.total * ratio));
        const sLesions = Math.max(1, Math.round(stat.lesions * ratio));
        return {
          ...stat,
          total: sTotal,
          lesions: sLesions,
          rate: Number(((sLesions / sTotal) * 100).toFixed(1))
        };
      });
      const sCount = Math.max(20, Math.round(profile.sampleCount * ratio));
      return {
        ...profile,
        sampleCount: sCount,
        targetOrganStats: scaledStats
      };
    });
  }, [timeRange]);

  const currentProfile = useMemo(() => {
    return testArticleDatasets.find(p => p.id === selectedId) || testArticleDatasets[0];
  }, [selectedId, testArticleDatasets]);

  return (
    <div className="bg-white border border-[#a4c3de]/80 p-5 rounded-2xl shadow-xs space-y-5">
      {/* 模块顶部标题栏与受试物类型筛选 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#bcd7ee]/60">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-[#0e3b66]/10 text-[#0e3b66] border border-[#a4c3de]">
            <HeartPulse className="w-5 h-5 text-[#0e3b66]" />
          </span>
          <h3 className="text-base font-bold text-[#102a48] tracking-tight">
            不同受试物的靶器官分析
          </h3>
        </div>

        {/* 受试物类型筛选：展示在右上方（即不同动物种属病变对比统计中性别筛选的位置与样式） */}
        <div className="flex items-center gap-1.5 bg-[#f0f6fc] border border-[#bcd7ee] px-3 py-1.5 rounded-lg text-xs text-[#102a48]">
          <span className="font-medium text-[#102a48]/70">受试物类型:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            aria-label="筛选受试物类型"
            className="bg-transparent font-medium text-[#102a48] focus:outline-hidden cursor-pointer"
          >
            {testArticleDatasets.map((item) => (
              <option key={item.id} value={item.id}>
                {item.subCategory}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 靶器官柱状图对比 */}
      <div className="border border-[#bcd7ee] rounded-xl p-4 bg-white space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#0e3b66]" />
            <span className="text-xs font-bold text-[#102a48]">
              病变率 (%)
            </span>
          </div>
        </div>

        <div className="h-64 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={currentProfile.targetOrganStats} 
              margin={{ top: 15, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="organ" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="%" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as TargetOrganStat;
                    return (
                      <div className="p-2.5 border border-[#bcd7ee] shadow-md rounded-lg bg-white text-xs space-y-1">
                        <div className="font-bold text-[#102a48] border-b border-slate-100 pb-1">{label}</div>
                        <div className="text-slate-600 flex items-center justify-between gap-4">
                          <span>病变率:</span>
                          <span className="font-mono font-semibold text-[#0e3b66]">{data.rate}%</span>
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center justify-between gap-4">
                          <span>病变数/总数:</span>
                          <span className="font-mono">{data.lesions} / {data.total}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} 
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="rate" name="病变率 (%)" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 靶器官病理表征明细列表 - 无框格，统一黑色普通字体不加粗，高度最多8条滚动 */}
      <div className="space-y-2">
        <div className="py-1 flex items-center justify-between">
          <span className="text-xs font-medium text-black">
            共{currentProfile.targetOrganStats.length}条
          </span>
        </div>

        <div className="max-h-[340px] overflow-y-auto overflow-x-auto border border-slate-200/60 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#f0f6fc] text-[#102a48] font-bold border-b border-[#bcd7ee] sticky top-0 z-10 shadow-2xs">
              <tr>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">靶器官名称</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48]">所属系统</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48] text-center">病变数/总数</th>
                <th className="py-2.5 px-3 font-bold text-[#102a48] text-center">病变率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {currentProfile.targetOrganStats.map((row) => (
                <tr key={row.organ} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 text-black font-normal">
                    {row.organ}
                  </td>
                  <td className="py-2.5 px-3 text-black font-normal">{row.system}</td>
                  <td className="py-2.5 px-3 text-center text-black font-normal">
                    {row.lesions} / {row.total}
                  </td>
                  <td className="py-2.5 px-3 text-center text-black font-normal">
                    {row.rate.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
