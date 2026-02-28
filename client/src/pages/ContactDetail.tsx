import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  FileText,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';

function formatAmount(pence: number | string): string {
  const amount = typeof pence === 'string' ? parseInt(pence, 10) : pence;
  return `\u00A3${(amount / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  pending_signature: 'bg-yellow-100 text-yellow-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  disputed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500',
};

export default function ContactDetail() {
  const params = useParams<{ id: string }>();
  const contactId = params.id!;
  const [newNote, setNewNote] = useState('');
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.contacts.get.useQuery({ id: contactId });

  const addNoteMutation = trpc.contacts.addNote.useMutation({
    onSuccess: () => {
      setNewNote('');
      utils.contacts.get.invalidate({ id: contactId });
    },
  });

  const deleteNoteMutation = trpc.contacts.deleteNote.useMutation({
    onSuccess: () => {
      utils.contacts.get.invalidate({ id: contactId });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Contact not found</p>
        <Link href="/dashboard/contacts">
          <Button variant="link" className="mt-2">Back to contacts</Button>
        </Link>
      </div>
    );
  }

  const { contact, contracts, notes, stats } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/contacts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <Avatar className="h-12 w-12">
          <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{contact.name || 'Unknown'}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {contact.businessName && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {contact.businessName}
              </span>
            )}
            {contact.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {contact.phone}
              </span>
            )}
          </div>
        </div>
        {contact.userType && (
          <Badge variant="secondary" className="ml-auto">
            {contact.userType === 'provider' ? 'Supplier' : contact.userType === 'both' ? 'Client & Supplier' : 'Client'}
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.totalContracts}</div>
            <p className="text-xs text-muted-foreground">Total Contracts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.activeContracts}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.completedContracts}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{formatAmount(stats.totalValue)}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Contracts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4" />
              Contracts ({contracts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contracts yet</p>
            ) : (
              <div className="space-y-3">
                {contracts.map((c) => (
                  <Link key={c.id} href={`/dashboard/contracts/${c.id}`}>
                    <div className="flex items-center justify-between rounded-md border p-3 cursor-pointer hover:bg-accent/50 transition-colors">
                      <div>
                        <p className="font-medium text-sm">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${statusColors[c.status] || ''}`} variant="secondary">
                          {c.status.replace('_', ' ')}
                        </Badge>
                        <p className="text-xs font-medium mt-1">{formatAmount(c.totalAmount)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add note */}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a note about this contact..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button
                size="sm"
                onClick={() =>
                  addNoteMutation.mutate({
                    contactId,
                    content: newNote,
                  })
                }
                disabled={!newNote.trim() || addNoteMutation.isPending}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Add Note
              </Button>
            </div>

            <Separator />

            {/* Notes list */}
            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No notes yet. Add one above.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-md border p-3">
                    <div className="flex items-start justify-between">
                      <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteNoteMutation.mutate({ id: note.id })}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(note.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
