import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart3, FileBarChart, FileText, ShieldCheck } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type Period = '1M' | '3M' | '6M' | '1Y';

const reportTypes = [
  { id: 'personal', title: 'My savings statement', description: 'Personal contribution and progress summary across the active Chama context.', icon: FileText },
  { id: 'chama', title: 'Chama activity summary', description: 'Membership, contribution-cycle and progress overview for the selected Chama.', icon: BarChart3 },
  { id: 'audit', title: 'Workspace activity preview', description: 'A role-safe preview of actions visible to the current workspace.', icon: ShieldCheck },
] as const;

export function ReportsScreen({ user }: { user: VerifiedTokenPayload }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [period, setPeriod] = useState<Period>('3M');
  const [selected, setSelected] = useState<(typeof reportTypes)[number]['id']>('personal');
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const selectedReport = useMemo(() => reportTypes.find((item) => item.id === selected) ?? reportTypes[0], [selected]);

  const generate = () => {
    const stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setGeneratedAt(`Prototype preview generated at ${stamp}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.eyebrow}>REPORTING</Text><Text style={styles.title}>Reports & Statements</Text><Text style={styles.subtitle}>Generate privacy-safe frontend previews for {user.fullName}. Official financial documents remain backend-generated and auditable.</Text></View>
        <Badge variant="brand">Prototype report centre</Badge>
      </View>

      <View style={styles.periods}>
        {(['1M', '3M', '6M', '1Y'] as Period[]).map((value) => (
          <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: period === value }} onPress={() => { setPeriod(value); setGeneratedAt(null); }} style={[styles.period, period === value && styles.periodActive]}>
            <Text style={[styles.periodText, period === value && styles.periodTextActive]}>{value}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.layout, compact && styles.layoutCompact]}>
        <View style={styles.reportList}>
          {reportTypes.map(({ id, title, description, icon: Icon }) => (
            <Pressable key={id} accessibilityRole="button" accessibilityState={{ selected: selected === id }} onPress={() => { setSelected(id); setGeneratedAt(null); }} style={[styles.reportCard, selected === id && styles.reportCardActive]}>
              <View style={styles.reportIcon}><Icon color={colors.primary} size={19} /></View>
              <View style={styles.reportCopy}><Text style={styles.reportTitle}>{title}</Text><Text style={styles.reportDescription}>{description}</Text></View>
            </Pressable>
          ))}
        </View>

        <Card variant="outlined" style={styles.preview}>
          <View style={styles.previewHeader}><View style={styles.previewIcon}><FileBarChart color={colors.primary} size={21} /></View><View style={styles.previewCopy}><Text style={styles.previewTitle}>{selectedReport.title}</Text><Text style={styles.meta}>Period: {period} · Active context: {user.chamaName}</Text></View></View>
          <View style={styles.metricGrid}>
            <View style={styles.metric}><Text style={styles.metricLabel}>Workspace</Text><Text style={styles.metricValue}>{user.role === 'member' ? 'Member View' : user.role}</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>Memberships</Text><Text style={styles.metricValue}>{user.memberships.length}</Text></View>
            <View style={styles.metric}><Text style={styles.metricLabel}>Period</Text><Text style={styles.metricValue}>{period}</Text></View>
          </View>
          <Text style={styles.previewBody}>This preview proves report selection, date-range state and role-scoped context. Production statements must be generated from backend ledger/reporting data rather than browser totals.</Text>
          <Button onPress={generate}>Generate preview</Button>
          <Button disabled variant="secondary">Export after report API</Button>
          {generatedAt ? <View style={styles.generated}><Text style={styles.generatedText}>{generatedAt}</Text></View> : null}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  generated: { backgroundColor: colors.successSoft, borderRadius: radii.md, padding: spacing.md },
  generatedText: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  layout: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.lg },
  layoutCompact: { flexDirection: 'column' },
  meta: { color: colors.textMuted, fontSize: 11 },
  metric: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, flex: 1, gap: 4, minWidth: 130, padding: spacing.md },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  metricLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  metricValue: { color: colors.navy, fontSize: 14, fontWeight: '900' },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  period: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 9 },
  periodActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  periodText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  periodTextActive: { color: colors.white },
  periods: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  preview: { flex: 1.3, gap: spacing.md, minWidth: 300 },
  previewBody: { color: colors.textMuted, fontSize: 12, lineHeight: 19 },
  previewCopy: { flex: 1, gap: 3 },
  previewHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  previewIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 42, justifyContent: 'center', width: 42 },
  previewTitle: { color: colors.navy, fontSize: 18, fontWeight: '900' },
  reportCard: { alignItems: 'flex-start', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  reportCardActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  reportCopy: { flex: 1, gap: 4 },
  reportDescription: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  reportIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 16, height: 38, justifyContent: 'center', width: 38 },
  reportList: { flex: 1, gap: spacing.sm, minWidth: 280 },
  reportTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
});
