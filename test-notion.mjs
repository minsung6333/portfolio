import { Client } from '@notionhq/client';
import { readFileSync } from 'fs';

// .env 파일 수동 파싱
const env = Object.fromEntries(
  readFileSync('.env', 'utf8').split('\n')
    .filter(l => l.includes('='))
    .map(l => l.split('=').map(s => s.trim()))
);

const notion = new Client({ auth: env.NOTION_API_KEY });

const res = await notion.databases.query({
  database_id: '32bf47e9-13f3-429d-841f-121da5253a10',
  filter: { property: '게시여부', checkbox: { equals: true } },
  sorts: [{ property: '순서', direction: 'ascending' }],
});

console.log('✅ 연결 성공! 프로젝트 수:', res.results.length);
res.results.forEach(p =>
  console.log(' -', p.properties['프로젝트명']?.title?.[0]?.plain_text)
);
