'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, Github } from 'lucide-react';
import type { NotionSideProject } from '@/lib/notion';

interface PersonalProjectModalProps {
  project: NotionSideProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalProjectModal({
  project,
  open,
  onOpenChange,
}: PersonalProjectModalProps) {
  const t = useTranslations('personalProjects');

  if (!project) return null;

  const hasGithub = !!project.github;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold'>
            {project.title}
          </DialogTitle>
          <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2'>
            <div className='flex items-center gap-2'>
              <Briefcase className='h-4 w-4' />
              <span>{project.role}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Calendar className='h-4 w-4' />
              <span>{project.period}</span>
            </div>
          </div>
        </DialogHeader>

        {/* Overview */}
        {project.overview && (
          <div className='mt-6'>
            <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-primary rounded-full' />
              {t('modal.overview')}
            </h3>
            <p className='text-muted-foreground leading-relaxed'>
              {project.overview}
            </p>
          </div>
        )}

        {project.tasks.length > 0 && <Separator className='my-4' />}

        {/* Key Tasks */}
        {project.tasks.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-primary rounded-full' />
              {t('modal.tasks')}
            </h3>
            <ul className='space-y-2'>
              {project.tasks.map((task, index) => (
                <li
                  key={index}
                  className='flex items-start gap-3 text-muted-foreground'
                >
                  <span className='mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.tech.length > 0 && <Separator className='my-4' />}

        {/* Tech Stack */}
        {project.tech.length > 0 && (
          <div>
            <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-primary rounded-full' />
              {t('modal.techStack')}
            </h3>
            <div className='flex flex-wrap gap-2'>
              {project.tech.map((item) => (
                <Badge key={item} variant='secondary' className='text-sm'>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hasGithub && <Separator className='my-4' />}

        {/* Links */}
        {hasGithub && (
          <div>
            <h3 className='text-lg font-semibold mb-3 flex items-center gap-2'>
              <span className='w-1 h-5 bg-primary rounded-full' />
              {t('modal.links')}
            </h3>
            <Button asChild variant='outline' size='sm'>
              <a
                href={project.github}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Github className='mr-2 h-4 w-4' />
                GitHub Repository
              </a>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
