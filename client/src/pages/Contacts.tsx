import { useState } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, Building2, ArrowUpRight } from 'lucide-react';
import { trpc } from '@/lib/trpc';

function formatAmount(pence: number): string {
  return `\u00A3${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function Contacts() {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'clients' | 'suppliers'>('all');

  const { data: contacts, isLoading } = trpc.contacts.list.useQuery(
    { search: search || undefined }
  );

  const filtered = contacts?.filter((c) => {
    if (tab === 'clients') return c.userType === 'client' || c.userType === 'both';
    if (tab === 'suppliers') return c.userType === 'provider' || c.userType === 'both';
    return true;
  }) || [];

  const totalValue = filtered.reduce((sum, c) => sum + (c.totalValue || 0), 0);
  const activeCount = filtered.reduce((sum, c) => sum + (c.activeContracts || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contacts</h1>
        <p className="text-muted-foreground">
          People you've worked with through AllSquared
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filtered.length}</div>
            <p className="text-sm text-muted-foreground">Total Contacts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-sm text-muted-foreground">Active Contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatAmount(totalValue)}</div>
            <p className="text-sm text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList>
            <TabsTrigger value="all">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              All
            </TabsTrigger>
            <TabsTrigger value="clients">
              <Building2 className="mr-1.5 h-3.5 w-3.5" />
              Clients
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              Suppliers
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contact List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No contacts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Contacts appear automatically when you create contracts with others.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((contact) => (
            <Link key={contact.id} href={`/dashboard/contacts/${contact.id}`}>
              <Card className="cursor-pointer transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 py-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-sm">
                      {getInitials(contact.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">
                        {contact.name || contact.email || 'Unknown'}
                      </p>
                      {contact.userType && (
                        <Badge variant="secondary" className="text-xs">
                          {contact.userType === 'provider' ? 'Supplier' : contact.userType === 'both' ? 'Both' : 'Client'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.businessName || contact.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {contact.contractCount} contract{contact.contractCount !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatAmount(contact.totalValue || 0)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
