import { useState, useEffect } from "react";
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
  const [step, setStep] = useState(0); // 0 = template selection, 1 = details, 2 = financial
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

  // Fetch templates
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
    
    // Parse template content
    const templateContent = template.templateContent 
      ? JSON.parse(template.templateContent)
      : { content: "", variables: [] };
    
    // Pre-fill form data
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      // Validate step 1
      if (!formData.title || !formData.category || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }
      setStep(2);
      return;
    }

    // Validate step 2
    if (!formData.totalAmount) {
      toast.error("Please enter the contract value");
      return;
    }

    const amount = parseFloat(formData.totalAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Create contract
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
      freelance: "bg-blue-100 text-blue-800",
      home_improvement: "bg-green-100 text-green-800",
      event_services: "bg-purple-100 text-purple-800",
      trade_services: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors.other;
  };

  const hasTemplates = templates && templates.length > 0;

  return (
    <div className="container max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 0) {
              setLocation("/dashboard/contracts");
            } else if (step === 1) {
              setStep(0);
            } else {
              setStep(1);
            }
          }}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Create New Contract</h1>
        <p className="text-muted-foreground mt-1">
          {step === 0
            ? "Choose a template or start from scratch"
            : step === 1
            ? "Start by choosing a service category and describing the work"
            : "Add financial details and timeline"}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 0 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 0 ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              1
            </div>
            <span className="font-medium hidden sm:inline">Template</span>
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              2
            </div>
            <span className="font-medium hidden sm:inline">Service Details</span>
          </div>
          <div className="w-12 h-0.5 bg-muted" />
          <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
            >
              3
            </div>
            <span className="font-medium hidden sm:inline">Financial & Timeline</span>
          </div>
        </div>
      </div>

      {/* Template Selection Step */}
      {step === 0 && (
        <Card>
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
                {/* Template Cards */}
                <div className="grid gap-4 max-h-[400px] overflow-y-auto">
                  {templates.map((template) => {
                    const templateContent = template.templateContent 
                      ? JSON.parse(template.templateContent as string)
                      : { content: "", variables: [] };
                    
                    return (
                      <button
                        key={template.id}
                        onClick={() => handleSelectTemplate(template as TemplateData)}
                        className="p-4 rounded-lg border-2 border-gray-200 bg-white transition-all text-left hover:border-primary hover:shadow-md flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
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

                {/* Divider */}
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

            {/* Start from Scratch */}
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
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
              <CardDescription>Describe the service you need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Template Banner */}
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

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Service Category <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
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
                {selectedCategory && (
                  <p className="text-sm text-muted-foreground">{selectedCategory.description}</p>
                )}
              </div>

              {/* Contract Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Contract Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Design for Small Business"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Service Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the work to be done, deliverables, and any specific requirements..."
                  rows={6}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be as specific as possible to avoid misunderstandings
                </p>
              </div>

              {/* Provider Email (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="providerEmail">Service Provider Email (Optional)</Label>
                <Input
                  id="providerEmail"
                  type="email"
                  placeholder="provider@example.com"
                  value={formData.providerEmail}
                  onChange={(e) => setFormData({ ...formData, providerEmail: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  If you already know who will provide the service, enter their email
                </p>
              </div>

              <Button type="submit" size="lg" className="w-full">
                Continue to Financial Details
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Financial & Timeline</CardTitle>
              <CardDescription>Set the contract value and dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Total Amount */}
              <div className="space-y-2">
                <Label htmlFor="totalAmount">
                  Total Contract Value (£) <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    required
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  This can be split into milestones after creating the contract
                </p>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date (Optional)</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="endDate">Expected Completion Date (Optional)</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  min={formData.startDate || undefined}
                />
              </div>

              {/* Summary */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <h4 className="font-semibold">Contract Summary</h4>
                <div className="text-sm space-y-1">
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
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-semibold">
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
