import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, CheckCircle2, Clock3, RefreshCcw, TriangleAlert, WalletCards } from 'lucide-react-native';

import { useAuth } from '../../../app/providers/AuthContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type TxStatus = 'Confirmed' | 'Processing' | 'Failed';
type Filter = 'All' | TxStatus;

const transactions = [
  { id: 'TX-2191', member: 'Aisha Kamau', amount: 2500, status: 'Confirmed' as TxStatus, kind: 'Contribution', time: '10:42 AM' },
  { id: 'TX-2190', member: 'Brian Maina', amount: 2500, status: 'Processing' as TxStatus, kind: 'Contribution', time: '10:31 AM' },
  { id: 'TX-2187', member: 'Mercy Wanjiku', amount: 500, status: 'Confirmed' as TxStatus, kind: 'Commitment', time: '9:58 AM' },
  { id: 'TX-2185', member: 'Kevin Otieno', amount: 2500, status: 'Failed' as TxStatus, kind: 'Contribution', time: '9:22 AM' },
] as const;

const money = (value: number) => `KSh ${value.toLocaleString('en-KE')}`;

export function TreasurerFinancialMonitorScreen() {
  const { activeMembership } = useAuth();
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState('Prototype snapshot');

  const visible = useMemo(() => transactions.filter((item) => filter === 'All' || item.status === filter), [filter]);
  const confirmed = transactions.filter((item) => item.status === 'Confirmed').reduce((sum, item) => sum + item.amount, 0);
  const processing = transactions.filter((item) => item.status === 'Processing').reduce((sum, item) => sum + item.amount, 0);

  const refresh = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastChecked(`Refreshed locally at ${time}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>TREASURER WORKSPACE</Text><Text style={styles.title}>Financial Monitor</Text><Text style={styles.subtitle}>Monitor contribution states for {activeMembership?.chamaName ?? 'the active Chama'} without pretending to query or mutate live pooled funds.</Text></View><Button variant="secondary" onPress={refresh} leftIcon={<RefreshCcw color={colors.primary} size={16} />}>Refresh view</Button></View>

      <View style={styles.metrics}>
        <Card variant="outlined" style={styles.metric}><WalletCards color={colors.success} size={21} /><Text style={styles.metricValue}>{money(confirmed)}</Text><Text style={styles.metricLabel}>Confirmed sample</Text></Card>
        <Card variant="outlined" style={styles.metric}><Clock3 color={colors.warning} size={21} /><Text style={styles.metricValue}>{money(processing)}</Text><Text style={styles.metricLabel}>Processing sample</Text></Card>
        <Card variant="outlined" style={styles.metric}><TriangleAlert color={colors.danger} size={21} /><Text style={styles.metricValue}>{transactions.filter((item) => item.status === 'Failed').length}</Text><Text style={styles.metricLabel}>Failed items</Text></Card>
      </View>

      <View style={styles.snapshot}><Activity color={colors.primary} size={17} /><Text style={styles.snapshotText}>{lastChecked} · This screen does not calculate authoritative Chama balances.</Text></View>

      <View style={styles.tabs}>
        {(['All', 'Confirmed', 'Processing', 'Failed'] as Filter[]).map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}><Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value}</Text></Pressable>)}
      </View>

      <Card variant="outlined" style={styles.list}>
        {visible.map((item) => {
          const open = expanded === item.id;
          return (
            <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setExpanded(open ? null : item.id)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={styles.rowTop}><View style={styles.copy}><Text style={styles.txId}>{item.id}</Text><Text style={styles.meta}>{item.member} · {item.kind} · {item.time}</Text></View><View style={styles.amountWrap}><Text style={styles.amount}>{money(item.amount)}</Text><Badge variant={item.status === 'Confirmed' ? 'success' : item.status === 'Processing' ? 'warning' : 'danger'}>{item.status}</Badge></View></View>
              {open ? <View style={styles.detail}><CheckCircle2 color={colors.primary} size={17} /><Text style={styles.detailText}>Provider receipt validation, reversal, pooled-fund posting and reconciliation actions remain backend-authoritative. This row only demonstrates Treasurer monitoring UX.</Text></View> : null}
            </Pressable>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  amount: { color: colors.navy, fontSize: 14, fontWeight: '900' },
  amountWrap: { alignItems: 'flex-end', gap: 4 },
  copy: { flex: 1, gap: 3, minWidth: 200 },
  detail: { alignItems: 'flex-start', backgroundColor: colors.primaryLight, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, padding: spacing.md },
  detailText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  list: { overflow: 'hidden', padding: 0 },
  meta: { color: colors.textMuted, fontSize: 11 },
  metric: { flex: 1, gap: 5, minWidth: 180 },
  metricLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metricValue: { color: colors.navy, fontSize: 22, fontWeight: '900' },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  snapshot: { alignItems: 'center', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  snapshotText: { color: colors.primaryDark, flex: 1, fontSize: 11, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 10 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  tabs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
  txId: { color: colors.text, fontSize: 13, fontWeight: '900' },
});
