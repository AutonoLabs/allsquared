import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { contractTemplates, contracts } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const templateBuilderRouter = router({
  // List available legal templates (with variable defs and clause banks)
  listLegalTemplates: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const templates = await db
      .select()
      .from(contractTemplates)
      .where(eq(contractTemplates.isActive, "yes"));

    // Only return templates that have templateSlug (i.e. legal templates)
    return templates
      .filter((t) => t.templateSlug)
      .map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        templateSlug: t.templateSlug,
        variables: t.variables ? JSON.parse(t.variables) : [],
        clauseBanks: t.clauseBanks ? JSON.parse(t.clauseBanks) : {},
      }));
  }),

  // Get single template with full markdown
  getLegalTemplate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, input.id))
        .limit(1);

      if (result.length === 0) {
        throw new Error("Template not found");
      }

      const t = result[0];
      return {
        id: t.id,
        name: t.name,
        description: t.description,
        category: t.category,
        templateSlug: t.templateSlug,
        templateMarkdown: t.templateMarkdown,
        variables: t.variables ? JSON.parse(t.variables) : [],
        clauseBanks: t.clauseBanks ? JSON.parse(t.clauseBanks) : {},
      };
    }),

  // Generate contract from template
  generateContract: protectedProcedure
    .input(
      z.object({
        templateId: z.string(),
        variables: z.record(z.string(), z.string()),
        selectedClauses: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get the template
      const result = await db
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, input.templateId))
        .limit(1);

      if (result.length === 0) {
        throw new Error("Template not found");
      }

      const template = result[0];
      let markdown = template.templateMarkdown || "";

      // Replace all [VARIABLE_NAME] placeholders with values
      for (const [key, value] of Object.entries(input.variables)) {
        const regex = new RegExp(`\\[${key}\\]`, "g");
        markdown = markdown.replace(regex, value || `[${key}]`);
      }

      // Generate a title from the template name + client name
      const title = `${template.name} - ${input.variables.CLIENT_NAME || input.variables.COMPANY_NAME || "Draft"}`;

      const contractId = `contract_${nanoid(16)}`;

      const insertData: Record<string, unknown> = {
        id: contractId,
        templateId: input.templateId,
        clientId: ctx.user.id,
        providerId: ctx.user.id,
        title,
        description: template.description || "",
        category: template.category,
        totalAmount: input.variables.CONTRACT_VALUE || "0",
        currency: input.variables.CURRENCY || "GBP",
        status: "draft" as const,
        contractContent: markdown,
        selectedClauses: JSON.stringify(input.selectedClauses),
        filledVariables: JSON.stringify(input.variables),
        generatedMarkdown: markdown,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      if (input.variables.START_DATE) {
        insertData.startDate = new Date(input.variables.START_DATE);
      }

      await db.insert(contracts).values(insertData as any);

      return { contractId, generatedMarkdown: markdown };
    }),

  // Save contract draft
  saveContractDraft: protectedProcedure
    .input(
      z.object({
        contractId: z.string().optional(),
        templateId: z.string(),
        variables: z.record(z.string()),
        selectedClauses: z.record(z.string()),
        generatedMarkdown: z.string(),
        status: z
          .enum(["draft", "pending_signature"])
          .optional()
          .default("draft"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      if (input.contractId) {
        // Update existing
        await db
          .update(contracts)
          .set({
            filledVariables: JSON.stringify(input.variables),
            selectedClauses: JSON.stringify(input.selectedClauses),
            generatedMarkdown: input.generatedMarkdown,
            contractContent: input.generatedMarkdown,
            status: input.status,
            updatedAt: new Date(),
          })
          .where(eq(contracts.id, input.contractId));

        return { contractId: input.contractId };
      }

      // Get template for metadata
      const result = await db
        .select()
        .from(contractTemplates)
        .where(eq(contractTemplates.id, input.templateId))
        .limit(1);

      const template = result[0];
      const title = `${template?.name || "Contract"} - ${input.variables.CLIENT_NAME || input.variables.COMPANY_NAME || "Draft"}`;

      const contractId = `contract_${nanoid(16)}`;

      await db.insert(contracts).values({
        id: contractId,
        templateId: input.templateId,
        clientId: ctx.user.id,
        providerId: ctx.user.id,
        title,
        description: template?.description || "",
        category: template?.category || "other",
        totalAmount: input.variables.CONTRACT_VALUE || "0",
        currency: input.variables.CURRENCY || "GBP",
        status: input.status,
        contractContent: input.generatedMarkdown,
        selectedClauses: JSON.stringify(input.selectedClauses),
        filledVariables: JSON.stringify(input.variables),
        generatedMarkdown: input.generatedMarkdown,
        startDate: input.variables.START_DATE
          ? new Date(input.variables.START_DATE)
          : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return { contractId };
    }),
});
