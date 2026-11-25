import { PathologySample } from '../types/pathology';

export const ALLOWED_FORMULATIONS = [
  '溶媒',
  '空包LNP',
  '基因治疗产品，mRNA-LNP',
] as const;

export function formatSystemOrganDisplay(sample: Pick<PathologySample, 'system' | 'organ' | 'systemOrgans'>): string {
  if (sample.systemOrgans && sample.systemOrgans.length > 0) {
    return sample.systemOrgans.map(so => `${so.system}/${so.organ}`).join('，');
  }
  return `${sample.system || '消化系统'}/${sample.organ}`;
}

export function formatFormulationDisplay(
  sample: Pick<PathologySample, 'formulation' | 'formulationCategory' | 'testArticleCategory'>
): string {
  if (sample.formulation && (ALLOWED_FORMULATIONS as readonly string[]).includes(sample.formulation)) {
    return sample.formulation;
  }
  if (
    sample.formulationCategory === '溶媒' ||
    sample.testArticleCategory === '溶媒' ||
    sample.formulation?.includes('溶媒')
  ) {
    return '溶媒';
  }
  if (
    sample.formulationCategory === '佐剂' ||
    sample.testArticleCategory === '空包LNP' ||
    sample.formulation?.includes('空包LNP')
  ) {
    return '空包LNP';
  }
  return '基因治疗产品，mRNA-LNP';
}

export function formatSampleYearMonth(dateStr?: string): string {
  if (!dateStr) return '-';
  const match = dateStr.match(/^(\d{4})-(\d{1,2})/);
  if (match) {
    return `${match[1]}年${parseInt(match[2], 10)}月`;
  }
  return dateStr;
}

export function formatLesionDiagnosis(
  sample: Pick<PathologySample, 'isLesion' | 'lesionName'>
): string {
  return sample.isLesion && sample.lesionName && sample.lesionName !== '正常形态'
    ? sample.lesionName
    : '-';
}

const SCORE_MAP: Record<number, string> = {
  1: '轻微',
  2: '轻度',
  3: '中度',
  4: '重度',
  5: '严重',
};

export function formatLesionSeverity(sample: PathologySample): string {
  if (!sample.isLesion) return '-';
  return sample.lesionSeverity || SCORE_MAP[sample.structuredDescription?.histopathologyScore] || '-';
}

export function formatGenderDisplay(gender?: string): string {
  if (!gender) return '-';
  return gender.includes('雌') ? '雌性' : '雄性';
}
