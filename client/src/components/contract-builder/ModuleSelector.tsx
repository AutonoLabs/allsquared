import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, Clock, CreditCard, AlertCircle } from "lucide-react";

interface ClauseOption {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  default?: boolean;
}

interface ClauseBanks {
  [key: string]: ClauseOption[];
}

interface Props {
  clauseBanks: ClauseBanks;
  selectedClauses: Record<string, string>;
  onChange: (selected: Record<string, string>) => void;
}

const CLAUSE_ICONS: Record<string, React.ReactNode> = {
  payment: <CreditCard className="w-4 h-4" />,
  liability: <Shield className="w-4 h-4" />,
  confidentiality: <FileText className="w-4 h-4" />,
  termination: <AlertCircle className="w-4 h-4" />,
  timeline: <Clock className="w-4 h-4" />,
};

function getIcon(groupKey: string) {
  const key = groupKey.toLowerCase();
  for (const [k, icon] of Object.entries(CLAUSE_ICONS)) {
    if (key.includes(k)) return icon;
  }
  return <FileText className="w-4 h-4" />;
}

export function ModuleSelector({ clauseBanks, selectedClauses, onChange }: Props) {
  if (!clauseBanks || Object.keys(clauseBanks).length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No clause bank available for this template.</p>
        <p className="text-xs mt-1">All standard clauses will be included.</p>
      </div>
    );
  }

  const toggle = (groupKey: string, optionId: string, checked: boolean) => {
    const updated = { ...selectedClauses };
    if (checked) {
      updated[groupKey] = optionId;
    } else {
      delete updated[groupKey];
    }
    onChange(updated);
  };

  return (
    <div className="space-y-5">
      {Object.entries(clauseBanks).map(([groupKey, options]) => (
        <div key={groupKey}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-violet-600">{getIcon(groupKey)}</span>
            <h3 className="font-medium text-sm capitalize text-foreground">
              {groupKey.replace(/_/g, " ")}
            </h3>
          </div>

          <div className="grid gap-2">
            {options.map((opt) => {
              const isSelected = selectedClauses[groupKey] === opt.id;
              return (
                <Card
                  key={opt.id}
                  className={`cursor-pointer transition-all border ${
                    isSelected
                      ? "border-violet-400 bg-violet-50/60 shadow-sm"
                      : "border-border hover:border-violet-200"
                  }`}
                  onClick={() => toggle(groupKey, opt.id, !isSelected)}
                >
                  <CardContent className="flex items-start justify-between p-3 gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{opt.label}</span>
                        {opt.required && (
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 py-0">
                            Required
                          </Badge>
                        )}
                        {opt.default && !opt.required && (
                          <Badge variant="outline" className="text-[10px] border-blue-300 text-blue-600 py-0">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      {opt.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {opt.description}
                        </p>
                      )}
                    </div>
                    <Switch
                      checked={isSelected}
                      onCheckedChange={(checked) => toggle(groupKey, opt.id, checked)}
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 mt-0.5"
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
