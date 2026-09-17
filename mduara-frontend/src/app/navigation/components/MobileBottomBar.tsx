import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';
import type { AppPath, NavItem } from '../types';

interface MobileBottomBarProps {
	currentPath: AppPath;
	items: NavItem[];
	onNavigate: (path: AppPath) => void;
}

export function MobileBottomBar({ currentPath, items, onNavigate }: MobileBottomBarProps) {
	return (
		<View style={styles.mobileBar}>
			{items.map((item) => {
				const Icon = item.icon;
				const active = currentPath === item.path;

				return (
					<Pressable key={item.path} onPress={() => onNavigate(item.path)} style={styles.mobileItem}>
						<Icon color={active ? colors.primary : colors.textMuted} size={18} />
						<Text style={[styles.mobileLabel, active ? styles.mobileLabelActive : null]}>{item.label}</Text>
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	mobileBar: {
		backgroundColor: colors.surface,
		borderTopColor: colors.border,
		borderTopWidth: 1,
		bottom: 0,
		flexDirection: 'row',
		justifyContent: 'space-around',
		left: 0,
		paddingBottom: spacing.sm,
		paddingTop: spacing.sm,
		position: 'absolute',
		right: 0,
	},
	mobileItem: {
		alignItems: 'center',
		flex: 1,
		gap: 4,
		justifyContent: 'center',
		minHeight: 56,
	},
	mobileLabel: {
		color: colors.textMuted,
		fontSize: 10,
		fontWeight: typography.weights.semibold,
	},
	mobileLabelActive: {
		color: colors.primary,
	},
});