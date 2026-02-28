import { z } from 'zod';
import { router, protectedProcedure } from '../_core/trpc';
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../db';

export const notificationsRouter = router({
  // List user's notifications
  list: protectedProcedure
    .input(
      z
        .object({
          limit: z.number().default(50),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit || 50;
      const notifications = await getUserNotifications(ctx.user.id, limit);
      
      const unreadCount = notifications.filter((n) => n.isRead === 'no').length;
      
      return {
        notifications,
        unreadCount,
      };
    }),

  // Mark notification as read
  markAsRead: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await markNotificationAsRead(input.id);
      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await markAllNotificationsAsRead(ctx.user.id);
    return { success: true };
  }),

  // Get unread count
  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const notifications = await getUserNotifications(ctx.user.id, 100);
    const count = notifications.filter((n) => n.isRead === 'no').length;
    return { count };
  }),
});

