/** Only accept user-role history from the client to reduce prompt-injection via fake assistant turns. */
export function sanitizeChatHistory(
  history: Array<{ role: 'user' | 'assistant'; content: string }> | undefined,
  maxMessages = 8,
  maxContentLength = 2000
): Array<{ role: 'user'; content: string }> {
  if (!history?.length) return [];

  return history
    .slice(-maxMessages)
    .filter((m) => m.role === 'user' && typeof m.content === 'string')
    .map((m) => ({
      role: 'user' as const,
      content: m.content.slice(0, maxContentLength),
    }));
}

export function sanitizeContractContext(context: string | undefined, maxLength = 4000): string {
  if (!context) return '';
  return context.slice(0, maxLength);
}
