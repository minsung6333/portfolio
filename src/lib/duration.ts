/**
 * day.js를 사용한 경력 기간 실시간 계산 유틸리티
 */
import dayjs from 'dayjs';

export interface DurationResult {
  years: number;
  months: number;
  totalMonths: number;
}

/**
 * 두 날짜 사이의 기간을 계산합니다.
 * @param startDate - 시작일 (YYYY.MM 또는 YYYY-MM 형식)
 * @param endDate - 종료일 (YYYY.MM 또는 YYYY-MM 형식, 없으면 현재 날짜)
 */
export function calculateDuration(
  startDate: string,
  endDate?: string
): DurationResult {
  // YYYY.MM 형식을 YYYY-MM-01 형식으로 변환
  const normalizeDate = (dateStr: string): string => {
    const normalized = dateStr.replace('.', '-');
    return `${normalized}-01`;
  };

  const start = dayjs(normalizeDate(startDate));
  const end = endDate ? dayjs(normalizeDate(endDate)) : dayjs();

  // 총 개월 수 계산 (시작 월 포함)
  const totalMonths = end.diff(start, 'month') + 1;

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return { years, months, totalMonths };
}

/**
 * 기간을 한국어 문자열로 포맷합니다.
 */
export function formatDurationKo(duration: DurationResult): string {
  const { years, months } = duration;

  if (years === 0) {
    return `${months}개월`;
  }

  if (months === 0) {
    return `${years}년`;
  }

  return `${years}년 ${months}개월`;
}

/**
 * 기간을 영어 문자열로 포맷합니다.
 */
export function formatDurationEn(duration: DurationResult): string {
  const { years, months } = duration;

  const yearStr = years === 1 ? '1 year' : `${years} years`;
  const monthStr = months === 1 ? '1 month' : `${months} months`;

  if (years === 0) {
    return monthStr;
  }

  if (months === 0) {
    return yearStr;
  }

  return `${yearStr} ${monthStr}`;
}

/**
 * 기간을 로케일에 맞게 포맷합니다.
 */
export function formatDuration(
  duration: DurationResult,
  locale: string
): string {
  return locale === 'ko'
    ? formatDurationKo(duration)
    : formatDurationEn(duration);
}

/**
 * 회사별 시작일 정보
 */
export const COMPANY_START_DATES: Record<
  string,
  { startDate: string; endDate?: string }
> = {
  klavi: { startDate: '2024.04' }, // 재직중
  nexthub: { startDate: '2022.05', endDate: '2023.02' },
  goldenplanet: { startDate: '2021.03', endDate: '2022.05' },
};

/**
 * 전체 경력 시작일 (첫 회사 시작일)
 */
export const CAREER_START_DATE = '2021.03';

/**
 * 회사 재직 기간을 계산합니다.
 */
export function getCompanyDuration(companyKey: string): DurationResult {
  const company = COMPANY_START_DATES[companyKey];
  if (!company) {
    return { years: 0, months: 0, totalMonths: 0 };
  }
  return calculateDuration(company.startDate, company.endDate);
}

/**
 * 전체 경력 기간을 계산합니다.
 */
export function getTotalCareerDuration(): DurationResult {
  return calculateDuration(CAREER_START_DATE);
}

/**
 * 전체 경력을 연차로 포맷합니다 (예: "4년차" / "4th Year").
 */
export function formatCareerYear(
  duration: DurationResult,
  locale: string
): string {
  // 경력 연차는 올림 (1개월이라도 있으면 다음 연차)
  const totalYears = duration.years + (duration.months > 0 ? 1 : 0);

  if (locale === 'ko') {
    return `${totalYears}년차`;
  }

  const suffix = getOrdinalSuffix(totalYears);
  return `${totalYears}${suffix} Year`;
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
