import React from 'react';

import type { NotificationItem, VerifiedTokenPayload } from '../../../shared/mockData';
import { FeatureScreenLayout } from '../../shared/components/FeatureScreenLayout';

interface AuditLogsScreenProps {
	notifications: NotificationItem[];
	query: string;
	unreadNotifications: number;
	user: VerifiedTokenPayload;
}

export function AuditLogsScreen({ notifications, query, unreadNotifications, user }: AuditLogsScreenProps) {
	return (
		<FeatureScreenLayout
			badgeLabel="Compliance View"
			description="Sensitive activity, approval trails, and compliance exports stay scoped to the verified governance role."
			metrics={[
				{ title: 'Unread Alerts', value: String(unreadNotifications), subtext: 'Escalations from audit stream', progress: Math.min(unreadNotifications * 20, 100) },
				{ title: 'Privileged Events', value: '38', subtext: `Filtered for ${user.chamaName}` },
				{ title: 'Export Readiness', value: '92%', subtext: 'Monthly bundle almost complete', progress: 92 },
			]}
			panels={[
				{ title: 'Approval chain integrity', body: `${user.fullName} can review member approvals, treasury overrides, and executive sign-offs without exposing member-only routes.`, badge: 'RBAC', badgeVariant: 'primary' },
				{ title: 'Compliance exports', body: 'Backend-generated audit exports remain grouped by actor, event type, and chama context for downstream review.', badge: 'Exports', badgeVariant: 'warning', progress: 92 },
				{ title: 'Recent audit signal', body: notifications[0]?.description ?? 'No recent audit alerts were returned by the backend.', badge: 'Live', badgeVariant: 'success' },
			]}
			query={query}
			title="Audit Logs"
		/>
	);
}