export type PublicChamaEntryMode = 'PUBLIC' | 'APPLICATION' | 'PRIVATE';
export type PublicChamaRecruitmentStatus = 'Open' | 'Almost Full' | 'Closed';
export type ChamaOfficialRole = 'chairperson' | 'secretary' | 'treasurer';
export type UserRole = ChamaOfficialRole | 'member' | 'superadmin';
export type MembershipStatus = 'active' | 'pending' | 'suspended' | 'exited';

export interface PublicChamaOfficial {
    role: 'Chairperson' | 'Secretary' | 'Treasurer';
    name: string;
}

export interface PublicChamaRule {
    title: string;
    summary: string;
}

export interface PublicChama {
    id: number;
    name: string;
    type: string;
    goal: string;
    goalCategory: string;
    location: string;
    members: number;
    capacity: number;
    pooled: number;
    target: number;
    status: 'Active' | 'Inactive';
    recruitmentStatus: PublicChamaRecruitmentStatus;
    entryMode: PublicChamaEntryMode;
    contribution: string;
    contributionAmount: number;
    contributionFrequency: 'Weekly' | 'Monthly';
    durationMonths: number;
    commitmentAmount: number;
    meeting: string;
    constitutionVersion: string;
    trustScore: number;
    trustSignals: string[];
    description: string;
    officials: PublicChamaOfficial[];
    rules: PublicChamaRule[];
}

export interface ChamaMembership {
    chamaId: number;
    chamaName: string;
    goalLabel: string;
    status: MembershipStatus;
    officialRole: ChamaOfficialRole | null;
    ownSaved: number;
    ownTarget: number;
    nextContributionAmount: number;
    nextContributionDue: string;
    contributionStatus: 'On track' | 'Due soon' | 'Late';
    trustScore: number;
}

/**
 * Frontend session shape used by the prototype until the backend session-context
 * endpoint is connected. `role`, `chamaId` and `chamaName` are compatibility
 * fields derived from the currently selected membership/workspace.
 */
export interface VerifiedTokenPayload {
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    mockPin: string;
    isPlatformAdmin: boolean;
    memberships: ChamaMembership[];
    role: UserRole;
    chamaId: number;
    chamaName: string;
    unreadNotifications: number;
    permissions: string[];
}

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    timeLabel: string;
    read: boolean;
}

const commonRules: PublicChamaRule[] = [
    { title: 'Contributions', summary: 'Members contribute the agreed amount on schedule. The exact amount and frequency are shown before joining.' },
    { title: 'Commitment & default', summary: 'A KSh 500 commitment applies where required. Missed-payment consequences follow the Constitution accepted by the member.' },
    { title: 'Exit & withdrawal', summary: 'Voluntary exit, notice periods and any refund conditions follow the active Constitution version.' },
    { title: 'Payout', summary: 'Savings or benefit payouts follow the Chama goal, contribution plan and authorised payment process.' },
    { title: 'Decision-making & voting', summary: 'Material Chama decisions follow the voting threshold and meeting process defined in the Constitution.' },
    { title: 'Member conduct & disputes', summary: 'Members are expected to act respectfully and use the defined dispute/escalation process when a conflict arises.' },
    { title: 'Dissolution', summary: 'Closing the Chama requires the Constitution-defined approval process and a clear final financial reconciliation.' },
];

export const publicChamas: PublicChama[] = [
    {
        id: 1, name: 'Umoja Land Investment', type: 'Goal-Based', goal: 'Purchase serviced land together', goalCategory: 'Home & Land',
        location: 'Nairobi & Kiambu', members: 24, capacity: 30, pooled: 4850000, target: 6000000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'APPLICATION',
        contribution: 'KES 10,000 monthly', contributionAmount: 10000, contributionFrequency: 'Monthly', durationMonths: 12, commitmentAmount: 500,
        meeting: '1st Saturday, 2:00 PM', constitutionVersion: 'v2.1', trustScore: 88, trustSignals: ['Verified officials', 'Current Constitution', 'Consistent group records'], description: 'A land-purchase savings group building a shared investment fund toward a clearly defined property goal.',
        officials: [{ role: 'Chairperson', name: 'Ruth Njeri' }, { role: 'Secretary', name: 'Aisha Kamau' }, { role: 'Treasurer', name: 'Peter Ouma' }], rules: commonRules,
    },
    {
        id: 2, name: 'Mwangaza Women Group', type: 'Table Banking', goal: 'Grow member savings and small-business capital', goalCategory: 'Business',
        location: 'Nakuru', members: 18, capacity: 25, pooled: 1200000, target: 2000000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'PUBLIC',
        contribution: 'KES 5,000 monthly', contributionAmount: 5000, contributionFrequency: 'Monthly', durationMonths: 10, commitmentAmount: 500,
        meeting: 'Last Sunday, 3:00 PM', constitutionVersion: 'v1.8', trustScore: 83, trustSignals: ['Verified officials', 'Current Constitution', 'Active contribution records'], description: 'A table-banking group focused on disciplined savings, lending and practical small-business support.',
        officials: [{ role: 'Chairperson', name: 'Grace Wambui' }, { role: 'Secretary', name: 'Mercy Achieng' }, { role: 'Treasurer', name: 'Daniel Kiptoo' }], rules: commonRules,
    },
    {
        id: 3, name: 'Sunrise Youth Welfare', type: 'Savings & Merry-Go-Round', goal: 'Build a youth welfare and rotating-payout fund', goalCategory: 'Personal',
        location: 'Nyeri', members: 12, capacity: 12, pooled: 450000, target: 500000, status: 'Inactive', recruitmentStatus: 'Closed', entryMode: 'PRIVATE',
        contribution: 'KES 2,500 monthly', contributionAmount: 2500, contributionFrequency: 'Monthly', durationMonths: 8, commitmentAmount: 500,
        meeting: '2nd Saturday, 10:00 AM', constitutionVersion: 'v1.3', trustScore: 76, trustSignals: ['Verified officials', 'Constitution on record', 'Closed recruitment'], description: 'A youth welfare group combining regular savings with rotating payouts and mutual-support activities.',
        officials: [{ role: 'Chairperson', name: 'Kevin Mwangi' }, { role: 'Secretary', name: 'Faith Nyambura' }, { role: 'Treasurer', name: 'Brian Maina' }], rules: commonRules,
    },
    {
        id: 4, name: "Summertides '27", type: 'Goal-Based', goal: 'Build a disciplined shared travel and opportunity fund', goalCategory: 'Travel',
        location: 'Nairobi', members: 21, capacity: 28, pooled: 890000, target: 1400000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'APPLICATION',
        contribution: 'KES 2,500 monthly', contributionAmount: 2500, contributionFrequency: 'Monthly', durationMonths: 14, commitmentAmount: 500,
        meeting: '2nd Sunday, 4:00 PM', constitutionVersion: 'v1.5', trustScore: 86, trustSignals: ['Verified officials', 'Current Constitution', 'Active contribution records'], description: 'A structured goal-based Chama saving toward shared travel and personal-growth opportunities.',
        officials: [{ role: 'Chairperson', name: 'David Mwangi' }, { role: 'Secretary', name: 'Aisha Kamau' }, { role: 'Treasurer', name: 'Peter Ouma' }], rules: commonRules,
    },
    {
        id: 5, name: 'Future Home', type: 'Goal-Based', goal: 'Build a personal home deposit', goalCategory: 'Home & Land',
        location: 'Nairobi & Machakos', members: 34, capacity: 40, pooled: 2650000, target: 4500000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'PUBLIC',
        contribution: 'KES 5,000 monthly', contributionAmount: 5000, contributionFrequency: 'Monthly', durationMonths: 18, commitmentAmount: 500,
        meeting: 'Last Saturday, 11:00 AM', constitutionVersion: 'v1.2', trustScore: 84, trustSignals: ['Verified officials', 'Current Constitution', 'Transparent member progress'], description: 'Members save toward home deposits with transparent personal progress and shared accountability.',
        officials: [{ role: 'Chairperson', name: 'Lucy Wanjiku' }, { role: 'Secretary', name: 'Samuel Kariuki' }, { role: 'Treasurer', name: 'Anne Njeri' }], rules: commonRules,
    },
    {
        id: 6, name: 'Washing Machine Mbogi', type: 'Goal-Based', goal: 'Buy a washing machine', goalCategory: 'Home Appliances',
        location: 'Nairobi', members: 18, capacity: 25, pooled: 510000, target: 750000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'PUBLIC',
        contribution: 'KES 2,500 monthly', contributionAmount: 2500, contributionFrequency: 'Monthly', durationMonths: 12, commitmentAmount: 500,
        meeting: '1st Wednesday, 7:00 PM', constitutionVersion: 'v1.0', trustScore: 82, trustSignals: ['Verified officials', 'Current Constitution', 'Goal-specific records'], description: 'A goal-specific Mbogi bringing together members saving for washing machines and future merchant rewards.',
        officials: [{ role: 'Chairperson', name: 'Miriam Wambui' }, { role: 'Secretary', name: 'John Otieno' }, { role: 'Treasurer', name: 'Caroline Muthoni' }], rules: commonRules,
    },
    {
        id: 7, name: 'Dubai Travel Circle', type: 'Goal-Based', goal: 'Save for a Dubai trip', goalCategory: 'Travel',
        location: 'Kenya-wide', members: 16, capacity: 24, pooled: 1320000, target: 2400000, status: 'Active', recruitmentStatus: 'Open', entryMode: 'APPLICATION',
        contribution: 'KES 8,000 monthly', contributionAmount: 8000, contributionFrequency: 'Monthly', durationMonths: 15, commitmentAmount: 500,
        meeting: '3rd Thursday, 7:30 PM', constitutionVersion: 'v1.1', trustScore: 80, trustSignals: ['Verified officials', 'Current Constitution', 'Active travel goal records'], description: 'A travel-focused group saving toward a structured Dubai travel budget and partner offers.',
        officials: [{ role: 'Chairperson', name: 'James Karanja' }, { role: 'Secretary', name: 'Linda Atieno' }, { role: 'Treasurer', name: 'Brian Kiptoo' }], rules: commonRules,
    },
];

export const authInitialValues = {
    register: { email: '', fullName: '', phone: '', pin: '' },
    signIn: { phone: '', pin: '' },
};

const memberPermissions = ['dashboard:view', 'contributions:view:self', 'loans:view:self', 'members:view:safe'];

export const verifiedUsers: Record<string, VerifiedTokenPayload> = {
    '+254730200300': {
        userId: 'user-aisha-004', fullName: 'Aisha Kamau', email: 'aisha@mduara.demo', phone: '+254730200300', mockPin: '3579', isPlatformAdmin: false,
        chamaId: 4, chamaName: "Summertides '27", role: 'member', unreadNotifications: 3, permissions: memberPermissions,
        memberships: [
            { chamaId: 4, chamaName: "Summertides '27", goalLabel: 'Travel & opportunity fund', status: 'active', officialRole: 'secretary', ownSaved: 6000, ownTarget: 15000, nextContributionAmount: 2500, nextContributionDue: '20 Sep', contributionStatus: 'On track', trustScore: 86 },
            { chamaId: 6, chamaName: 'Washing Machine Mbogi', goalLabel: 'Washing machine', status: 'active', officialRole: null, ownSaved: 12500, ownTarget: 30000, nextContributionAmount: 2500, nextContributionDue: '25 Sep', contributionStatus: 'On track', trustScore: 82 },
            { chamaId: 5, chamaName: 'Future Home', goalLabel: 'Home deposit', status: 'active', officialRole: null, ownSaved: 20000, ownTarget: 65000, nextContributionAmount: 5000, nextContributionDue: '28 Sep', contributionStatus: 'Due soon', trustScore: 84 },
            { chamaId: 7, chamaName: 'Dubai Travel Circle', goalLabel: 'Dubai trip', status: 'active', officialRole: null, ownSaved: 8000, ownTarget: 30000, nextContributionAmount: 8000, nextContributionDue: '03 Oct', contributionStatus: 'On track', trustScore: 80 },
        ],
    },
    '+254700000001': {
        userId: 'user-chair-001', fullName: 'Ruth Njeri', email: 'ruth@umoja.ke', phone: '+254700000001', mockPin: '2468', isPlatformAdmin: false,
        chamaId: 1, chamaName: 'Umoja Land Investment', role: 'member', unreadNotifications: 4, permissions: memberPermissions,
        memberships: [{ chamaId: 1, chamaName: 'Umoja Land Investment', goalLabel: 'Serviced land', status: 'active', officialRole: 'chairperson', ownSaved: 120000, ownTarget: 180000, nextContributionAmount: 10000, nextContributionDue: '01 Oct', contributionStatus: 'On track', trustScore: 91 }],
    },
    '+254700000002': {
        userId: 'user-treasurer-002', fullName: 'Daniel Kiptoo', email: 'daniel@mwangaza.ke', phone: '+254700000002', mockPin: '4680', isPlatformAdmin: false,
        chamaId: 2, chamaName: 'Mwangaza Women Group', role: 'member', unreadNotifications: 2, permissions: memberPermissions,
        memberships: [{ chamaId: 2, chamaName: 'Mwangaza Women Group', goalLabel: 'Business capital', status: 'active', officialRole: 'treasurer', ownSaved: 45000, ownTarget: 75000, nextContributionAmount: 5000, nextContributionDue: '30 Sep', contributionStatus: 'On track', trustScore: 88 }],
    },
    '+254700000003': {
        userId: 'user-member-003', fullName: 'Justus Mwangi', email: 'justus@umoja.ke', phone: '+254700000003', mockPin: '1234', isPlatformAdmin: false,
        chamaId: 1, chamaName: 'Umoja Land Investment', role: 'member', unreadNotifications: 1, permissions: memberPermissions,
        memberships: [{ chamaId: 1, chamaName: 'Umoja Land Investment', goalLabel: 'Serviced land', status: 'active', officialRole: null, ownSaved: 65000, ownTarget: 120000, nextContributionAmount: 10000, nextContributionDue: '01 Oct', contributionStatus: 'Due soon', trustScore: 79 }],
    },
    '+254750400500': {
        userId: 'user-platform-admin-005', fullName: 'John Kamau', email: 'john.admin@mduara.demo', phone: '+254750400500', mockPin: '5791', isPlatformAdmin: true,
        chamaId: 0, chamaName: 'M-Duara Platform', role: 'superadmin', unreadNotifications: 5, permissions: ['platform:*'], memberships: [],
    },
};

export const mockNotifications: Record<UserRole, NotificationItem[]> = {
    chairperson: [
        { description: 'Treasury reconciliation is ready for executive sign-off.', id: 'notice-chair-1', read: false, timeLabel: '5m ago', title: 'Reconciliation submitted' },
        { description: 'Two new members are waiting for approval.', id: 'notice-chair-2', read: false, timeLabel: '18m ago', title: 'Pending onboarding approvals' },
    ],
    secretary: [
        { description: 'Three membership applications are waiting for secretary review.', id: 'notice-secretary-1', read: false, timeLabel: '7m ago', title: 'Applications need review' },
        { description: "Summertides '27 meeting minutes are ready to publish.", id: 'notice-secretary-2', read: false, timeLabel: '48m ago', title: 'Minutes draft ready' },
    ],
    treasurer: [
        { description: 'Three STK push payments are awaiting verification.', id: 'notice-treasurer-1', read: false, timeLabel: '3m ago', title: 'Pending STK confirmations' },
        { description: 'Liquidity ratio dipped below this week\'s threshold.', id: 'notice-treasurer-2', read: false, timeLabel: '22m ago', title: 'Liquidity threshold alert' },
    ],
    member: [
        { description: 'Your next contribution is due soon in one of your Chamas.', id: 'notice-member-1', read: false, timeLabel: '9m ago', title: 'Contribution reminder' },
        { description: 'Your personal Chama progress summary is ready.', id: 'notice-member-2', read: true, timeLabel: '2h ago', title: 'Progress updated' },
    ],
    superadmin: [
        { description: 'Platform monitoring completed without a critical service alert.', id: 'notice-admin-1', read: false, timeLabel: '4m ago', title: 'System health summary' },
    ],
};
