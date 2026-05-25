import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://minsung6333.vercel.app'),
  title: {
    default: '서민성 | AI PM & Engineer',
    template: '%s | 서민성',
  },
  description:
    '4년차 AI PM & Engineer 서민성입니다. 생성형 AI·RAG 기반 챗봇을 기획하고 직접 구현하는 AI PM입니다.',
  keywords: [
    'AI PM',
    'AI Engineer',
    'RAG',
    'LLM',
    '생성형AI',
    '챗봇',
    '포트폴리오',
    '서민성',
  ],
  authors: [{ name: '서민성' }],
  creator: '서민성',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    siteName: '서민성 Portfolio',
    title: '서민성 | AI PM & Engineer',
    description:
      '4년차 AI PM & Engineer 서민성입니다. 생성형 AI·RAG 기반 챗봇을 기획하고 직접 구현하는 AI PM입니다.',
    images: [
      {
        url: '/title_image.png',
        width: 1200,
        height: 630,
        alt: '서민성 AI PM & Engineer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '서민성 | AI PM & Engineer',
    description: '4년차 AI PM & Engineer 포트폴리오',
    images: ['/title_image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
