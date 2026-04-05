import { TRPCError } from '@trpc/server';
import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { contractTemplates } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from 'nanoid';

export const templatesRouter = router({
  // List all templates
  list: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
      })
    )
    .query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });
      let query = db.select().from(contractTemplates);
      
      if (input.category) {
        query = query.where(eq(contractTemplates.category, input.category)) as any;
      }

      const templates = await query.orderBy(desc(contractTemplates.createdAt));

      return templates;
    }),

  // Get single template
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });
      const template = await db
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, input.id))
        .limit(1);

      if (template.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND', message: "Template not found" });
      }

      return template[0];
    }),

  // Create template
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.enum(["freelance", "home_improvement", "event_services", "trade_services", "other"]),
        content: z.string(),
        variables: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      const templateId = `tmpl_${nanoid(16)}`;

      const templateContent = {
        content: input.content,
        variables: input.variables || [],
      };

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });
      await db.insert(contractTemplates).values({
        id: templateId,
        name: input.name,
        description: input.description,
        category: input.category,
        templateContent: JSON.stringify(templateContent),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { templateId };
    }),

  // Update template
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        category: z.enum(["freelance", "home_improvement", "event_services", "trade_services", "other"]).optional(),
        content: z.string().optional(),
        variables: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }: any) => {
      const { id, content, variables, ...updates } = input;

      const updateData: any = {
        ...updates,
        updatedAt: new Date(),
      };

      if (content || variables) {
        const templateContent = {
          content: content || "",
          variables: variables || [],
        };
        updateData.templateContent = JSON.stringify(templateContent);
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });
      await db
        .update(contractTemplates)
        .set(updateData)
        .where(eq(contractTemplates.id, id));

      return { success: true };
    }),

  // Delete template
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }: any) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Database not available" });
      await db
        .delete(contractTemplates)
        .where(eq(contractTemplates.id, input.id));

      return { success: true };
    }),
});

