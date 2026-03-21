/**
 * New Contract Builder — Simplified UX
 * 
 * Flow:
 * 1. Party A (you) — company lookup + address → save profile
 * 2. Party B (counterparty) — company lookup + address
 * 3. Add modules (clause banks) to contract
 * 4. Answer questions per module
 * 5. Chatbot side panel guides through it
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  ArrowLeft, ArrowRight, Building2, User, FileText, Plus, Check,
  MessageSquare, Send, Loader2, Save, Search, X, ChevronDown,
  Shield, Scale, Clock, Banknote,
} from "lucide-react";
import CompanyLookup from "@/components/CompanyLookup";

// ── Types ──────────────────────────────────────────────────────────

interface PartyInfo {
  type: "individual" | "company";
  name: string;
  companyNumber: string;
  address: string;
  addressObj: {
    line1: string;
    line2: string;
    city: string;
    county: string;
    postcode: string;
  };
  email: string;
  phone: string;
}

interface ContractModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  questions: ModuleQuestion[];
}

interface ModuleQuestion {
  id: string;
  question: string;
  type: "text" | "select" | "number" | "date" | "toggle";
  options?: string[];
  default?: string;
  answer: string;
}

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
}

// ── Default Modules ────────────────────────────────────────────────

const DEFAULT_MODULES: ContractModule[] = [
  {
    id: "scope",
    name: "Scope of Work",
    description: "Define what's being delivered",
    icon: "FileText",
    enabled: true,
    questions: [
      { id: "scope_desc", question: "Describe the work to be done", type: "text", answer: "" },
      { id: "scope_deliverables", question: "List the key deliverables", type: "text", answer: "" },
      { id: "scope_exclusions", question: "Any exclusions? (things NOT included)", type: "text", answer: "" },
    ],
  },
  {
    id: "payment",
    name: "Payment Terms",
    description: "How and when payments are made",
    icon: "Banknote",
    enabled: true,
    questions: [
      { id: "pay_total", question: "Total contract value (£)", type: "number", answer: "" },
      { id: "pay_currency", question: "Currency", type: "select", options: ["GBP", "USD", "EUR"], default: "GBP", answer: "GBP" },
      { id: "pay_schedule", question: "Payment schedule", type: "select", options: ["Upfront", "50/50", "Milestones", "On completion", "Monthly"], answer: "" },
      { id: "pay_late", question: "Late payment interest rate (%)", type: "number", default: "8", answer: "8" },
    ],
  },
  {
    id: "timeline",
    name: "Timeline & Milestones",
    description: "Start date, end date, key milestones",
    icon: "Clock",
    enabled: true,
    questions: [
      { id: "time_start", question: "Start date", type: "date", answer: "" },
      { id: "time_end", question: "Expected completion date", type: "date", answer: "" },
      { id: "time_milestones", question: "Key milestones (one per line)", type: "text", answer: "" },
    ],
  },
  {
    id: "escrow",
    name: "Escrow Protection",
    description: "Hold funds in escrow until milestones are met",
    icon: "Shield",
    enabled: false,
    questions: [
      { id: "escrow_amount", question: "Amount to hold in escrow (£)", type: "number", answer: "" },
      { id: "escrow_release", question: "Release trigger", type: "select", options: ["Milestone completion", "Client approval", "Automatic after 14 days"], answer: "" },
    ],
  },
  {
    id: "ip",
    name: "Intellectual Property",
    description: "Who owns what's created",
    icon: "Scale",
    enabled: false,
    questions: [
      { id: "ip_ownership", question: "IP ownership on completion", type: "select", options: ["Transfers to client", "Stays with provider", "Joint ownership", "Licensed to client"], answer: "" },
      { id: "ip_preexisting", question: "Pre-existing IP exclusions", type: "text", answer: "" },
    ],
  },
  {
    id: "disputes",
    name: "Dispute Resolution",
    description: "How disagreements are handled",
    icon: "Scale",
    enabled: true,
    questions: [
      { id: "dispute_method", question: "Primary dispute resolution method", type: "select", options: ["Mediation first", "Arbitration", "Court proceedings", "AllSquared ADR"], default: "AllSquared ADR", answer: "AllSquared ADR" },
      { id: "dispute_jurisdiction", question: "Governing law", type: "select", options: ["England & Wales", "Scotland", "Northern Ireland"], default: "England & Wales", answer: "England & Wales" },
    ],
  },
  {
    id: "confidentiality",
    name: "Confidentiality & NDA",
    description: "Protect sensitive information",
    icon: "Shield",
    enabled: false,
    questions: [
      { id: "nda_duration", question: "Confidentiality period after contract ends", type: "select", options: ["1 year", "2 years", "5 years", "Indefinite"], answer: "" },
      { id: "nda_scope", question: "What's confidential?", type: "select", options: ["All shared information", "Only marked 'Confidential'", "Technical information only"], answer: "" },
    ],
  },
  {
    id: "termination",
    name: "Termination",
    description: "How either party can end the contract",
    icon: "X",
    enabled: true,
    questions: [
      { id: "term_notice", question: "Notice period for termination", type: "select", options: ["7 days", "14 days", "30 days", "60 days"], default: "30 days", answer: "30 days" },
      { id: "term_breach", question: "Cure period for breach", type: "select", options: ["7 days", "14 days", "30 days"], default: "14 days", answer: "14 days" },
    ],
  },
];

// ── Component ──────────────────────────────────────────────────────

export default function NewContractBuilder() {
  const [, setLocation] = useLocation();
  
  // Steps: parties → modules → questions → review
  const [step, setStep] = useState(0);
  const [contractTitle, setContractTitle] = useState("");
  
  // Party info
  const [partyA, setPartyA] = useState<PartyInfo>({
    type: "company", name: "", companyNumber: "", address: "",
    addressObj: { line1: "", line2: "", city: "", county: "", postcode: "" },
    email: "", phone: "",
  });
  const [partyB, setPartyB] = useState<PartyInfo>({
    type: "company", name: "", companyNumber: "", address: "",
    addressObj: { line1: "", line2: "", city: "", county: "", postcode: "" },
    email: "", phone: "",
  });
  
  // Modules
  const [modules, setModules] = useState<ContractModule[]>(DEFAULT_MODULES);
  const [activeModuleIdx, setActiveModuleIdx] = useState(0);
  
  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hi! I'm here to help you build your contract. Let's start with the parties involved. Who is Party A (you or your company)?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Save
  const saveMutation = trpc.templateBuilder.saveContractDraft.useMutation({
    onSuccess: (data) => {
      toast.success("Contract saved!");
      setLocation(`/dashboard/contracts/${data.contractId}`);
    },
    onError: (err) => toast.error(err.message),
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const enabledModules = modules.filter(m => m.enabled);

  function toggleModule(moduleId: string) {
    setModules(modules.map(m => 
      m.id === moduleId ? { ...m, enabled: !m.enabled } : m
    ));
  }

  function updateAnswer(moduleId: string, questionId: string, answer: string) {
    setModules(modules.map(m => 
      m.id === moduleId 
        ? { ...m, questions: m.questions.map(q => q.id === questionId ? { ...q, answer } : q) }
        : m
    ));
  }

  function sendChat() {
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, 
      { role: "user", content: chatInput },
      { role: "assistant", content: getChatResponse(chatInput, step) },
    ]);
    setChatInput("");
  }

  function getChatResponse(input: string, currentStep: number): string {
    // Simple contextual responses — in production, wire to LexAI
    if (currentStep === 0) {
      return "Great. Once you've entered both parties' details, click 'Next' to choose which modules to include in your contract.";
    }
    if (currentStep === 1) {
      return "Toggle on the modules you need. At minimum, you'll want Scope of Work, Payment Terms, and Timeline. Escrow protection is recommended for contracts over £10,000.";
    }
    if (currentStep === 2) {
      return "Fill in the details for each module. If you're unsure about anything, I can explain what each option means. Just ask!";
    }
    return "Your contract is ready for review. Check the summary and click 'Save & Send for Signature' when you're happy.";
  }

  // ── Render Functions ────────────────────────────────────────────

  function renderPartyForm(party: PartyInfo, setParty: (p: PartyInfo) => void, label: string) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{label}</CardTitle>
          <CardDescription>Enter details or search Companies House</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Type toggle */}
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setParty({ ...party, type: "individual" })}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                party.type === "individual" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <User className="inline h-4 w-4 mr-1" /> Individual
            </button>
            <button
              type="button"
              onClick={() => setParty({ ...party, type: "company" })}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                party.type === "company" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Building2 className="inline h-4 w-4 mr-1" /> Company
            </button>
          </div>

          {party.type === "company" ? (
            <CompanyLookup
              label={`${label} — Company Name`}
              onSelect={(company) => {
                setParty({
                  ...party,
                  name: company.companyName,
                  companyNumber: company.companyNumber,
                  address: company.address,
                  addressObj: company.addressObj || party.addressObj,
                });
              }}
              initialValue={party.name}
            />
          ) : (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={party.name}
                onChange={(e) => setParty({ ...party, name: e.target.value })}
                placeholder="Full legal name"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={party.email}
                onChange={(e) => setParty({ ...party, email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                type="tel"
                value={party.phone}
                onChange={(e) => setParty({ ...party, phone: e.target.value })}
                placeholder="+44 20 1234 5678"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label>Address</Label>
            {party.address ? (
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <Check className="inline h-4 w-4 text-emerald-500 mr-1" />
                {party.address}
                <button
                  type="button"
                  onClick={() => setParty({ ...party, address: "", addressObj: { line1: "", line2: "", city: "", county: "", postcode: "" } })}
                  className="ml-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="inline h-3 w-3" /> Change
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                <Input
                  value={party.addressObj.line1}
                  onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, line1: e.target.value } })}
                  placeholder="Address line 1"
                />
                <Input
                  value={party.addressObj.line2}
                  onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, line2: e.target.value } })}
                  placeholder="Address line 2 (optional)"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={party.addressObj.city}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, city: e.target.value } })}
                    placeholder="City"
                  />
                  <Input
                    value={party.addressObj.county}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, county: e.target.value } })}
                    placeholder="County"
                  />
                  <Input
                    value={party.addressObj.postcode}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, postcode: e.target.value } })}
                    placeholder="Postcode"
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  function renderStep0() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Create a new contract</h1>
          <p className="text-muted-foreground mt-1">Enter details for both parties</p>
        </div>

        <div className="space-y-2">
          <Label>Contract Title</Label>
          <Input
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            placeholder="e.g. Website Development Agreement"
            className="text-lg h-12"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderPartyForm(partyA, setPartyA, "Party A (You)")}
          {renderPartyForm(partyB, setPartyB, "Party B (Counterparty)")}
        </div>
      </div>
    );
  }

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Choose contract modules</h1>
          <p className="text-muted-foreground mt-1">Toggle on the sections you need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Card key={mod.id} className={`cursor-pointer transition-all ${mod.enabled ? "border-primary shadow-sm" : "opacity-60"}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mod.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {mod.icon === "FileText" && <FileText className="h-5 w-5" />}
                      {mod.icon === "Banknote" && <Banknote className="h-5 w-5" />}
                      {mod.icon === "Clock" && <Clock className="h-5 w-5" />}
                      {mod.icon === "Shield" && <Shield className="h-5 w-5" />}
                      {mod.icon === "Scale" && <Scale className="h-5 w-5" />}
                      {mod.icon === "X" && <X className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{mod.name}</p>
                      <p className="text-xs text-muted-foreground">{mod.description}</p>
                    </div>
                  </div>
                  <Switch checked={mod.enabled} onCheckedChange={() => toggleModule(mod.id)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  function renderStep2() {
    const currentModule = enabledModules[activeModuleIdx];
    if (!currentModule) return null;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{currentModule.name}</h1>
          <p className="text-muted-foreground mt-1">{currentModule.description}</p>
          <div className="flex gap-2 mt-3">
            {enabledModules.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModuleIdx(i)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  i === activeModuleIdx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {currentModule.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label>{q.question}</Label>
              {q.type === "text" && (
                <Textarea
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="min-h-[80px]"
                />
              )}
              {q.type === "number" && (
                <Input
                  type="number"
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                  placeholder={q.default || "0"}
                />
              )}
              {q.type === "date" && (
                <Input
                  type="date"
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                />
              )}
              {q.type === "select" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer(currentModule.id, q.id, opt)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                        q.answer === opt
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {q.answer === opt && <Check className="inline h-3 w-3 mr-1" />}
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === "toggle" && (
                <Switch
                  checked={q.answer === "yes"}
                  onCheckedChange={(v) => updateAnswer(currentModule.id, q.id, v ? "yes" : "no")}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold">Contract ready</h1>
          <p className="text-muted-foreground mt-1">{contractTitle || "Untitled Contract"}</p>
        </div>

        {/* Summary */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Party A</p>
                <p className="font-medium">{partyA.name || "Not set"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Party B</p>
                <p className="font-medium">{partyB.name || "Not set"}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground text-sm mb-2">Modules included:</p>
              <div className="flex flex-wrap gap-2">
                {enabledModules.map(m => (
                  <Badge key={m.id} variant="secondary">{m.name}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              toast.success("Draft saved!");
              setLocation("/dashboard/contracts");
            }}
          >
            <Save className="h-4 w-4 mr-2" /> Save as Draft
          </Button>
          <Button size="lg">
            <Send className="h-4 w-4 mr-2" /> Save & Send for Signature
          </Button>
        </div>
      </div>
    );
  }

  // ── Chat Panel ──────────────────────────────────────────────────

  function renderChatPanel() {
    return (
      <div className={`fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-lg z-40 flex flex-col transition-transform ${showChat ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Contract Assistant</span>
          </div>
          <button type="button" onClick={() => setShowChat(false)} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chatMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 border-t">
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              className="text-sm"
            />
            <Button size="sm" onClick={sendChat}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────

  const steps = ["Parties", "Modules", "Details", "Review"];

  return (
    <div className="min-h-screen bg-background">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-muted-foreground">
              Step {step + 1} of {steps.length}: {steps[step]}
            </h2>
            <button
              type="button"
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <MessageSquare className="h-4 w-4" />
              {showChat ? "Hide" : "Show"} Assistant
            </button>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`max-w-4xl mx-auto px-4 py-8 ${showChat ? "mr-80" : ""} transition-all`}>
        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {/* Bottom nav */}
      {step < 3 && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t">
          <div className={`max-w-4xl mx-auto px-4 py-4 flex items-center justify-between ${showChat ? "mr-80" : ""}`}>
            <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : setLocation("/dashboard/contracts")} >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Draft saved!");
                setLocation("/dashboard/contracts");
              }}
            >
              <Save className="h-4 w-4 mr-2" /> Save & Exit
            </Button>
            <Button onClick={() => setStep(step + 1)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {renderChatPanel()}
    </div>
  );
}
