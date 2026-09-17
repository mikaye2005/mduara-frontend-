import React from 'react';

import { publicChamas, type VerifiedTokenPayload } from '../../../shared/mockData';
import { formatCurrency } from '../../../shared/date';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface ChamaMgmtScreenProps {
	query: string;
	unreadNotifications: number;
	user: VerifiedTokenPayload;
}

export function ChamaMgmtScreen({ query, unreadNotifications, user }: ChamaMgmtScreenProps) {
	const activeChama = publicChamas.find((chama) => chama.id === user.chamaId) ?? publicChamas[0];
	const pooledProgress = Math.round((activeChama.pooled / activeChama.target) * 100);

	return (
		<FeatureScreenLayout
			description="Operational overview for the authenticated chama session, driven by the verified token and scoped backend data."
			metrics={[
				{ title: 'Members Active', value: String(activeChama.members), subtext: `${user.chamaName} roster`, progress: 88 },
				{ title: 'Capital Pooled', value: formatCurrency(activeChama.pooled), subtext: `Target ${formatCurrency(activeChama.target)}`, progress: pooledProgress },
				{ title: 'Unread Actions', value: String(unreadNotifications), subtext: `${user.role} queue pending` },
			]}
			panels={[
				{ title: 'Chama performance', body: `${activeChama.name} is currently ${activeChama.status.toLowerCase()} with ${activeChama.contribution} and meetings on ${activeChama.meeting}.`, badge: activeChama.status, badgeVariant: activeChama.status === 'Active' ? 'success' : 'warning', progress: pooledProgress },
				{ title: 'Verified operating context', body: `${user.fullName} is signed in as ${user.role} and only sees modules granted by backend permissions.`, badge: 'Secure', badgeVariant: 'primary' },
				{ title: 'Next operational focus', body: activeChama.description, badge: 'Pipeline', badgeVariant: 'warning' },
			]}
			query={query}
			title="Dashboard"
		/>
	);
}
