import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { FileSearch } from 'lucide-react-native';

import { Badge, type BadgeVariant } from '../../../components/ui/Badge';
import { Card, MetricCard } from '../../../components/ui/Card';
import { ProgressBar } from '../../../components/ui/ProgressBar';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

interface FeatureMetric {
	title: string;
	value: string;
	subtext?: string;
	progress?: number;
}

interface FeaturePanel {
	title: string;
	body: string;
	badge?: string;
	badgeVariant?: BadgeVariant;
	progress?: number;
}

interface FeatureScreenLayoutProps {
	badgeLabel?: string;
	description: string;
	metrics: FeatureMetric[];
	panels: FeaturePanel[];
	query: string;
	title: string;
}

export function FeatureScreenLayout({ badgeLabel = 'Verified Token Session', description, metrics, panels, query, title }: FeatureScreenLayoutProps) {
	const filteredPanels = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		if (!normalizedQuery) {
			return panels;
		}

		return panels.filter((panel) => `${panel.title} ${panel.body} ${panel.badge ?? ''}`.toLowerCase().includes(normalizedQuery));
	}, [panels, query]);

	return (
		<ScrollView contentContainerStyle={styles.content}>
			<View style={styles.pageHeader}>
				<View style={styles.pageTitleWrap}>
					<Text style={styles.pageTitle}>{title}</Text>
					<Text style={styles.pageDescription}>{description}</Text>
				</View>
				<Badge variant="primary">{badgeLabel}</Badge>
			</View>

			<View style={styles.metricsRow}>
				{metrics.map((metric) => (
					<View key={metric.title} style={styles.metricSlot}>
						<MetricCard style={styles.metricCard} subtext={metric.subtext} title={metric.title} value={metric.value} />
						{typeof metric.progress === 'number' ? (
							<View style={styles.metricProgressWrap}>
								<ProgressBar progress={metric.progress} />
							</View>
						) : null}
					</View>
				))}
			</View>

			<View style={styles.sectionGrid}>
				{filteredPanels.map((panel) => (
					<Card key={panel.title} style={styles.sectionCard} variant="default">
						<View style={styles.sectionCardHeader}>
							<Text style={styles.sectionHeading}>{panel.title}</Text>
							{panel.badge ? <Badge variant={panel.badgeVariant ?? 'primary'}>{panel.badge}</Badge> : null}
						</View>
						<Text style={styles.sectionBody}>{panel.body}</Text>
						{typeof panel.progress === 'number' ? (
							<View style={styles.panelProgressWrap}>
								<ProgressBar progress={panel.progress} />
							</View>
						) : null}
					</Card>
				))}

				{filteredPanels.length === 0 ? (
					<Card style={styles.emptyCard} variant="outlined">
						<FileSearch color={colors.primary} size={22} />
						<Text style={styles.emptyTitle}>No matching results</Text>
						<Text style={styles.emptyBody}>Try a different search term for this module.</Text>
					</Card>
				) : null}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	content: {
		gap: spacing.lg,
		padding: 20,
		paddingBottom: 96,
	},
	emptyBody: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
		textAlign: 'center',
	},
	emptyCard: {
		alignItems: 'center',
		gap: spacing.sm,
		paddingVertical: spacing.xxl,
	},
	emptyTitle: {
		color: colors.text,
		fontSize: 16,
		fontWeight: typography.weights.bold,
	},
	metricCard: {
		minHeight: 104,
	},
	metricProgressWrap: {
		marginTop: 8,
	},
	metricSlot: {
		flexBasis: 220,
		flexGrow: 1,
	},
	metricsRow: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
	},
	pageDescription: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
		lineHeight: 21,
		maxWidth: 620,
	},
	pageHeader: {
		alignItems: 'flex-start',
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
		justifyContent: 'space-between',
	},
	pageTitle: {
		color: colors.text,
		fontSize: 28,
		fontWeight: typography.weights.extrabold,
	},
	pageTitleWrap: {
		gap: spacing.xs,
	},
	panelProgressWrap: {
		marginTop: spacing.md,
	},
	sectionBody: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
		lineHeight: 21,
	},
	sectionCard: {
		flexBasis: 280,
		flexGrow: 1,
	},
	sectionCardHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: spacing.sm,
		justifyContent: 'space-between',
		marginBottom: spacing.sm,
	},
	sectionGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: spacing.md,
	},
	sectionHeading: {
		color: colors.text,
		fontSize: 16,
		fontWeight: typography.weights.bold,
	},
});