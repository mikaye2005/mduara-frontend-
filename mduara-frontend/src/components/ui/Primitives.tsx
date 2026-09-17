import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react-native';

import { colors } from '../../theme/colors';
import { dimensions, radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

export function PageHeading({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <View style={styles.headingRow}>
      <View style={styles.headingCopy}>
        <Text style={styles.headingTitle}>{title}</Text>
        {subtitle ? <Text style={styles.headingSubtitle}>{subtitle}</Text> : null}
      </View>
      {actions ? <View style={styles.headingActions}>{actions}</View> : null}
    </View>
  );
}

export function SearchBox({ style, ...props }: TextInputProps & { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.searchWrap, style]}>
      <Search color={colors.textMuted} size={17} />
      <TextInput
        placeholderTextColor={colors.textSubtle}
        style={styles.searchInput}
        accessibilityLabel={props.accessibilityLabel ?? 'Search'}
        {...props}
      />
    </View>
  );
}

export function FilterSelect({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.filterRow}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.filterPill, active ? styles.filterPillActive : null]}
          >
            <Text style={[styles.filterText, active ? styles.filterTextActive : null]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Pagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const previousDisabled = page <= 1;
  const nextDisabled = page >= pageCount;
  return (
    <View style={styles.pagination}>
      <Pressable
        disabled={previousDisabled}
        onPress={() => onPageChange(page - 1)}
        style={[styles.pageButton, previousDisabled ? styles.pageButtonDisabled : null]}
        accessibilityLabel="Previous page"
      >
        <ChevronLeft size={16} color={colors.textMuted} />
      </Pressable>
      <Text style={styles.pageText}>Page {page} of {Math.max(pageCount, 1)}</Text>
      <Pressable
        disabled={nextDisabled}
        onPress={() => onPageChange(page + 1)}
        style={[styles.pageButton, nextDisabled ? styles.pageButtonDisabled : null]}
        accessibilityLabel="Next page"
      >
        <ChevronRight size={16} color={colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  headingRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    justifyContent: 'space-between',
  },
  headingCopy: { flex: 1, minWidth: 240 },
  headingTitle: {
    color: colors.text,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.extrabold,
    lineHeight: typography.lineHeights.h2,
  },
  headingSubtitle: {
    color: colors.textMuted,
    fontSize: typography.sizes.body,
    lineHeight: typography.lineHeights.body,
    marginTop: spacing.xs,
  },
  headingActions: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  searchWrap: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    minHeight: dimensions.controlHeight,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.sizes.body,
    minHeight: dimensions.controlHeight - 2,
    outlineStyle: 'none' as any,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  filterPill: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
  },
  filterPillActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  filterText: { color: colors.textMuted, fontSize: typography.sizes.label, fontWeight: typography.weights.semibold },
  filterTextActive: { color: colors.primary },
  pagination: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  pageButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.sm,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  pageButtonDisabled: { opacity: 0.4 },
  pageText: { color: colors.textMuted, fontSize: typography.sizes.label, fontWeight: typography.weights.semibold },
});
