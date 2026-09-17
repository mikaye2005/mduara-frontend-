import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { CheckCircle2, Link2, Search, Smartphone } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type MatchState = 'Matched' | 'Unmatched' | 'Pending callback';
type Filter = 'All' | MatchState;
const filters: Filter[] = ['All', 'Matched', 'Unmatched', 'Pending callback'];

const rows = [
  { id: 'TX-9041', member: 'Aisha Kamau', amount: 5000, receipt: 'QJK7N21M4P', date: '17 Sep 2026', state: 'Matched' as MatchState },
  { id: 'TX-9040', member: 'Brian Maina', amount: 5000, receipt: 'QJK7M88A2L', date: '17 Sep 2026', state: 'Matched' as MatchState },
  { id: 'TX-9038', member: 'Mary Wanjiku', amount: 5000, receipt: 'QJK7K42P9D', date: '17 Sep 2026', state: 'Unmatched' as MatchState },
  { id: 'TX-9037', member: 'Kevin Otieno', amount: 5000, receipt: 'Awaiting provider ref', date: '17 Sep 2026', state: 'Pending callback' as MatchState },
] as const;

const money = (value: number) => `KSh ${value.toLocaleString('en-KE')}`;

export function TreasurerReconciliationScreen({ query, user }: { query: string; user: VerifiedTokenPayload }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [filter, setFilter] = useState<Filter>('All');
  const [search, setSearch] = useState(query);
  const [expanded, setExpanded] = useState<string | null>(null);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => (filter === 'All' || row.state === filter) && (!q || `${row.member} ${row.receipt} ${row.id}`.toLowerCase().includes(q)));
  }, [filter, search]);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.eyebrow}>TREASURER WORKSPACE</Text><Text style={styles.title}>Contribution Reconciliation</Text><Text style={styles.subtitle}>Match contribution records to provider receipts for {user.chamaName}. Member amounts are shown here because this is an authorised Treasurer workspace.</Text></View>
        <Badge variant="warning">Treasury operations</Badge>
      </View>

      <View style={styles.metrics}>
        <Card variant="outlined" style={styles.metric}><Text style={styles.metricValue}>{money(15000)}</Text><Text style={styles.metricLabel}>Matched in sample</Text></Card>
        <Card variant="outlined" style={styles.metric}><Text style={styles.metricValue}>1</Text><Text style={styles.metricLabel}>Unmatched transaction</Text></Card>
        <Card variant="outlined" style={styles.metric}><Text style={styles.metricValue}>1</Text><Text style={styles.metricLabel}>Pending callback</Text></Card>
      </View>

      <View style={styles.tabs}>{filters.map((value) => <Pressable key={value} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}><Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value}</Text></Pressable>)}</View>
      <View style={styles.searchBox}><Search color={colors.textMuted} size={18} /><TextInput value={search} onChangeText={setSearch} placeholder="Search member or receipt" placeholderTextColor={colors.textMuted} style={styles.searchInput} /></View>

      <Card variant="outlined" style={styles.listCard}>
        {visible.map((row) => {
          const open = expanded === row.id;
          return <Pressable key={row.id} onPress={() => setExpanded(open ? null : row.id)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
            <View style={[styles.rowTop, compact && styles.rowTopCompact]}>
              <View style={styles.identity}><View style={styles.icon}><Smartphone color={colors.primary} size={17} /></View><View><Text style={styles.member}>{row.member}</Text><Text style={styles.meta}>{row.id} · {row.receipt} · {row.date}</Text></View></View>
              <View style={styles.right}><Text style={styles.amount}>{money(row.amount)}</Text><Badge variant={row.state === 'Matched' ? 'success' : row.state === 'Unmatched' ? 'danger' : 'warning'}>{row.state}</Badge></View>
            </View>
            {open ? <View style={styles.detail}>{row.state === 'Matched' ? <CheckCircle2 color={colors.success} size={18} /> : <Link2 color={colors.primary} size={18} />}<Text style={styles.detailText}>{row.state === 'Matched' ? 'This sample transaction already has a provider receipt mapped to the member contribution.' : 'Candidate matching is visible, but the frontend will not mutate reconciliation state until the backend match action is connected and audited.'}</Text></View> : null}
          </Pressable>;
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 }, header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' }, titleWrap: { gap: 4, maxWidth: 780 }, eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, title: { color: colors.navy, fontSize: 30, fontWeight: '900' }, subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, metric: { flexGrow: 1, minWidth: 190, gap: 4 }, metricValue: { color: colors.navy, fontSize: 22, fontWeight: '900' }, metricLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700' }, tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg }, tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 12 }, tabActive: { borderBottomColor: colors.primary }, tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' }, tabTextActive: { color: colors.primary }, searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, maxWidth: 520, paddingHorizontal: spacing.md }, searchInput: { color: colors.text, flex: 1, minHeight: 44, outlineStyle: 'none' } as any, listCard: { overflow: 'hidden', padding: 0 }, row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg }, rowPressed: { backgroundColor: colors.surfaceMuted }, rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' }, rowTopCompact: { alignItems: 'flex-start', flexDirection: 'column' }, identity: { alignItems: 'center', flexDirection: 'row', gap: spacing.md }, icon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 16, height: 34, justifyContent: 'center', width: 34 }, member: { color: colors.text, fontSize: 13, fontWeight: '900' }, meta: { color: colors.textMuted, fontSize: 11, marginTop: 2 }, right: { alignItems: 'flex-end', gap: 4 }, amount: { color: colors.navy, fontSize: 14, fontWeight: '900' }, detail: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, padding: spacing.md }, detailText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
});
