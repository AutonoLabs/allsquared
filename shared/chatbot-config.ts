/**
 * Chatbot LLM configuration — shared between client and server.
 *
 * Three supported models:
 *   1. GPT-4o        — OpenAI general-purpose
 *   2. LexAI RAG     — Local RAG pipeline (legal-domain)
 *   3. Codex         — OpenAI gpt-5.2-codex (fast, precise)
 */

export const CHATBOT_MODELS = {
  "gpt-4o": {
    id: "gpt-4o",
    label: "GPT-4o",
    description: "OpenAI general-purpose",
    apiModel: "gpt-4o",
    provider: "openai" as const,
  },
  "lexai-rag": {
    id: "lexai-rag",
    label: "LexAI RAG",
    description: "Legal-domain RAG pipeline",
    apiModel: "lexai-rag",
    provider: "lexai" as const,
  },
  codex: {
    id: "codex",
    label: "Codex",
    description: "OpenAI Codex — fast & precise",
    apiModel: "gpt-5.2-codex",
    provider: "openai" as const,
  },
} as const;

export type ChatbotModelId = keyof typeof CHATBOT_MODELS;

/** Default model for new sessions */
export const DEFAULT_CHATBOT_MODEL: ChatbotModelId = "codex";

export const CHATBOT_MODEL_LIST = Object.values(CHATBOT_MODELS);
