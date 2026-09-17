import React from 'react';

import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface UserDirectoryScreenProps {
	query: string;
	user: VerifiedTokenPayload;
}

export function UserDirectoryScreen({ query, user }: UserDirectoryScreenProps) {
	return (
		<FeatureScreenLayout
			badgeLabel="Directory Control"
			description="Member directory and onboarding visibility for authorized governance roles, backed by the active verified token."
			metrics={[
				{ title: 'Verified Members', value: '22', subtext: `${user.chamaName} active roster`, progress: 91 },
				{ title: 'Pending Approvals', value: '2', subtext: 'Require executive action' },
				{ title: 'Profile Completion', value: '91%', subtext: 'KYC sync coverage', progress: 91 },
			]}
			panels={[
				{ title: 'Approval queue', body: `${user.fullName} can admit, hold, or review applicants without exposing this path to standard members.`, badge: 'Governance', badgeVariant: 'primary' },
				{ title: 'Directory hygiene', body: 'Phone numbers, KYC status, and invitation states can be managed from one backend-backed roster module.', badge: 'Roster', badgeVariant: 'success' },
				{ title: 'Access protection', body: 'Unauthorized users are redirected before this module renders, keeping the shell and route guard consistent.', badge: 'Protected', badgeVariant: 'warning' },
			]}
			query={query}
			title="Members"
		/>
	);
}
