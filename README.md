# MaterialQA

A minimal conversational agent that answers materials science questions using Wikipedia as the sole source of truth. The agent retrieves up to 3 relevant Wikipedia articles, synthesizes an answer, and cites exact URLs inline, plus a References section. In multi-turn conversations, it attempts to answer questions from memory first, and then retrieves more articles if a query cant be answered.

## Requirements

- Node.js >= 20.9.0
- An Anthropic API key with credits

## Setup

1. Clone repo and Install dependencies:

```bash
npm install
```

2. Set your Anthropic API key in the environment:

```bash
export ANTHROPIC_API_KEY=your_key_here
```

3. Run `npm run dev` and open the playground at localhost address


## How it works

- Agent: `src/mastra/agents/materials-wikipedia-agent.ts` (MaterialQA)
  - Uses Anthropic Claude 3.5 Sonnet via `@ai-sdk/anthropic`.
  - Uses `wikipedia-search` tool to fetch up to 3 relevant articles.
  - Always cites exact Wikipedia URLs inline and in a References section.
- Tool: `src/mastra/tools/wikipedia-tool.ts`
  - Input: `{ query: string, maxArticles?: number }`
  - Returns: `{ usedQuery, articles: [{ title, url, content }] }`
- Storage: Agent memory persists to memory, has a working memory module to summarize wikipedia artciles

## Rationale

### Framework Choice

I initially started building this agent with LangGraph in Python. However, I quickly realized that I would need to implement many things from scratch - such as multi-turn conversations, memory, and a user interface. The agent graph also became more complex than I anticipated. My WIP LangGraph agent can be found at this github link: 

After some research, I decided to switch to Mastra. I had previously come across it in the book 'Principles of Building AI Agents' (written by the creators of Mastra) and thought it might be a good fit given the constraints of this task and the focus on usability over complex features. Mastra provides:

- A built-in streaming chat UI, so I didn’t need to build one from scratch.
- An easy way to add tools and logic for deciding when to use them.
- Built-in memory modules to handle multi-turn conversations.

These features made it much simpler and faster to implement the agent for this task.

If I were working with a larger set of tools and a more specialized workflow, I might still choose LangGraph with Python for more granular control. But for this project, Mastra was the better choice given the framework support and boilerplates.

