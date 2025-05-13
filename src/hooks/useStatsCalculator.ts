
import { useMemo } from 'react';
import { Category, Item, Message, DashboardStats } from '@/types';

export const useStatsCalculator = (items: Item[], categories: Category[], messages: Message[]) => {
  const stats: DashboardStats = useMemo(() => ({
    totalLostItems: items.filter(item => item.status === 'lost').length,
    totalFoundItems: items.filter(item => item.status === 'found').length,
    totalClaimedItems: items.filter(item => item.status === 'claimed').length,
    totalPendingItems: items.filter(item => ['lost', 'found'].includes(item.status)).length,
    totalMessages: messages.length,
    activeCategories: categories.filter(cat => cat.is_active).length,
    inactiveCategories: categories.filter(cat => !cat.is_active).length,
  }), [items, categories, messages]);

  return stats;
};
