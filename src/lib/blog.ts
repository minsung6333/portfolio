const RSS_URL = 'https://v2.velog.io/rss/@minsung6333';

export interface BlogPost {
  title: string;
  link: string;
  description: string;
  category: string;
  pubDate: string;
  thumbnail: string | null;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'");
}

function extractThumbnail(html: string): string | null {
  const decoded = decodeHtmlEntities(html);
  // Match src attribute that starts with http (to avoid onerror fallback URLs)
  const imgMatch = decoded.match(
    /<img\s+[^>]*?src=["'](https?:\/\/[^"']+)["']/i
  );
  return imgMatch ? imgMatch[1] : null;
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

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export async function getBlogPosts(
  limit: number = 4,
  locale: string = 'ko'
): Promise<BlogPost[]> {
  if (process.env.SKIP_RSS_FETCH === '1') {
    return [];
  }

  try {
    const response = await fetch(RSS_URL, {
      next: { revalidate: 3600 }, // Revalidate every hour
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status}`);
    }

    const xml = await response.text();

    // Parse items from RSS XML
    const items: BlogPost[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const itemXml = match[1];

      const title =
        itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] ||
        itemXml.match(/<title>([\s\S]*?)<\/title>/)?.[1] ||
        '';

      const link = itemXml.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim() || '';

      const description =
        itemXml.match(
          /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/
        )?.[1] ||
        itemXml.match(/<description>([\s\S]*?)<\/description>/)?.[1] ||
        '';

      const category =
        itemXml.match(
          /<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/
        )?.[1] ||
        itemXml.match(/<category>([\s\S]*?)<\/category>/)?.[1] ||
        '';

      const pubDate =
        itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1] || '';

      items.push({
        title: stripHtml(title),
        link,
        description: stripHtml(description).slice(0, 150) + '...',
        category,
        pubDate: formatDate(pubDate, locale),
        thumbnail: extractThumbnail(description),
      });
    }

    return items;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}
