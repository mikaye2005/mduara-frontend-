/**
 * Single import surface for frontend prototype fixtures.
 *
 * Keep mock entities domain-separated in mockData.ts / goalMarketplace.ts,
 * but consume them through this module so screens do not build competing
 * copies of the same user, Chama, goal, merchant or membership data.
 */
export {
  authInitialValues,
  mockNotifications,
  publicChamas,
  verifiedUsers,
  type ChamaMembership,
  type ChamaOfficialRole,
  type MembershipStatus,
  type NotificationItem,
  type PublicChama,
  type PublicChamaEntryMode,
  type PublicChamaOfficial,
  type PublicChamaRecruitmentStatus,
  type PublicChamaRule,
  type UserRole,
  type VerifiedTokenPayload,
} from './mockData';

export {
  goalCategories,
  goalsForCategory,
  savingGoals,
  type GoalCategory,
  type GoalCategoryCode,
  type GoalMerchant,
  type MerchantRewardStatus,
  type SavingGoal,
} from './goalMarketplace';

import { publicChamas, verifiedUsers } from './mockData';
import { savingGoals } from './goalMarketplace';

export const prototypeSelectors = {
  chamaById: (chamaId: number) => publicChamas.find((item) => item.id === chamaId) ?? null,
  goalById: (goalId: string) => savingGoals.find((item) => item.id === goalId) ?? null,
  userByPhone: (phone: string) => verifiedUsers[phone.trim()] ?? null,
} as const;
