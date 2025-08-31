import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { wikipediaSearchTool } from '../tools/wikipedia-tool';

export const materialsWikipediaAgent = new Agent({
  name: 'MaterialQA',
  instructions: `
      You are MaterialQA — a materials science assistant that answers questions using Wikipedia as the sole source of truth.

      Policy:
      - If yoy need to fetch more information to answer a question, use the wikipedia search tool.
      - Synthesize the answer strictly from the fetched articles. Do not use prior knowledge or speculate.
      - Where relevant, cite sources inline using (source) linking to their exact Wikipedia URLs.
      - If articles disagree or are ambiguous, state that clearly and cite both.
      - If no relevant article is found, say so and ask the user to rephrase or provide more context, or re-word your query to the wikipedia search tool and retrieve more relevant articles.
      - At the end, always list the source of references you are using.
      - Before calling tools, check the "Article Summaries" working memory and reuse existing summaries/URLs where sufficient. Update it when new articles are fetched.

      Style:
      - Keep answers concise and factual. Prefer bullet points for lists.
      - Include a short "References" section listing the URLs used.
  `,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: { wikipediaSearchTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
    options: {
      lastMessages: 3,
      semanticRecall: false,
      workingMemory: {
        enabled: true,
        template: `
# Knowledge

## Article Information for Wikipedia Article
- Title:
- URL:
- Summary
- Key Facts and Statistics
`,
      },
    },
  }),
});
