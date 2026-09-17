import React from 'react';

import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface MemberLoansScreenProps {
	query: string;
	user: VerifiedTokenPayload;
}

export function MemberLoansScreen({ query, user }: MemberLoansScreenProps) {
	return (
		<FeatureScreenLayout
			badgeLabel="Member Loans"
			description="Loan visibility for members only, showing personal applications, repayments, and approval progress from backend records."
			metrics={[
				{ title: 'Active Loan', value: 'KES 60,000', subtext: 'Repayment on schedule', progress: 63 },
				{ title: 'Installments Left', value: '5', subtext: `${user.chamaName} schedule` },
				{ title: 'Approval Turnaround', value: '2 days', subtext: 'Average for current cycle' },
			]}
			panels={[
				{ title: 'Application status', body: `${user.fullName} can follow approval and repayment milestones without exposure to portfolio-level member data.`, badge: 'Private', badgeVariant: 'success' },
				{ title: 'Repayment schedule', body: 'Installments, due dates, and balance updates stay aligned with backend repayment events and committee decisions.', badge: 'Schedule', badgeVariant: 'primary', progress: 63 },
				{ title: 'Next action', body: 'Submit supporting documents or early repayment requests from this member-scoped route.', badge: 'Action', badgeVariant: 'warning' },
			]}
			query={query}
			title="Loans"
		/>
	);
}
