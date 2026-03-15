import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  FileText,
  Code2,
  UserCheck,
  Lock,
  ScrollText,
  Shield,
  Download,
  Save,
  Send,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Types ──────────────────────────────────────────────────────────────

interface VariableDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select";
  required?: boolean;
  default?: string;
  group: string;
  options?: string[];
}

interface ClauseOption {
  id: string;
  label: string;
  summary: string;
}

interface LegalTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  templateSlug: string | null;
  variables: VariableDef[];
  clauseBanks: Record<string, ClauseOption[]>;
}

// ── Constants ──────────────────────────────────────────────────────────

const STEP_LABELS = [
  "Select Agreement",
  "Fill Details",
  "Select Clauses",
  "Preview",
  "Save & Sign",
];

const TEMPLATE_ICONS: Record<string, typeof FileText> = {
  "msa-uk": FileText,
  "software-dev-uk": Code2,
  "freelancer-uk": UserCheck,
  "escrow-uk": Lock,
  "tos-uk": ScrollText,
  "privacy-uk": Shield,
};

const TEMPLATE_DESCRIPTIONS: Record<string, string> = {
  "msa-uk": "Comprehensive services agreement for UK engagements",
  "software-dev-uk": "Software development with agile delivery & IP terms",
  "freelancer-uk": "Freelancer/contractor engagement with IR35 provisions",
  "escrow-uk": "Escrow payment annexure for milestone-based projects",
  "tos-uk": "Website/platform terms of service for UK compliance",
  "privacy-uk": "GDPR-compliant privacy policy with ICO registration",
};

// ── Slide animation ────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 600 : -600, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? 600 : -600, opacity: 0 }),
};

// ── Component ──────────────────────────────────────────────────────────

export default function NewContractTypeform() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Data
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedClauses, setSelectedClauses] = useState<Record<string, string>>({});
  const [generatedMarkdown, setGeneratedMarkdown] = useState("");
  const [savedContractId, setSavedContractId] = useState<string | null>(null);

  // Variable group navigation (sub-step within step 2)
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);

  // Queries
  const { data: templates, isLoading: loadingTemplates, error: templatesError } =
    trpc.templateBuilder.listLegalTemplates.useQuery(undefined, {
      retry: 3,
      retryDelay: 1000,
    });

  const selectedTemplate = useMemo(
    () => templates?.find((t) => t.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  );

  const { data: fullTemplate } = trpc.templateBuilder.getLegalTemplate.useQuery(
    { id: selectedTemplateId! },
    { enabled: !!selectedTemplateId }
  );

  // Mutations
  const generateMutation = trpc.templateBuilder.generateContract.useMutation({
    onSuccess: (data) => {
      setGeneratedMarkdown(data.generatedMarkdown);
      setSavedContractId(data.contractId);
    },
    onError: (err) => toast.error(err.message),
  });

  const saveMutation = trpc.templateBuilder.saveContractDraft.useMutation({
    onSuccess: (data) => {
      setSavedContractId(data.contractId);
      toast.success("Contract saved!");
      goTo(4); // go to final step
    },
    onError: (err) => toast.error(err.message),
  });

  // Individual vs Company toggle for "Your Details" section
  const [clientType, setClientType] = useState<"individual" | "company">("individual");

  // Remap group labels for display
  const groupDisplayNames: Record<string, string> = {
    "Client Details": "Your Details",
  };

  // Derived
  const variableGroups = useMemo(() => {
    if (!selectedTemplate) return [];
    const groups: { name: string; displayName: string; vars: VariableDef[] }[] = [];
    const seen = new Set<string>();
    for (const v of selectedTemplate.variables) {
      if (!seen.has(v.group)) {
        seen.add(v.group);
        const vars = selectedTemplate.variables
          .filter((x: VariableDef) => x.group === v.group)
          .map((x: VariableDef) => {
            // Rename "Client Name" based on individual/company toggle
            if (x.name === "CLIENT_NAME") {
              return {
                ...x,
                label: clientType === "company" ? "Company Name" : "Full Name",
              };
            }
            return x;
          });
        groups.push({
          name: v.group,
          displayName: groupDisplayNames[v.group] || v.group,
          vars,
        });
      }
    }
    return groups;
  }, [selectedTemplate, clientType]);

  const clauseCategories = useMemo(() => {
    if (!selectedTemplate) return [];
    return Object.entries(selectedTemplate.clauseBanks);
  }, [selectedTemplate]);

  const progress = ((step + 1) / 5) * 100;

  // ── Navigation ─────────────────────────────────────────────────────

  function goTo(s: number) {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  }

  function handleBack() {
    if (step === 1 && currentGroupIdx > 0) {
      setCurrentGroupIdx(currentGroupIdx - 1);
      return;
    }
    if (step > 0) {
      goTo(step - 1);
      if (step - 1 === 1) setCurrentGroupIdx(variableGroups.length - 1);
    } else {
      setLocation("/dashboard/contracts");
    }
  }

  function handleNext() {
    if (step === 1) {
      // Validate required vars in current group
      const group = variableGroups[currentGroupIdx];
      if (group) {
        for (const v of group.vars) {
          if (v.required && !variables[v.name]) {
            toast.error(`Please fill in "${v.label}"`);
            return;
          }
        }
      }
      if (currentGroupIdx < variableGroups.length - 1) {
        setCurrentGroupIdx(currentGroupIdx + 1);
        return;
      }
    }

    if (step === 2) {
      // Generate markdown for preview
      if (fullTemplate?.templateMarkdown) {
        let md = fullTemplate.templateMarkdown;
        for (const [key, value] of Object.entries(variables)) {
          md = md.replace(new RegExp(`\\[${key}\\]`, "g"), value || `[${key}]`);
        }
        setGeneratedMarkdown(md);
      }
    }

    goTo(step + 1);
    if (step + 1 === 1) setCurrentGroupIdx(0);
  }

  // ── Step 0: Select Agreement Type ──────────────────────────────────

  function renderStep0() {
    if (loadingTemplates) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (templatesError) {
      return (
        <div className="text-center py-20 space-y-4">
          <FileText className="h-12 w-12 text-destructive mx-auto" />
          <p className="text-lg text-muted-foreground">
            Unable to load templates. Please try refreshing the page.
          </p>
          <p className="text-sm text-muted-foreground">
            {templatesError.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Refresh
          </button>
        </div>
      );
    }

    if (!templates || templates.length === 0) {
      return (
        <div className="text-center py-20 space-y-4">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-lg text-muted-foreground">
            No templates available yet. Please check back soon.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Choose your agreement type
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Select a UK legal template to customise
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {templates.map((t) => {
            const Icon = TEMPLATE_ICONS[t.templateSlug || ""] || FileText;
            const desc =
              TEMPLATE_DESCRIPTIONS[t.templateSlug || ""] || t.description || "";
            return (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTemplateId(t.id);
                  // Pre-fill defaults
                  const defaults: Record<string, string> = {};
                  for (const v of t.variables) {
                    if (v.default) defaults[v.name] = v.default;
                  }
                  setVariables(defaults);
                  // Pre-select first clause option per bank
                  const clauses: Record<string, string> = {};
                  for (const [key, opts] of Object.entries(t.clauseBanks) as [string, ClauseOption[]][]) {
                    if (opts.length > 0) clauses[key] = opts[0].id;
                  }
                  setSelectedClauses(clauses);
                  setCurrentGroupIdx(0);
                  goTo(1);
                }}
                className="group relative p-6 rounded-2xl border-2 border-border bg-card text-left transition-all hover:border-primary hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base">{t.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {desc}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="secondary" className="text-xs">
                        {t.variables.length} fields
                      </Badge>
                      {Object.keys(t.clauseBanks).length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(t.clauseBanks).length} clause{Object.keys(t.clauseBanks).length !== 1 ? "s" : ""}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Step 1: Fill Variables ──────────────────────────────────────────

  function renderStep1() {
    if (!selectedTemplate || variableGroups.length === 0) return null;
    const group = variableGroups[currentGroupIdx];

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {group.displayName}
          </h1>
          <p className="text-muted-foreground mt-2">
            Step {currentGroupIdx + 1} of {variableGroups.length} — fill in the details
          </p>
        </div>

        {/* Individual / Company toggle for "Your Details" group */}
        {group.name === "Client Details" && (
          <div className="flex items-center gap-2 p-1 bg-muted rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setClientType("individual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                clientType === "individual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Individual
            </button>
            <button
              type="button"
              onClick={() => setClientType("company")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                clientType === "company"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Company
            </button>
          </div>
        )}

        {/* Sub-progress */}
        <div className="flex gap-1.5">
          {variableGroups.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= currentGroupIdx ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="space-y-5">
          {group.vars.map((v) => (
            <div key={v.name} className="space-y-2">
              <Label htmlFor={v.name}>
                {v.label}
                {v.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {v.type === "text" && (
                <Input
                  id={v.name}
                  placeholder={v.default || v.label}
                  value={variables[v.name] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.name]: e.target.value })
                  }
                  className="h-12 text-base"
                />
              )}

              {v.type === "textarea" && (
                <Textarea
                  id={v.name}
                  placeholder={v.label}
                  value={variables[v.name] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.name]: e.target.value })
                  }
                  className="min-h-[120px] text-base"
                />
              )}

              {v.type === "date" && (
                <Input
                  id={v.name}
                  type="date"
                  value={variables[v.name] || ""}
                  onChange={(e) =>
                    setVariables({ ...variables, [v.name]: e.target.value })
                  }
                  className="h-12 text-base"
                />
              )}

              {v.type === "select" && v.options && (
                <Select
                  value={variables[v.name] || v.default || ""}
                  onValueChange={(val) =>
                    setVariables({ ...variables, [v.name]: val })
                  }
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={`Select ${v.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {v.options.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 2: Select Clauses ─────────────────────────────────────────

  function renderStep2() {
    if (!selectedTemplate) return null;

    if (clauseCategories.length === 0) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Clause Options
            </h1>
            <p className="text-muted-foreground mt-2">
              No optional clauses for this template — your agreement is ready to preview.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Choose your clauses
          </h1>
          <p className="text-muted-foreground mt-2">
            Select the options that best fit your engagement
          </p>
        </div>

        {clauseCategories.map(([categoryKey, options]) => (
          <div key={categoryKey} className="space-y-3">
            <h2 className="text-lg font-semibold capitalize">
              {categoryKey.replace(/_/g, " ")}
            </h2>
            <div className="grid gap-3">
              {(options as ClauseOption[]).map((opt: ClauseOption) => {
                const isSelected = selectedClauses[categoryKey] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() =>
                      setSelectedClauses({ ...selectedClauses, [categoryKey]: opt.id })
                    }
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                      <div>
                        <h3 className="font-medium">{opt.label}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {opt.summary}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Step 3: Preview ────────────────────────────────────────────────

  function renderStep3() {
    const markdown = generatedMarkdown || "No content generated yet.";

    // Simple markdown-to-HTML: headings, bold, paragraphs, hr, lists
    const html = markdownToHtml(markdown);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Preview
            </h1>
            <p className="text-muted-foreground mt-2">
              Review your generated agreement
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.print();
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <div
          className="contract-preview bg-white border rounded-xl p-8 md:p-12 max-h-[60vh] overflow-y-auto shadow-sm print:shadow-none print:border-none print:max-h-none print:p-0"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <style>{`
          .contract-preview {
            font-family: 'Georgia', 'Times New Roman', serif;
            line-height: 1.7;
            color: #1a1a1a;
          }
          .contract-preview h1 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 2rem 0 1rem;
            color: #111;
          }
          .contract-preview h2 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 1.25rem;
            font-weight: 600;
            margin: 1.5rem 0 0.75rem;
            color: #222;
          }
          .contract-preview h3 {
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 1.1rem;
            font-weight: 600;
            margin: 1.25rem 0 0.5rem;
            color: #333;
          }
          .contract-preview p {
            margin: 0.5rem 0;
          }
          .contract-preview hr {
            border: none;
            border-top: 1px solid #e5e5e5;
            margin: 1.5rem 0;
          }
          .contract-preview strong {
            font-weight: 700;
          }
          .contract-preview ul, .contract-preview ol {
            padding-left: 1.5rem;
            margin: 0.5rem 0;
          }
          .contract-preview .unfilled-var {
            background: #fef3c7;
            padding: 0 4px;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.9em;
          }
          @media print {
            body * { visibility: hidden; }
            .contract-preview, .contract-preview * { visibility: visible; }
            .contract-preview { position: absolute; left: 0; top: 0; width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  // ── Step 4: Save & Sign ────────────────────────────────────────────

  function renderStep4() {
    const isSaved = !!savedContractId;

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto"
          >
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Your agreement is ready
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            {selectedTemplate?.name}
          </p>
        </div>

        {/* Summary */}
        <div className="bg-card border rounded-xl p-6 space-y-4 max-w-lg mx-auto">
          <h2 className="font-semibold text-lg">Summary</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {variables.CLIENT_NAME && (
              <>
                <span className="text-muted-foreground">Client</span>
                <span className="font-medium">{variables.CLIENT_NAME}</span>
              </>
            )}
            {(variables.SUPPLIER_NAME || variables.DEVELOPER_NAME || variables.CONTRACTOR_NAME) && (
              <>
                <span className="text-muted-foreground">Counter-party</span>
                <span className="font-medium">
                  {variables.SUPPLIER_NAME || variables.DEVELOPER_NAME || variables.CONTRACTOR_NAME}
                </span>
              </>
            )}
            {variables.CONTRACT_VALUE && (
              <>
                <span className="text-muted-foreground">Value</span>
                <span className="font-medium">
                  {variables.CURRENCY || "GBP"} {variables.CONTRACT_VALUE}
                </span>
              </>
            )}
            {variables.START_DATE && (
              <>
                <span className="text-muted-foreground">Start Date</span>
                <span className="font-medium">{variables.START_DATE}</span>
              </>
            )}
            {Object.entries(selectedClauses).map(([key, val]) => (
              <span key={key} className="contents">
                <span className="text-muted-foreground capitalize">
                  {key.replace(/_/g, " ")}
                </span>
                <span className="font-medium capitalize">{val.replace(/_/g, " ")}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-14 text-base"
            disabled={saveMutation.isPending}
            onClick={() => {
              saveMutation.mutate({
                contractId: savedContractId || undefined,
                templateId: selectedTemplateId!,
                variables,
                selectedClauses,
                generatedMarkdown,
                status: "draft",
              });
            }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Save as Draft
          </Button>
          <Button
            size="lg"
            className="flex-1 h-14 text-base"
            disabled={saveMutation.isPending}
            onClick={() => {
              saveMutation.mutate({
                contractId: savedContractId || undefined,
                templateId: selectedTemplateId!,
                variables,
                selectedClauses,
                generatedMarkdown,
                status: "pending_signature",
              });
            }}
          >
            {saveMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <Send className="h-5 w-5 mr-2" />
            )}
            Send for Signature
          </Button>
        </div>

        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              variant="link"
              onClick={() => setLocation(`/dashboard/contracts/${savedContractId}`)}
            >
              View your contract
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────

  const stepRenderers = [renderStep0, renderStep1, renderStep2, renderStep3, renderStep4];
  const showNavButtons = step >= 1 && step <= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex flex-col">
      {/* Top progress bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <Progress value={progress} className="h-1 rounded-none" />
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
            {STEP_LABELS.map((label, i) => (
              <span
                key={i}
                className={`transition-colors ${
                  i === step
                    ? "text-primary font-medium"
                    : i < step
                      ? "text-foreground"
                      : ""
                }`}
              >
                {i < step ? (
                  <Check className="h-4 w-4 inline mr-1 text-primary" />
                ) : null}
                {label}
              </span>
            ))}
          </div>
          <span className="text-sm text-muted-foreground sm:hidden">
            {step + 1} / 5
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step === 1 ? `step1-${currentGroupIdx}` : `step${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.15 },
              }}
            >
              {stepRenderers[step]()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom nav */}
      {showNavButtons && (
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm border-t">
          <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleNext}>
              {step === 3 ? "Continue" : "Next"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Minimal markdown→HTML ────────────────────────────────────────────

function markdownToHtml(md: string): string {
  let html = md
    // Escape HTML
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr/>")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, "<li>$1</li>")
    // Highlight unfilled [VARIABLE] placeholders
    .replace(
      /\[([A-Z_]+)\]/g,
      '<span class="unfilled-var">[$1]</span>'
    );

  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.+<\/li>\n?)+)/g, "<ul>$1</ul>");

  // Paragraphs: wrap remaining lines
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (
        !trimmed ||
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<ol")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  return html;
}
