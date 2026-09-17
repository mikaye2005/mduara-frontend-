import React from 'react';

import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface LoanPortfolioScreenProps {
	query: string;
	user: VerifiedTokenPayload;
}

export function LoanPortfolioScreen({ query, user }: LoanPortfolioScreenProps) {
	return (
		<FeatureScreenLayout
			badgeLabel="Portfolio View"
			description="Portfolio-level lending visibility for treasury and executive roles, including repayment risk and review queues."
			metrics={[
				{ title: 'Open Applications', value: '9', subtext: '3 new today' },
				{ title: 'Portfolio at Risk', value: '2.1%', subtext: `${user.chamaName} below threshold`, progress: 21 },
				{ title: 'Repayments Due', value: 'KES 96,000', subtext: 'Next 5 days', progress: 58 },
			]}
			panels={[
				{ title: 'Credit oversight', body: `${user.role} permissions unlock review of arrears, approvals, and disbursement readiness for the active chama.`, badge: 'Portfolio', badgeVariant: 'primary' },
				{ title: 'Risk handling', body: 'Delinquency trends, collateral notes, and repayment pressure indicators remain grouped in one backend-driven queue.', badge: 'Risk', badgeVariant: 'warning', progress: 34 },
				{ title: 'Decision support', body: 'Loan actions can be added here without changing the shared navigation shell or RBAC hook.', badge: 'Extensible', badgeVariant: 'success' },
			]}
			query={query}
			title="Loans"
		/>
	);
}
