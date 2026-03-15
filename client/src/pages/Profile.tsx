import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Save, User, Building2, Mail, Phone, Briefcase, Search, CheckCircle2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { UserTypeSelector } from "@/components/UserTypeSelector";

const UK_POSTCODE_REGEX = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;

interface StructuredAddress {
  line1: string;
  line2: string;
  city: string;
  county: string;
  postcode: string;
  verified: boolean;
}

function parseAddress(raw: string | null | undefined): StructuredAddress {
  if (!raw) return { line1: "", line2: "", city: "", county: "", postcode: "", verified: false };
  try {
    const parsed = JSON.parse(raw);
    return {
      line1: parsed.line1 || "",
      line2: parsed.line2 || "",
      city: parsed.city || "",
      county: parsed.county || "",
      postcode: parsed.postcode || "",
      verified: !!parsed.verified,
    };
  } catch {
    // Legacy plain-text address — put it in line1
    return { line1: raw, line2: "", city: "", county: "", postcode: "", verified: false };
  }
}

export function formatAddress(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    const a = JSON.parse(raw) as StructuredAddress;
    return [a.line1, a.line2, a.city, a.county, a.postcode].filter(Boolean).join(", ");
  } catch {
    return raw;
  }
}

export default function Profile() {
  const { data: user, isLoading, refetch } = trpc.auth.me.useQuery();
  const updateProfileMutation = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [showUserTypeSelector, setShowUserTypeSelector] = useState(false);

  // Structured address fields
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressCounty, setAddressCounty] = useState("");
  const [addressPostcode, setAddressPostcode] = useState("");
  const [addressVerified, setAddressVerified] = useState(false);
  const [postcodeError, setPostcodeError] = useState("");

  // Postcode lookup
  const [lookupPostcode, setLookupPostcode] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResults, setLookupResults] = useState<Array<{ line1: string; line2: string; city: string; county: string }>>([]);
  const [showLookupResults, setShowLookupResults] = useState(false);

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [contractUpdates, setContractUpdates] = useState(true);
  const [milestoneAlerts, setMilestoneAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Populate form fields when user data loads
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setCompany(user.businessName || "");
      setPhone(user.phone || "");
      const addr = parseAddress(user.address);
      setAddressLine1(addr.line1);
      setAddressLine2(addr.line2);
      setAddressCity(addr.city);
      setAddressCounty(addr.county);
      setAddressPostcode(addr.postcode);
      setAddressVerified(addr.verified);
    }
  }, [user]);

  const validatePostcode = (pc: string): boolean => {
    if (!pc) return true; // empty is OK (not required until save)
    return UK_POSTCODE_REGEX.test(pc.trim());
  };

  const handlePostcodeLookup = async () => {
    const pc = lookupPostcode.trim();
    if (!pc) return;
    if (!UK_POSTCODE_REGEX.test(pc)) {
      toast.error("Please enter a valid UK postcode");
      return;
    }
    setLookupLoading(true);
    setLookupResults([]);
    try {
      // Validate the postcode first
      const validateRes = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}/validate`);
      const validateData = await validateRes.json();
      if (!validateData.result) {
        toast.error("Postcode not found");
        setLookupLoading(false);
        return;
      }
      // Fetch postcode data
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      const data = await res.json();
      if (data.status === 200 && data.result) {
        const r = data.result;
        const result = {
          line1: "",
          line2: "",
          city: r.admin_ward || "",
          county: r.admin_county || r.region || "",
        };
        setLookupResults([result]);
        setShowLookupResults(true);
        // Auto-fill postcode and location fields
        setAddressPostcode(r.postcode);
        setAddressCity(r.admin_district || r.admin_ward || "");
        setAddressCounty(r.admin_county || r.region || "");
        setAddressVerified(true);
        setPostcodeError("");
        toast.success("Postcode found — fill in your street address");
      } else {
        toast.error("Postcode not found");
      }
    } catch {
      toast.error("Failed to look up postcode");
    } finally {
      setLookupLoading(false);
    }
  };

  const handleSelectLookupResult = (result: { line1: string; line2: string; city: string; county: string }) => {
    if (result.city) setAddressCity(result.city);
    if (result.county) setAddressCounty(result.county);
    setShowLookupResults(false);
  };

  const handleSaveProfile = () => {
    // Validate postcode if address fields are partially filled
    const hasAddressFields = addressLine1 || addressCity || addressPostcode;
    if (hasAddressFields) {
      if (!addressLine1.trim()) {
        toast.error("Address Line 1 is required");
        return;
      }
      if (!addressCity.trim()) {
        toast.error("City / Town is required");
        return;
      }
      if (!addressPostcode.trim()) {
        toast.error("Postcode is required");
        return;
      }
      if (!validatePostcode(addressPostcode)) {
        setPostcodeError("Please enter a valid UK postcode");
        return;
      }
    }

    const address = hasAddressFields
      ? JSON.stringify({
          line1: addressLine1.trim(),
          line2: addressLine2.trim(),
          city: addressCity.trim(),
          county: addressCounty.trim(),
          postcode: addressPostcode.trim().toUpperCase(),
          verified: addressVerified,
        })
      : "";

    updateProfileMutation.mutate({
      name,
      businessName: company,
      phone,
      address,
    });
  };

  const handleSaveNotifications = () => {
    // TODO: Implement notification preferences update
    toast.success("Notification preferences updated");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{user?.name || "User"}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={user?.userType ? "default" : "secondary"}>
                  <Briefcase className="h-3 w-3 mr-1" />
                  {user?.userType === "provider" && "Service Provider"}
                  {user?.userType === "client" && "Client"}
                  {user?.userType === "both" && "Provider & Client"}
                  {!user?.userType && "No Type Selected"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowUserTypeSelector(true)}
                  className="h-6 px-2 text-xs"
                >
                  Change
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="inline h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Smith"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-2" />
                Email Address
                {user?.verified === "yes" ? (
                  <Badge variant="default" className="ml-2 bg-green-500 text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800 text-xs">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending Verification
                  </Badge>
                )}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Email is managed through Clerk
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">
                <Building2 className="inline h-4 w-4 mr-2" />
                Company Name
              </Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your Company Ltd"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="inline h-4 w-4 mr-2" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+44 20 1234 5678"
              />
            </div>
          </div>

          <Separator />

          {/* Postcode Lookup */}
          <div className="space-y-2">
            <Label>Find Address by Postcode</Label>
            <div className="flex gap-2">
              <Input
                value={lookupPostcode}
                onChange={(e) => setLookupPostcode(e.target.value)}
                placeholder="e.g. SW1A 1AA"
                className="max-w-[200px]"
                onKeyDown={(e) => e.key === "Enter" && handlePostcodeLookup()}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handlePostcodeLookup}
                disabled={lookupLoading || !lookupPostcode.trim()}
              >
                {lookupLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Find Address
              </Button>
            </div>
            {showLookupResults && lookupResults.length > 0 && (
              <div className="border rounded-md p-2 bg-muted/50 space-y-1">
                {lookupResults.map((result, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-primary/10 transition-colors"
                    onClick={() => handleSelectLookupResult(result)}
                  >
                    {[result.city, result.county].filter(Boolean).join(", ")} — Click to fill city/county
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Structured Address Fields */}
          <div className="space-y-2">
            <Label htmlFor="address">Business Address</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="addressLine1" className="text-sm">
                Address Line 1 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressLine1"
                value={addressLine1}
                onChange={(e) => { setAddressLine1(e.target.value); setAddressVerified(false); }}
                placeholder="123 High Street"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressLine2" className="text-sm">
                Address Line 2
              </Label>
              <Input
                id="addressLine2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Flat 4, Building Name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressCity" className="text-sm">
                City / Town <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressCity"
                value={addressCity}
                onChange={(e) => setAddressCity(e.target.value)}
                placeholder="London"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressCounty" className="text-sm">
                County
              </Label>
              <Input
                id="addressCounty"
                value={addressCounty}
                onChange={(e) => setAddressCounty(e.target.value)}
                placeholder="Greater London"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressPostcode" className="text-sm">
                Postcode <span className="text-destructive">*</span>
              </Label>
              <Input
                id="addressPostcode"
                value={addressPostcode}
                onChange={(e) => {
                  setAddressPostcode(e.target.value);
                  setPostcodeError("");
                  setAddressVerified(false);
                }}
                placeholder="SW1A 1AA"
                className={postcodeError ? "border-destructive" : ""}
              />
              {postcodeError && (
                <p className="text-xs text-destructive">{postcodeError}</p>
              )}
            </div>
            {addressVerified && (
              <div className="flex items-center space-y-2 pt-6">
                <Badge variant="default" className="bg-green-500 text-xs">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Postcode Verified
                </Badge>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you want to receive updates and alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="contract-updates">Contract Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when contracts are signed or updated
                </p>
              </div>
              <Switch
                id="contract-updates"
                checked={contractUpdates}
                onCheckedChange={setContractUpdates}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="milestone-alerts">Milestone Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Notifications for milestone submissions and approvals
                </p>
              </div>
              <Switch
                id="milestone-alerts"
                checked={milestoneAlerts}
                onCheckedChange={setMilestoneAlerts}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive updates about new features and promotions
                </p>
              </div>
              <Switch
                id="marketing-emails"
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveNotifications}>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Authentication</h4>
              <p className="text-sm text-muted-foreground">
                Managed through Clerk
              </p>
            </div>
            <Button variant="outline" disabled>
              Managed Externally
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                toast.error("Account deletion requires contacting support");
              }}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* User Type Selector Dialog */}
      <UserTypeSelector
        open={showUserTypeSelector}
        onClose={() => setShowUserTypeSelector(false)}
        onComplete={() => refetch()}
      />
    </div>
  );
}

