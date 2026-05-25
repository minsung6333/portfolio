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
import { Calendar, Briefcase, ChevronDown, Users } from 'lucide-react';
import { SpotlightCard } from '@/components/common/spotlight-card';
import {
  formatDuration,
  getCompanyDuration,
  getTotalCareerDuration,
} from '@/lib/duration';

// Details labels for each position
const detailsConfig: Record<string, Record<string, string[]>> = {
  klavi: {
    pm: ['pm_role', 'deliverables'],
    ai: ['dev'],
  },
  nexthub: {
    pm_da: ['pm', 'analysis'],
  },
  goldenplanet: {
    pm_da: ['pm', 'analysis'],
  },
};

function DetailsCollapsible({
  companyKey,
  positionKey,
  t,
}: {
  companyKey: string;
  positionKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const detailKeys = detailsConfig[companyKey]?.[positionKey];
  if (!detailKeys || detailKeys.length === 0) return null;

  // Check if details exist in translations
  let hasDetails = false;
  try {
    const details = t.raw(
      `companies.${companyKey}.positions.${positionKey}.details`
    );
    hasDetails = details && Object.keys(details).length > 0;
  } catch {
    return null;
  }

  if (!hasDetails) return null;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='mt-3'>
      <CollapsibleTrigger className='flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors cursor-pointer'>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
        <span>{isOpen ? t('hideDetails') : t('showDetails')}</span>
      </CollapsibleTrigger>
      <CollapsibleContent className='mt-3 p-3 liquid-glass-subtle space-y-3'>
        {detailKeys.map((detailKey) => {
          let items: string[] = [];
          try {
            items = t.raw(
              `companies.${companyKey}.positions.${positionKey}.details.${detailKey}`
            ) as string[];
          } catch {
            return null;
          }

          if (!items || !Array.isArray(items) || items.length === 0)
            return null;

          return (
            <div
              key={detailKey}
              className='pl-3 border-l border-[var(--timeline-line)] space-y-1'
            >
              {items.map((item: string, i: number) => (
                <p key={i} className='text-xs text-muted-foreground'>
                  • {item}
                </p>
              ))}
            </div>
          );
        })}
      </CollapsibleContent>
    </Collapsible>
  );
}

export function Experience() {
  const t = useTranslations('experience');
  const locale = useLocale();

  // 실시간 경력 기간 계산
  const totalCareerDuration = formatDuration(getTotalCareerDuration(), locale);

  // 회사별 재직 기간 동적 계산
  const getCompanyDurationText = (companyKey: string) => {
    return formatDuration(getCompanyDuration(companyKey), locale);
  };

  const companies = [
    {
      key: 'klavi',
      logo: '/images/logos/klavi.png',
      logoAlt: '클라비',
      positions: ['pm', 'ai'],
    },
    {
      key: 'nexthub',
      logo: '/images/logos/nexthub.jpg',
      logoAlt: '넥스트허브',
      positions: ['pm_da'],
    },
    {
      key: 'goldenplanet',
      logo: '/images/logos/goldenplanet.png',
      logoAlt: '골든플래닛',
      positions: ['pm_da'],
    },
  ];

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
          {companies.map((company, companyIndex) => (
            <motion.div
              key={company.key}
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
                        <div className='relative w-9 h-9 rounded-lg overflow-hidden liquid-glass-subtle'>
                          <Image
                            src={company.logo}
                            alt={company.logoAlt}
                            fill
                            sizes='36px'
                            className='object-contain'
                            unoptimized
                          />
                        </div>
                        <div>
                          <CardTitle className='text-xl'>
                            {t(`companies.${company.key}.name`)}
                          </CardTitle>
                          <p className='text-sm text-muted-foreground'>
                            {t(`companies.${company.key}.type`)}
                          </p>
                        </div>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <Calendar className='h-4 w-4' />
                        <span>{t(`companies.${company.key}.period`)}</span>
                        <Badge variant='glass'>
                          {getCompanyDurationText(company.key)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Positions */}
                  <CardContent className='pt-6'>
                    <div className='space-y-6'>
                      {company.positions.map((position) => (
                        <div
                          key={position}
                          className='relative pl-6 border-l-2 border-[var(--timeline-line)]'
                        >
                          {/* Timeline dot */}
                          <div className='absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--timeline-dot-bg)] border-2 border-[var(--timeline-dot-border)] shadow-sm' />

                          <div className='mb-2'>
                            <h3 className='font-semibold'>
                              {t(
                                `companies.${company.key}.positions.${position}.team`
                              )}
                            </h3>
                            <p className='text-sm text-muted-foreground'>
                              {t(
                                `companies.${company.key}.positions.${position}.period`
                              )}
                            </p>
                            {(() => {
                              try {
                                const teamSize = t.raw(
                                  `companies.${company.key}.positions.${position}.teamSize`
                                );
                                if (typeof teamSize === 'string') {
                                  return (
                                    <div className='flex items-center gap-1 mt-1 text-xs text-muted-foreground'>
                                      <Users className='h-3 w-3' />
                                      <span>{teamSize}</span>
                                    </div>
                                  );
                                }
                                return null;
                              } catch {
                                return null;
                              }
                            })()}
                          </div>

                          <ul className='space-y-2'>
                            {(
                              t.raw(
                                `companies.${company.key}.positions.${position}.projects`
                              ) as string[]
                            ).map((project: string, i: number) => (
                              <li
                                key={i}
                                className='flex items-start gap-2 text-sm text-muted-foreground'
                              >
                                <span className='mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/50 shrink-0' />
                                <span>{project}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Details Collapsible */}
                          <DetailsCollapsible
                            companyKey={company.key}
                            positionKey={position}
                            t={t}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
