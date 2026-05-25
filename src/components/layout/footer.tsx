'use client';

import { useTranslations } from 'next-intl';
import { Github, Linkedin, Mail } from 'lucide-react';
import * as gtag from '@/lib/gtag';

export function Footer() {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

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
  ];

  return (
    <footer className='mt-8 p-4'>
      <div className='liquid-glass mx-auto max-w-7xl'>
        <div className='px-6 py-6'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            {/* Copyright */}
            <p className='text-sm text-muted-foreground'>
              &copy; {currentYear} {t('copyright')}
            </p>

            {/* Social Links */}
            <div className='flex items-center gap-3'>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='p-2 rounded-xl liquid-glass-subtle hover:liquid-glass text-muted-foreground hover:text-foreground transition-all'
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
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
