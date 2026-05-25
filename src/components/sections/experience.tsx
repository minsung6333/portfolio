'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Calendar, Briefcase, ChevronDown } from 'lucide-react';
import { SpotlightCard } from '@/components/common/spotlight-card';
import {
  calculateDuration,
  formatDuration,
  getTotalCareerDuration,
} from '@/lib/duration';
import type { NotionCareer, NotionCareerProject } from '@/lib/notion';

// 회사명 → 로고 경로 매핑
const COMPANY_LOGOS: Record<string, { src: string; alt: string }> = {
  '(주)클라비': { src: '/images/logos/klavi.png', alt: '클라비' },
  '(주)넥스트허브': { src: '/images/logos/nexthub.jpg', alt: '넥스트허브' },
  '(주)골든플래닛': {
    src: '/images/logos/goldenplanet.png',
    alt: '골든플래닛',
  },
};

/** "2024.04 – 현재 (1년 10개월)" 형태의 기간 문자열에서 시작/종료일 파싱 */
function parsePeriod(period: string): {
  startDate: string;
  endDate?: string;
} {
  const parts = period
    .replace(/\(.*?\)/g, '')
    .split(/[–\-]/)
    .map((s) => s.trim());
  const startDate = parts[0]?.replace(/\./g, '.') ?? '';
  const endRaw = parts[1]?.trim() ?? '';
  const endDate =
    endRaw &&
    !endRaw.includes('현재') &&
    !endRaw.toLowerCase().includes('present')
      ? endRaw
      : undefined;
  return { startDate, endDate };
}

/** role 그룹핑: 같은 역할끼리 묶어서 표시 순서 결정 */
function groupProjectsByRole(
  projects: NotionCareerProject[]
): { role: string; projects: NotionCareerProject[] }[] {
  const map = new Map<string, NotionCareerProject[]>();
  for (const p of projects) {
    const existing = map.get(p.role) ?? [];
    existing.push(p);
    map.set(p.role, existing);
  }
  return Array.from(map.entries()).map(([role, projects]) => ({
    role,
    projects,
  }));
}

function ProjectDetailsCollapsible({
  project,
  t,
}: {
  project: NotionCareerProject;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const hasDetails =
    project.keyTasks.length > 0 ||
    project.deliverables.length > 0 ||
    project.myRole.length > 0;

  if (!hasDetails) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mt-2 ml-3'>
      <CollapsibleTrigger className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer'>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
        <span>{isOpen ? t('hideDetails') : t('showDetails')}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className='mt-2 p-3 liquid-glass-subtle space-y-3'>
        {project.purpose && (
          <div className='pl-3 border-l border-[var(--timeline-line)]'>
            <p className='text-xs font-medium text-foreground/70 mb-1'>
              수행목적
            </p>
            <p className='text-xs text-muted-foreground'>{project.purpose}</p>
          </div>
        )}
        {project.keyTasks.length > 0 && (
          <div className='pl-3 border-l border-[var(--timeline-line)] space-y-1'>
            <p className='text-xs font-medium text-foreground/70 mb-1'>
              핵심과제
            </p>
            {project.keyTasks.map((task, i) => (
              <p key={i} className='text-xs text-muted-foreground'>
                • {task}
              </p>
            ))}
          </div>
        )}
        {project.deliverables.length > 0 && (
          <div className='pl-3 border-l border-[var(--timeline-line)] space-y-1'>
            <p className='text-xs font-medium text-foreground/70 mb-1'>
              산출물
            </p>
            {project.deliverables.map((d, i) => (
              <p key={i} className='text-xs text-muted-foreground'>
                • {d}
              </p>
            ))}
          </div>
        )}
        {project.myRole.length > 0 && (
          <div className='pl-3 border-l border-[var(--timeline-line)] space-y-1'>
            <p className='text-xs font-medium text-foreground/70 mb-1'>
              본인역할
            </p>
            {project.myRole.map((r, i) => (
              <p key={i} className='text-xs text-muted-foreground'>
                • {r}
              </p>
            ))}
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface ExperienceProps {
  notionCareers: NotionCareer[];
  notionCareerProjects: NotionCareerProject[];
}

export function Experience({
  notionCareers,
  notionCareerProjects,
}: ExperienceProps) {
  const t = useTranslations('experience');
  const locale = useLocale();

  const totalCareerDuration = formatDuration(getTotalCareerDuration(), locale);

  return (
    <section id='experience' className='py-20 md:py-32'>
      <div className='container mx-auto px-4'>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl md:text-4xl font-bold mb-4'>{t('title')}</h2>
          <div className='inline-flex items-center gap-2 px-4 py-2 liquid-glass-subtle'>
            <Briefcase className='h-4 w-4 text-primary' />
            <span className='text-sm font-medium'>{totalCareerDuration}</span>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className='max-w-4xl mx-auto space-y-8'>
          {notionCareers.map((career, companyIndex) => {
            const logo = COMPANY_LOGOS[career.name];
            const { startDate, endDate } = parsePeriod(career.period);
            const duration = calculateDuration(startDate, endDate);
            const durationText = formatDuration(duration, locale);

            // 이 회사에 속한 프로젝트들
            const companyProjects = notionCareerProjects.filter((p) =>
              p.companyIds.includes(career.id)
            );

            // 역할별로 그룹핑
            const roleGroups = groupProjectsByRole(companyProjects);

            return (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: companyIndex * 0.1 }}
                viewport={{ once: true }}
              >
                <SpotlightCard>
                  <Card className='overflow-hidden liquid-glass-interactive'>
                    {/* Company Header */}
                    <CardHeader className='bg-gradient-to-r from-primary/5 to-transparent'>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div className='flex items-center gap-3'>
                          {logo && (
                            <div className='relative w-9 h-9 rounded-lg overflow-hidden liquid-glass-subtle'>
                              <Image
                                src={logo.src}
                                alt={logo.alt}
                                fill
                                sizes='36px'
                                className='object-contain'
                                unoptimized
                              />
                            </div>
                          )}
                          <div>
                            <CardTitle className='text-xl'>
                              {career.name}
                            </CardTitle>
                            <p className='text-sm text-muted-foreground'>
                              {career.companyType}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                          <Calendar className='h-4 w-4' />
                          <span>
                            {career.period.replace(/\(.*?\)/, '').trim()}
                          </span>
                          <Badge variant='glass'>{durationText}</Badge>
                          {career.isCurrent && (
                            <Badge variant='accent'>{t('current')}</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {/* Role Groups */}
                    <CardContent className='pt-6'>
                      <div className='space-y-6'>
                        {roleGroups.map(({ role, projects: roleProjects }) => (
                          <div
                            key={role}
                            className='relative pl-6 border-l-2 border-[var(--timeline-line)]'
                          >
                            {/* Timeline dot */}
                            <div className='absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--timeline-dot-bg)] border-2 border-[var(--timeline-dot-border)] shadow-sm' />

                            <div className='mb-3'>
                              <h3 className='font-semibold'>
                                {career.role} · {role}
                              </h3>
                              <p className='text-sm text-muted-foreground'>
                                {roleProjects[roleProjects.length - 1]?.period
                                  .split('–')[0]
                                  ?.trim() ?? ''}{' '}
                                –{' '}
                                {roleProjects[0]?.period
                                  .split('–')[1]
                                  ?.trim() ?? ''}
                              </p>
                            </div>

                            {/* Projects list */}
                            <ul className='space-y-3'>
                              {roleProjects.map(
                                (project: NotionCareerProject) => (
                                  <li key={project.id}>
                                    <div className='flex items-start gap-2 text-sm text-muted-foreground'>
                                      <span className='mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0' />
                                      <div className='flex-1'>
                                        <span>{project.title}</span>
                                        {project.client && (
                                          <span className='ml-1 text-xs text-muted-foreground/60'>
                                            ({project.client})
                                          </span>
                                        )}
                                        <span className='ml-2 text-xs text-muted-foreground/60'>
                                          {project.period}
                                        </span>
                                        {/* 기술스택 뱃지 */}
                                        {project.tech.length > 0 && (
                                          <div className='flex flex-wrap gap-1 mt-1'>
                                            {project.tech
                                              .slice(0, 4)
                                              .map((tech: string) => (
                                                <Badge
                                                  key={tech}
                                                  variant='outline'
                                                  className='text-[10px] px-1.5 py-0'
                                                >
                                                  {tech}
                                                </Badge>
                                              ))}
                                            {project.tech.length > 4 && (
                                              <Badge
                                                variant='outline'
                                                className='text-[10px] px-1.5 py-0'
                                              >
                                                +{project.tech.length - 4}
                                              </Badge>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    {/* 프로젝트 상세 접기/펼치기 */}
                                    <ProjectDetailsCollapsible
                                      project={project}
                                      t={t}
                                    />
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        ))}

                        {/* 프로젝트 없는 경우 */}
                        {roleGroups.length === 0 && (
                          <p className='text-sm text-muted-foreground pl-6'>
                            {career.role}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
