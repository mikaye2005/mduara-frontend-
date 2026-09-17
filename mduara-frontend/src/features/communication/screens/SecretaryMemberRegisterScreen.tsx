import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { BadgeCheck, Search, Users } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type MemberStatus = 'Active' | 'Pending' | 'Suspended';
type MemberFilter = 'All' | MemberStatus;
const filters: MemberFilter[] = ['All', 'Active', 'Pending', 'Suspended'];

const members = [
  { id: 'MEM-001', name: 'Aisha Kamau', role: 'Secretary', status: 'Active' as MemberStatus, joined: '08 Jan 2026', verified: true, activity: 'Minutes and member register up to date' },
  { id: 'MEM-002', name: 'Brian Maina', role: 'Member', status: 'Active' as MemberStatus, joined: '12 Jan 2026', verified: true, activity: 'Contribution status: on track' },
  { id: 'MEM-003', name: 'Mercy Wanjiku', role: 'Member', status: 'Pending' as MemberStatus, joined: '16 Sep 2026', verified: true, activity: 'Application accepted; commitment pending' },
  { id: 'MEM-004', name: 'Kevin Otieno', role: 'Member', status: 'Suspended' as MemberStatus, joined: '03 Feb 2026', verified: true, activity: 'Membership status under Chama review' },
] as const;

export function SecretaryMemberRegisterScreen({ query = '' }: { query?: string }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [filter, setFilter] = useState<MemberFilter>('All');
  const [search, setSearch] = useState(query);
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((member) => (filter === 'All' || member.status === filter) && (!q || `${member.name} ${member.role} ${member.status}`.toLowerCase().includes(q)));
  }, [filter, search]);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>SECRETARY WORKSPACE</Text>
          <Text style={styles.title}>Member Register</Text>
          <Text style={styles.subtitle}>Maintain the Chama membership register without exposing another member's raw balances or private payment amounts.</Text>
        </View>
        <Badge variant="info">Privacy-safe register</Badge>
      </View>

      <View style={styles.tabs}>
        {filters.map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}><Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value} {value === 'All' ? members.length : members.filter((m) => m.status === value).length}</Text></Pressable>)}
      </View>

      <View style={styles.searchBox}><Search color={colors.textMuted} size={18} /><TextInput accessibilityLabel="Search member register" value={search} onChangeText={setSearch} placeholder="Search member, role or status" placeholderTextColor={colors.textMuted} style={styles.searchInput} /></View>

      <Card variant="outlined" style={styles.listCard}>
        {visible.length ? visible.map((member) => {
          const open = expanded === member.id;
          return (
            <Pressable key={member.id} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setExpanded(open ? null : member.id)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={[styles.rowTop, compact && styles.rowTopCompact]}>
                <View style={styles.identity}>
                  <View style={styles.avatar}><Users color={colors.primary} size={18} /></View>
                  <View style={styles.identityCopy}>
                    <View style={styles.nameRow}><Text style={styles.name}>{member.name}</Text>{member.verified ? <BadgeCheck color={colors.success} size={15} /> : null}</View>
                    <Text style={styles.meta}>{member.id} · Joined {member.joined}</Text>
                  </View>
                </View>
                <View style={styles.badges}><Badge variant={member.role === 'Secretary' ? 'info' : 'neutral'}>{member.role}</Badge><Badge variant={member.status === 'Active' ? 'success' : member.status === 'Pending' ? 'warning' : 'danger'}>{member.status}</Badge></View>
              </View>
              {open ? <View style={styles.detail}><Text style={styles.detailTitle}>Register activity</Text><Text style={styles.detailText}>{member.activity}</Text><Text style={styles.privacy}>Financial amounts are intentionally omitted from this shared register view.</Text></View> : null}
            </Pressable>
          );
        }) : <View style={styles.empty}><Text style={styles.emptyTitle}>No members match this view</Text><Text style={styles.emptyText}>Change the filter or search term.</Text></View>}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  titleWrap: { gap: 4, maxWidth: 760 },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, maxWidth: 520, paddingHorizontal: spacing.md },
  searchInput: { color: colors.text, flex: 1, minHeight: 44, outlineStyle: 'none' } as any,
  listCard: { overflow: 'hidden', padding: 0 },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  rowTopCompact: { alignItems: 'flex-start', flexDirection: 'column' },
  identity: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: spacing.md },
  avatar: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  identityCopy: { flex: 1, gap: 3 },
  nameRow: { alignItems: 'center', flexDirection: 'row', gap: 5 },
  name: { color: colors.text, fontSize: 14, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 11 },
  badges: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  detail: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, gap: 4, marginTop: spacing.md, padding: spacing.md },
  detailTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  detailText: { color: colors.textMuted, fontSize: 12 },
  privacy: { color: colors.primaryDark, fontSize: 11, fontWeight: '700', marginTop: 4 },
  empty: { alignItems: 'center', gap: 4, padding: spacing.xxl },
  emptyTitle: { color: colors.text, fontWeight: '900' },
  emptyText: { color: colors.textMuted, fontSize: 12 },
});
