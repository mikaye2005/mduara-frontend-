export type GoalCategoryCode = 'HOME_APPLIANCES' | 'TRAVEL' | 'EDUCATION' | 'PERSONAL';

export type MerchantRewardStatus = 'locked' | 'eligible' | 'redeemed';

export interface GoalMerchant {
  id: string;
  name: string;
  offer: string;
  rewardStatus: MerchantRewardStatus;
  eligibilityNote: string;
  isPrototype: true;
}

export interface SavingGoal {
  id: string;
  categoryCode: GoalCategoryCode;
  title: string;
  icon: string;
  memberCount: number;
  totalTargetValue: number;
  partnerMerchants: GoalMerchant[];
  contributionFrom: number;
  typicalTimeline: string;
  availableMbogis: number;
  description: string;
}

export interface GoalCategory {
  code: GoalCategoryCode;
  label: string;
  description: string;
}

export const goalCategories: GoalCategory[] = [
  { code: 'HOME_APPLIANCES', label: 'Home Appliances', description: 'Save with people targeting practical household upgrades.' },
  { code: 'TRAVEL', label: 'Travel', description: 'Build a travel fund around a shared destination and timeline.' },
  { code: 'EDUCATION', label: 'Education', description: 'Plan fees and professional learning with a clear savings target.' },
  { code: 'PERSONAL', label: 'Personal', description: 'Save for high-value personal purchases without losing visibility.' },
];

const prototypeMerchant = (id: string, name: string, offer: string): GoalMerchant => ({
  id,
  name,
  offer,
  rewardStatus: 'locked',
  eligibilityNote: 'Reward unlocks only after eligibility is confirmed by the production service.',
  isPrototype: true,
});

const merchants = {
  appliance: [
    prototypeMerchant('merchant-homehub', 'HomeHub Kenya', 'Member price unlocked at goal completion'),
    prototypeMerchant('merchant-appliance-point', 'Appliance Point', 'Delivery reward for eligible Mbogis'),
    prototypeMerchant('merchant-mbogi-mart', 'Mbogi Mart', 'Goal-completion voucher for eligible members'),
  ],
  travel: [
    prototypeMerchant('merchant-safari-link', 'SafariLink Partners', 'Group booking reward on eligible plans'),
    prototypeMerchant('merchant-coast-stays', 'Coast Stays', 'Accommodation reward for qualifying groups'),
  ],
  education: [
    prototypeMerchant('merchant-study-hub', 'StudyHub Partners', 'Learning-material reward on eligible goals'),
  ],
  personal: [
    prototypeMerchant('merchant-tech-point', 'TechPoint Partners', 'Eligible member purchase reward'),
    prototypeMerchant('merchant-home-style', 'HomeStyle Partners', 'Furniture goal reward for qualifying members'),
  ],
};

export const savingGoals: SavingGoal[] = [
  {
    id: 'washing-machine', categoryCode: 'HOME_APPLIANCES', title: 'Washing Machine', icon: '🧺',
    memberCount: 87, totalTargetValue: 3_800_000, partnerMerchants: merchants.appliance,
    contributionFrom: 2500, typicalTimeline: '6–12 months', availableMbogis: 6,
    description: 'Join members saving toward reliable washing machines with comparable timelines and contribution capacity.',
  },
  { id: 'fridge', categoryCode: 'HOME_APPLIANCES', title: 'Fridge', icon: '🧊', memberCount: 64, totalTargetValue: 3_150_000, partnerMerchants: merchants.appliance.slice(0, 2), contributionFrom: 2500, typicalTimeline: '6–10 months', availableMbogis: 4, description: 'Save toward a fridge with groups organised around realistic purchase targets.' },
  { id: 'tv', categoryCode: 'HOME_APPLIANCES', title: 'TV', icon: '📺', memberCount: 49, totalTargetValue: 1_980_000, partnerMerchants: merchants.appliance.slice(1), contributionFrom: 2000, typicalTimeline: '4–8 months', availableMbogis: 4, description: 'Goal-based saving for televisions across different target ranges.' },
  { id: 'cooker', categoryCode: 'HOME_APPLIANCES', title: 'Cooker', icon: '🍳', memberCount: 38, totalTargetValue: 1_440_000, partnerMerchants: merchants.appliance.slice(0, 2), contributionFrom: 1500, typicalTimeline: '4–8 months', availableMbogis: 3, description: 'Build a cooker purchase fund with members on similar contribution plans.' },

  { id: 'diani', categoryCode: 'TRAVEL', title: 'Diani', icon: '🏖️', memberCount: 73, totalTargetValue: 4_200_000, partnerMerchants: merchants.travel, contributionFrom: 3000, typicalTimeline: '6–10 months', availableMbogis: 5, description: 'Save toward transport, accommodation and shared Diani travel costs.' },
  { id: 'zanzibar', categoryCode: 'TRAVEL', title: 'Zanzibar', icon: '🌊', memberCount: 51, totalTargetValue: 5_100_000, partnerMerchants: merchants.travel, contributionFrom: 5000, typicalTimeline: '8–14 months', availableMbogis: 4, description: 'Plan a Zanzibar trip with members working toward comparable travel budgets.' },
  { id: 'dubai', categoryCode: 'TRAVEL', title: 'Dubai', icon: '✈️', memberCount: 42, totalTargetValue: 7_600_000, partnerMerchants: merchants.travel.slice(0, 1), contributionFrom: 7500, typicalTimeline: '10–18 months', availableMbogis: 3, description: 'Build a higher-value international travel fund with a disciplined timeline.' },
  { id: 'maasai-mara', categoryCode: 'TRAVEL', title: 'Maasai Mara', icon: '🦁', memberCount: 58, totalTargetValue: 2_650_000, partnerMerchants: merchants.travel.slice(0, 1), contributionFrom: 2500, typicalTimeline: '4–8 months', availableMbogis: 4, description: 'Save toward a Maasai Mara experience with goal-aligned groups.' },

  { id: 'school-fees', categoryCode: 'EDUCATION', title: 'School Fees', icon: '🎒', memberCount: 104, totalTargetValue: 8_900_000, partnerMerchants: merchants.education, contributionFrom: 3000, typicalTimeline: '3–12 months', availableMbogis: 8, description: 'Build school-fee reserves ahead of due dates with predictable progress.' },
  { id: 'professional-course', categoryCode: 'EDUCATION', title: 'Professional Course', icon: '📚', memberCount: 46, totalTargetValue: 3_300_000, partnerMerchants: merchants.education, contributionFrom: 3000, typicalTimeline: '5–12 months', availableMbogis: 4, description: 'Save toward certifications and professional courses with peers pursuing similar development goals.' },
  { id: 'university-fees', categoryCode: 'EDUCATION', title: 'University Fees', icon: '🎓', memberCount: 69, totalTargetValue: 7_250_000, partnerMerchants: merchants.education, contributionFrom: 5000, typicalTimeline: '6–18 months', availableMbogis: 5, description: 'Plan university-fee contributions with a longer-term savings structure.' },

  { id: 'laptop', categoryCode: 'PERSONAL', title: 'Laptop', icon: '💻', memberCount: 93, totalTargetValue: 6_100_000, partnerMerchants: merchants.personal.slice(0, 1), contributionFrom: 3000, typicalTimeline: '5–10 months', availableMbogis: 7, description: 'Save for a laptop with people targeting similar device budgets.' },
  { id: 'phone', categoryCode: 'PERSONAL', title: 'Phone', icon: '📱', memberCount: 81, totalTargetValue: 4_450_000, partnerMerchants: merchants.personal.slice(0, 1), contributionFrom: 2500, typicalTimeline: '4–10 months', availableMbogis: 6, description: 'Build a phone purchase fund using a clear goal, target and contribution cadence.' },
  { id: 'furniture', categoryCode: 'PERSONAL', title: 'Furniture', icon: '🛋️', memberCount: 55, totalTargetValue: 4_900_000, partnerMerchants: merchants.personal.slice(1), contributionFrom: 3500, typicalTimeline: '6–12 months', availableMbogis: 4, description: 'Save toward furniture purchases with groups organised around similar household plans.' },
];

export function goalsForCategory(code: GoalCategoryCode) {
  return savingGoals.filter((goal) => goal.categoryCode === code);
}
