const VELOG_API = 'https://api.velog.io/graphql';
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

export async function getBlogPosts(
  limit: number = 4,
  locale: string = 'ko'
): Promise<BlogPost[]> {
  if (process.env.SKIP_RSS_FETCH === '1') {
    return [];
  }

  try {
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
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Velog API: ${response.status}`);
    }

    const json = (await response.json()) as {
      data?: { posts?: VelogPost[] };
    };
    const allPosts = json.data?.posts ?? [];

    // 태그 필터링 후 limit 적용
    const filtered = allPosts
      .filter((p) =>
        p.tags.some((t) => t.toLowerCase() === BLOG_TAG_FILTER.toLowerCase())
      )
      .slice(0, limit);

    return filtered.map((p) => ({
      title: p.title,
      link: `https://velog.io/@${VELOG_USERNAME}/${p.slug}`,
      description: p.short_description ?? '',
      category: BLOG_TAG_FILTER,
      pubDate: formatDate(p.released_at, locale),
      thumbnail: p.thumbnail ?? null,
    }));
  } catch (error) {
    console.error('Error fetching Velog posts:', error);
    return [];
  }
}
