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
  Shield, Scale, Clock, Banknote, Bot, Sparkles,
} from "lucide-react";
import CompanyLookup from "@/components/CompanyLookup";
import { CHATBOT_MODEL_LIST, DEFAULT_CHATBOT_MODEL, type ChatbotModelId } from "@shared/chatbot-config";

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
  {
    id: "debt_acknowledgement",
    name: "Debt Acknowledgement & Payment Arrangement",
    description: "Formalise an existing agreed debt between businesses (B2B only — not consumer credit)",
    icon: "Banknote",
    enabled: false,
    questions: [
      { id: "debt_amount", question: "Total debt acknowledged (£)", type: "number", answer: "" },
      { id: "debt_description", question: "Description of the debt (what it's for)", type: "text", answer: "" },
      { id: "debt_date", question: "Date the debt was incurred", type: "date", answer: "" },
      { id: "debt_repayment_type", question: "Repayment structure", type: "select", options: ["Lump sum", "Instalments", "Milestone-based", "Upon completion of work"], answer: "" },
      { id: "debt_instalment_amount", question: "Instalment amount per payment (£)", type: "number", answer: "" },
      { id: "debt_instalment_frequency", question: "Payment frequency", type: "select", options: ["Weekly", "Fortnightly", "Monthly", "Quarterly"], answer: "" },
      { id: "debt_first_payment", question: "First payment due date", type: "date", answer: "" },
      { id: "debt_interest", question: "Interest on outstanding balance", type: "select", options: ["None", "Bank of England base rate + 8%", "Fixed 4%", "Fixed 8%", "Custom"], default: "None", answer: "None" },
      { id: "debt_default_action", question: "What happens if a payment is missed?", type: "select", options: ["7-day grace period then full balance due", "14-day grace period then full balance due", "Escalate to ADR", "Automatic debt recovery"], answer: "" },
      { id: "debt_security", question: "Is the debt secured against any asset?", type: "select", options: ["Unsecured", "Personal guarantee", "Property charge", "Equipment lien"], answer: "" },
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
  const [chatLoading, setChatLoading] = useState(false);
  const [chatModel, setChatModel] = useState<ChatbotModelId>(DEFAULT_CHATBOT_MODEL);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatMutation = trpc.ai.chatMessage.useMutation();
  
  // Save — use contracts.create for new drafts, contracts.update if draft already saved
  const [saving, setSaving] = useState(false);
  const [savedContractId, setSavedContractId] = useState<string | null>(null);
  const createMutation = trpc.contracts.create.useMutation({
    onSuccess: (data) => {
      setSavedContractId(data.contractId);
      toast.success("Contract saved!");
      setLocation(`/dashboard/contracts/${data.contractId}`);
    },
    onError: (err) => toast.error(err.message || "Failed to save contract"),
  });
  const updateMutation = trpc.contracts.update.useMutation({
    onSuccess: (data) => {
      toast.success("Contract updated!");
      setLocation(`/dashboard/contracts/${savedContractId}`);
    },
    onError: (err) => toast.error(err.message || "Failed to update contract"),
  });

  function handleSaveDraft() {
    if (saving) return;
    setSaving(true);

    // Build content from modules
    const content = {
      partyA: { ...partyA },
      partyB: { ...partyB },
      modules: enabledModules.map((m) => ({
        id: m.id,
        name: m.name,
        answers: Object.fromEntries(m.questions.map((q) => [q.id, q.answer])),
      })),
    };

    // Extract total amount from payment module
    const payModule = enabledModules.find((m) => m.id === "payment");
    const totalAmount = parseFloat(
      payModule?.questions.find((q) => q.id === "pay_total")?.answer || "0"
    ) || 0.01; // minimum to pass validation

    // Extract dates from timeline module
    const timeModule = enabledModules.find((m) => m.id === "timeline");
    const startDate = timeModule?.questions.find((q) => q.id === "time_start")?.answer || undefined;
    const endDate = timeModule?.questions.find((q) => q.id === "time_end")?.answer || undefined;

    // If already saved once this session, update instead of creating a duplicate
    if (savedContractId) {
      updateMutation.mutate(
        {
          id: savedContractId,
          title: contractTitle || "Untitled Contract",
          description: `Contract between ${partyA.name || "Party A"} and ${partyB.name || "Party B"}`,
          totalAmount,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          content,
        },
        { onSettled: () => setSaving(false) }
      );
    } else {
      createMutation.mutate(
        {
          title: contractTitle || "Untitled Contract",
          description: `Contract between ${partyA.name || "Party A"} and ${partyB.name || "Party B"}`,
          category: "service_agreement",
          totalAmount,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          content,
        },
        { onSettled: () => setSaving(false) }
      );
    }
  }

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

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    // Build lightweight contract context from current form state
    const contextParts: string[] = [];
    if (contractTitle) contextParts.push(`Title: ${contractTitle}`);
    if (partyA.name) contextParts.push(`Party A: ${partyA.name}`);
    if (partyB.name) contextParts.push(`Party B: ${partyB.name}`);
    enabledModules.forEach((m) => {
      const answered = m.questions.filter((q) => q.answer).map((q) => `${q.question}: ${q.answer}`);
      if (answered.length) contextParts.push(`[${m.name}] ${answered.join('; ')}`);
    });

    try {
      const result = await chatMutation.mutateAsync({
        message: text,
        contractContext: contextParts.join('\n') || undefined,
        modelId: chatModel,
        history: chatMessages.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      });

      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.reply },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  // ── Render Functions ────────────────────────────────────────────

  // ── M3 Party Form ───────────────────────────────────────────────

  function renderPartyForm(party: PartyInfo, setParty: (p: PartyInfo) => void, label: string, accent: string) {
    return (
      <div className="m3-card-outlined overflow-hidden">
        {/* Card header — accent top border */}
        <div className={`h-1 w-full ${accent}`} />
        <div className="p-5">
          <div className="mb-5">
            <h3 className="m3-title-lg font-semibold">{label}</h3>
            <p className="m3-body-sm text-muted-foreground mt-0.5">Enter details or search Companies House</p>
          </div>

          {/* M3 segmented button — individual / company */}
          <div className="mb-5 flex w-fit items-center gap-0.5 rounded-full border border-border bg-muted/50 p-0.5">
            {[
              { value: "individual" as const, Icon: User,      label: "Individual" },
              { value: "company"    as const, Icon: Building2, label: "Company"    },
            ].map(({ value, Icon, label: btnLabel }) => (
              <button
                key={value}
                type="button"
                onClick={() => setParty({ ...party, type: value })}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  party.type === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {btnLabel}
              </button>
            ))}
          </div>

          {/* Name / Company Lookup */}
          {party.type === "company" ? (
            <CompanyLookup
              label={`${label} — Company Name`}
              onSelect={(company) =>
                setParty({
                  ...party,
                  name: company.companyName,
                  companyNumber: company.companyNumber,
                  address: company.address,
                  addressObj: company.addressObj || party.addressObj,
                })
              }
              initialValue={party.name}
            />
          ) : (
            <div className="mb-4 space-y-1.5">
              <Label className="m3-label-md text-muted-foreground">Full Name</Label>
              <Input
                value={party.name}
                onChange={(e) => setParty({ ...party, name: e.target.value })}
                placeholder="Full legal name"
                className="rounded-lg"
              />
            </div>
          )}

          {/* Contact */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="m3-label-md text-muted-foreground">Email</Label>
              <Input
                type="email"
                value={party.email}
                onChange={(e) => setParty({ ...party, email: e.target.value })}
                placeholder="email@company.com"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="m3-label-md text-muted-foreground">Phone</Label>
              <Input
                type="tel"
                value={party.phone}
                onChange={(e) => setParty({ ...party, phone: e.target.value })}
                placeholder="+44 20 1234 5678"
                className="rounded-lg"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mt-3 space-y-1.5">
            <Label className="m3-label-md text-muted-foreground">Address</Label>
            {party.address ? (
              <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span className="flex-1">{party.address}</span>
                <button
                  type="button"
                  onClick={() =>
                    setParty({ ...party, address: "", addressObj: { line1: "", line2: "", city: "", county: "", postcode: "" } })
                  }
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid gap-2">
                <Input
                  value={party.addressObj.line1}
                  onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, line1: e.target.value } })}
                  placeholder="Address line 1"
                  className="rounded-lg"
                />
                <Input
                  value={party.addressObj.line2}
                  onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, line2: e.target.value } })}
                  placeholder="Address line 2 (optional)"
                  className="rounded-lg"
                />
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    value={party.addressObj.city}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, city: e.target.value } })}
                    placeholder="City"
                    className="rounded-lg"
                  />
                  <Input
                    value={party.addressObj.county}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, county: e.target.value } })}
                    placeholder="County"
                    className="rounded-lg"
                  />
                  <Input
                    value={party.addressObj.postcode}
                    onChange={(e) => setParty({ ...party, addressObj: { ...party.addressObj, postcode: e.target.value } })}
                    placeholder="Postcode"
                    className="rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Step 0: Parties ──────────────────────────────────────────────

  function renderStep0() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="m3-headline-sm font-bold">Create a new contract</h1>
          <p className="mt-1 text-muted-foreground">Enter details for both parties</p>
        </div>

        {/* Contract title — M3 filled input feel */}
        <div className="space-y-1.5">
          <Label className="m3-label-md text-muted-foreground">Contract Title</Label>
          <Input
            value={contractTitle}
            onChange={(e) => setContractTitle(e.target.value)}
            placeholder="e.g. Website Development Agreement"
            className="h-12 rounded-xl text-base"
          />
        </div>

        {/* Party cards — two-panel M3 layout */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {renderPartyForm(partyA, setPartyA, "Party A — You", "bg-gradient-to-r from-[#0F172A] to-[#6D28D9]")}
          {renderPartyForm(partyB, setPartyB, "Party B — Counterparty", "bg-gradient-to-r from-[#6D28D9] to-[#A78BFA]")}
        </div>
      </div>
    );
  }

  // ── Step 1: Modules ──────────────────────────────────────────────

  function renderStep1() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="m3-headline-sm font-bold">Choose contract modules</h1>
          <p className="mt-1 text-muted-foreground">Toggle on the sections you need</p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {modules.map((mod) => (
            <button
              key={mod.id}
              type="button"
              onClick={() => toggleModule(mod.id)}
              className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 ${
                mod.enabled
                  ? "border-[#6D28D9]/30 bg-[#F1F0FF] shadow-sm"
                  : "border-border bg-card hover:border-[#6D28D9]/20 hover:bg-muted/40"
              }`}
            >
              {/* M3 state layer */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity group-hover:opacity-[0.04] bg-foreground" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* M3 icon container */}
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                      mod.enabled
                        ? "bg-[#6D28D9] text-white"
                        : "bg-muted text-muted-foreground group-hover:bg-muted/80"
                    }`}
                  >
                    {mod.icon === "FileText" && <FileText className="h-5 w-5" />}
                    {mod.icon === "Banknote" && <Banknote className="h-5 w-5" />}
                    {mod.icon === "Clock"    && <Clock    className="h-5 w-5" />}
                    {mod.icon === "Shield"   && <Shield   className="h-5 w-5" />}
                    {mod.icon === "Scale"    && <Scale    className="h-5 w-5" />}
                    {mod.icon === "X"        && <X        className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className={`m3-label-lg font-semibold ${mod.enabled ? "text-[#4C1D95]" : "text-foreground"}`}>
                      {mod.name}
                    </p>
                    <p className="m3-body-sm text-muted-foreground">{mod.description}</p>
                  </div>
                </div>
                {/* M3 Switch — prevent double-toggle via stopPropagation */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={mod.enabled}
                    onCheckedChange={() => toggleModule(mod.id)}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Questions ────────────────────────────────────────────

  function renderStep2() {
    const currentModule = enabledModules[activeModuleIdx];
    if (!currentModule) return null;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="m3-headline-sm font-bold">{currentModule.name}</h1>
          <p className="mt-1 text-muted-foreground">{currentModule.description}</p>

          {/* M3 module chip tabs */}
          <div className="mt-4 flex flex-wrap gap-2">
            {enabledModules.map((m, i) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveModuleIdx(i)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all ${
                  i === activeModuleIdx
                    ? "bg-[#0F172A] text-white shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* M3 question form card */}
        <div className="m3-card-outlined rounded-2xl p-6 space-y-5">
          {currentModule.questions.map((q) => (
            <div key={q.id} className="space-y-2">
              <Label className="m3-label-lg text-foreground">{q.question}</Label>

              {q.type === "text" && (
                <Textarea
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="min-h-[80px] rounded-xl"
                />
              )}
              {q.type === "number" && (
                <Input
                  type="number"
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                  placeholder={q.default || "0"}
                  className="rounded-xl"
                />
              )}
              {q.type === "date" && (
                <Input
                  type="date"
                  value={q.answer}
                  onChange={(e) => updateAnswer(currentModule.id, q.id, e.target.value)}
                  className="rounded-xl"
                />
              )}
              {q.type === "select" && q.options && (
                <div className="flex flex-wrap gap-2">
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateAnswer(currentModule.id, q.id, opt)}
                      className={`m3-state-layer flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                        q.answer === opt
                          ? "border-[#6D28D9] bg-[#F1F0FF] text-[#4C1D95] shadow-sm"
                          : "border-border hover:border-[#6D28D9]/40 hover:bg-muted/60"
                      }`}
                    >
                      {q.answer === opt && <Check className="h-3 w-3" />}
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

  // ── Step 3: Review ───────────────────────────────────────────────

  function renderStep3() {
    return (
      <div className="space-y-6">
        {/* M3 success state */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <Check className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="m3-headline-sm font-bold">Contract ready</h1>
          <p className="mt-1 text-muted-foreground">{contractTitle || "Untitled Contract"}</p>
        </div>

        {/* M3 summary card */}
        <div className="m3-card-outlined rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="m3-label-md text-muted-foreground">Party A</p>
              <p className="mt-0.5 font-medium">{partyA.name || "Not set"}</p>
            </div>
            <div>
              <p className="m3-label-md text-muted-foreground">Party B</p>
              <p className="mt-0.5 font-medium">{partyB.name || "Not set"}</p>
            </div>
          </div>
          <Separator className="m3-divider" />
          <div>
            <p className="m3-label-md text-muted-foreground mb-2">Modules included</p>
            <div className="flex flex-wrap gap-2">
              {enabledModules.map((m) => (
                <span
                  key={m.id}
                  className="inline-flex items-center gap-1 rounded-full bg-[#F1F0FF] px-3 py-1 text-xs font-medium text-[#4C1D95]"
                >
                  <Check className="h-3 w-3" />
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* M3 action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-[1.75rem]"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save as Draft
          </Button>
          <Button
            size="lg"
            className="rounded-[1.75rem] bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
          >
            <Send className="mr-2 h-4 w-4" />
            Save & Send for Signature
          </Button>
        </div>
      </div>
    );
  }

  // ── Chat Panel — M3 side panel ───────────────────────────────────

  function renderChatPanel() {
    const activeModel = CHATBOT_MODEL_LIST.find((m) => m.id === chatModel) || CHATBOT_MODEL_LIST[0];

    return (
      <div
        className={`fixed right-0 top-0 z-40 flex h-full w-80 flex-col border-l border-border bg-background shadow-[var(--shadow-elevation-3)] transition-transform duration-300 ${
          showChat ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between border-b px-4 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D28D9]">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="m3-title-sm font-semibold block leading-tight">Contract Assistant</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChat(false)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Model selector bar */}
        <div className="relative border-b px-3 py-2">
          <button
            type="button"
            onClick={() => setShowModelPicker(!showModelPicker)}
            className="flex w-full items-center justify-between rounded-lg bg-muted/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              {activeModel.label}
              <span className="text-[10px] font-normal opacity-60">— {activeModel.description}</span>
            </span>
            <ChevronDown className={`h-3 w-3 transition-transform ${showModelPicker ? "rotate-180" : ""}`} />
          </button>

          {showModelPicker && (
            <div className="absolute left-3 right-3 top-full z-50 mt-1 rounded-xl border bg-background p-1.5 shadow-lg">
              {CHATBOT_MODEL_LIST.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => { setChatModel(m.id as ChatbotModelId); setShowModelPicker(false); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                    chatModel === m.id
                      ? "bg-[#F1F0FF] text-[#4C1D95] font-semibold"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex-1">
                    <span className="font-medium">{m.label}</span>
                    <span className="ml-1.5 text-[10px] opacity-60">{m.description}</span>
                  </div>
                  {chatModel === m.id && <Check className="h-3 w-3 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-sm bg-[#0F172A] text-white"
                    : "rounded-bl-sm bg-muted text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {chatLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3">
          <div className="flex gap-2">
            <Input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              disabled={chatLoading}
              className="rounded-full text-sm"
            />
            <Button
              size="sm"
              className="h-9 w-9 flex-shrink-0 rounded-full bg-[#6D28D9] p-0 text-white hover:bg-[#5B21B6]"
              onClick={sendChat}
              disabled={!chatInput.trim() || chatLoading}
            >
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

      {/* M3 sticky top bar — progress + nav */}
      <div className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="m3-label-md text-muted-foreground">
              Step {step + 1} of {steps.length}: <span className="font-semibold text-foreground">{steps[step]}</span>
            </span>
            <button
              type="button"
              onClick={() => setShowChat(!showChat)}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              {showChat ? "Hide" : "Show"} Assistant
            </button>
          </div>

          {/* M3 progress bar — linear indicator */}
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  i < step
                    ? "bg-[#6D28D9]"
                    : i === step
                    ? "bg-[#A78BFA]"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`mx-auto max-w-4xl px-4 py-8 transition-all duration-300 ${showChat ? "pr-[21rem]" : ""}`}
      >
        {step === 0 && renderStep0()}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {/* M3 sticky bottom navigation */}
      {step < 3 && (
        <div className="sticky bottom-0 border-t bg-background/90 backdrop-blur-md">
          <div
            className={`mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 transition-all duration-300 ${
              showChat ? "pr-[21rem]" : ""
            }`}
          >
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => (step > 0 ? setStep(step - 1) : setLocation("/dashboard/contracts"))}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {step === 0 ? "Cancel" : "Back"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save & Exit
            </Button>

            <Button
              className="rounded-full bg-[#6D28D9] text-white hover:bg-[#5B21B6]"
              onClick={() => setStep(step + 1)}
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* M3 Chat side panel */}
      {renderChatPanel()}
    </div>
  );
}
