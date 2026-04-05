import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Check, X, Search } from "lucide-react";

interface CompanyData {
  companyNumber: string;
  companyName: string;
  companyStatus: string;
  companyType: string;
  address: string;
  addressObj: {
    line1: string;
    line2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
  } | null;
  dateOfCreation: string;
}

interface CompanyLookupProps {
  onSelect: (company: CompanyData) => void;
  initialValue?: string;
  label?: string;
  placeholder?: string;
}

export default function CompanyLookup({
  onSelect,
  initialValue = "",
  label = "Company Name",
  placeholder = "Search Companies House...",
}: CompanyLookupProps) {
  const [query, setQuery] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState<CompanyData | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (query.length >= 2 && !selected) {
        setDebouncedQuery(query);
        setShowDropdown(true);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, selected]);

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

  const { data, isLoading, error } = trpc.companiesHouse.search.useQuery(
    { query: debouncedQuery, limit: 8 },
    { enabled: debouncedQuery.length >= 2 && !selected }
  );

  const handleSelect = (company: CompanyData) => {
    setSelected(company);
    setQuery(company.companyName);
    setShowDropdown(false);
    onSelect(company);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setDebouncedQuery("");
  };

  const statusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-emerald-100 text-emerald-700";
      case "dissolved": return "bg-red-100 text-red-700";
      case "liquidation": return "bg-amber-100 text-amber-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-2" ref={dropdownRef}>
      <Label>{label}</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (selected) setSelected(null);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        )}
        {selected && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Dropdown */}
        {showDropdown && data?.items && data.items.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {data.items.map((company: CompanyData) => (
              <button
                key={company.companyNumber}
                type="button"
                onClick={() => handleSelect(company)}
                className="w-full px-4 py-3 text-left hover:bg-muted/50 border-b border-border/50 last:border-0 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="font-medium text-sm">{company.companyName}</span>
                  </div>
                  <Badge variant="secondary" className={`text-xs ${statusColor(company.companyStatus)}`}>
                    {company.companyStatus}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1 pl-6">
                  {company.companyNumber} · {company.address}
                </div>
              </button>
            ))}
          </div>
        )}

        {showDropdown && data?.items?.length === 0 && debouncedQuery.length >= 2 && !isLoading && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
            No companies found
          </div>
        )}

        {error && (
          <p className="text-xs text-red-600 mt-1">
            Failed to search Companies House. Please try again.
          </p>
        )}

        {data?.message && (
          <p className="text-xs text-amber-600 mt-1">{data.message}</p>
        )}
      </div>

      {/* Selected company details */}
      {selected && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" />
            <span className="font-medium text-sm">{selected.companyName}</span>
            <Badge variant="secondary" className={`text-xs ${statusColor(selected.companyStatus)}`}>
              {selected.companyStatus}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground pl-6 space-y-0.5">
            <div>Company No: {selected.companyNumber}</div>
            <div>{selected.address}</div>
            {selected.dateOfCreation && <div>Incorporated: {selected.dateOfCreation}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
