import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';
import type { AppPath } from '../../../app/navigation/types';
import { routeContentMap } from '../../../app/navigation/config';

interface ModuleStateScreenProps {
  path: AppPath;
}

export function ModuleStateScreen({ path }: ModuleStateScreenProps) {
  const title = routeContentMap[path]?.breadcrumbs.at(-1) ?? 'Workspace';

  return (
    <View style={styles.page}>
      <Card style={styles.card}>
        <View style={styles.iconWrap}>
          <ShieldCheck color={colors.primary} size={24} />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.body}>
          This workspace is available for your current role. Live records will appear here when the corresponding API returns data for the active Chama.
        </Text>
        <View style={styles.note}>
          <Text style={styles.noteText}>Role-scoped access is enforced before this screen renders.</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  card: {
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
    padding: spacing.xxl,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderWidth: 1,
    borderColor: colors.primaryLine,
  },
  title: {
    marginTop: spacing.lg,
    color: colors.text,
    fontSize: typography.sizes.h2,
    lineHeight: typography.lineHeights.h2,
    fontWeight: typography.weights.bold,
  },
  body: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.sizes.body,
    lineHeight: typography.lineHeights.body,
    maxWidth: 600,
  },
  note: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    backgroundColor: colors.infoSoft,
  },
  noteText: {
    color: colors.info,
    fontSize: typography.sizes.caption,
    lineHeight: typography.lineHeights.caption,
    fontWeight: typography.weights.semibold,
  },
});
