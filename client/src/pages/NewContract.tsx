import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2, FileText, Check, X } from "lucide-react";

const CONTRACT_CATEGORIES = [
  { value: "freelance", label: "Freelance Services", description: "Web design, writing, consulting, etc." },
  { value: "home_improvement", label: "Home Improvement", description: "Renovations, repairs, installations" },
  { value: "event_services", label: "Event Services", description: "Photography, catering, entertainment" },
  { value: "trade_services", label: "Trade Services", description: "Plumbing, electrical, carpentry" },
  { value: "other", label: "Other Services", description: "Custom service agreements" },
];

interface TemplateData {
  id: string;
  name: string;
  description: string | null;
  category: string;
  templateContent: string | null;
}

export default function NewContract() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    providerEmail: "",
    totalAmount: "",
    startDate: "",
    endDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: templates, isLoading: templatesLoading } = trpc.templates.list.useQuery({});

  const createMutation = trpc.contracts.create.useMutation({
    onSuccess: (data) => {
      toast.success("Contract created successfully!");
      setLocation(`/dashboard/contracts/${data.contractId}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create contract");
    },
  });

  const handleSelectTemplate = (template: TemplateData) => {
    setSelectedTemplate(template);

    const templateContent = template.templateContent
      ? JSON.parse(template.templateContent)
      : { content: "", variables: [] };

    setFormData({
      ...formData,
      category: template.category,
      description: templateContent.content || "",
    });

    toast.success(`Template "${template.name}" selected`);
    setStep(1);
  };

  const handleClearTemplate = () => {
    setSelectedTemplate(null);
    setFormData({
      ...formData,
      category: "",
      description: "",
    });
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Contract title is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description.trim()) newErrors.description = "Service description is required";
    if (formData.providerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.providerEmail)) {
      newErrors.providerEmail = "Please enter a valid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.totalAmount) {
      newErrors.totalAmount = "Contract value is required";
    } else {
      const amount = parseFloat(formData.totalAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.totalAmount = "Please enter a valid amount greater than 0";
      }
    }
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }

    if (!validateStep2()) return;

    const amount = parseFloat(formData.totalAmount);

    createMutation.mutate({
      templateId: selectedTemplate?.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      providerEmail: formData.providerEmail || undefined,
      totalAmount: amount,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      content: {
        terms: formData.description,
        createdBy: "client",
        templateId: selectedTemplate?.id,
        templateName: selectedTemplate?.name,
      },
    });
  };

  const selectedCategory = CONTRACT_CATEGORIES.find((c) => c.value === formData.category);

  const getCategoryLabel = (category: string) => {
    const cat = CONTRACT_CATEGORIES.find(c => c.value === category);
    return cat?.label || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      freelance: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      home_improvement: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      event_services: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      trade_services: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return colors[category] || colors.other;
  };

  const hasTemplates = templates && templates.length > 0;

  const steps = [
    { label: "Template", completed: step > 0 },
    { label: "Service Details", completed: step > 1 },
    { label: "Financial & Timeline", completed: false },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (step === 0) {
              setLocation("/dashboard/contracts");
            } else if (step === 1) {
              setStep(0);
            } else {
              setStep(1);
            }
          }}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create New Contract</h1>
        <p className="text-muted-foreground mt-1">
          {step === 0
            ? "Choose a template or start from scratch"
            : step === 1
            ? "Describe the service and choose a category"
            : "Set the contract value and timeline"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2 sm:gap-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:gap-4">
              <div className={`flex items-center gap-2 ${step >= i ? "text-primary" : "text-muted-foreground"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    s.completed
                      ? "bg-primary text-primary-foreground"
                      : step === i
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.completed ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="font-medium hidden sm:inline text-sm">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 ${step > i ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Template Selection Step */}
      {step === 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>
              Start with a pre-built template or create from scratch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {templatesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : hasTemplates ? (
              <>
                <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                  {templates.map((template) => {
                    const templateContent = template.templateContent
                      ? JSON.parse(template.templateContent as string)
                      : { content: "", variables: [] };

                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template as TemplateData)}
                        className="p-4 rounded-xl border-2 border-border bg-card transition-all text-left hover:border-primary hover:shadow-md flex items-start gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {template.description || templateContent.content?.substring(0, 80) + "..."}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getCategoryColor(template.category)}>
                              {getCategoryLabel(template.category)}
                            </Badge>
                            {templateContent.variables && templateContent.variables.length > 0 && (
                              <Badge variant="outline">
                                {templateContent.variables.length} variables
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">or</span>
                  </div>
                </div>
              </>
            ) : null}

            <Button
              onClick={() => setStep(1)}
              variant={hasTemplates ? "outline" : "default"}
              size="lg"
              className="w-full"
            >
              {hasTemplates ? "Start from Scratch" : "Create Contract"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Form Steps */}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Describe the service you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTemplate && (
                <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Using template: {selectedTemplate.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Category and description pre-filled
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleClearTemplate}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">
                  Service Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    setFormData({ ...formData, category: value });
                    if (errors.category) setErrors({ ...errors, category: "" });
                  }}
                >
                  <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTRACT_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <div>
                          <div className="font-medium">{cat.label}</div>
                          <div className="text-xs text-muted-foreground">{cat.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                {selectedCategory && !errors.category && (
                  <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Contract Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Design for Small Business"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: "" });
                  }}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Service Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work to be done, deliverables, and any specific requirements..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (errors.description) setErrors({ ...errors, description: "" });
                  }}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                {!errors.description && (
                  <p className="text-sm text-muted-foreground">
                    Be as specific as possible to avoid misunderstandings
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="providerEmail">Service Provider Email (Optional)</Label>
                <Input
                  id="providerEmail"
                  type="email"
                  placeholder="provider@example.com"
                  value={formData.providerEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, providerEmail: e.target.value });
                    if (errors.providerEmail) setErrors({ ...errors, providerEmail: "" });
                  }}
                  className={errors.providerEmail ? "border-destructive" : ""}
                />
                {errors.providerEmail ? (
                  <p className="text-sm text-destructive">{errors.providerEmail}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    If you already know who will provide the service, enter their email
                  </p>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continue to Financial Details
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Financial & Timeline</CardTitle>
              <CardDescription>Set the contract value and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="totalAmount">
                  Total Contract Value (£) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`pl-7 ${errors.totalAmount ? "border-destructive" : ""}`}
                    value={formData.totalAmount}
                    onChange={(e) => {
                      setFormData({ ...formData, totalAmount: e.target.value });
                      if (errors.totalAmount) setErrors({ ...errors, totalAmount: "" });
                    }}
                  />
                </div>
                {errors.totalAmount ? (
                  <p className="text-sm text-destructive">{errors.totalAmount}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    This can be split into milestones after creating the contract
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date (Optional)</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">Expected Completion Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      setFormData({ ...formData, endDate: e.target.value });
                      if (errors.endDate) setErrors({ ...errors, endDate: "" });
                    }}
                    min={formData.startDate || undefined}
                    className={errors.endDate ? "border-destructive" : ""}
                  />
                  {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-muted/50 p-5 rounded-xl space-y-3 border">
                <h4 className="font-semibold">Contract Summary</h4>
                <div className="text-sm space-y-2">
                  {selectedTemplate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Template:</span>
                      <span className="font-medium">{selectedTemplate.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium capitalize">{formData.category.replace(/_/g, " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium truncate ml-4">{formData.title}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground font-medium">Total Value:</span>
                    <span className="font-bold text-lg">
                      £{parseFloat(formData.totalAmount || "0").toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" size="lg" className="flex-1" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Contract
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}
