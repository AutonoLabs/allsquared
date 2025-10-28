import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, X, Loader2, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CATEGORIES = [
  { value: "freelance", label: "Freelance Services" },
  { value: "home_improvement", label: "Home Improvement" },
  { value: "event_services", label: "Event Services" },
  { value: "trade_services", label: "Trade Services" },
  { value: "other", label: "Other" },
];

const COMMON_VARIABLES = [
  "client_name",
  "provider_name",
  "project_name",
  "total_amount",
  "start_date",
  "end_date",
  "payment_terms",
  "deliverables",
];

export default function TemplateEditor() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const templateId = params.id;
  const isEditing = templateId && templateId !== "new";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [content, setContent] = useState("");
  const [variables, setVariables] = useState<string[]>([]);
  const [newVariable, setNewVariable] = useState("");

  const { data: template, isLoading } = trpc.templates.get.useQuery(
    { id: templateId! },
    { enabled: !!isEditing }
  );

  const createMutation = trpc.templates.create.useMutation({
    onSuccess: () => {
      toast.success("Template created successfully");
      setLocation("/dashboard/templates");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create template");
    },
  });

  const updateMutation = trpc.templates.update.useMutation({
    onSuccess: () => {
      toast.success("Template updated successfully");
      setLocation("/dashboard/templates");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update template");
    },
  });

  useEffect(() => {
    if (template) {
      setName(template.name);
      setDescription(template.description || "");
      setCategory(template.category);
      
      const templateContent = template.templateContent 
        ? JSON.parse(template.templateContent as string)
        : { content: "", variables: [] };
      
      setContent(templateContent.content || "");
      setVariables(templateContent.variables || []);
    }
  }, [template]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter template content");
      return;
    }

    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      category: category as any,
      content: content.trim(),
      variables,
    };

    if (isEditing) {
      updateMutation.mutate({ id: templateId!, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleAddVariable = () => {
    if (!newVariable.trim()) return;
    
    const varName = newVariable.trim().toLowerCase().replace(/\s+/g, "_");
    if (variables.includes(varName)) {
      toast.error("Variable already exists");
      return;
    }
    
    setVariables([...variables, varName]);
    setNewVariable("");
    
    // Insert variable at cursor position
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + `{{${varName}}}` + content.substring(end);
      setContent(newContent);
      
      // Set cursor after inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + varName.length + 4, start + varName.length + 4);
      }, 0);
    }
  };

  const handleRemoveVariable = (varName: string) => {
    setVariables(variables.filter((v) => v !== varName));
  };

  const handleInsertVariable = (varName: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + `{{${varName}}}` + content.substring(end);
      setContent(newContent);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + varName.length + 4, start + varName.length + 4);
      }, 0);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard/templates")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Template" : "New Template"}
            </h1>
            <p className="text-muted-foreground mt-1">
              Create reusable contract templates with dynamic variables
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Template
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Basic information about your template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Freelance Web Design Contract"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description of this template"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
              <CardDescription>
                Write your contract template. Use variables like {'{{'}client_name{'}}'} for dynamic content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your contract template here...

Example:
This agreement is made between {{client_name}} and {{provider_name}} for {{project_name}}.

Total Amount: {{total_amount}}
Start Date: {{start_date}}
End Date: {{end_date}}

..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Variables */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Variables
              </CardTitle>
              <CardDescription>
                Add dynamic fields that will be filled when creating contracts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Variable */}
              <div className="space-y-2">
                <Label htmlFor="newVariable">Add Variable</Label>
                <div className="flex gap-2">
                  <Input
                    id="newVariable"
                    placeholder="e.g., client_name"
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddVariable()}
                  />
                  <Button size="icon" onClick={handleAddVariable}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Current Variables */}
              {variables.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {variables.map((varName) => (
                      <TooltipProvider key={varName}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="secondary"
                              className="cursor-pointer hover:bg-secondary/80"
                              onClick={() => handleInsertVariable(varName)}
                            >
                              {varName}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveVariable(varName);
                                }}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Click to insert {'{{'}{varName}{'}}'}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}

              {/* Common Variables */}
              <div className="space-y-2">
                <Label>Quick Add</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_VARIABLES.filter((v) => !variables.includes(v)).map((varName) => (
                    <Badge
                      key={varName}
                      variant="outline"
                      className="cursor-pointer hover:bg-accent"
                      onClick={() => {
                        setVariables([...variables, varName]);
                        handleInsertVariable(varName);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      {varName}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How variables will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {'{{'}client_name{'}}'}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary font-medium">John Smith</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-xs">
                    {'{{'}total_amount{'}}'}
                  </code>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-primary font-medium">£5,000</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

