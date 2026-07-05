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
  {
    file: "07-cookie-policy-uk.md",
    slug: "cookie-policy-uk",
    name: "Cookie Policy (UK PECR)",
    description:
      "Cookie policy compliant with UK GDPR and PECR, covering cookie categories, consent, and user controls.",
    category: "other",
    variables: [
      { name: "EFFECTIVE_DATE", label: "Effective Date", type: "date", group: "Dates" },
      { name: "LAST_UPDATED_DATE", label: "Last Updated Date", type: "date", group: "Dates" },
      { name: "SUPPORT_EMAIL", label: "Support Email", type: "text", group: "Contact" },
    ],
    clauseBanks: {},
  },
  {
    file: "08-data-processing-agreement-uk.md",
    slug: "dpa-uk",
    name: "Data Processing Agreement (UK GDPR)",
    description:
      "DPA between Controller and Processor compliant with UK GDPR Article 28 requirements.",
    category: "other",
    variables: [
      { name: "controllerName", label: "Controller Name", type: "text", required: true, group: "Controller Details" },
      { name: "controllerAddress", label: "Controller Address", type: "text", required: true, group: "Controller Details" },
      { name: "controllerICORegistrationNumber", label: "Controller ICO Reg Number", type: "text", group: "Controller Details" },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true, group: "Dates" },
    ],
    clauseBanks: {},
  },
  {
    file: "10-adr-procedural-rules.md",
    slug: "adr-procedural-rules",
    name: "ADR Procedural Rules",
    description:
      "Public-facing Alternative Dispute Resolution procedural rules required under SI 2015/542.",
    category: "other",
    variables: [
      { name: "EFFECTIVE_DATE", label: "Effective Date", type: "date", group: "Dates" },
    ],
    clauseBanks: {},
  },
  {
    file: "15-statement-of-work-template.md",
    slug: "sow-template-uk",
    name: "Statement of Work Template (UK)",
    description:
      "SOW template for use alongside the Master Services Agreement, covering deliverables, milestones, and acceptance.",
    category: "freelance",
    variables: [
      { name: "sowNumber", label: "SOW Number", type: "text", group: "Reference" },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true, group: "Dates" },
      { name: "CLIENT_NAME", label: "Client Name", type: "text", required: true, group: "Client Details" },
      { name: "CLIENT_ADDRESS", label: "Client Address", type: "text", group: "Client Details" },
      { name: "FREELANCER_NAME", label: "Freelancer Name", type: "text", required: true, group: "Freelancer Details" },
      { name: "FREELANCER_ADDRESS", label: "Freelancer Address", type: "text", group: "Freelancer Details" },
    ],
    clauseBanks: {},
  },
  {
    file: "16-ai-transparency-disclosure.md",
    slug: "ai-transparency-disclosure",
    name: "AI Transparency Disclosure",
    description:
      "Public disclosure of AI use in dispute resolution, addressing UK GDPR Article 22 and IBA Guidelines.",
    category: "other",
    variables: [
      { name: "EFFECTIVE_DATE", label: "Effective Date", type: "date", group: "Dates" },
    ],
    clauseBanks: {},
  },
];

/** Seed templates into the given drizzle db instance. Exported for auto-seed on boot. */
export async function seedTemplates(db: ReturnType<typeof drizzle>) {
  const legalDir = path.resolve(__dirname, "../legal");

  console.log("[seed] Seeding legal templates...\n");

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
      await db
        .update(contractTemplates)
        .set(templateData)
        .where(eq(contractTemplates.id, existing[0].id));
      console.log(`  ✓ Updated: ${config.name} (${config.slug})`);
    } else {
      await db.insert(contractTemplates).values({
        id: `tmpl_${nanoid(16)}`,
        ...templateData,
        createdAt: new Date(),
      });
      console.log(`  + Created: ${config.name} (${config.slug})`);
    }
  }

  console.log("[seed] Done! Seeded", TEMPLATES.length, "legal templates.");
}

// ── Seed from templates directory (YAML frontmatter) ─────────────────────

interface SimpleFrontmatter {
  title: string;
  category: string;
  description?: string;
}

function parseYamlFrontmatter(content: string): { frontmatter: SimpleFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid frontmatter format`);
  }
  const fmRaw = match[1];
  const body = match[2];
  const frontmatter: Record<string, string> = {};
  for (const line of fmRaw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex === -1) continue;
    const key = trimmed.substring(0, colonIndex).trim();
    let value = trimmed.substring(colonIndex + 1).trim();
    // Strip quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    frontmatter[key] = value;
  }
  return {
    frontmatter: {
      title: frontmatter.title || '',
      category: frontmatter.category || '',
      description: frontmatter.description || '',
    },
    body,
  };
}

function extractVariableNames(content: string): string[] {
  const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  const vars = new Set<string>();
  let match;
  while ((match = regex.exec(content)) !== null) {
    vars.add(match[1]);
  }
  return Array.from(vars);
}

async function seedFromTemplatesDir(db: ReturnType<typeof drizzle>) {
  const templatesDir = path.resolve(__dirname, "../templates");
  if (!fs.existsSync(templatesDir)) {
    console.log("  [seed] Templates directory not found, skipping...");
    return;
  }

  const files = fs.readdirSync(templatesDir).filter(f => f.endsWith('.md'));
  console.log(`  [seed] Seeding ${files.length} templates from templates/ directory...`);

  for (const file of files) {
    const filePath = path.join(templatesDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { frontmatter, body } = parseYamlFrontmatter(content);
    const slug = file.replace(/\.md$/, '');

    const allowedCategories = ["freelance", "home_improvement", "event_services", "trade_services", "other"] as const;
    if (!allowedCategories.includes(frontmatter.category as any)) {
      console.warn(`  ⚠ Skipping ${file}: invalid category '${frontmatter.category}'`);
      continue;
    }

    const variableNames = extractVariableNames(body);
    const variables: VariableDef[] = variableNames.map(name => ({
      name,
      label: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      type: name.toLowerCase().includes('date') ? 'date' : 'text' as const,
      group: 'General',
      required: false,
    }));

    const templateData = {
      name: frontmatter.title,
      description: frontmatter.description || '',
      category: frontmatter.category as any,
      templateContent: JSON.stringify({ content: frontmatter.description || '', variables: variableNames }),
      isActive: "yes" as const,
      variables: JSON.stringify(variables),
      clauseBanks: JSON.stringify({}),
      templateMarkdown: body,
      templateSlug: slug,
      updatedAt: new Date(),
    };

    const existing = await db
      .select()
      .from(contractTemplates)
      .where(eq(contractTemplates.templateSlug, slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(contractTemplates)
        .set(templateData)
        .where(eq(contractTemplates.id, existing[0].id));
      console.log(`  ✓ Updated template: ${frontmatter.title} (${slug})`);
    } else {
      await db.insert(contractTemplates).values({
        id: `tmpl_${nanoid(16)}`,
        ...templateData,
        createdAt: new Date(),
      });
      console.log(`  + Created template: ${frontmatter.title} (${slug})`);
    }
  }

  console.log(`  [seed] Templates directory seeding complete.`);
}

export async function seedAllTemplates(db: ReturnType<typeof drizzle>) {
  console.log("[seed] Seeding all contract templates...\n");
  // Seed existing legal templates
  await seedTemplates(db);
  // Seed new YAML-based templates
  await seedFromTemplatesDir(db);
  console.log("[seed] All templates seeded!");
}

// CLI entrypoint: npx tsx server/seed-templates.ts
const isCLI = process.argv[1] && (
  process.argv[1].endsWith('seed-templates.ts') ||
  process.argv[1].endsWith('seed-templates.js')
);

if (isCLI) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }
  seedAllTemplates(drizzle(dbUrl))
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Seed failed:", err);
      process.exit(1);
    });
}
