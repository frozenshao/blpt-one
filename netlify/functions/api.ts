import { INITIAL_PATHOLOGY_SAMPLES } from '../../src/data/mockPathologyData';
import type { PathologyFilterParams, PathologySample } from '../../src/types/pathology';

let pathologySamples: PathologySample[] = [...INITIAL_PATHOLOGY_SAMPLES];

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'content-type': 'application/json; charset=utf-8' },
});

async function readBody(request: Request) {
  try {
    return await request.json() as Record<string, any>;
  } catch {
    return {};
  }
}

function search(params: PathologyFilterParams) {
  let filtered = [...pathologySamples];
  const keyword = params.keyword?.trim().toLowerCase();
  if (keyword) {
    filtered = filtered.filter((item) => [
      item.sampleCode, item.animalId, item.strain, item.experimentGroup,
      item.testArticle, item.pathologyDiagnosis, item.organ, item.lesionName,
      item.species, item.collectorName, item.pathologistSign,
      item.structuredDescription.clinicalDiagnosis,
      item.structuredDescription.pathologistRemarks,
      item.structuredDescription.cellularMorphology,
    ].some((value) => value?.toLowerCase().includes(keyword)));
  }
  if (params.organs?.length) filtered = filtered.filter((item) => params.organs!.includes(item.organ));
  if (params.sliceTypes?.length) filtered = filtered.filter((item) => params.sliceTypes!.includes(item.sliceType));
  if (params.isLesionFilter === 'normal') filtered = filtered.filter((item) => !item.isLesion);
  if (params.isLesionFilter === 'lesion') filtered = filtered.filter((item) => item.isLesion);
  if (params.lesionNames?.length) filtered = filtered.filter((item) => params.lesionNames!.includes(item.lesionName));
  if (params.lesionDistributions?.length) filtered = filtered.filter((item) => params.lesionDistributions!.includes(item.lesionDistribution));
  if (params.species?.length) filtered = filtered.filter((item) => params.species!.includes(item.species));
  if (params.genders?.length) filtered = filtered.filter((item) => params.genders!.includes(item.gender));
  if (typeof params.ageMin === 'number') filtered = filtered.filter((item) => item.ageWeeks >= params.ageMin!);
  if (typeof params.ageMax === 'number') filtered = filtered.filter((item) => item.ageWeeks <= params.ageMax!);
  if (params.dateStart) filtered = filtered.filter((item) => item.samplingDate >= params.dateStart!);
  if (params.dateEnd) filtered = filtered.filter((item) => item.samplingDate <= params.dateEnd!);
  for (const cf of params.customFilters ?? []) {
    if (!cf.field || !cf.value) continue;
    filtered = filtered.filter((item) => {
      const value = item.customFields?.[cf.field]?.toLowerCase();
      if (!value) return false;
      const expected = cf.value.toLowerCase();
      return cf.operator === 'contains' ? value.includes(expected) : value === expected;
    });
  }

  const sortBy = params.sortBy ?? 'samplingDate';
  const direction = params.sortOrder === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    const left = a[sortBy] ?? '';
    const right = b[sortBy] ?? '';
    return left < right ? -direction : left > right ? direction : 0;
  });
  const counts = (field: 'organ' | 'lesionName' | 'species') => pathologySamples.reduce<Record<string, number>>((result, item) => {
    result[item[field]] = (result[item[field]] ?? 0) + 1;
    return result;
  }, {});
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 12;
  const total = filtered.length;
  return {
    success: true, total, page, pageSize,
    totalPages: Math.ceil(total / pageSize),
    data: filtered.slice((page - 1) * pageSize, page * pageSize),
    facets: {
      totalSamples: pathologySamples.length,
      normalCount: pathologySamples.filter((item) => !item.isLesion).length,
      lesionCount: pathologySamples.filter((item) => item.isLesion).length,
      organCounts: counts('organ'), lesionTypeCounts: counts('lesionName'), speciesCounts: counts('species'),
    },
  };
}

function classify(body: Record<string, any>, startTime: number) {
  const rawImage = body.imageBase64 ?? body.image;
  if (typeof rawImage !== 'string' || !rawImage.trim()) return json({ success: false, error: '请提供待识别的病理图像数据 (Base64编码格式)' }, 400);
  if (body.filename?.includes('不合格') || body.filename?.toLowerCase().includes('unqualified')) {
    return json({ success: false, error: `切片文件【${body.filename}】质量或格式不合格，请重新上传合格样本。` }, 400);
  }
  const base64 = rawImage.includes(';base64,') ? rawImage.split(';base64,')[1] : rawImage;
  let hash = 0;
  for (let i = 0; i < Math.min(base64.length, 5000); i += 7) hash = (hash * 31 + base64.charCodeAt(i)) | 0;
  const score = Math.abs(hash % 1000) / 1000;
  const isLesion = score > 0.45;
  const confidence = Number((88.5 + Math.abs(hash % 110) / 10).toFixed(1));
  const lesionProbability = isLesion ? confidence / 100 : (100 - confidence) / 100;
  return json({ success: true, data: {
    classification: isLesion ? '病变组织' : '正常组织', isLesion, confidence,
    confidenceScore: confidence / 100,
    normalProbability: Number((1 - lesionProbability).toFixed(3)),
    lesionProbability: Number(lesionProbability.toFixed(3)),
    lesionTypePredicted: isLesion ? '炎性细胞浸润伴组织结构异常' : '正常形态组织',
    lesionDistributionPredicted: isLesion ? '局灶性聚集' : '无病变(正常)',
    affectedAreaPercentage: isLesion ? Math.floor(25 + score * 50) : 0,
    cellularAnalysis: {
      nuclearAtypia: isLesion ? '细胞核轻-中度异型性，局部核染色加深' : '细胞核大小均匀，染色质分布规则',
      tissueArchitecture: isLesion ? '组织结构连续性局部破坏' : '组织结构排列规整，轮廓清晰',
      inflammatoryInfiltration: isLesion ? '可见炎性细胞灶性浸润' : '未见病理性炎细胞集聚',
      stromalReaction: isLesion ? '间质反应性充血及纤维胶原增多' : '间质形态良好',
      mitoticCount: isLesion ? '核分裂象 1-3 / 10 HPF' : '核分裂象 0 / 10 HPF',
    },
    hotspots: [{ x: isLesion ? 30 + Math.abs((hash >> 3) % 40) : 50, y: isLesion ? 25 + Math.abs((hash >> 5) % 45) : 50, radius: isLesion ? 44 : 20, intensity: isLesion ? 0.94 : 0.05, score: isLesion ? 95 : 5, label: isLesion ? '异常细胞浸润热区' : '均匀生理背景分布' }],
    processingTimeMs: Date.now() - startTime, modelVersion: 'patho-netlify-preview-v1', isFallback: true,
    warningMessage: '预览环境使用可复现的本地病理图像演示模型。',
    suggestedAction: isLesion ? '建议调取连续切片做免疫组化复核。' : '未见明显组织学病变指标。', timestamp: new Date().toISOString(),
  } });
}

export default async (request: Request) => {
  const startTime = Date.now();
  const { pathname } = new URL(request.url);
  const body = request.method === 'POST' ? await readBody(request) : {};
  if (request.method === 'POST' && pathname.endsWith('/pathology/search')) return json(search(body as PathologyFilterParams));
  if (request.method === 'POST' && pathname.endsWith('/pathology/classify')) return classify(body, startTime);
  if (request.method === 'POST' && pathname.endsWith('/pathology/sample')) {
    const sample = { id: `sample-${Date.now()}`, sampleCode: `PAT-${new Date().getFullYear()}-USR-${Math.floor(1000 + Math.random() * 9000)}`, samplingDate: new Date().toISOString().slice(0, 10), collectorName: '当前系统研究员', pathologistSign: 'AI辅助诊断系统 (待专家复核)', qualityGrade: 'A', ...body } as PathologySample;
    pathologySamples.unshift(sample);
    return json({ success: true, data: sample });
  }
  if (request.method === 'GET' && pathname.includes('/pathology/sample/')) {
    const id = decodeURIComponent(pathname.split('/pathology/sample/')[1]);
    const sample = pathologySamples.find((item) => item.id === id || item.sampleCode === id);
    return sample ? json({ success: true, data: sample }) : json({ success: false, message: '未找到该病理样本切片数据' }, 404);
  }
  if (request.method === 'GET' && pathname.endsWith('/pathology/stats')) {
    const lesionCount = pathologySamples.filter((item) => item.isLesion).length;
    return json({ success: true, data: { totalSamples: pathologySamples.length, lesionCount, normalCount: pathologySamples.length - lesionCount, lesionRate: Number(((lesionCount / pathologySamples.length) * 100).toFixed(1)) } });
  }
  return json({ success: false, error: 'Not found' }, 404);
};
