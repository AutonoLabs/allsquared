/**
 * Chatbot LLM configuration — shared between client and server.
 *
 * Three supported models:
 *   1. GPT-4o    — OpenAI general-purpose
 *   2. LexAI RAG — Local RAG pipeline (legal-domain)
 *   3. Squario   — AllSquared's contract-specialist assistant
 *                  (powered by OpenAI under the hood, fast & precise)
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
  squario: {
    id: "squario",
    label: "Squario",
    description: "AllSquared's contract-specialist assistant — fast & precise",
    apiModel: "gpt-4o",
    provider: "openai" as const,
  },
} as const;

export type ChatbotModelId = keyof typeof CHATBOT_MODELS;

/** Default model for new sessions */
export const DEFAULT_CHATBOT_MODEL: ChatbotModelId = "squario";

export const CHATBOT_MODEL_LIST = Object.values(CHATBOT_MODELS);

/**
 * Squario's opening line — shown when a user opens a fresh chat.
 */
export const SQUARIO_GREETING =
  "Hi, I'm Squario. I can draft a contract, flag a risky clause, or explain a term in plain English. What are we working on?";

/**
 * Squario's fallback message — used when the assistant can't process
 * a request (network blip, model unavailable, malformed input).
 * Designed to acknowledge both failure modes without frustrating the user.
 */
export const SQUARIO_FALLBACK =
  "Hmm, that one didn't land. Try rephrasing, or give me another moment — I might be down so I'll get back to you shortly.";