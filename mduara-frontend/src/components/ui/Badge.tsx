import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

export type BadgeVariant = 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  compact?: boolean;
  style?: ViewStyle;
}

const badgeMap: Record<BadgeVariant, { backgroundColor: string; color: string; borderColor: string }> = {
  brand: { backgroundColor: colors.primaryLight, color: colors.primary, borderColor: colors.primaryLine },
  primary: { backgroundColor: colors.primaryLight, color: colors.primary, borderColor: colors.primaryLine },
  success: { backgroundColor: colors.successSoft, color: colors.success, borderColor: '#CDEEDD' },
  warning: { backgroundColor: colors.warningSoft, color: colors.warning, borderColor: '#F4DCA8' },
  danger: { backgroundColor: colors.dangerSoft, color: colors.danger, borderColor: '#F2CACA' },
  info: { backgroundColor: colors.infoSoft, color: colors.info, borderColor: '#CFE0F6' },
  neutral: { backgroundColor: colors.surfaceMuted, color: colors.textMuted, borderColor: colors.border },
};

export function Badge({ children, variant = 'brand', compact = false, style }: BadgeProps) {
  const tone = badgeMap[variant];

  return (
    <View
      style={[
        styles.badge,
        compact ? styles.compact : null,
        { backgroundColor: tone.backgroundColor, borderColor: tone.borderColor },
        style,
      ]}
    >
      <Text style={[styles.label, { color: tone.color }]}>{children}</Text>
    </View>
  );
}

export const StatusBadge = Badge;

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  label: {
    fontSize: typography.sizes.caption,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.25,
  },
});
