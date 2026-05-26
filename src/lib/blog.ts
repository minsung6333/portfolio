const VELOG_API = 'https://api.velog.io/graphql';
const VELOG_RSS = 'https://v2.velog.io/rss/@minsung6333';
const VELOG_USERNAME = 'minsung6333';
const BLOG_TAG_FILTER = 'rag 논문';

export interface BlogPost {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  thumbnail: string | null;
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  if (locale === 'ko') {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface VelogPost {
  id: string;
  title: string;
  short_description: string;
  slug: string;
  tags: string[];
  thumbnail: string | null;
  released_at: string;
}

/** GraphQL API로 가져오기 (태그 필터링 지원) */
async function fetchByGraphQL(
  limit: number,
  locale: string
): Promise<BlogPost[]> {
  const response = await fetch(VELOG_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{
        posts(username: "${VELOG_USERNAME}") {
          id title short_description slug tags thumbnail released_at
        }
      }`,
    }),
    next: { revalidate: 604800 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`GraphQL ${response.status}`);

  const json = (await response.json()) as {
    data?: { posts?: VelogPost[] };
  };
  const allPosts = json.data?.posts ?? [];

  return allPosts
    .filter((p) =>
      p.tags.some((t) => t.toLowerCase() === BLOG_TAG_FILTER.toLowerCase())
    )
    .slice(0, limit)
    .map((p) => ({
      title: p.title,
      link: `https://velog.io/@${VELOG_USERNAME}/${p.slug}`,
      description: p.short_description ?? '',
      category: BLOG_TAG_FILTER,
      pubDate: formatDate(p.released_at, locale),
      thumbnail: p.thumbnail ?? null,
    }));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

function extractThumbnail(html: string): string | null {
  const decoded = html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');
  const imgMatch = decoded.match(
    /<img\s+[^>]*?src=["'](https?:\/\/[^"']+)["']/i
  );
  return imgMatch ? imgMatch[1] : null;
}

/** RSS 폴백 (최신 글 순서로, 태그 필터 없이) */
async function fetchByRSS(limit: number, locale: string): Promise<BlogPost[]> {
  const response = await fetch(VELOG_RSS, {
    next: { revalidate: 604800 },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) throw new Error(`RSS ${response.status}`);

  const xml = await response.text();
  const items: BlogPost[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemXml = match[1];
    const title =
      itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || '';
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';
    const description =
      itemXml.match(
        /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/
      )?.[1] || '';
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';

    items.push({
      title: stripHtml(title),
      link,
      description: stripHtml(description).slice(0, 150) + '...',
      category: 'blog',
      pubDate: formatDate(pubDate, locale),
      thumbnail: extractThumbnail(description),
    });
  }

  return items;
}

export async function getBlogPosts(
  limit: number = 4,
  locale: string = 'ko'
): Promise<BlogPost[]> {
  if (process.env.SKIP_RSS_FETCH === '1') {
    return [];
  }

  try {
    const posts = await fetchByGraphQL(limit, locale);
    if (posts.length > 0) return posts;
    // GraphQL 성공했지만 태그 매칭 결과 없으면 RSS 폴백
    return fetchByRSS(limit, locale);
  } catch (error) {
    console.error('GraphQL failed, falling back to RSS:', error);
    try {
      return await fetchByRSS(limit, locale);
    } catch (rssError) {
      console.error('RSS also failed:', rssError);
      return [];
    }
  }
}
