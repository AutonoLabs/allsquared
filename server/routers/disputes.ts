import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import { getDb, createNotification } from '../db';
import {
  disputes,
  disputeAnalyses,
  mediationResponses,
  settlementOptions,
  contracts,
  milestones,
  users,
  litlReferrals,
  escrowTransactions,
  auditLogs,
} from '../../drizzle/schema';
import { eq, or, desc, and, sql, count } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// LexAI RAG — legal research engine (Tailscale → Studio, fallback localhost)
const LEXAI_API_URL = process.env.LEXAI_API_URL || 'http://100.65.116.80:8400';

// LexAI /review — contract clause assessment
async function reviewWithLexAI(contractText: string, reviewType: string = 'general'): Promise<{ issues: { category: string; description: string; severity: string }[] }> {
  try {
    const response = await fetch(`${LEXAI_API_URL}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: contractText, review_type: reviewType }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return { issues: [] };
    const data = await response.json() as { issues?: { category: string; description: string; severity: string }[] };
    console.log(`[LexAI /review] Found ${data.issues?.length || 0} issues`);
    return { issues: data.issues || [] };
  } catch (err) {
    console.warn('[LexAI /review] Unavailable:', (err as Error).message);
    return { issues: [] };
  }
}

// LexAI /draft — settlement proposal generation
async function draftWithLexAI(prompt: string, style: string = 'formal'): Promise<string> {
  try {
    const response = await fetch(`${LEXAI_API_URL}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, style }),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) return '';
    const data = await response.json() as { draft?: string };
    return data.draft || '';
  } catch (err) {
    console.warn('[LexAI /draft] Unavailable:', (err as Error).message);
    return '';
  }
}

async function queryLexAI(query: string, practiceArea?: string): Promise<{ answer: string; sources: { citation: string; text: string }[] }> {
  try {
    const body: Record<string, unknown> = { query, top_k: 5 };
    if (practiceArea) body.practice_area = practiceArea;

    const response = await fetch(`${LEXAI_API_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      console.warn('[LexAI] Query failed:', response.status);
      return { answer: '', sources: [] };
    }

    const data = await response.json() as { answer?: string; sources?: { citation: string; text: string }[] };
    console.log(`[LexAI] Returned ${data.sources?.length || 0} sources for: "${query.substring(0, 50)}..."`);
    return { answer: data.answer || '', sources: data.sources || [] };
  } catch (err) {
    console.warn('[LexAI] Unavailable:', (err as Error).message);
    return { answer: '', sources: [] };
  }
}

const DISPUTE_ANALYSIS_PROMPT = `You are an expert dispute analyst for AllSquared, a UK-based freelance contracts platform. You analyze disputes between clients and service providers.

Given a contract and a dispute reason, produce a structured analysis. Be fair, balanced, and reference specific contract terms. Follow UK contract law principles.

Respond ONLY with valid JSON in this exact format:
{
  "contractSummary": "Brief summary of the contract terms relevant to the dispute",
  "claimantPosition": "Summary of the claimant's case and its merits",
  "respondentPosition": "Likely position and defence of the respondent",
  "strengthAssessment": {"claimant": "strong/moderate/weak with reasoning", "respondent": "strong/moderate/weak with reasoning"},
  "relevantClauses": ["List of specific contract clauses relevant to the dispute"],
  "recommendedAction": "mediation or escalation or settlement",
  "confidence": "high or medium or low"
}`;

const MEDIATION_SUGGESTION_PROMPT = `You are a mediation assistant for AllSquared, a UK-based freelance contracts platform. Given the dispute context and the latest message from one party, suggest a constructive response for the other party that moves toward resolution.

Be concise, professional, and solution-oriented. Focus on finding common ground. Respond with just the suggested message text, no JSON wrapper.`;

// Call OpenAI for dispute analysis
async function analyzeDisputeWithAI(
  contractText: string,
  disputeReason: string,
  evidence: string | null,
  claimantName: string,
  respondentName: string,
): Promise<{
  contractSummary: string;
  claimantPosition: string;
  respondentPosition: string;
  strengthAssessment: string;
  relevantClauses: string;
  recommendedAction: string;
  confidence: 'high' | 'medium' | 'low';
  aiModel: string;
}> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return {
      contractSummary: 'AI analysis unavailable — no API key configured.',
      claimantPosition: disputeReason,
      respondentPosition: 'Awaiting respondent input.',
      strengthAssessment: JSON.stringify({ claimant: 'unknown', respondent: 'unknown' }),
      relevantClauses: JSON.stringify([]),
      recommendedAction: 'mediation',
      confidence: 'low',
      aiModel: 'fallback',
    };
  }

  // Query LexAI for relevant UK case law and contract review
  const [lexResult, contractReview] = await Promise.all([
    queryLexAI(`${disputeReason} UK contract law remedies breach`, 'contract'),
    reviewWithLexAI(contractText, 'risk'),
  ]);

  const caseLawSection = lexResult.sources.length > 0
    ? `\n\nRELEVANT UK CASE LAW (from LexAI):\n${lexResult.sources.map((s, i) => `${i + 1}. ${s.citation}: ${s.text.substring(0, 300)}`).join('\n')}\n\n${lexResult.answer ? `LEGAL ANALYSIS:\n${lexResult.answer}` : ''}`
    : '';

  const contractIssuesSection = contractReview.issues.length > 0
    ? `\n\nCONTRACT REVIEW ISSUES (from LexAI):\n${contractReview.issues.map((iss, i) => `${i + 1}. [${iss.severity.toUpperCase()}] ${iss.category}: ${iss.description}`).join('\n')}`
    : '';

  const legalContext = (caseLawSection || contractIssuesSection)
    ? `${caseLawSection}${contractIssuesSection}`
    : '\n\n[Note: LexAI legal research unavailable — analyse based on general UK contract law principles.]';

  const userPrompt = `Analyse this dispute:

CONTRACT TEXT:
${contractText}

CLAIMANT (${claimantName}) REASON FOR DISPUTE:
${disputeReason}

${evidence ? `EVIDENCE PROVIDED:\n${evidence}` : 'No evidence submitted.'}

RESPONDENT: ${respondentName}
${legalContext}`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: DISPUTE_ANALYSIS_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2000,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    const model = data.model || 'gpt-4-turbo-preview';

    return {
      contractSummary: parsed.contractSummary || '',
      claimantPosition: parsed.claimantPosition || '',
      respondentPosition: parsed.respondentPosition || '',
      strengthAssessment: JSON.stringify(parsed.strengthAssessment || {}),
      relevantClauses: JSON.stringify(parsed.relevantClauses || []),
      recommendedAction: parsed.recommendedAction || 'mediation',
      confidence: (['high', 'medium', 'low'].includes(parsed.confidence) ? parsed.confidence : 'medium') as 'high' | 'medium' | 'low',
      aiModel: model,
    };
  } catch (error) {
    console.error('Dispute AI analysis failed:', error);
    return {
      contractSummary: 'AI analysis failed — please retry or escalate.',
      claimantPosition: disputeReason,
      respondentPosition: 'Awaiting respondent input.',
      strengthAssessment: JSON.stringify({ claimant: 'unknown', respondent: 'unknown' }),
      relevantClauses: JSON.stringify([]),
      recommendedAction: 'mediation',
      confidence: 'low',
      aiModel: 'fallback',
    };
  }
}

// Get AI mediation suggestion
async function getMediationSuggestion(
  contractSummary: string,
  disputeReason: string,
  mediationHistory: string,
  latestMessage: string,
  targetRole: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  // Query LexAI for relevant mediation guidance
  const lexMediationResult = await queryLexAI(
    `${disputeReason} mediation resolution UK contract dispute`,
    'contract'
  );

  const legalGuidance = lexMediationResult.sources.length > 0
    ? `\n\nRelevant legal context (LexAI):\n${lexMediationResult.sources.slice(0, 3).map(s => `- ${s.citation}: ${s.text.substring(0, 200)}`).join('\n')}`
    : '';

  const userPrompt = `Contract summary: ${contractSummary}

Dispute reason: ${disputeReason}

Mediation history:
${mediationHistory}

Latest message from the other party:
${latestMessage}
${legalGuidance}

Suggest a constructive response for the ${targetRole}:`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: MEDIATION_SUGGESTION_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.5,
        max_tokens: 500,
      }),
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch {
    return null;
  }
}

export const disputesRouter = router({
  // File a new dispute
  file: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        milestoneId: z.string().optional(),
        reason: z.string().min(10, 'Please provide a detailed reason for the dispute'),
        evidence: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      // Verify contract exists and user is a party
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.contractId))
        .limit(1);

      if (!contract) throw new Error('Contract not found');

      if (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id) {
        throw new Error('You are not a party to this contract');
      }

      // Verify milestone if provided
      if (input.milestoneId) {
        const [milestone] = await db
          .select()
          .from(milestones)
          .where(
            and(
              eq(milestones.id, input.milestoneId),
              eq(milestones.contractId, input.contractId)
            )
          )
          .limit(1);

        if (!milestone) throw new Error('Milestone not found for this contract');
      }

      // Create the dispute
      const disputeId = `dispute_${nanoid(16)}`;
      await db.insert(disputes).values({
        id: disputeId,
        contractId: input.contractId,
        milestoneId: input.milestoneId,
        raisedBy: ctx.user.id,
        reason: input.reason,
        evidence: input.evidence ? JSON.stringify(input.evidence) : null,
        status: 'open',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Update contract status to disputed
      await db
        .update(contracts)
        .set({ status: 'disputed', updatedAt: new Date() })
        .where(eq(contracts.id, input.contractId));

      // Determine claimant/respondent
      const respondentId = contract.clientId === ctx.user.id ? contract.providerId : contract.clientId;

      // Get names for AI context
      const [claimant] = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      const [respondent] = await db
        .select()
        .from(users)
        .where(eq(users.id, respondentId))
        .limit(1);

      // Trigger AI analysis
      const contractText = contract.contractContent || contract.generatedMarkdown || '';
      const analysis = await analyzeDisputeWithAI(
        contractText,
        input.reason,
        input.evidence ? JSON.stringify(input.evidence) : null,
        claimant?.name || 'Claimant',
        respondent?.name || 'Respondent',
      );

      const analysisId = `analysis_${nanoid(16)}`;
      await db.insert(disputeAnalyses).values({
        id: analysisId,
        disputeId,
        ...analysis,
        createdAt: new Date(),
      });

      // Update dispute to under_review now that analysis exists
      await db
        .update(disputes)
        .set({ status: 'under_review', updatedAt: new Date() })
        .where(eq(disputes.id, disputeId));

      // Audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'dispute.filed',
        entityType: 'dispute',
        entityId: disputeId,
        newValue: JSON.stringify({ contractId: input.contractId, reason: input.reason }),
        createdAt: new Date(),
      });

      // Notify the respondent
      await createNotification({
        id: `notif_${nanoid(16)}`,
        userId: respondentId,
        type: 'dispute',
        title: 'Dispute Filed Against You',
        message: `A dispute has been filed on contract "${contract.title}". Please review and respond.`,
        relatedId: disputeId,
        isRead: 'no',
        createdAt: new Date(),
      });

      // If AI recommends settlement, auto-generate an option
      if (analysis.recommendedAction === 'settlement') {
        const settlementId = `settlement_${nanoid(16)}`;
        await db.insert(settlementOptions).values({
          id: settlementId,
          disputeId,
          proposedBy: 'ai',
          description: `Based on AI analysis: ${analysis.contractSummary}. Recommended resolution via settlement.`,
          financialTerms: JSON.stringify({
            amount: contract.totalAmount,
            currency: contract.currency,
            splitPercentage: 50,
            escrowAction: 'split',
          }),
          status: 'proposed',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          createdAt: new Date(),
        });
      }

      return {
        disputeId,
        analysisId,
        analysis: {
          contractSummary: analysis.contractSummary,
          claimantPosition: analysis.claimantPosition,
          respondentPosition: analysis.respondentPosition,
          recommendedAction: analysis.recommendedAction,
          confidence: analysis.confidence,
        },
      };
    }),

  // Get a dispute with all related data
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.id))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      // Verify user is a party to the contract
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      // Get all related data in parallel
      const [analyses, mediation, settlements, raisedByUser, milestone] = await Promise.all([
        db
          .select()
          .from(disputeAnalyses)
          .where(eq(disputeAnalyses.disputeId, input.id))
          .orderBy(desc(disputeAnalyses.createdAt)),
        db
          .select()
          .from(mediationResponses)
          .where(eq(mediationResponses.disputeId, input.id))
          .orderBy(mediationResponses.round, mediationResponses.createdAt),
        db
          .select()
          .from(settlementOptions)
          .where(eq(settlementOptions.disputeId, input.id))
          .orderBy(desc(settlementOptions.createdAt)),
        db
          .select()
          .from(users)
          .where(eq(users.id, dispute.raisedBy))
          .limit(1),
        dispute.milestoneId
          ? db
              .select()
              .from(milestones)
              .where(eq(milestones.id, dispute.milestoneId))
              .limit(1)
          : Promise.resolve([]),
      ]);

      // Determine roles
      const claimantId = dispute.raisedBy;
      const respondentId = contract.clientId === claimantId ? contract.providerId : contract.clientId;

      return {
        dispute,
        contract: {
          id: contract.id,
          title: contract.title,
          totalAmount: contract.totalAmount,
          currency: contract.currency,
          status: contract.status,
        },
        claimantId,
        respondentId,
        raisedBy: raisedByUser[0] || null,
        milestone: milestone[0] || null,
        analyses,
        mediation,
        settlements,
      };
    }),

  // List disputes for the authenticated user
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['open', 'under_review', 'resolved', 'escalated', 'closed']).optional(),
        page: z.number().default(1),
        limit: z.number().default(20),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { status, page = 1, limit = 20 } = input || {};

      // Get contracts where user is a party
      const userContracts = await db
        .select({ id: contracts.id })
        .from(contracts)
        .where(
          or(
            eq(contracts.clientId, ctx.user.id),
            eq(contracts.providerId, ctx.user.id)
          )
        );

      const contractIds = userContracts.map((c) => c.id);
      if (contractIds.length === 0) {
        return { disputes: [], total: 0, page, totalPages: 0 };
      }

      // Build conditions
      const conditions = [
        or(
          eq(disputes.raisedBy, ctx.user.id),
          ...contractIds.map((cid) => eq(disputes.contractId, cid))
        ),
      ];
      if (status) {
        conditions.push(eq(disputes.status, status));
      }

      const whereClause = and(...conditions);

      const [countResult] = await db
        .select({ count: count() })
        .from(disputes)
        .where(whereClause);
      const total = countResult?.count || 0;

      const results = await db
        .select()
        .from(disputes)
        .where(whereClause)
        .orderBy(desc(disputes.createdAt))
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        disputes: results,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  // Trigger or re-trigger AI analysis
  analyze: protectedProcedure
    .input(z.object({ disputeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      // Verify access
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      const claimantId = dispute.raisedBy;
      const respondentId = contract.clientId === claimantId ? contract.providerId : contract.clientId;

      const [claimant] = await db.select().from(users).where(eq(users.id, claimantId)).limit(1);
      const [respondent] = await db.select().from(users).where(eq(users.id, respondentId)).limit(1);

      const contractText = contract.contractContent || contract.generatedMarkdown || '';
      const analysis = await analyzeDisputeWithAI(
        contractText,
        dispute.reason,
        dispute.evidence,
        claimant?.name || 'Claimant',
        respondent?.name || 'Respondent',
      );

      const analysisId = `analysis_${nanoid(16)}`;
      await db.insert(disputeAnalyses).values({
        id: analysisId,
        disputeId: input.disputeId,
        ...analysis,
        createdAt: new Date(),
      });

      return { analysisId, analysis };
    }),

  // Submit a mediation response
  mediate: protectedProcedure
    .input(
      z.object({
        disputeId: z.string(),
        message: z.string().min(1, 'Message cannot be empty'),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      if (dispute.status !== 'open' && dispute.status !== 'under_review') {
        throw new Error('Dispute is not open for mediation');
      }

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      // Determine role
      const isClaimant = dispute.raisedBy === ctx.user.id;
      const role: 'claimant' | 'respondent' = isClaimant ? 'claimant' : 'respondent';
      const otherPartyId = isClaimant
        ? (contract.clientId === ctx.user.id ? contract.providerId : contract.clientId)
        : dispute.raisedBy;

      // Get current round (max round + 1 if same role already responded this round)
      const existingResponses = await db
        .select()
        .from(mediationResponses)
        .where(eq(mediationResponses.disputeId, input.disputeId))
        .orderBy(desc(mediationResponses.round));

      const lastRound = existingResponses[0]?.round || 0;
      const lastByThisRole = existingResponses.find((r) => r.role === role);
      const round = lastByThisRole && lastByThisRole.round === lastRound ? lastRound + 1 : Math.max(lastRound, 1);

      // Get AI suggestion for the OTHER party's next response
      const targetRole = role === 'claimant' ? 'respondent' : 'claimant';
      const [latestAnalysis] = await db
        .select()
        .from(disputeAnalyses)
        .where(eq(disputeAnalyses.disputeId, input.disputeId))
        .orderBy(desc(disputeAnalyses.createdAt))
        .limit(1);

      const historyText = existingResponses
        .map((r) => `[Round ${r.round} - ${r.role}]: ${r.message}`)
        .join('\n');

      const aiSuggestion = await getMediationSuggestion(
        latestAnalysis?.contractSummary || '',
        dispute.reason,
        historyText,
        input.message,
        targetRole,
      );

      const responseId = `mediation_${nanoid(16)}`;
      await db.insert(mediationResponses).values({
        id: responseId,
        disputeId: input.disputeId,
        responderId: ctx.user.id,
        role,
        message: input.message,
        aiSuggestion,
        round,
        createdAt: new Date(),
      });

      // Notify the other party
      await createNotification({
        id: `notif_${nanoid(16)}`,
        userId: otherPartyId,
        type: 'dispute',
        title: 'New Mediation Response',
        message: `A new mediation message has been submitted for the dispute on "${contract.title}".`,
        relatedId: input.disputeId,
        isRead: 'no',
        createdAt: new Date(),
      });

      return {
        responseId,
        round,
        aiSuggestion,
      };
    }),

  // Propose a settlement
  proposeSettlement: protectedProcedure
    .input(
      z.object({
        disputeId: z.string(),
        description: z.string().min(10),
        financialTerms: z.object({
          amount: z.string(),
          currency: z.string().default('GBP'),
          splitPercentage: z.number().min(0).max(100).optional(),
          escrowAction: z.enum(['release', 'refund', 'split']).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      const isClaimant = dispute.raisedBy === ctx.user.id;
      const proposedBy: 'claimant' | 'respondent' = isClaimant ? 'claimant' : 'respondent';
      const otherPartyId = isClaimant
        ? (contract.clientId === ctx.user.id ? contract.providerId : contract.clientId)
        : dispute.raisedBy;

      const settlementId = `settlement_${nanoid(16)}`;
      await db.insert(settlementOptions).values({
        id: settlementId,
        disputeId: input.disputeId,
        proposedBy,
        description: input.description,
        financialTerms: input.financialTerms ? JSON.stringify(input.financialTerms) : null,
        status: 'proposed',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        createdAt: new Date(),
      });

      // Notify the other party
      await createNotification({
        id: `notif_${nanoid(16)}`,
        userId: otherPartyId,
        type: 'dispute',
        title: 'Settlement Proposed',
        message: `A settlement has been proposed for the dispute on "${contract.title}". Please review and respond.`,
        relatedId: input.disputeId,
        isRead: 'no',
        createdAt: new Date(),
      });

      return { settlementId };
    }),

  // Accept a settlement option
  acceptSettlement: protectedProcedure
    .input(z.object({ settlementId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [settlement] = await db
        .select()
        .from(settlementOptions)
        .where(eq(settlementOptions.id, input.settlementId))
        .limit(1);

      if (!settlement) throw new Error('Settlement option not found');

      if (settlement.status !== 'proposed') {
        throw new Error('This settlement is no longer available');
      }

      if (settlement.expiresAt && settlement.expiresAt < new Date()) {
        await db
          .update(settlementOptions)
          .set({ status: 'expired' })
          .where(eq(settlementOptions.id, input.settlementId));
        throw new Error('This settlement has expired');
      }

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, settlement.disputeId))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      // Determine which role is accepting
      const isClaimant = dispute.raisedBy === ctx.user.id;
      const updateField = isClaimant ? 'acceptedByClaimant' : 'acceptedByRespondent';

      await db
        .update(settlementOptions)
        .set({ [updateField]: true })
        .where(eq(settlementOptions.id, input.settlementId));

      // Re-fetch to check if both accepted
      const otherField = isClaimant ? settlement.acceptedByRespondent : settlement.acceptedByClaimant;
      const bothAccepted = otherField === true;

      if (bothAccepted) {
        // Resolve the dispute
        await db
          .update(settlementOptions)
          .set({ status: 'accepted' })
          .where(eq(settlementOptions.id, input.settlementId));

        await db
          .update(disputes)
          .set({
            status: 'resolved',
            resolution: `Settlement accepted: ${settlement.description}`,
            resolvedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(disputes.id, settlement.disputeId));

        // Handle escrow if financial terms exist
        if (settlement.financialTerms) {
          const terms = JSON.parse(settlement.financialTerms);
          if (terms.escrowAction) {
            const escrows = await db
              .select()
              .from(escrowTransactions)
              .where(
                and(
                  eq(escrowTransactions.contractId, dispute.contractId),
                  eq(escrowTransactions.status, 'held')
                )
              );

            for (const escrow of escrows) {
              const newStatus = terms.escrowAction === 'refund' ? 'refunded' : 'released';
              await db
                .update(escrowTransactions)
                .set({
                  status: newStatus,
                  ...(newStatus === 'released' ? { releasedAt: new Date() } : {}),
                  updatedAt: new Date(),
                })
                .where(eq(escrowTransactions.id, escrow.id));
            }
          }
        }

        // Audit log
        await db.insert(auditLogs).values({
          id: `audit_${nanoid(16)}`,
          userId: ctx.user.id,
          action: 'dispute.resolved_via_settlement',
          entityType: 'dispute',
          entityId: settlement.disputeId,
          newValue: JSON.stringify({ settlementId: input.settlementId }),
          createdAt: new Date(),
        });

        // Notify both parties
        const partyIds = [contract.clientId, contract.providerId].filter(Boolean);
        for (const userId of partyIds) {
          await createNotification({
            id: `notif_${nanoid(16)}`,
            userId,
            type: 'dispute',
            title: 'Dispute Resolved',
            message: `The dispute on "${contract.title}" has been resolved via settlement.`,
            relatedId: settlement.disputeId,
            isRead: 'no',
            createdAt: new Date(),
          });
        }
      } else {
        // Notify the other party that one side accepted
        const otherPartyId = isClaimant
          ? (contract.clientId === ctx.user.id ? contract.providerId : contract.clientId)
          : dispute.raisedBy;

        await createNotification({
          id: `notif_${nanoid(16)}`,
          userId: otherPartyId,
          type: 'dispute',
          title: 'Settlement Accepted by Other Party',
          message: `The other party has accepted the settlement for the dispute on "${contract.title}". Your acceptance is needed to finalise.`,
          relatedId: settlement.disputeId,
          isRead: 'no',
          createdAt: new Date(),
        });
      }

      return { bothAccepted };
    }),

  // Escalate to LITL (lawyer-in-the-loop)
  escalate: protectedProcedure
    .input(
      z.object({
        disputeId: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const [dispute] = await db
        .select()
        .from(disputes)
        .where(eq(disputes.id, input.disputeId))
        .limit(1);

      if (!dispute) throw new Error('Dispute not found');

      if (dispute.status === 'resolved' || dispute.status === 'closed') {
        throw new Error('Cannot escalate a resolved or closed dispute');
      }

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, dispute.contractId))
        .limit(1);

      if (
        !contract ||
        (contract.clientId !== ctx.user.id && contract.providerId !== ctx.user.id)
      ) {
        throw new Error('Unauthorized');
      }

      // Update dispute status
      await db
        .update(disputes)
        .set({ status: 'escalated', updatedAt: new Date() })
        .where(eq(disputes.id, input.disputeId));

      // Create LITL referral
      const referralId = `litl_${nanoid(16)}`;
      await db.insert(litlReferrals).values({
        id: referralId,
        userId: ctx.user.id,
        contractId: dispute.contractId,
        requestType: 'dispute_assistance',
        description: input.description || `Escalated dispute: ${dispute.reason}`,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: ctx.user.id,
        action: 'dispute.escalated',
        entityType: 'dispute',
        entityId: input.disputeId,
        newValue: JSON.stringify({ referralId }),
        createdAt: new Date(),
      });

      // Notify both parties
      const partyIds = [contract.clientId, contract.providerId].filter(Boolean);
      for (const userId of partyIds) {
        await createNotification({
          id: `notif_${nanoid(16)}`,
          userId,
          type: 'dispute',
          title: 'Dispute Escalated to Legal Review',
          message: `The dispute on "${contract.title}" has been escalated to a legal professional for review.`,
          relatedId: input.disputeId,
          isRead: 'no',
          createdAt: new Date(),
        });
      }

      return { referralId };
    }),
});
