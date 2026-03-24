import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, X, Bot, User, Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
  sources?: Array<{ citation: string; text: string }>;
}

interface Props {
  contractMarkdown: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContractChatbot({ contractMarkdown, open, onOpenChange }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your contract assistant. Ask me anything about this contract — payment terms, clauses, obligations, or what any section means.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch available models
  const { data: modelsData } = trpc.contractChat.models.useQuery(undefined, {
    staleTime: 60_000,
  });

  const sendMutation = trpc.contractChat.send.useMutation();

  const availableModels = (modelsData?.models || []).filter((m) => m.available);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || sendMutation.isPending) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text, timestamp: new Date() },
    ]);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

      const result = await sendMutation.mutateAsync({
        message: text,
        contractContext: contractMarkdown,
        model: selectedModel,
        history,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.reply,
          timestamp: new Date(),
          model: result.model,
          sources: result.sources?.length ? result.sources : undefined,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error: ${err.message || "Failed to get response. Please try again."}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] flex flex-col p-0"
      >
        <SheetHeader className="px-4 py-3 border-b bg-gradient-to-r from-navy-900 to-violet-700 text-white">
          <SheetTitle className="flex items-center gap-2 text-white">
            <Bot className="w-4 h-4" />
            Contract Assistant
          </SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-7 text-xs bg-white/10 border-white/20 text-white w-[160px]">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
                {availableModels.length === 0 && (
                  <SelectItem value="gpt-4o-mini" disabled>
                    No models available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-violet-200 flex-1">
              {selectedModel === "lexai-rag"
                ? "Legal research + RAG"
                : "AI assistant"}
            </p>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 py-3">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={cn(
                    "flex gap-2",
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      msg.role === "user"
                        ? "bg-violet-600 text-white"
                        : "bg-navy-100 text-navy-700 border border-navy-200"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div
                    className={cn(
                      "max-w-[80%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-tr-sm"
                        : "bg-muted text-foreground rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                    {msg.model && msg.role === "assistant" && (
                      <span className="block text-[10px] mt-1 opacity-50">
                        via {msg.model}
                      </span>
                    )}
                  </div>
                </div>

                {/* LexAI RAG sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="ml-9 mt-1 space-y-1">
                    {msg.sources.map((src, si) => (
                      <div
                        key={si}
                        className="flex items-start gap-1.5 text-[11px] text-muted-foreground bg-muted/50 rounded px-2 py-1"
                      >
                        <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                        <div>
                          {src.citation && (
                            <span className="font-medium">{src.citation}: </span>
                          )}
                          <span className="line-clamp-2">{src.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {sendMutation.isPending && (
              <div className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-navy-100 border border-navy-200 flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5 text-navy-700" />
                </div>
                <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        <div className="border-t p-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about this contract..."
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={sendMutation.isPending}
            className="flex-1"
          />
          <Button
            onClick={send}
            disabled={!input.trim() || sendMutation.isPending}
            size="icon"
            className="bg-violet-600 hover:bg-violet-700 text-white shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
