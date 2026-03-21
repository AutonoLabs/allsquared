import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

export interface VariableDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "number";
  required?: boolean;
  default?: string;
  group: string;
  options?: string[];
  placeholder?: string;
}

interface Props {
  variables: VariableDef[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

function groupVariables(vars: VariableDef[]): Record<string, VariableDef[]> {
  return vars.reduce(
    (acc, v) => {
      const g = v.group || "General";
      if (!acc[g]) acc[g] = [];
      acc[g].push(v);
      return acc;
    },
    {} as Record<string, VariableDef[]>
  );
}

function groupProgress(vars: VariableDef[], values: Record<string, string>): number {
  const required = vars.filter((v) => v.required);
  if (required.length === 0) return 100;
  const filled = required.filter((v) => values[v.name]?.trim()).length;
  return Math.round((filled / required.length) * 100);
}

export function ModuleQuestions({ variables, values, onChange }: Props) {
  if (!variables || variables.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-60" />
        <p className="text-sm">No additional questions required for selected modules.</p>
      </div>
    );
  }

  const groups = groupVariables(variables);

  const set = (name: string, val: string) => onChange({ ...values, [name]: val });

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([groupName, vars]) => {
        const progress = groupProgress(vars, values);
        return (
          <Card key={groupName} className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold capitalize text-foreground">
                  {groupName}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {progress === 100 ? (
                    <Badge variant="outline" className="border-green-300 text-green-700 text-[10px] py-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Complete
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">{progress}%</span>
                  )}
                </div>
              </div>
              <Progress value={progress} className="h-1 mt-1" />
            </CardHeader>
            <CardContent className="space-y-4">
              {vars.map((v) => (
                <div key={v.name}>
                  <Label className="text-sm flex items-center gap-1">
                    {v.label}
                    {v.required && <span className="text-red-500">*</span>}
                  </Label>

                  {v.type === "textarea" ? (
                    <Textarea
                      value={values[v.name] || ""}
                      onChange={(e) => set(v.name, e.target.value)}
                      placeholder={v.placeholder || v.label}
                      className="mt-1 resize-none"
                      rows={3}
                    />
                  ) : v.type === "select" && v.options ? (
                    <Select
                      value={values[v.name] || ""}
                      onValueChange={(val) => set(v.name, val)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={`Select ${v.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {v.options.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      type={v.type === "date" ? "date" : v.type === "number" ? "number" : "text"}
                      value={values[v.name] || ""}
                      onChange={(e) => set(v.name, e.target.value)}
                      placeholder={v.placeholder || (v.default ? `e.g. ${v.default}` : v.label)}
                      className="mt-1"
                    />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
