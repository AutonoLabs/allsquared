import { z } from "zod";
import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { contractTemplates } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

async function getTemplateOrThrow(db: NonNullable<Awaited<ReturnType<typeof getDb>>>, id: string) {
  const rows = await db.select().from(contractTemplates).where(eq(contractTemplates.id, id)).limit(1);
  if (!rows[0]) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Template not found" });
  }
  return rows[0];
}

function assertCanMutateTemplate(template: { templateSlug: string | null }, userRole: string) {
  if (template.templateSlug && userRole !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Platform legal templates can only be modified by administrators",
    });
  }
}

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
      if (!db) throw new Error("Database not available");
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
      if (!db) throw new Error("Database not available");
      const template = await db
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, input.id))
        .limit(1);

      if (template.length === 0) {
        throw new Error("Template not found");
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
    .mutation(async ({ ctx, input }) => {
      const templateId = `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const templateContent = {
        content: input.content,
        variables: input.variables || [],
      };

      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.insert(contractTemplates).values({
        id: templateId,
        name: input.name,
        description: input.description,
        category: input.category,
        templateContent: JSON.stringify(templateContent),
        isActive: "yes",
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
    .mutation(async ({ ctx, input }) => {
      const { id, content, variables, ...updates } = input;

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const template = await getTemplateOrThrow(db, id);
      assertCanMutateTemplate(template, ctx.user.role);

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
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const template = await getTemplateOrThrow(db, input.id);
      assertCanMutateTemplate(template, ctx.user.role);

      await db
        .delete(contractTemplates)
        .where(eq(contractTemplates.id, input.id));

      return { success: true };
    }),
});

