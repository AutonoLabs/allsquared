import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getUserContacts,
  getContactNotes,
  createContactNote,
  deleteContactNote,
  getUser,
  getUserContracts,
} from '../db';

export const contactsRouter = router({
  // List all contacts (people you have contracts with)
  list: protectedProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      let contacts = await getUserContacts(ctx.user.id);

      // Filter by search query
      if (input?.search) {
        const q = input.search.toLowerCase();
        contacts = contacts.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.businessName?.toLowerCase().includes(q)
        );
      }

      // Sort by most recent contract
      contacts.sort((a, b) => {
        const dateA = new Date(a.lastContractDate || 0).getTime();
        const dateB = new Date(b.lastContractDate || 0).getTime();
        return dateB - dateA;
      });

      return contacts;
    }),

  // Get single contact with their contracts and notes
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const contact = await getUser(input.id);
      if (!contact) throw new Error('Contact not found');

      // Get shared contracts
      const allContracts = await getUserContracts(ctx.user.id);
      const sharedContracts = allContracts.filter(
        (c) => c.clientId === input.id || c.providerId === input.id
      );

      // Get notes
      const notes = await getContactNotes(ctx.user.id, input.id);

      // Build activity timeline from contracts + milestones
      const activities = sharedContracts.map((c) => ({
        type: 'contract' as const,
        id: c.id,
        title: c.title || 'Untitled Contract',
        status: c.status,
        amount: c.totalAmount,
        date: c.createdAt,
      }));

      activities.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

      return {
        contact,
        contracts: sharedContracts,
        notes,
        activities,
        stats: {
          totalContracts: sharedContracts.length,
          activeContracts: sharedContracts.filter((c) => c.status === 'active').length,
          completedContracts: sharedContracts.filter((c) => c.status === 'completed').length,
          totalValue: sharedContracts.reduce(
            (sum, c) => sum + parseInt(c.totalAmount || '0', 10),
            0
          ),
        },
      };
    }),

  // Add a note about a contact
  addNote: protectedProcedure
    .input(
      z.object({
        contactId: z.string(),
        content: z.string().min(1),
        contractId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const noteId = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await createContactNote({
        id: noteId,
        ownerId: ctx.user.id,
        contactId: input.contactId,
        content: input.content,
        contractId: input.contractId || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { noteId };
    }),

  // Delete a note
  deleteNote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await deleteContactNote(input.id, ctx.user.id);
      return { success: true };
    }),
});
