import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CheckCircle2, Clock3, ShieldCheck, TriangleAlert, Users } from 'lucide-react-native';

import { useAuth } from '../../../app/providers/AuthContext';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type ContributionStatus = 'On track' | 'Due soon' | 'Late';
type StatusFilter = 'All' | ContributionStatus;

const filters: StatusFilter[] = ['All', 'On track', 'Due soon', 'Late'];

const sampleStatuses = [
  { id: 'MEM-001', name: 'Aisha Kamau', role: 'Secretary', status: 'On track' as ContributionStatus, nextDue: '20 Sep 2026' },
  { id: 'MEM-002', name: 'Brian Maina', role: 'Member', status: 'On track' as ContributionStatus, nextDue: '20 Sep 2026' },
  { id: 'MEM-003', name: 'Mercy Wanjiku', role: 'Member', status: 'Due soon' as ContributionStatus, nextDue: '20 Sep 2026' },
  { id: 'MEM-004', name: 'Kevin Otieno', role: 'Member', status: 'Late' as ContributionStatus, nextDue: '15 Sep 2026' },
] as const;

function badgeVariant(status: ContributionStatus) {
  if (status === 'On track') return 'success' as const;
  if (status === 'Due soon') return 'warning' as const;
  return 'danger' as const;
}

export function ChamaContributionOverviewScreen() {
  const { activeMembership } = useAuth();
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(
    () => sampleStatuses.filter((item) => filter === 'All' || item.status === filter),
    [filter],
  );

  const counts = useMemo(() => ({
    onTrack: sampleStatuses.filter((item) => item.status === 'On track').length,
    dueSoon: sampleStatuses.filter((item) => item.status === 'Due soon').length,
    late: sampleStatuses.filter((item) => item.status === 'Late').length,
  }), []);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>CHAIR WORKSPACE</Text>
          <Text style={styles.title}>Contribution Oversight</Text>
          <Text style={styles.subtitle}>
            Review privacy-safe contribution standing for {activeMembership?.chamaName ?? 'the active Chama'}. Reconciliation and payment corrections remain a Treasurer responsibility.
          </Text>
        </View>
        <Badge variant="info">Read-only oversight</Badge>
      </View>

      <View style={styles.metrics}>
        <Card variant="outlined" style={styles.metric}>
          <Users color={colors.primary} size={20} />
          <Text style={styles.metricValue}>{sampleStatuses.length}</Text>
          <Text style={styles.metricLabel}>Sample members</Text>
        </Card>
        <Card variant="outlined" style={styles.metric}>
          <CheckCircle2 color={colors.success} size={20} />
          <Text style={styles.metricValue}>{counts.onTrack}</Text>
          <Text style={styles.metricLabel}>On track</Text>
        </Card>
        <Card variant="outlined" style={styles.metric}>
          <Clock3 color={colors.warning} size={20} />
          <Text style={styles.metricValue}>{counts.dueSoon}</Text>
          <Text style={styles.metricLabel}>Due soon</Text>
        </Card>
        <Card variant="outlined" style={styles.metric}>
          <TriangleAlert color={colors.danger} size={20} />
          <Text style={styles.metricValue}>{counts.late}</Text>
          <Text style={styles.metricLabel}>Late</Text>
        </Card>
      </View>

      <View accessibilityRole="tablist" style={styles.tabs}>
        {filters.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="tab"
            accessibilityState={{ selected: filter === value }}
            onPress={() => setFilter(value)}
            style={[styles.tab, filter === value && styles.tabActive]}
          >
            <Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value}</Text>
          </Pressable>
        ))}
      </View>

      <Card variant="outlined" style={styles.listCard}>
        {visible.map((member) => {
          const open = expanded === member.id;
          return (
            <Pressable
              key={member.id}
              accessibilityLabel={`${member.name}, ${member.status}. ${open ? 'Collapse details' : 'Expand details'}`}
              accessibilityRole="button"
              accessibilityState={{ expanded: open }}
              onPress={() => setExpanded(open ? null : member.id)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={[styles.rowTop, compact && styles.rowTopCompact]}>
                <View style={styles.identity}>
                  <View style={styles.avatar}><Users color={colors.primary} size={18} /></View>
                  <View style={styles.identityCopy}>
                    <Text style={styles.name}>{member.name}</Text>
                    <Text style={styles.meta}>{member.id} · {member.role}</Text>
                  </View>
                </View>
                <View style={styles.statusWrap}>
                  <Badge variant={badgeVariant(member.status)}>{member.status}</Badge>
                  <Text style={styles.due}>Next due {member.nextDue}</Text>
                </View>
              </View>

              {open ? (
                <View style={styles.detail}>
                  <ShieldCheck color={colors.primary} size={18} />
                  <View style={styles.detailCopy}>
                    <Text style={styles.detailTitle}>Privacy-safe Chair view</Text>
                    <Text style={styles.detailText}>
                      The Chair can see the member's contribution standing and due-state only. Raw balances, M-Pesa receipts and reconciliation actions are intentionally omitted from this workspace.
                    </Text>
                  </View>
                </View>
              ) : null}
            </Pressable>
          );
        })}
      </Card>

      <View style={styles.boundary}>
        <ShieldCheck color={colors.primary} size={18} />
        <Text style={styles.boundaryText}>
          Prototype data only. Production contribution status must come from the audited ledger/reconciliation API and Chama-scoped authorization.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatar: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  boundary: { alignItems: 'flex-start', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  boundaryText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  detail: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, padding: spacing.md },
  detailCopy: { flex: 1, gap: 4 },
  detailText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  detailTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '900' },
  due: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  identity: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: spacing.md },
  identityCopy: { flex: 1, gap: 3 },
  listCard: { overflow: 'hidden', padding: 0 },
  meta: { color: colors.textMuted, fontSize: 11 },
  metric: { flexGrow: 1, gap: 5, minWidth: 160 },
  metricLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metricValue: { color: colors.navy, fontSize: 22, fontWeight: '900' },
  name: { color: colors.text, fontSize: 14, fontWeight: '900' },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  rowTopCompact: { alignItems: 'flex-start', flexDirection: 'column' },
  statusWrap: { alignItems: 'flex-end', gap: 5 },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingHorizontal: 4, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.primary },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 760 },
});
