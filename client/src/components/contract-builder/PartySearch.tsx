import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, User, Search, ChevronDown } from "lucide-react";

export interface PartyData {
  name: string;
  companyNumber?: string;
  address?: string;
  email?: string;
  phone?: string;
  type: "client" | "contractor" | "individual" | "company";
  companiesHouseData?: string;
  saveAsProfile?: boolean;
}

interface Props {
  label: string;
  role: "client" | "contractor";
  value: PartyData;
  onChange: (data: PartyData) => void;
  savedProfiles?: Array<{
    id: string;
    name: string;
    companyNumber?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    type: string;
  }>;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function PartySearch({ label, role, value, onChange, savedProfiles = [] }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false);
  const debouncedQuery = useDebounce(searchQuery, 400);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchResult = trpc.companiesHouse.search.useQuery(
    { query: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 }
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectCompany = (item: {
    companyName: string;
    companyNumber: string;
    address: string;
    companyStatus: string;
  }) => {
    onChange({
      ...value,
      name: item.companyName,
      companyNumber: item.companyNumber,
      address: item.address,
      type: "company",
      companiesHouseData: JSON.stringify(item),
    });
    setSearchQuery("");
    setShowDropdown(false);
  };

  const selectProfile = (p: (typeof savedProfiles)[0]) => {
    onChange({
      name: p.name,
      companyNumber: p.companyNumber || undefined,
      address: p.address || undefined,
      email: p.email || undefined,
      phone: p.phone || undefined,
      type: (p.type as PartyData["type"]) || "company",
      saveAsProfile: false,
    });
    setShowProfiles(false);
  };

  return (
    <div className="space-y-4">
      {/* Saved profiles picker */}
      {savedProfiles.length > 0 && (
        <div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowProfiles(!showProfiles)}
            className="text-violet-600 border-violet-200 hover:bg-violet-50"
          >
            <User className="w-3.5 h-3.5 mr-1.5" />
            Pick from saved profiles
            <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform ${showProfiles ? "rotate-180" : ""}`} />
          </Button>
          {showProfiles && (
            <Card className="mt-2 border-violet-100">
              <CardContent className="p-2 space-y-1">
                {savedProfiles.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectProfile(p)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-violet-50 transition-colors"
                  >
                    <div className="font-medium text-sm text-navy-900">{p.name}</div>
                    {p.companyNumber && (
                      <div className="text-xs text-muted-foreground">#{p.companyNumber}</div>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Companies House search */}
      <div className="relative" ref={dropdownRef}>
        <Label className="text-sm font-medium mb-1.5 block">
          <Building2 className="inline w-3.5 h-3.5 mr-1 text-violet-500" />
          Search Companies House
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by company name..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="pl-9"
          />
        </div>

        {showDropdown && debouncedQuery.length >= 2 && (
          <Card className="absolute z-50 w-full mt-1 shadow-lg border-violet-100">
            <CardContent className="p-1">
              {searchResult.isLoading && (
                <div className="space-y-2 p-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              )}
              {!searchResult.isLoading && searchResult.data?.items?.length === 0 && (
                <div className="p-3 text-sm text-muted-foreground text-center">No companies found</div>
              )}
              {searchResult.data?.items?.map((item: any) => (
                <button
                  key={item.companyNumber}
                  type="button"
                  onClick={() => selectCompany(item)}
                  className="w-full text-left px-3 py-2.5 rounded-md hover:bg-violet-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{item.companyName}</span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${item.companyStatus === "active" ? "border-green-300 text-green-700" : "border-gray-300 text-gray-500"}`}
                    >
                      {item.companyStatus}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    #{item.companyNumber} · {item.address?.slice(0, 50)}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Selected / manual fields */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label className="text-sm">Legal Name *</Label>
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder={`${label} legal name`}
            className="mt-1"
          />
        </div>

        {value.companyNumber && (
          <div>
            <Label className="text-sm">Company Number</Label>
            <Input
              value={value.companyNumber}
              onChange={(e) => onChange({ ...value, companyNumber: e.target.value })}
              className="mt-1 font-mono"
            />
          </div>
        )}

        <div>
          <Label className="text-sm">Registered Address</Label>
          <Input
            value={value.address || ""}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
            placeholder="Address"
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm">Email</Label>
            <Input
              type="email"
              value={value.email || ""}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
              placeholder="contact@company.com"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm">Phone</Label>
            <Input
              type="tel"
              value={value.phone || ""}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
              placeholder="+44 20 ..."
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Save as profile */}
      <div className="flex items-center gap-2">
        <Checkbox
          id={`save-${role}`}
          checked={value.saveAsProfile}
          onCheckedChange={(checked) => onChange({ ...value, saveAsProfile: !!checked })}
        />
        <label htmlFor={`save-${role}`} className="text-sm text-muted-foreground cursor-pointer">
          Save as a reusable profile
        </label>
      </div>
    </div>
  );
}
