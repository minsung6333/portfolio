import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

const DB = {
  sideProjects: process.env.NOTION_SIDE_PROJECTS_DB_ID!,
  career: process.env.NOTION_CAREER_DB_ID!,
  careerProjects: process.env.NOTION_CAREER_PROJECTS_DB_ID!,
};

// ── 타입 ────────────────────────────────────────────────────────────────────

export interface NotionSideProject {
  id: string;
  title: string;
  description: string;
  role: string;
  period: string;
  tech: string[];
  features: string[];
  overview: string;
  tasks: string[];
  github: string;
  cardStyle: 'editorial' | 'glass';
  order: number;
}

export interface NotionCareer {
  id: string;
  name: string;
  period: string;
  role: string;
  companyType: string;
  headcount: string;
  employmentType: string;
  isCurrent: boolean;
  order: number;
}

// ── 텍스트 추출 헬퍼 ────────────────────────────────────────────────────────

type NotionProp = Record<string, unknown>;

function getText(prop: NotionProp | undefined | null): string {
  if (!prop) return '';
  if (prop.type === 'title') {
    const items = prop.title as Array<{ plain_text: string }>;
    return items?.map((r) => r.plain_text).join('') ?? '';
  }
  if (prop.type === 'rich_text') {
    const items = prop.rich_text as Array<{ plain_text: string }>;
    return items?.map((r) => r.plain_text).join('') ?? '';
  }
  if (prop.type === 'url') return (prop.url as string) ?? '';
  if (prop.type === 'select') {
    const sel = prop.select as { name: string } | null;
    return sel?.name ?? '';
  }
  if (prop.type === 'checkbox') return prop.checkbox ? '__YES__' : '__NO__';
  if (prop.type === 'number') return String((prop.number as number) ?? 0);
  if (prop.type === 'multi_select') {
    const items = prop.multi_select as Array<{ name: string }>;
    return items?.map((s) => s.name).join(',') ?? '';
  }
  return '';
}

function toLines(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

// ── 사이드 프로젝트 fetch ───────────────────────────────────────────────────

export async function getSideProjects(): Promise<NotionSideProject[]> {
  const res = await notion.databases.query({
    database_id: DB.sideProjects,
    filter: { property: '게시여부', checkbox: { equals: true } },
    sorts: [{ property: '순서', direction: 'ascending' }],
  });

  return res.results.map((page) => {
    const p = (page as { properties: Record<string, NotionProp> }).properties;
    return {
      id: page.id,
      title: getText(p['프로젝트명']),
      description: getText(p['설명']),
      role: getText(p['역할']),
      period: getText(p['기간']),
      tech: getText(p['기술스택']).split(',').filter(Boolean),
      features: toLines(getText(p['주요특징'])),
      overview: getText(p['개요']),
      tasks: toLines(getText(p['주요작업'])),
      github: getText(p['GitHub']),
      cardStyle: (getText(p['카드스타일']) as 'editorial' | 'glass') || 'glass',
      order: Number(getText(p['순서'])),
    };
  });
}

export interface NotionCareerProject {
  id: string;
  title: string;
  companyIds: string[]; // 소속회사 relation에서 추출한 page ID 배열
  role: string; // PM | AI Engineer | 데이터 분석가 | PM+AI Engineer
  period: string;
  client: string; // 고객사
  purpose: string; // 수행목적
  keyTasks: string[]; // 핵심과제
  deliverables: string[]; // 산출물
  myRole: string[]; // 본인역할
  tech: string[]; // 기술스택
  order: number;
}

// ── 경력사항 fetch ──────────────────────────────────────────────────────────

export async function getCareers(): Promise<NotionCareer[]> {
  const res = await notion.databases.query({
    database_id: DB.career,
    filter: { property: '게시여부', checkbox: { equals: true } },
    sorts: [{ property: '순서', direction: 'ascending' }],
  });

  return res.results.map((page) => {
    const p = (page as { properties: Record<string, NotionProp> }).properties;
    return {
      id: page.id,
      name: getText(p['회사명']),
      period: getText(p['기간']),
      role: getText(p['직책']),
      companyType: getText(p['회사유형']),
      headcount: getText(p['직원수']),
      employmentType: getText(p['고용형태']),
      isCurrent: getText(p['현재재직중']) === '__YES__',
      order: Number(getText(p['순서'])),
    };
  });
}

// ── 경력 프로젝트 fetch ─────────────────────────────────────────────────────

/** relation 프로퍼티에서 page ID 배열 추출 */
function getRelationIds(prop: NotionProp | undefined | null): string[] {
  if (!prop || prop.type !== 'relation') return [];
  const items = prop.relation as Array<{ id: string }>;
  return items?.map((r) => r.id) ?? [];
}

export async function getCareerProjects(): Promise<NotionCareerProject[]> {
  const res = await notion.databases.query({
    database_id: DB.careerProjects,
    filter: { property: '게시여부', checkbox: { equals: true } },
    sorts: [{ property: '순서', direction: 'ascending' }],
  });

  return res.results.map((page) => {
    const p = (page as { properties: Record<string, NotionProp> }).properties;
    return {
      id: page.id,
      title: getText(p['프로젝트명']),
      companyIds: getRelationIds(p['소속회사']),
      role: getText(p['역할']),
      period: getText(p['기간']),
      client: getText(p['고객사']),
      purpose: getText(p['수행목적']),
      keyTasks: toLines(getText(p['핵심과제'])),
      deliverables: toLines(getText(p['산출물'])),
      myRole: toLines(getText(p['본인역할'])),
      tech: (() => {
        try {
          const raw = getText(p['기술스택']);
          return JSON.parse(raw) as string[];
        } catch {
          return [];
        }
      })(),
      order: Number(getText(p['순서'])),
    };
  });
}
