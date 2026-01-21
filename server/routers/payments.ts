import { z } from 'zod';
import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { getDb } from '../db';
import { payments, subscriptions, users, webhookEvents, auditLogs } from '../../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';

// Stripe API configuration
const STRIPE_API_URL = 'https://api.stripe.com/v1';

// Subscription tier pricing (in pence)
const TIER_PRICING = {
  free: 0,
  starter: 1500, // £15/month
  pro: 3500, // £35/month
  enterprise: 9900, // £99/month
} as const;

// Transaction fee rates
const TRANSACTION_FEES = {
  free: { rate: 0.025, min: 500, max: 10000 }, // 2.5%, min £5, max £100
  starter: { rate: 0.02, min: 500, max: 7500 }, // 2.0%, min £5, max £75
  pro: { rate: 0.015, min: 500, max: 5000 }, // 1.5%, min £5, max £50
  enterprise: { rate: 0.01, min: 500, max: 2500 }, // 1.0%, min £5, max £25
} as const;

// Helper to make Stripe API calls
async function stripeRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'DELETE' = 'POST',
  body?: Record<string, any>
) {
  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    throw new Error('Stripe is not configured');
  }

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  if (body && method !== 'GET') {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(body)) {
      if (value !== undefined && value !== null) {
        if (typeof value === 'object') {
          for (const [subKey, subValue] of Object.entries(value)) {
            params.append(`${key}[${subKey}]`, String(subValue));
          }
        } else {
          params.append(key, String(value));
        }
      }
    }
    options.body = params.toString();
  }

  const response = await fetch(`${STRIPE_API_URL}${endpoint}`, options);
  const data = await response.json();

  if (!response.ok) {
    console.error('Stripe API error:', data);
    throw new Error(data.error?.message || 'Stripe API error');
  }

  return data;
}

// Calculate platform fee based on user's subscription tier
function calculatePlatformFee(amount: number, tier: keyof typeof TRANSACTION_FEES): number {
  const fees = TRANSACTION_FEES[tier];
  const calculatedFee = Math.round(amount * fees.rate);
  return Math.max(fees.min, Math.min(fees.max, calculatedFee));
}

export const paymentsRouter = router({
  // Get user's subscription status
  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription[0]) {
      return {
        tier: 'free' as const,
        status: 'active' as const,
        isSubscribed: false,
      };
    }

    return {
      ...subscription[0],
      isSubscribed: subscription[0].tier !== 'free',
    };
  }),

  // Get available subscription tiers
  getTiers: publicProcedure.query(() => {
    return {
      tiers: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          transactionFee: '2.5% (min £5, max £100)',
          features: [
            'Basic contract templates',
            'Up to 5 contracts/month',
            'Email support',
            'Escrow protection',
          ],
        },
        {
          id: 'starter',
          name: 'Starter',
          price: 15,
          transactionFee: '2.0% (min £5, max £75)',
          features: [
            'All Free features',
            'Up to 20 contracts/month',
            'AI contract generation',
            'Priority email support',
            'Custom branding',
          ],
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 35,
          transactionFee: '1.5% (min £5, max £50)',
          features: [
            'All Starter features',
            'Unlimited contracts',
            'Advanced AI customization',
            'Phone support',
            'API access',
            'Team collaboration',
          ],
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          price: 99,
          transactionFee: '1.0% (min £5, max £25)',
          features: [
            'All Pro features',
            'Dedicated account manager',
            'Custom integrations',
            'SLA guarantee',
            'LITL discounts',
            'White-label option',
          ],
        },
      ],
    };
  }),

  // Create or update Stripe customer
  createCustomer: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const user = ctx.user;

    // Check if user already has a Stripe customer ID
    if (user.stripeCustomerId) {
      return { customerId: user.stripeCustomerId };
    }

    // Create Stripe customer
    const customer = await stripeRequest('/customers', 'POST', {
      email: user.email,
      name: user.name,
      metadata: {
        userId: user.id,
        platform: 'allsquared',
      },
    });

    // Update user with Stripe customer ID
    await db
      .update(users)
      .set({ stripeCustomerId: customer.id })
      .where(eq(users.id, user.id));

    return { customerId: customer.id };
  }),

  // Create Stripe Connect account for providers
  createConnectedAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const user = ctx.user;

    // Check if user already has a connected account
    if (user.stripeConnectedAccountId) {
      // Get account link for onboarding completion
      const accountLink = await stripeRequest('/account_links', 'POST', {
        account: user.stripeConnectedAccountId,
        refresh_url: `${process.env.APP_URL}/settings/payments?refresh=true`,
        return_url: `${process.env.APP_URL}/settings/payments?success=true`,
        type: 'account_onboarding',
      });

      return {
        accountId: user.stripeConnectedAccountId,
        onboardingUrl: accountLink.url,
      };
    }

    // Create Stripe Connect Express account
    const account = await stripeRequest('/accounts', 'POST', {
      type: 'express',
      country: 'GB',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        userId: user.id,
        platform: 'allsquared',
      },
    });

    // Update user with connected account ID
    await db
      .update(users)
      .set({ stripeConnectedAccountId: account.id })
      .where(eq(users.id, user.id));

    // Create account link for onboarding
    const accountLink = await stripeRequest('/account_links', 'POST', {
      account: account.id,
      refresh_url: `${process.env.APP_URL}/settings/payments?refresh=true`,
      return_url: `${process.env.APP_URL}/settings/payments?success=true`,
      type: 'account_onboarding',
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  }),

  // Create checkout session for subscription
  createSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        tier: z.enum(['starter', 'pro', 'enterprise']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const user = ctx.user;

      // Ensure user has Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeRequest('/customers', 'POST', {
          email: user.email,
          name: user.name,
          metadata: {
            userId: user.id,
            platform: 'allsquared',
          },
        });
        customerId = customer.id;

        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, user.id));
      }

      // Get or create price for the tier
      // In production, you'd have pre-created prices in Stripe
      const priceId = process.env[`STRIPE_PRICE_${input.tier.toUpperCase()}`];

      if (!priceId) {
        throw new Error('Subscription tier not configured');
      }

      // Create checkout session
      const session = await stripeRequest('/checkout/sessions', 'POST', {
        customer: customerId,
        mode: 'subscription',
        'line_items[0][price]': priceId,
        'line_items[0][quantity]': 1,
        success_url: `${process.env.APP_URL}/settings/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.APP_URL}/settings/billing?cancelled=true`,
        metadata: {
          userId: user.id,
          tier: input.tier,
        },
        subscription_data: {
          metadata: {
            userId: user.id,
            tier: input.tier,
          },
        },
      });

      return {
        sessionId: session.id,
        url: session.url,
      };
    }),

  // Create payment intent for escrow deposit
  createEscrowPayment: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        milestoneId: z.string().optional(),
        amount: z.number().positive(), // Amount in pence
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const user = ctx.user;

      // Get user's subscription tier for fee calculation
      const subscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, user.id))
        .limit(1);

      const tier = (subscription[0]?.tier || 'free') as keyof typeof TRANSACTION_FEES;
      const platformFee = calculatePlatformFee(input.amount, tier);
      const totalAmount = input.amount + platformFee;

      // Ensure user has Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripeRequest('/customers', 'POST', {
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        customerId = customer.id;

        await db
          .update(users)
          .set({ stripeCustomerId: customerId })
          .where(eq(users.id, user.id));
      }

      // Create payment intent
      const paymentIntent = await stripeRequest('/payment_intents', 'POST', {
        amount: totalAmount,
        currency: 'gbp',
        customer: customerId,
        capture_method: 'manual', // Authorize only, capture later
        metadata: {
          contractId: input.contractId,
          milestoneId: input.milestoneId || '',
          userId: user.id,
          escrowAmount: input.amount,
          platformFee: platformFee,
          type: 'escrow_deposit',
        },
      });

      // Create payment record
      const paymentId = `pay_${nanoid(16)}`;
      await db.insert(payments).values({
        id: paymentId,
        userId: user.id,
        contractId: input.contractId,
        milestoneId: input.milestoneId,
        type: 'escrow_deposit',
        amount: String(input.amount),
        currency: 'GBP',
        status: 'pending',
        stripePaymentIntentId: paymentIntent.id,
        description: `Escrow deposit for contract ${input.contractId}`,
        metadata: JSON.stringify({
          platformFee,
          totalCharged: totalAmount,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Create audit log
      await db.insert(auditLogs).values({
        id: `audit_${nanoid(16)}`,
        userId: user.id,
        action: 'escrow_payment_initiated',
        entityType: 'payment',
        entityId: paymentId,
        newValue: JSON.stringify({
          amount: input.amount,
          platformFee,
          contractId: input.contractId,
        }),
        createdAt: new Date(),
      });

      return {
        paymentId,
        clientSecret: paymentIntent.client_secret,
        amount: input.amount,
        platformFee,
        totalAmount,
      };
    }),

  // Get payment history
  getPaymentHistory: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
        type: z.enum(['subscription', 'escrow_deposit', 'escrow_release', 'escrow_refund', 'platform_fee', 'litl_fee']).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const { page = 1, limit = 20, type } = input || {};

      // Build where condition based on whether type filter is provided
      const whereCondition = type
        ? and(eq(payments.userId, ctx.user.id), eq(payments.type, type))
        : eq(payments.userId, ctx.user.id);

      const paymentsList = await db
        .select()
        .from(payments)
        .where(whereCondition)
        .orderBy(payments.createdAt)
        .limit(limit)
        .offset((page - 1) * limit);

      return {
        payments: paymentsList,
        page,
        limit,
      };
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription[0] || !subscription[0].stripeSubscriptionId) {
      throw new Error('No active subscription found');
    }

    // Cancel at period end (not immediately)
    await stripeRequest(
      `/subscriptions/${subscription[0].stripeSubscriptionId}`,
      'POST',
      { cancel_at_period_end: true }
    );

    // Update local record
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: 'yes',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription[0].id));

    // Audit log
    await db.insert(auditLogs).values({
      id: `audit_${nanoid(16)}`,
      userId: ctx.user.id,
      action: 'subscription_cancelled',
      entityType: 'subscription',
      entityId: subscription[0].id,
      newValue: JSON.stringify({ cancelAtPeriodEnd: true }),
      createdAt: new Date(),
    });

    return { success: true };
  }),

  // Reactivate subscription
  reactivateSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error('Database not available');

    const subscription = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription[0] || !subscription[0].stripeSubscriptionId) {
      throw new Error('No subscription found');
    }

    // Reactivate subscription
    await stripeRequest(
      `/subscriptions/${subscription[0].stripeSubscriptionId}`,
      'POST',
      { cancel_at_period_end: false }
    );

    // Update local record
    await db
      .update(subscriptions)
      .set({
        cancelAtPeriodEnd: 'no',
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription[0].id));

    return { success: true };
  }),

  // Get Stripe Connect account status
  getConnectStatus: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.stripeConnectedAccountId) {
      return {
        hasAccount: false,
        isOnboarded: false,
        payoutsEnabled: false,
        chargesEnabled: false,
      };
    }

    try {
      const account = await stripeRequest(
        `/accounts/${user.stripeConnectedAccountId}`,
        'GET'
      );

      return {
        hasAccount: true,
        isOnboarded: account.details_submitted,
        payoutsEnabled: account.payouts_enabled,
        chargesEnabled: account.charges_enabled,
        accountId: account.id,
      };
    } catch (error) {
      return {
        hasAccount: true,
        isOnboarded: false,
        payoutsEnabled: false,
        chargesEnabled: false,
        error: 'Failed to fetch account status',
      };
    }
  }),

  // Handle Stripe webhook (called from webhook endpoint)
  handleWebhook: publicProcedure
    .input(
      z.object({
        eventType: z.string(),
        eventId: z.string(),
        data: z.any(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');

      const webhookId = `webhook_${nanoid(16)}`;

      // Store webhook event
      await db.insert(webhookEvents).values({
        id: webhookId,
        provider: 'stripe',
        eventType: input.eventType,
        eventId: input.eventId,
        payload: JSON.stringify(input.data),
        status: 'processing',
        createdAt: new Date(),
      });

      try {
        // Process based on event type
        switch (input.eventType) {
          case 'checkout.session.completed': {
            const session = input.data.object;
            if (session.mode === 'subscription') {
              // Handle subscription creation
              const subscriptionId = `sub_${nanoid(16)}`;
              await db.insert(subscriptions).values({
                id: subscriptionId,
                userId: session.metadata.userId,
                tier: session.metadata.tier,
                status: 'active',
                stripeSubscriptionId: session.subscription,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
            break;
          }

          case 'customer.subscription.updated': {
            const subscription = input.data.object;
            await db
              .update(subscriptions)
              .set({
                status: subscription.status === 'active' ? 'active' : 'past_due',
                currentPeriodStart: new Date(subscription.current_period_start * 1000),
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end ? 'yes' : 'no',
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
            break;
          }

          case 'customer.subscription.deleted': {
            const subscription = input.data.object;
            await db
              .update(subscriptions)
              .set({
                status: 'cancelled',
                tier: 'free',
                updatedAt: new Date(),
              })
              .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
            break;
          }

          case 'payment_intent.succeeded': {
            const paymentIntent = input.data.object;
            await db
              .update(payments)
              .set({
                status: 'succeeded',
                stripeChargeId: paymentIntent.latest_charge,
                processedAt: new Date(),
                updatedAt: new Date(),
              })
              .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
            break;
          }

          case 'payment_intent.payment_failed': {
            const paymentIntent = input.data.object;
            await db
              .update(payments)
              .set({
                status: 'failed',
                failureReason: paymentIntent.last_payment_error?.message,
                updatedAt: new Date(),
              })
              .where(eq(payments.stripePaymentIntentId, paymentIntent.id));
            break;
          }
        }

        // Mark webhook as processed
        await db
          .update(webhookEvents)
          .set({
            status: 'processed',
            processedAt: new Date(),
          })
          .where(eq(webhookEvents.id, webhookId));

        return { success: true };
      } catch (error) {
        // Mark webhook as failed
        await db
          .update(webhookEvents)
          .set({
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          })
          .where(eq(webhookEvents.id, webhookId));

        throw error;
      }
    }),
});
