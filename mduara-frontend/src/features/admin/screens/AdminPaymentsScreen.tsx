import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CircleDollarSign, Clock3, Smartphone, TriangleAlert } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type PaymentStatus = 'Confirmed' | 'Processing' | 'Failed';
type PaymentFilter = 'All' | PaymentStatus;
const filters: PaymentFilter[] = ['All', 'Confirmed', 'Processing', 'Failed'];

const payments = [
  { ref: 'MDP-240918-1042', user: 'Aisha Kamau', chama: "Summertides '27", amount: 5000, type: 'Contribution', status: 'Confirmed' as PaymentStatus, time: '10:42 AM' },
  { ref: 'MDP-240918-1041', user: 'Peter Ouma', chama: 'Future Home', amount: 500, type: 'Commitment', status: 'Processing' as PaymentStatus, time: '10:31 AM' },
  { ref: 'MDP-240918-1039', user: 'Mary Wanjiku', chama: 'Washing Machine Mbogi', amount: 2500, type: 'Contribution', status: 'Failed' as PaymentStatus, time: '9:58 AM' },
  { ref: 'MDP-240918-1036', user: 'Justus Mwangi', chama: 'Umoja Land Investment', amount: 10000, type: 'Contribution', status: 'Confirmed' as PaymentStatus, time: '9:14 AM' },
] as const;

const money = (value: number) => `KSh ${value.toLocaleString('en-KE')}`;

export function AdminPaymentsScreen() {
  const [filter, setFilter] = useState<PaymentFilter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = useMemo(() => payments.filter((item) => filter === 'All' || item.status === filter), [filter]);
  const confirmedTotal = payments.filter((item) => item.status === 'Confirmed').reduce((sum, item) => sum + item.amount, 0);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.title}>Payments</Text><Text style={styles.subtitle}>Observe prototype transaction states without pretending to execute or reverse real money movements.</Text></View>
        <Badge variant="brand">M-Pesa-ready UI</Badge>
      </View>

      <View style={styles.metrics}>
        <Card variant="outlined" style={styles.metric}><CircleDollarSign color={colors.success} size={21} /><Text style={styles.metricValue}>{money(confirmedTotal)}</Text><Text style={styles.metricLabel}>Confirmed in sample</Text></Card>
        <Card variant="outlined" style={styles.metric}><Clock3 color={colors.warning} size={21} /><Text style={styles.metricValue}>{payments.filter((p) => p.status === 'Processing').length}</Text><Text style={styles.metricLabel}>Processing</Text></Card>
        <Card variant="outlined" style={styles.metric}><TriangleAlert color={colors.danger} size={21} /><Text style={styles.metricValue}>{payments.filter((p) => p.status === 'Failed').length}</Text><Text style={styles.metricLabel}>Failed</Text></Card>
      </View>

      <View style={styles.tabs}>
        {filters.map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}><Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value}</Text></Pressable>)}
      </View>

      <Card variant="outlined" style={styles.listCard}>
        {visible.map((item) => {
          const open = expanded === item.ref;
          return (
            <Pressable key={item.ref} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setExpanded(open ? null : item.ref)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={styles.rowTop}>
                <View style={styles.paymentCopy}><Text style={styles.ref}>{item.ref}</Text><Text style={styles.meta}>{item.user} · {item.chama} · {item.type}</Text></View>
                <View style={styles.amountWrap}><Text style={styles.amount}>{money(item.amount)}</Text><Badge variant={item.status === 'Confirmed' ? 'success' : item.status === 'Processing' ? 'warning' : 'danger'}>{item.status}</Badge></View>
              </View>
              {open ? <View style={styles.detail}><Smartphone color={colors.primary} size={18} /><View style={styles.detailText}><Text style={styles.detailTitle}>Prototype transaction detail</Text><Text style={styles.detailBody}>Recorded at {item.time}. Provider reference, receipt validation, reversal and reconciliation controls will remain read-only until connected to audited backend payment actions.</Text></View></View> : null}
            </Pressable>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  titleWrap: { gap: 4, maxWidth: 760 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { flexGrow: 1, minWidth: 180, gap: 5 },
  metricValue: { color: colors.navy, fontSize: 22, fontWeight: '900' },
  metricLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  listCard: { overflow: 'hidden', padding: 0 },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  paymentCopy: { flex: 1, gap: 3, minWidth: 210 },
  ref: { color: colors.text, fontSize: 14, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  amountWrap: { alignItems: 'flex-end', gap: 5 },
  amount: { color: colors.navy, fontSize: 15, fontWeight: '900' },
  detail: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, padding: spacing.md },
  detailText: { flex: 1, gap: 3 },
  detailTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '900' },
  detailBody: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
});
