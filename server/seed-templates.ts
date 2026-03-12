/**
 * Seed script for legal contract templates.
 * Run with: npx tsx server/seed-templates.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { drizzle } from "drizzle-orm/node-postgres";
import { contractTemplates } from "../drizzle/schema";
import { nanoid } from "nanoid";
import { eq } from "drizzle-orm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Variable & Clause Definitions ──────────────────────────────────────

interface VariableDef {
  name: string;
  label: string;
  type: "text" | "textarea" | "date" | "select";
  required?: boolean;
  default?: string;
  group: string;
  options?: string[];
}

interface ClauseOption {
  id: string;
  label: string;
  summary: string;
}

interface TemplateConfig {
  file: string;
  slug: string;
  name: string;
  description: string;
  category: "freelance" | "home_improvement" | "event_services" | "trade_services" | "other";
  variables: VariableDef[];
  clauseBanks: Record<string, ClauseOption[]>;
}

const TEMPLATES: TemplateConfig[] = [
  {
    file: "master-services-agreement-uk.md",
    slug: "msa-uk",
    name: "Master Services Agreement (UK)",
    description:
      "Comprehensive services agreement covering scope, payment, IP, confidentiality and liability for UK engagements.",
    category: "freelance",
    variables: [
      { name: "CLIENT_NAME", label: "Client Name", type: "text", required: true, group: "Client Details" },
      { name: "CLIENT_ADDRESS", label: "Client Address", type: "text", required: true, group: "Client Details" },
      { name: "SUPPLIER_NAME", label: "Supplier Name", type: "text", required: true, group: "Supplier Details" },
      { name: "SUPPLIER_ADDRESS", label: "Supplier Address", type: "text", required: true, group: "Supplier Details" },
      { name: "CONTRACT_VALUE", label: "Contract Value", type: "text", required: true, group: "Commercial Terms" },
      {
        name: "CURRENCY",
        label: "Currency",
        type: "select",
        default: "GBP",
        group: "Commercial Terms",
        options: ["GBP", "USD", "EUR"],
      },
      { name: "START_DATE", label: "Start Date", type: "date", required: true, group: "Dates" },
      { name: "INITIAL_TERM", label: "Initial Term (months)", type: "text", default: "12", group: "Dates" },
      { name: "NOTICE_PERIOD", label: "Notice Period (days)", type: "text", default: "30", group: "Dates" },
      {
        name: "PAYMENT_TERMS",
        label: "Payment Terms",
        type: "text",
        default: "30 days from invoice",
        group: "Commercial Terms",
      },
    ],
    clauseBanks: {
      engagement_type: [
        { id: "standard", label: "Standard Engagement", summary: "Standard project-based terms with milestone payments" },
        { id: "retainer", label: "Retainer Engagement", summary: "Monthly retainer with agreed hours and scope" },
        { id: "project_based", label: "Project-Based", summary: "Fixed scope, fixed price project delivery" },
      ],
    },
  },
  {
    file: "software-development-agreement-uk.md",
    slug: "software-dev-uk",
    name: "Software Development Agreement (UK)",
    description:
      "Agreement for software development projects covering agile delivery, IP assignment, warranties and support.",
    category: "freelance",
    variables: [
      { name: "CLIENT_NAME", label: "Client Name", type: "text", required: true, group: "Client Details" },
      { name: "CLIENT_ADDRESS", label: "Client Address", type: "text", required: true, group: "Client Details" },
      { name: "DEVELOPER_NAME", label: "Developer Name", type: "text", required: true, group: "Developer Details" },
      { name: "DEVELOPER_ADDRESS", label: "Developer Address", type: "text", required: true, group: "Developer Details" },
      { name: "PROJECT_NAME", label: "Project Name", type: "text", required: true, group: "Project Details" },
      { name: "TECHNOLOGY_STACK", label: "Technology Stack", type: "text", group: "Project Details" },
      { name: "CONTRACT_VALUE", label: "Contract Value", type: "text", required: true, group: "Commercial Terms" },
      { name: "START_DATE", label: "Start Date", type: "date", required: true, group: "Dates" },
      { name: "SPRINT_DURATION", label: "Sprint Duration (weeks)", type: "text", default: "2", group: "Dates" },
      { name: "WARRANTY_PERIOD", label: "Warranty Period (months)", type: "text", default: "6", group: "Dates" },
    ],
    clauseBanks: {
      pricing_model: [
        { id: "fixed_price", label: "Fixed Price", summary: "Agreed total price for defined scope" },
        { id: "time_materials", label: "Time & Materials", summary: "Billed per day/hour with regular invoicing" },
        { id: "agile_sprint", label: "Agile Sprint", summary: "Sprint-based delivery with per-sprint pricing" },
      ],
    },
  },
  {
    file: "freelancer-contractor-agreement-uk.md",
    slug: "freelancer-uk",
    name: "Freelancer / Contractor Agreement (UK)",
    description:
      "Agreement for engaging freelancers and contractors, covering IR35 status, scope, payment and confidentiality.",
    category: "freelance",
    variables: [
      { name: "CLIENT_NAME", label: "Client Name", type: "text", required: true, group: "Client Details" },
      { name: "CLIENT_ADDRESS", label: "Client Address", type: "text", required: true, group: "Client Details" },
      { name: "CONTRACTOR_NAME", label: "Contractor Name", type: "text", required: true, group: "Contractor Details" },
      { name: "CONTRACTOR_ADDRESS", label: "Contractor Address", type: "text", required: true, group: "Contractor Details" },
      { name: "CONTRACT_VALUE", label: "Contract Value", type: "text", required: true, group: "Commercial Terms" },
      {
        name: "CURRENCY",
        label: "Currency",
        type: "select",
        default: "GBP",
        group: "Commercial Terms",
        options: ["GBP", "USD", "EUR"],
      },
      { name: "DAY_RATE", label: "Day Rate", type: "text", group: "Commercial Terms" },
      { name: "START_DATE", label: "Start Date", type: "date", required: true, group: "Dates" },
      { name: "END_DATE", label: "End Date", type: "date", group: "Dates" },
      { name: "SERVICE_DESCRIPTION", label: "Service Description", type: "textarea", group: "Project Details" },
    ],
    clauseBanks: {
      ir35_status: [
        { id: "outside_ir35", label: "Outside IR35", summary: "Contractor determines own working practices" },
        { id: "inside_ir35", label: "Inside IR35", summary: "Client responsible for tax deductions" },
      ],
      nda_type: [
        { id: "one_way", label: "One-Way NDA", summary: "Only contractor bound by confidentiality" },
        { id: "two_way", label: "Two-Way NDA (Mutual)", summary: "Both parties bound by confidentiality" },
      ],
    },
  },
  {
    file: "escrow-annexure-uk.md",
    slug: "escrow-uk",
    name: "Escrow Annexure (UK)",
    description:
      "Escrow payment annexure for holding and releasing project funds based on milestone or completion triggers.",
    category: "other",
    variables: [
      { name: "CLIENT_NAME", label: "Client Name", type: "text", required: true, group: "Client Details" },
      { name: "CLIENT_ADDRESS", label: "Client Address", type: "text", required: true, group: "Client Details" },
      { name: "SUPPLIER_NAME", label: "Supplier Name", type: "text", required: true, group: "Supplier Details" },
      { name: "SUPPLIER_ADDRESS", label: "Supplier Address", type: "text", required: true, group: "Supplier Details" },
      { name: "CONTRACT_VALUE", label: "Contract Value", type: "text", required: true, group: "Commercial Terms" },
      { name: "START_DATE", label: "Start Date", type: "date", required: true, group: "Dates" },
      { name: "ESCROW_FEE_PERCENTAGE", label: "Escrow Fee %", type: "text", default: "2.5", group: "Commercial Terms" },
      { name: "FUNDING_DEADLINE_DAYS", label: "Funding Deadline (days)", type: "text", default: "5", group: "Dates" },
    ],
    clauseBanks: {
      release_type: [
        { id: "milestone", label: "Milestone-Based Release", summary: "Funds released on milestone completion" },
        { id: "completion", label: "Completion-Based Release", summary: "All funds released on project completion" },
      ],
    },
  },
  {
    file: "terms-of-service-uk.md",
    slug: "tos-uk",
    name: "Terms of Service (UK)",
    description:
      "Website / platform terms of service compliant with UK consumer and e-commerce regulations.",
    category: "other",
    variables: [
      { name: "COMPANY_NUMBER", label: "Company Number", type: "text", group: "Company Details" },
      { name: "REGISTERED_ADDRESS", label: "Registered Address", type: "text", group: "Company Details" },
      { name: "EFFECTIVE_DATE", label: "Effective Date", type: "date", group: "Dates" },
      { name: "LAST_UPDATED_DATE", label: "Last Updated Date", type: "date", group: "Dates" },
      { name: "SUPPORT_EMAIL", label: "Support Email", type: "text", group: "Contact" },
      { name: "LEGAL_EMAIL", label: "Legal Email", type: "text", group: "Contact" },
    ],
    clauseBanks: {
      audience: [
        { id: "b2b", label: "B2B Only", summary: "Terms for business users only" },
        { id: "b2c", label: "B2C (Consumer)", summary: "Includes consumer protection provisions" },
        { id: "both", label: "B2B + B2C", summary: "Terms for both business and consumer users" },
      ],
    },
  },
  {
    file: "privacy-policy-uk-gdpr.md",
    slug: "privacy-uk",
    name: "Privacy Policy (UK GDPR)",
    description:
      "GDPR-compliant privacy policy covering data collection, processing, rights and ICO registration.",
    category: "other",
    variables: [
      { name: "COMPANY_NUMBER", label: "Company Number", type: "text", group: "Company Details" },
      { name: "REGISTERED_ADDRESS", label: "Registered Address", type: "text", group: "Company Details" },
      { name: "ICO_REG_NUMBER", label: "ICO Registration Number", type: "text", group: "Company Details" },
      { name: "EFFECTIVE_DATE", label: "Effective Date", type: "date", group: "Dates" },
      { name: "LAST_UPDATED_DATE", label: "Last Updated Date", type: "date", group: "Dates" },
    ],
    clauseBanks: {},
  },
];

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const db = drizzle(dbUrl);
  const legalDir = path.resolve(__dirname, "../legal");

  console.log("Seeding legal templates...\n");

  for (const config of TEMPLATES) {
    const filePath = path.join(legalDir, config.file);

    let markdown = "";
    try {
      markdown = fs.readFileSync(filePath, "utf-8");
    } catch {
      console.warn(`  ⚠ File not found: ${config.file} — inserting without markdown`);
    }

    // Check if template with this slug already exists
    const existing = await db
      .select()
      .from(contractTemplates)
      .where(eq(contractTemplates.templateSlug, config.slug))
      .limit(1);

    const templateData = {
      name: config.name,
      description: config.description,
      category: config.category,
      templateContent: JSON.stringify({ content: config.description, variables: config.variables.map((v) => v.name) }),
      isActive: "yes" as const,
      variables: JSON.stringify(config.variables),
      clauseBanks: JSON.stringify(config.clauseBanks),
      templateMarkdown: markdown,
      templateSlug: config.slug,
      updatedAt: new Date(),
    };

    if (existing.length > 0) {
      // Update
      await db
        .update(contractTemplates)
        .set(templateData)
        .where(eq(contractTemplates.id, existing[0].id));
      console.log(`  ✓ Updated: ${config.name} (${config.slug})`);
    } else {
      // Insert
      await db.insert(contractTemplates).values({
        id: `tmpl_${nanoid(16)}`,
        ...templateData,
        createdAt: new Date(),
      });
      console.log(`  + Created: ${config.name} (${config.slug})`);
    }
  }

  console.log("\nDone! Seeded", TEMPLATES.length, "legal templates.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
