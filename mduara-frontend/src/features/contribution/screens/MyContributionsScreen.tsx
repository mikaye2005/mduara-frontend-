import React from 'react';

import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface MyContributionsScreenProps {
	query: string;
	user: VerifiedTokenPayload;
}

export function MyContributionsScreen({ query, user }: MyContributionsScreenProps) {
	return (
		<FeatureScreenLayout
			badgeLabel="Member Ledger"
			description="Personal contribution tracking for members, with balances and confirmations pulled from the authenticated backend session."
			metrics={[
				{ title: 'This Month', value: 'KES 10,000', subtext: 'Posted successfully', progress: 100 },
				{ title: 'Contribution Health', value: '100%', subtext: `${user.chamaName} cycle on track`, progress: 100 },
				{ title: 'Pending Receipts', value: '1', subtext: 'Awaiting sync from payments API' },
			]}
			panels={[
				{ title: 'Personal ledger', body: `${user.fullName} can review posted savings, receipt status, and contribution cadence without seeing treasury-only workflows.`, badge: 'Member', badgeVariant: 'success' },
				{ title: 'Upcoming obligation', body: 'Your next scheduled contribution is due before the next chama meeting and will reconcile automatically once the payment callback lands.', badge: 'Due Soon', badgeVariant: 'warning', progress: 72 },
				{ title: 'Receipt confidence', body: 'Each posted entry stays tied to a backend transaction reference rather than any client-side role selection state.', badge: 'Verified', badgeVariant: 'primary' },
			]}
			query={query}
			title="Contributions"
		/>
	);
}
