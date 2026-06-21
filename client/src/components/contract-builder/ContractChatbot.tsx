import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Send, X, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { SQUARIO_GREETING, SQUARIO_FALLBACK } from "@shared/chatbot-config";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Props {
  contractMarkdown: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function askContractAI(question: string, context: string): Promise<string> {
  const apiKey = (window as any).__openai_key || "";

  // Fallback to heuristic response if no key
  if (!apiKey) {
    return generateFallbackResponse(question, context);
  }

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a helpful contract assistant for AllSquared, a UK contract platform.
You help users understand and improve their contract. Be concise and practical.
Never provide legal advice — instead suggest seeking a solicitor for complex matters.

Current contract context:
${context.slice(0, 3000)}`,
          },
          { role: "user", content: question },
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    if (!resp.ok) throw new Error("API error");
    const data = await resp.json();
    return data.choices[0]?.message?.content || "Unable to generate response.";
  } catch {
    return generateFallbackResponse(question, context);
  }
}

function generateFallbackResponse(question: string, context: string): string {
  const q = question.toLowerCase();
  if (q.includes("payment") || q.includes("pay")) {
    return "Payment terms define when and how the client pays. The contract uses milestone-based payments held in escrow for security. You can edit the payment milestones and amounts in the contract fields.";
  }
  if (q.includes("terminat") || q.includes("cancel")) {
    return "Termination clauses define how either party can end the agreement. Typically 14 days written notice is required. Upon termination, the client pays for completed work and the provider delivers all work to date.";
  }
  if (q.includes("ip") || q.includes("intellectual property") || q.includes("copyright")) {
    return "IP ownership transfers to the client upon full payment. Until payment is complete, the provider retains ownership. You may want to specify this explicitly if your work involves sensitive IP.";
  }
  if (q.includes("dispute") || q.includes("problem") || q.includes("disagree")) {
    return "The contract includes AllSquared's AI-assisted mediation service as the first step for disputes. This is faster and cheaper than court. If unresolved, parties can escalate to formal mediation or the courts of England and Wales.";
  }
  return SQUARIO_FALLBACK;
}

export function ContractChatbot({ contractMarkdown, open, onOpenChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: SQUARIO_GREETING,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text, timestamp: new Date() }]);
    setLoading(true);

    try {
      const reply = await askContractAI(text, contractMarkdown);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] flex flex-col p-0"
      >
        <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-[#0b1b33] to-[#1f6b3f] text-white">
          <SheetTitle className="flex items-center gap-2 text-white">
            <img src="/squario.svg" alt="Squario" className="w-7 h-7 rounded-md bg-white/10 p-0.5" />
            Squario — UK contract assistant
          </SheetTitle>
          <p className="text-xs text-emerald-100 mt-0.5">AI-assisted contract drafting under English and Welsh common law only.</p>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
              >
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden",
                    msg.role === "user"
                      ? "bg-[#1f6b3f] text-white"
                      : "bg-[#e5f1ea] border border-[#c7d0e0]"
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5" />
                  ) : (
                    <img src="/squario.svg" alt="Squario" className="w-6 h-6" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  )}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-[#e5f1ea] border border-[#c7d0e0] flex items-center justify-center shrink-0 overflow-hidden">
                  <img src="/squario.svg" alt="Squario" className="w-6 h-6" />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t border-border/50 px-4 py-1.5 bg-muted/30">
          <p className="text-[10px] text-muted-foreground text-center leading-tight">
            🇬🇧 English &amp; Welsh common law only. Not legal advice. Consult a solicitor for complex matters.
          </p>
        </div>
        <div className="border-t p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this contract..."
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={send}
            disabled={!input.trim() || loading}
            size="icon"
            className="bg-[#1f6b3f] hover:bg-[#2a8554] text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
