import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import { getDb } from '../db';
import { aiGenerations, contractTemplates } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// OpenAI API configuration - will be set via environment variable
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Contract generation system prompt
const SYSTEM_PROMPT = `You are a legal contract drafting assistant for AllSquared, a UK-based platform for secure service contracts. Your role is to generate clear, professional contract clauses based on user requirements.

IMPORTANT LEGAL DISCLAIMER: You generate contract templates for unreserved legal activities only. These contracts are starting points and users should seek independent legal advice for complex matters.

When generating contracts:
1. Use plain English that is easy to understand
2. Include all essential terms for the service type
3. Incorporate milestone-based payment structures
4. Include dispute resolution clauses referencing AllSquared's mediation service
5. Follow UK contract law principles
6. Be specific about deliverables, timelines, and payment terms
7. Include appropriate limitation of liability clauses
8. Reference escrow payment protection where relevant

DO NOT:
- Provide legal advice
- Generate contracts for reserved legal activities
- Include terms that would be unfair under the Consumer Rights Act 2015
- Make guarantees about legal enforceability`;

// Category-specific prompts
const CATEGORY_PROMPTS: Record<string, string> = {
  freelance: `This is a freelance services contract. Focus on:
- Scope of work and deliverables
- Project timeline and milestones
- Payment terms and rates
- Intellectual property assignment
- Confidentiality obligations
- Revision and feedback process`,

  home_improvement: `This is a home improvement/trades contract. Focus on:
- Detailed scope of works
- Materials specification and costs
- Project timeline with key milestones
- Building regulations compliance
- Access arrangements
- Warranty and defect liability period
- Clean-up and waste disposal`,

  event_services: `This is an event services contract. Focus on:
- Event date, time, and location
- Services to be provided
- Setup and pack-down requirements
- Cancellation and rescheduling terms
- Force majeure provisions
- Insurance requirements
- Deposit and payment schedule`,

  trade_services: `This is a trade services contract. Focus on:
- Service specifications
- Health and safety compliance
- Qualifications and certifications required
- Materials and equipment
- Site access and working hours
- Insurance and liability
- Completion criteria`,

  other: `This is a general service contract. Include standard terms covering:
- Service description
- Payment terms
- Timeline
- Liability
- Termination
- Dispute resolution`,
};

// Generate contract content using OpenAI
async function generateContractWithAI(
  category: string,
  requirements: string,
  templateContent?: string
): Promise<{ content: string; tokensUsed: number }> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Fallback to template-based generation if no API key
    return {
      content: generateFallbackContract(category, requirements),
      tokensUsed: 0,
    };
  }

  const categoryPrompt = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS.other;

  const userPrompt = `Generate a professional service contract with the following requirements:

Category: ${category}
${categoryPrompt}

User Requirements:
${requirements}

${templateContent ? `Base Template:\n${templateContent}` : ''}

Generate the contract in a structured format with clear sections. Include placeholder brackets [PLACEHOLDER] for information that needs to be filled in by the user.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate contract');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';
    const tokensUsed = data.usage?.total_tokens || 0;

    return { content, tokensUsed };
  } catch (error) {
    console.error('AI generation error:', error);
    // Fallback to template
    return {
      content: generateFallbackContract(category, requirements),
      tokensUsed: 0,
    };
  }
}

// Fallback contract generation without AI
function generateFallbackContract(category: string, requirements: string): string {
  const now = new Date().toISOString().split('T')[0];

  return `SERVICE AGREEMENT

This Agreement is entered into as of [DATE] between:

CLIENT: [CLIENT NAME]
Address: [CLIENT ADDRESS]
Email: [CLIENT EMAIL]

and

SERVICE PROVIDER: [PROVIDER NAME]
Address: [PROVIDER ADDRESS]
Email: [PROVIDER EMAIL]

1. SCOPE OF SERVICES

The Service Provider agrees to provide the following services:

${requirements}

2. PROJECT TIMELINE

Start Date: [START DATE]
Estimated Completion: [END DATE]

Milestones:
- Milestone 1: [DESCRIPTION] - Due: [DATE] - Payment: £[AMOUNT]
- Milestone 2: [DESCRIPTION] - Due: [DATE] - Payment: £[AMOUNT]
- Milestone 3: [DESCRIPTION] - Due: [DATE] - Payment: £[AMOUNT]

3. PAYMENT TERMS

Total Contract Value: £[TOTAL AMOUNT]
Payment Method: Escrow via AllSquared Platform

Payments will be held in escrow and released upon milestone approval by the Client.

4. DELIVERABLES

The Service Provider shall deliver:
[LIST DELIVERABLES]

5. REVISIONS AND CHANGES

[NUMBER] rounds of revisions are included. Additional revisions will be charged at £[RATE] per hour.

6. INTELLECTUAL PROPERTY

Upon full payment, all intellectual property created under this agreement shall transfer to the Client.

7. CONFIDENTIALITY

Both parties agree to maintain confidentiality of any proprietary information shared during this engagement.

8. LIABILITY

The Service Provider's liability is limited to the total contract value. Neither party shall be liable for indirect, consequential, or incidental damages.

9. TERMINATION

Either party may terminate this agreement with [NUMBER] days' written notice. Upon termination, the Client shall pay for work completed to date.

10. DISPUTE RESOLUTION

Any disputes shall first be submitted to AllSquared's AI-assisted mediation service. If unresolved, disputes may be escalated to a qualified mediator or the courts of England and Wales.

11. GOVERNING LAW

This agreement is governed by the laws of England and Wales.

SIGNATURES

Client Signature: ___________________ Date: ___________

Provider Signature: ___________________ Date: ___________

---
Generated via AllSquared - Secure Service Contracts
Contract Reference: [CONTRACT_ID]
Generated: ${now}`;
}

export const aiRouter = router({
  // Generate contract content
  generateContract: protectedProcedure
    .input(
      z.object({
        category: z.enum(['freelance', 'home_improvement', 'event_services', 'trade_services', 'other']),
        requirements: z.string().min(10, 'Please provide more details about your requirements'),
        templateId: z.string().optional(),
        clientName: z.string().optional(),
        providerName: z.string().optional(),
        totalAmount: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const generationId = `aigen_${nanoid(16)}`;

      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Get template if specified
      let templateContent: string | undefined;
      if (input.templateId) {
        const template = await db
          .select()
          .from(contractTemplates)
          .where(eq(contractTemplates.id, input.templateId))
          .limit(1);

        if (template[0]) {
          templateContent = template[0].templateContent;
        }
      }

      // Build requirements string
      let fullRequirements = input.requirements;
      if (input.clientName) {
        fullRequirements += `\nClient: ${input.clientName}`;
      }
      if (input.providerName) {
        fullRequirements += `\nService Provider: ${input.providerName}`;
      }
      if (input.totalAmount) {
        fullRequirements += `\nTotal Amount: £${input.totalAmount.toFixed(2)}`;
      }

      // Generate contract
      const { content, tokensUsed } = await generateContractWithAI(
        input.category,
        fullRequirements,
        templateContent
      );

      // Store generation record
      await db.insert(aiGenerations).values({
        id: generationId,
        userId: ctx.user.id,
        templateId: input.templateId,
        prompt: fullRequirements,
        generatedContent: content,
        model: tokensUsed > 0 ? 'gpt-4-turbo-preview' : 'template',
        tokensUsed: String(tokensUsed),
        status: 'completed',
        createdAt: new Date(),
      });

      return {
        generationId,
        content,
        tokensUsed,
      };
    }),

  // Revise generated contract
  reviseContract: protectedProcedure
    .input(
      z.object({
        generationId: z.string(),
        revisionInstructions: z.string().min(10, 'Please provide specific revision instructions'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Get original generation
      const original = await db
        .select()
        .from(aiGenerations)
        .where(eq(aiGenerations.id, input.generationId))
        .limit(1);

      if (!original[0] || original[0].userId !== ctx.user.id) {
        throw new Error('Generation not found');
      }

      const newGenerationId = `aigen_${nanoid(16)}`;
      const revisionCount = parseInt(original[0].revisionCount || '0', 10) + 1;

      // Build revision prompt
      const revisionPrompt = `Original contract:\n${original[0].generatedContent}\n\nRevision instructions:\n${input.revisionInstructions}`;

      const { content, tokensUsed } = await generateContractWithAI(
        'other', // Use generic for revisions
        revisionPrompt
      );

      // Store revision
      await db.insert(aiGenerations).values({
        id: newGenerationId,
        userId: ctx.user.id,
        contractId: original[0].contractId,
        templateId: original[0].templateId,
        prompt: revisionPrompt,
        generatedContent: content,
        model: tokensUsed > 0 ? 'gpt-4-turbo-preview' : 'template',
        tokensUsed: String(tokensUsed),
        status: 'revised',
        revisionCount: String(revisionCount),
        createdAt: new Date(),
      });

      // Update original as revised
      await db
        .update(aiGenerations)
        .set({ status: 'revised' })
        .where(eq(aiGenerations.id, input.generationId));

      return {
        generationId: newGenerationId,
        content,
        tokensUsed,
        revisionNumber: revisionCount,
      };
    }),

  // Get generation history
  getHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { page = 1, limit = 10 } = input || {};

      const generations = await db
        .select()
        .from(aiGenerations)
        .where(eq(aiGenerations.userId, ctx.user.id))
        .orderBy(aiGenerations.createdAt)
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        generations,
        page,
        limit,
      };
    }),

  // Submit feedback on generation
  submitFeedback: protectedProcedure
    .input(
      z.object({
        generationId: z.string(),
        feedback: z.enum(['positive', 'negative', 'neutral']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const generation = await db
        .select()
        .from(aiGenerations)
        .where(eq(aiGenerations.id, input.generationId))
        .limit(1);

      if (!generation[0] || generation[0].userId !== ctx.user.id) {
        throw new Error('Generation not found');
      }

      await db
        .update(aiGenerations)
        .set({ userFeedback: input.feedback })
        .where(eq(aiGenerations.id, input.generationId));

      return { success: true };
    }),

  // Suggest clauses for specific scenarios
  suggestClauses: protectedProcedure
    .input(
      z.object({
        scenario: z.string(),
        category: z.enum(['freelance', 'home_improvement', 'event_services', 'trade_services', 'other']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const apiKey = process.env.OPENAI_API_KEY;

      if (!apiKey) {
        // Return pre-defined clauses
        return {
          clauses: getDefaultClauses(input.scenario, input.category),
        };
      }

      const prompt = `Suggest 3-5 relevant contract clauses for the following scenario in a ${input.category} contract:

Scenario: ${input.scenario}

Provide clauses that are:
1. Clear and enforceable under English law
2. Fair to both parties
3. Appropriate for the service category

Format each clause with a title and the clause text.`;

      try {
        const response = await fetch(OPENAI_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4-turbo-preview',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              { role: 'user', content: prompt },
            ],
            temperature: 0.7,
            max_tokens: 1500,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate clauses');
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content || '';

        return {
          clauses: content,
        };
      } catch (error) {
        return {
          clauses: getDefaultClauses(input.scenario, input.category),
        };
      }
    }),
});

// Default clauses for common scenarios
function getDefaultClauses(scenario: string, category: string): string {
  const commonClauses = {
    late_payment: `LATE PAYMENT CLAUSE

If payment is not received within the agreed timeframe, the following shall apply:

1. A late payment fee of 8% above the Bank of England base rate shall accrue on the outstanding amount from the due date.

2. The Service Provider reserves the right to suspend work until payment is received.

3. The Client shall be responsible for all reasonable costs incurred in collecting overdue payments, including legal fees.

This clause is in accordance with the Late Payment of Commercial Debts (Interest) Act 1998.`,

    scope_change: `CHANGE ORDER CLAUSE

Any changes to the scope of work must be:

1. Submitted in writing by the Client
2. Reviewed and quoted by the Service Provider within 5 working days
3. Approved in writing by the Client before work commences

Changes may affect the project timeline and total cost. Additional work will be charged at the agreed hourly/daily rate or as quoted for the specific change.`,

    confidentiality: `CONFIDENTIALITY CLAUSE

1. Both parties agree to keep confidential all proprietary information, trade secrets, and business information disclosed during this engagement.

2. Confidential information shall not be disclosed to third parties without prior written consent.

3. This obligation survives the termination of this agreement for a period of 2 years.

4. Exceptions: Information that is publicly available, independently developed, or required by law.`,

    termination: `TERMINATION CLAUSE

1. Either party may terminate this agreement with 14 days' written notice.

2. Upon termination:
   - The Client shall pay for all work completed to date
   - The Service Provider shall deliver all completed work
   - Any materials or equipment shall be returned

3. Immediate termination is permitted if either party commits a material breach that remains uncured for 7 days after written notice.`,

    force_majeure: `FORCE MAJEURE CLAUSE

Neither party shall be liable for delays or failures in performance resulting from circumstances beyond their reasonable control, including but not limited to:

- Natural disasters
- War or civil unrest
- Government actions or regulations
- Pandemic or epidemic
- Utility failures

The affected party must notify the other party promptly and use reasonable efforts to mitigate the impact. If the force majeure event continues for more than 30 days, either party may terminate this agreement.`,
  };

  const scenarioLower = scenario.toLowerCase();

  if (scenarioLower.includes('late') || scenarioLower.includes('payment')) {
    return commonClauses.late_payment;
  }
  if (scenarioLower.includes('change') || scenarioLower.includes('scope')) {
    return commonClauses.scope_change;
  }
  if (scenarioLower.includes('confidential') || scenarioLower.includes('secret')) {
    return commonClauses.confidentiality;
  }
  if (scenarioLower.includes('terminate') || scenarioLower.includes('cancel')) {
    return commonClauses.termination;
  }
  if (scenarioLower.includes('force') || scenarioLower.includes('disaster') || scenarioLower.includes('unforeseen')) {
    return commonClauses.force_majeure;
  }

  // Return all common clauses if scenario doesn't match
  return Object.values(commonClauses).join('\n\n---\n\n');
}
