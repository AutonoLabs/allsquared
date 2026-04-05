import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const LEXAI_API_URL = process.env.LEXAI_API_URL || ''; // e.g. http://localhost:8400

const AI_MODELS = {
  'gpt-4o': { label: 'GPT-4o', provider: 'openai', model: 'gpt-4o' },
  'gpt-4o-mini': { label: 'GPT-4o Mini', provider: 'openai', model: 'gpt-4o-mini' },
  'lexai-rag': { label: 'LexAI RAG', provider: 'lexai', model: 'lexai-rag' },
} as const;

type ModelId = keyof typeof AI_MODELS;

const SYSTEM_PROMPT = `You are a helpful contract assistant for AllSquared, a UK contract platform.
You help users understand and improve their contracts. Be concise and practical.
Always reference English and Welsh law. Never provide legal advice — instead suggest seeking a solicitor for complex matters.`;

async function queryOpenAI(
  question: string,
  context: string,
  model: string,
): Promise<{ reply: string; model: string }> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new TRPCError({ code: 'BAD_REQUEST', message: 'OPENAI_API_KEY not configured' });

  const resp = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: `${SYSTEM_PROMPT}\n\nCurrent contract context:\n${context.slice(0, 3000)}` },
        { role: 'user', content: question },
      ],
      max_tokens: 800,
      temperature: 0.5,
    }),
  });

  if (!resp.ok) {
    const err = await resp.text().catch(() => 'Unknown error');
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `OpenAI API error (${resp.status}): ${err}` });
  }

  const data = await resp.json();
  return {
    reply: data.choices?.[0]?.message?.content || 'No response generated.',
    model,
  };
}

async function queryLexAI(
  question: string,
  context: string,
): Promise<{ reply: string; model: string; sources: Array<{ citation: string; text: string }> }> {
  if (!LEXAI_API_URL) throw new TRPCError({ code: 'BAD_REQUEST', message: 'LEXAI_API_URL not configured' });

  // Query LexAI RAG for relevant legal context
  const ragResp = await fetch(`${LEXAI_API_URL}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: question,
      context_type: 'public',
      top_k: 3,
      rerank: true,
      practice_area: 'contract',
      jurisdiction_primary: 'United Kingdom',
    }),
  });

  if (!ragResp.ok) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: `LexAI API error (${ragResp.status})` });
  }

  const ragData = await ragResp.json();
  const sources = (ragData.sources || []).map((s: any) => ({
    citation: s.citation || '',
    text: (s.text || '').slice(0, 300),
  }));

  // Use the RAG answer enriched with contract context
  let reply = ragData.answer || 'No relevant legal context found.';
  if (context) {
    reply = `Based on your contract and legal research:\n\n${reply}`;
  }

  return {
    reply,
    model: ragData.model_used || 'lexai-rag',
    sources,
  };
}

export const contractChatRouter = router({
  /** List available AI models for chatbot */
  models: protectedProcedure.query(() => {
    const models = Object.entries(AI_MODELS).map(([id, m]) => ({
      id,
      label: m.label,
      provider: m.provider,
      available: m.provider === 'openai'
        ? !!process.env.OPENAI_API_KEY
        : m.provider === 'lexai'
          ? !!LEXAI_API_URL
          : false,
    }));
    return { models };
  }),

  /** Send a message to the contract chatbot */
  send: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      contractContext: z.string().max(5000).default(''),
      model: z.string().default('gpt-4o-mini'),
      history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })).max(20).default([]),
    }))
    .mutation(async ({ input }) => {
      const modelConfig = AI_MODELS[input.model as ModelId];

      if (!modelConfig) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Unknown model: ${input.model}` });
      }

      try {
        if (modelConfig.provider === 'lexai') {
          const result = await queryLexAI(input.message, input.contractContext);
          return {
            reply: result.reply,
            model: result.model,
            sources: result.sources,
          };
        }

        // OpenAI path
        const result = await queryOpenAI(input.message, input.contractContext, modelConfig.model);
        return {
          reply: result.reply,
          model: result.model,
          sources: [] as Array<{ citation: string; text: string }>,
        };
      } catch (err: any) {
        console.error('[contractChat] Error:', err.message);
        throw new Error(err.message || 'Failed to get AI response');
      }
    }),
});
