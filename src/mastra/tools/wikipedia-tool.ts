import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import wiki from 'wikipedia';

export const wikipediaSearchTool = createTool({
  id: 'wikipedia-search',
  description: 'Search Wikipedia and return up to 3 full articles with URLs.',
  inputSchema: z.object({
    query: z.string().describe('User query or topic to search on Wikipedia'),
    maxArticles: z.number().int().min(1).max(3).default(3),
  }),
  outputSchema: z.object({
    usedQuery: z.string(),
    articles: z.array(z.object({
      title: z.string(),
      url: z.string(),
      content: z.string(),
    })),
  }),
  execute: async ({ context }) => {
    const language = 'en';
    const maxArticles = Math.min(Math.max(context.maxArticles ?? 3, 1), 3);
    const usedQuery = context.query.trim();

    await wiki.setLang(language);

    const { results = [] } = await wiki.search(usedQuery, { limit: maxArticles });
    const top = results.slice(0, maxArticles);

    const articles: { title: string; url: string; content: string }[] = [];
    for (const hit of top) {
      try {
        const page = await wiki.page(hit.title);
        const content = await page.content();
        const url = `https://${language}.wikipedia.org/wiki/${encodeURIComponent(
          hit.title.replace(/ /g, '_'),
        )}`;
        articles.push({ title: hit.title, url, content });
      } catch {
        // Skip failures and continue
      }
    }

    return { usedQuery, articles };
  },
});


