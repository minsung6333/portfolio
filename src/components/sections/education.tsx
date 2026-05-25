'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  GraduationCap,
  Award,
  Calendar,
  ChevronDown,
  BookOpen,
  Download,
} from 'lucide-react';
import { SpotlightCard } from '@/components/common/spotlight-card';
import * as gtag from '@/lib/gtag';

export function Education() {
  const tEdu = useTranslations('education');
  const tCert = useTranslations('certifications');
  const [isCoursesOpen, setIsCoursesOpen] = useState(false);

  const certifications = tCert.raw('items') as Array<{
    name: string;
    org: string;
    date: string;
    file?: string;
  }>;

  const basicCourses = tEdu.raw('courses.basic.items') as string[];

  // Undergrad data from translation
  const undergrad = tEdu.raw('undergrad') as {
    university: string;
    major: string;
    period: string;
    status: string;
  };

  return (
    <section id='education' className='py-20 md:py-32'>
      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto'>
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className='mb-16'
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-2 rounded-lg liquid-glass-subtle'>
                <GraduationCap className='h-6 w-6 text-point' />
              </div>
              <h2 className='text-3xl md:text-4xl font-bold'>
                {tEdu('title')}
              </h2>
            </div>

            <div className='space-y-4'>
              {/* Graduate School Card */}
              <SpotlightCard>
                <Collapsible
                  open={isCoursesOpen}
                  onOpenChange={(open) => {
                    setIsCoursesOpen(open);
                    gtag.event({
                      action: 'click',
                      category: 'button',
                      label: 'courses_toggle',
                    });
                  }}
                >
                  <Card className='liquid-glass'>
                    <CardHeader>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                          <CardTitle className='text-xl mb-1'>
                            {tEdu('university')}
                          </CardTitle>
                          <p className='text-muted-foreground'>
                            {tEdu('major')}
                          </p>
                        </div>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Calendar className='h-4 w-4' />
                            <span>{tEdu('period')}</span>
                          </div>
                          <Badge variant='glass'>{tEdu('status')}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <span className='text-sm text-muted-foreground'>
                            GPA:
                          </span>
                          <span className='font-semibold gradient-text'>
                            {tEdu('gpa')}
                          </span>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant='ghost' size='sm' className='gap-2'>
                            <BookOpen className='h-4 w-4' />
                            {isCoursesOpen
                              ? tEdu('hideCourses')
                              : tEdu('viewCourses')}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                isCoursesOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                      </div>

                      <AnimatePresence initial={false}>
                        {isCoursesOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              height: { duration: 0.3, ease: 'easeInOut' },
                              opacity: { duration: 0.2, delay: 0.1 },
                            }}
                            className='overflow-hidden'
                          >
                            <div className='space-y-4 pt-4 p-4 liquid-glass-subtle mt-4'>
                              <div>
                                <h3 className='text-sm font-medium text-muted-foreground mb-3'>
                                  {tEdu('courses.basic.title')}
                                </h3>
                                <div className='flex flex-wrap gap-2'>
                                  {basicCourses.map((course) => (
                                    <Badge
                                      key={course}
                                      variant='glass'
                                      className='hover:glass-glow'
                                    >
                                      {course}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </Collapsible>
              </SpotlightCard>

              {/* Undergraduate Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                viewport={{ once: true }}
              >
                <SpotlightCard>
                  <Card className='liquid-glass'>
                    <CardHeader>
                      <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                        <div>
                          <CardTitle className='text-xl mb-1'>
                            {undergrad.university}
                          </CardTitle>
                          <p className='text-muted-foreground'>
                            {undergrad.major}
                          </p>
                        </div>
                        <div className='flex items-center gap-4'>
                          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                            <Calendar className='h-4 w-4' />
                            <span>{undergrad.period}</span>
                          </div>
                          <Badge variant='glass'>{undergrad.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </SpotlightCard>
              </motion.div>
            </div>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className='flex items-center gap-3 mb-8'>
              <div className='p-2 rounded-lg liquid-glass-subtle'>
                <Award className='h-6 w-6 text-point' />
              </div>
              <h2 className='text-3xl md:text-4xl font-bold'>
                {tCert('title')}
              </h2>
            </div>

            <div className='space-y-0'>
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className='relative pl-6 pb-6 border-l-2 border-[var(--timeline-line)] last:pb-0'
                >
                  {/* Timeline dot */}
                  <div className='absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-[var(--timeline-dot-bg)] border-2 border-[var(--timeline-dot-border)] shadow-sm' />

                  {/* Content */}
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                    <div>
                      <h3 className='font-medium'>{cert.name}</h3>
                      <p className='text-sm text-muted-foreground'>
                        {cert.org}
                      </p>
                    </div>
                    <div className='flex items-center gap-2 shrink-0'>
                      <Badge variant='glass' className='w-fit'>
                        {cert.date}
                      </Badge>
                      {cert.file && (
                        <a
                          href={cert.file}
                          download
                          onClick={() =>
                            gtag.event({
                              action: 'download',
                              category: 'project',
                              label: cert.name,
                            })
                          }
                          className='inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-primary border border-primary/30 hover:bg-primary/10 transition-colors'
                        >
                          <Download className='h-3 w-3' />
                          PDF
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
