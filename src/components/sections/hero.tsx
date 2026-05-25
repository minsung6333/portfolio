'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Github, Linkedin, Mail, BookOpen } from 'lucide-react';
import * as gtag from '@/lib/gtag';
import LiquidEther from '@/components/common/liquid-ether';

// Theme-based color palettes
const LIGHT_COLORS = ['#047857', '#059669', '#34d399'];
const DARK_COLORS = ['#059669', '#10b981', '#6ee7b7'];

export function Hero() {
  const t = useTranslations('hero');
  const { resolvedTheme } = useTheme();

  // Use light colors as default during SSR, then switch based on resolved theme
  const liquidColors = resolvedTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  const socialLinks = [
    {
      icon: Github,
      href: 'https://github.com/minsung6333',
      label: 'GitHub',
      gtagLabel: 'github',
    },
    {
      icon: Mail,
      href: 'mailto:sq153@naver.com',
      label: 'Email',
      gtagLabel: 'email',
    },
    {
      icon: BookOpen,
      href: 'https://velog.io/@minsung6333',
      label: 'Velog',
      gtagLabel: 'blog_velog',
    },
  ];

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-16'>
      {/* Background - LiquidEther */}
      <div className='absolute inset-0 -z-10 pointer-events-auto'>
        <LiquidEther
          key={resolvedTheme}
          colors={liquidColors}
          mouseForce={15}
          autoDemo={true}
          autoSpeed={0.5}
          resolution={0.5}
        />
      </div>

      <div className='container mx-auto px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          {/* Name - Large Typography */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight'
          >
            {t('name')}
          </motion.h1>

          {/* Role - Gradient Text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='text-3xl md:text-4xl lg:text-5xl font-bold gradient-text mb-6'
          >
            {t('role')}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 text-balance'
          >
            {t('description')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12'
          >
            <Button size='lg' variant='glass' className='glass-glow' asChild>
              <a
                href='/resume/minsung-seo-resume.pdf'
                download
                onClick={() =>
                  gtag.event({
                    action: 'download',
                    category: 'resume',
                  })
                }
              >
                <Download className='mr-2 h-4 w-4' />
                {t('downloadResume')}
              </a>
            </Button>
            <Button size='lg' variant='glass' asChild>
              <a
                href='https://github.com/minsung6333'
                target='_blank'
                rel='noopener noreferrer'
                onClick={() =>
                  gtag.event({
                    action: 'click',
                    category: 'link',
                    label: 'github',
                  })
                }
              >
                <Github className='mr-2 h-4 w-4' />
                {t('viewGithub')}
              </a>
            </Button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className='flex items-center justify-center gap-4'
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className='relative group p-3 rounded-full liquid-glass hover:liquid-glass-elevated hover:scale-110 transition-all'
                aria-label={link.label}
                onClick={() =>
                  gtag.event({
                    action: 'click',
                    category: 'link',
                    label: link.gtagLabel,
                  })
                }
              >
                <link.icon className='h-5 w-5' />
                <span className='absolute -bottom-8 left-1/2 -translate-x-1/2 px-3 py-1.5 text-xs rounded-lg liquid-glass-elevated opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap'>
                  {link.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator - hidden on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className='hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2'
        >
          <div className='flex flex-col items-center gap-2'>
            <span className='text-xs text-muted-foreground'>Scroll</span>
            <div className='w-6 h-10 rounded-full border-2 border-muted-foreground/50 flex justify-center pt-2'>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className='w-1.5 h-1.5 rounded-full bg-muted-foreground'
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
