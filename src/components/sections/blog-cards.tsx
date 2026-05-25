'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, ExternalLink, ArrowRight } from 'lucide-react';
import { SpotlightCard } from '@/components/common/spotlight-card';
import type { BlogPost } from '@/lib/blog';
import * as gtag from '@/lib/gtag';

interface BlogCardsProps {
  posts: BlogPost[];
  title: string;
  subtitle: string;
  viewAll: string;
}

export function BlogCards({ posts, title, subtitle, viewAll }: BlogCardsProps) {
  return (
    <>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className='mb-12'
      >
        <div className='flex items-center gap-3 mb-4'>
          <div className='p-2 rounded-lg liquid-glass-subtle'>
            <BookOpen className='h-6 w-6 text-point' />
          </div>
          <h2 className='text-3xl md:text-4xl font-bold'>{title}</h2>
        </div>
        <p className='text-lg text-muted-foreground'>{subtitle}</p>
      </motion.div>

      {/* Blog Posts Grid */}
      {posts.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {posts.map((post, index) => (
            <SpotlightCard key={post.link} className='h-full'>
              <motion.a
                href={post.link}
                target='_blank'
                rel='noopener noreferrer'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className='group h-full block'
                onClick={() =>
                  gtag.event({
                    action: 'click',
                    category: 'link',
                    label: 'blog_post',
                  })
                }
              >
                <Card className='h-full overflow-hidden liquid-glass-interactive'>
                  {/* Thumbnail or Gradient */}
                  <div className='relative h-40 overflow-hidden'>
                    {post.thumbnail ? (
                      <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes='(max-width: 768px) 100vw, 384px'
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                        unoptimized
                      />
                    ) : (
                      <div className='w-full h-full gradient-bg opacity-20 flex items-center justify-center'>
                        <BookOpen className='h-12 w-12 text-muted-foreground/30' />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300' />
                  </div>

                  {/* Content */}
                  <div className='p-5'>
                    {/* Category Badge */}
                    {post.category && (
                      <Badge
                        variant='glass'
                        className='mb-3 text-xs hover:glass-glow'
                      >
                        {post.category}
                      </Badge>
                    )}

                    {/* Title */}
                    <h3 className='font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors'>
                      {post.title}
                    </h3>

                    {/* Date */}
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                      <Calendar className='h-4 w-4' />
                      <span>{post.pubDate}</span>
                    </div>
                  </div>

                  {/* External link indicator */}
                  <div className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <div className='p-1.5 rounded-full liquid-glass-elevated'>
                      <ExternalLink className='h-4 w-4 text-primary' />
                    </div>
                  </div>
                </Card>
              </motion.a>
            </SpotlightCard>
          ))}
        </div>
      ) : (
        <div className='text-center py-12 text-muted-foreground'>
          Loading blog posts...
        </div>
      )}

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        viewport={{ once: true }}
        className='text-center'
      >
        <Button
          variant='outline'
          size='lg'
          asChild
          className='group liquid-glass hover:liquid-glass-elevated'
        >
          <a
            href='https://velog.io/@minsung6333'
            target='_blank'
            rel='noopener noreferrer'
            onClick={() =>
              gtag.event({
                action: 'click',
                category: 'link',
                label: 'blog_tistory',
              })
            }
          >
            {viewAll}
            <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
          </a>
        </Button>
      </motion.div>
    </>
  );
}
