import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Bell, ChevronUp, Menu, Search } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import type { NotificationItem, VerifiedTokenPayload } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, shadows, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';
import type { BadgeVariant } from '../../../components/ui/Badge';
import { getInitials } from '../utils';

interface TopBarProps {
	breadcrumbs: string[];
	isCompact: boolean;
	isNotificationOpen: boolean;
	isProfileOpen: boolean;
	onOpenSidebar: () => void;
	onSignOut: () => void;
	onToggleNotifications: () => void;
	onToggleProfile: () => void;
	query: string;
	roleBadgeVariant: BadgeVariant;
	roleLabel: string;
	searchPlaceholder: string;
	setQuery: (value: string) => void;
	notifications: NotificationItem[];
	unreadNotifications: number;
	user: VerifiedTokenPayload;
}

export function TopBar({
	breadcrumbs,
	isCompact,
	isNotificationOpen,
	isProfileOpen,
	onOpenSidebar,
	onSignOut,
	onToggleNotifications,
	onToggleProfile,
	query,
	roleBadgeVariant,
	roleLabel,
	searchPlaceholder,
	setQuery,
	notifications,
	unreadNotifications,
	user,
}: TopBarProps) {
	return (
		<View style={styles.topbar}>
			<View style={styles.topbarLeft}>
				{isCompact ? (
					<Pressable style={styles.iconButton} onPress={onOpenSidebar}>
						<Menu color={colors.text} size={20} />
					</Pressable>
				) : null}
				<View style={styles.breadcrumbs}>
					{breadcrumbs.map((crumb, index) => (
						<Text key={`${crumb}-${index}`} style={index === breadcrumbs.length - 1 ? styles.breadcrumbCurrent : styles.breadcrumbText}>
							{index > 0 ? ' / ' : ''}
							{crumb}
						</Text>
					))}
				</View>
			</View>

			<View style={styles.topbarRight}>
				<View style={styles.searchBar}>
					<Search color={colors.textMuted} size={18} />
					<TextInput
						placeholder={searchPlaceholder}
						placeholderTextColor={colors.textMuted}
						style={styles.searchInput}
						value={query}
						onChangeText={setQuery}
					/>
				</View>

				<View style={styles.menuAnchor}>
					<Pressable style={styles.iconButton} onPress={onToggleNotifications}>
						<Bell color={colors.text} size={18} />
						{unreadNotifications > 0 ? (
							<View style={styles.notificationDot}>
								<Text style={styles.notificationDotLabel}>{unreadNotifications}</Text>
							</View>
						) : null}
					</Pressable>

					{isNotificationOpen ? (
						<View style={styles.drawerMenu}>
							<Text style={styles.drawerTitle}>Notifications</Text>
							{notifications.map((item) => (
								<View key={item.id} style={styles.drawerRow}>
									<View style={styles.drawerRowCopy}>
										<Text style={styles.drawerRowTitle}>{item.title}</Text>
										<Text style={styles.drawerRowBody}>{item.description}</Text>
									</View>
									<Text style={styles.drawerRowTime}>{item.timeLabel}</Text>
								</View>
							))}
						</View>
					) : null}
				</View>

				<View style={styles.menuAnchor}>
					<Pressable style={styles.profileButton} onPress={onToggleProfile}>
						<View style={styles.avatar}>
							<Text style={styles.avatarLabel}>{getInitials(user.fullName)}</Text>
						</View>
						{!isCompact ? <ChevronUp color={colors.textMuted} size={14} style={isProfileOpen ? undefined : styles.chevronClosed} /> : null}
					</Pressable>

					{isProfileOpen ? (
						<View style={styles.drawerMenu}>
							<Text style={styles.drawerTitle}>{user.fullName}</Text>
							<Text style={styles.profileMeta}>{user.email}</Text>
							<Badge variant={roleBadgeVariant}>{roleLabel}</Badge>
							<View style={styles.profileDivider} />
							<Text style={styles.profileMeta}>Chama: {user.chamaName}</Text>
							<Button variant="secondary" onPress={onSignOut}>Sign Out</Button>
						</View>
					) : null}
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	avatar: {
		alignItems: 'center',
		backgroundColor: colors.primary,
		borderRadius: 999,
		height: 34,
		justifyContent: 'center',
		width: 34,
	},
	avatarLabel: {
		color: colors.white,
		fontSize: typography.sizes.label,
		fontWeight: typography.weights.bold,
	},
	breadcrumbCurrent: {
		color: colors.text,
		fontSize: typography.sizes.body,
		fontWeight: typography.weights.semibold,
	},
	breadcrumbText: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
	},
	breadcrumbs: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	chevronClosed: {
		transform: [{ rotate: '180deg' }],
	},
	drawerMenu: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: radii.md,
		borderWidth: 1,
		gap: spacing.md,
		minWidth: 280,
		padding: spacing.md,
		position: 'absolute',
		right: 0,
		top: 48,
		...shadows.md,
		zIndex: 30,
	},
	drawerRow: {
		alignItems: 'flex-start',
		borderBottomColor: colors.border,
		borderBottomWidth: 1,
		flexDirection: 'row',
		gap: spacing.sm,
		justifyContent: 'space-between',
		paddingBottom: spacing.sm,
	},
	drawerRowBody: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
		lineHeight: 19,
	},
	drawerRowCopy: {
		flex: 1,
		gap: 2,
	},
	drawerRowTime: {
		color: colors.textMuted,
		fontSize: typography.sizes.caption,
	},
	drawerRowTitle: {
		color: colors.text,
		fontSize: typography.sizes.body,
		fontWeight: typography.weights.semibold,
	},
	drawerTitle: {
		color: colors.text,
		fontSize: 15,
		fontWeight: typography.weights.bold,
	},
	iconButton: {
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: radii.sm,
		borderWidth: 1,
		height: 42,
		justifyContent: 'center',
		position: 'relative',
		width: 42,
	},
	menuAnchor: {
		position: 'relative',
	},
	notificationDot: {
		alignItems: 'center',
		backgroundColor: colors.danger,
		borderRadius: 999,
		minWidth: 18,
		paddingHorizontal: 4,
		position: 'absolute',
		right: -4,
		top: -4,
	},
	notificationDotLabel: {
		color: colors.white,
		fontSize: 9,
		fontWeight: typography.weights.bold,
	},
	profileButton: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: spacing.xs,
	},
	profileDivider: {
		backgroundColor: colors.border,
		height: 1,
		width: '100%',
	},
	profileMeta: {
		color: colors.textMuted,
		fontSize: typography.sizes.body,
	},
	searchBar: {
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: radii.md,
		borderWidth: 1,
		flexDirection: 'row',
		gap: spacing.sm,
		height: 44,
		maxWidth: 360,
		paddingHorizontal: spacing.md,
		width: '100%',
	},
	searchInput: {
		color: colors.text,
		flex: 1,
		fontSize: typography.sizes.body,
	},
	topbar: {
		alignItems: 'center',
		backgroundColor: colors.surface,
		borderBottomColor: colors.border,
		borderBottomWidth: 1,
		flexDirection: 'row',
		gap: spacing.md,
		justifyContent: 'space-between',
		paddingHorizontal: 20,
		paddingVertical: spacing.md,
	},
	topbarLeft: {
		alignItems: 'center',
		flexDirection: 'row',
		gap: spacing.md,
	},
	topbarRight: {
		alignItems: 'center',
		flex: 1,
		flexDirection: 'row',
		gap: spacing.sm,
		justifyContent: 'flex-end',
	},
});