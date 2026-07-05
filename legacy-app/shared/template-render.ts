/**
 * Unified template variable substitution.
 * Supports both legal/ bracket syntax [VARIABLE] and YAML {{variable}} syntax.
 */
export function renderTemplate(
  markdown: string,
  variables: Record<string, string>
): string {
  let result = markdown;
  for (const [key, value] of Object.entries(variables)) {
    const safe = value ?? "";
    result = result.replace(new RegExp(`\\[${escapeRegex(key)}\\]`, "g"), safe || `[${key}]`);
    result = result.replace(
      new RegExp(`\\{\\{\\s*${escapeRegex(key)}\\s*\\}\\}`, "g"),
      safe || `{{${key}}}`
    );
  }
  return result;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Map builder party/module answers to common UK legal template variable names. */
export function buildTemplateVariablesFromBuilder(input: {
  partyA: { name: string; address: string };
  partyB: { name: string; address: string };
  modules: Array<{
    id: string;
    answers: Record<string, string>;
  }>;
}): Record<string, string> {
  const vars: Record<string, string> = {
    CLIENT_NAME: input.partyB.name,
    CLIENT_ADDRESS: input.partyB.address,
    SUPPLIER_NAME: input.partyA.name,
    SUPPLIER_ADDRESS: input.partyA.address,
    DEVELOPER_NAME: input.partyA.name,
    DEVELOPER_ADDRESS: input.partyA.address,
    CONTRACTOR_NAME: input.partyA.name,
    CONTRACTOR_ADDRESS: input.partyA.address,
  };

  for (const mod of input.modules) {
    if (mod.id === "payment") {
      if (mod.answers.pay_total) vars.CONTRACT_VALUE = mod.answers.pay_total;
      if (mod.answers.pay_currency) vars.CURRENCY = mod.answers.pay_currency;
      if (mod.answers.pay_schedule) vars.PAYMENT_TERMS = mod.answers.pay_schedule;
    }
    if (mod.id === "timeline") {
      if (mod.answers.time_start) vars.START_DATE = mod.answers.time_start;
      if (mod.answers.time_end) vars.END_DATE = mod.answers.time_end;
    }
    if (mod.id === "scope" && mod.answers.scope_desc) {
      vars.SERVICE_DESCRIPTION = mod.answers.scope_desc;
      vars.PROJECT_NAME = mod.answers.scope_desc.slice(0, 80);
    }
  }

  return vars;
}
