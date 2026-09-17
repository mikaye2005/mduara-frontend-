import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Search, UserRoundCheck, Users } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type UserStatus = 'Active' | 'Pending' | 'Suspended';
type UserFilter = 'All' | UserStatus;

const rows = [
  { id: 'USR-1048', name: 'Aisha Kamau', phone: '+254 730 200 300', chamas: 4, status: 'Active' as UserStatus, context: 'Secretary in Summertides ’27' },
  { id: 'USR-1049', name: 'Peter Ouma', phone: '+254 740 300 400', chamas: 2, status: 'Active' as UserStatus, context: 'Treasurer in Future Home' },
  { id: 'USR-1050', name: 'Mary Wanjiku', phone: '+254 712 345 678', chamas: 1, status: 'Pending' as UserStatus, context: 'Awaiting phone verification' },
  { id: 'USR-1051', name: 'Kevin Mwangi', phone: '+254 722 190 180', chamas: 1, status: 'Suspended' as UserStatus, context: 'Account review required' },
] as const;

const filters: UserFilter[] = ['All', 'Active', 'Pending', 'Suspended'];

export function AdminUsersScreen({ query = '' }: { query?: string }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [filter, setFilter] = useState<UserFilter>('All');
  const [localQuery, setLocalQuery] = useState(query);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = useMemo(() => Object.fromEntries(filters.map((value) => [value, value === 'All' ? rows.length : rows.filter((row) => row.status === value).length])), []);
  const filtered = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    return rows.filter((row) => (filter === 'All' || row.status === filter) && (!q || `${row.id} ${row.name} ${row.phone} ${row.context}`.toLowerCase().includes(q)));
  }, [filter, localQuery]);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Users</Text>
          <Text style={styles.subtitle}>Review platform identities and account state without exposing a role picker.</Text>
        </View>
        <Badge variant="brand">Prototype records</Badge>
      </View>

      <View style={styles.tabs}>
        {filters.map((value) => (
          <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}>
            <Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value} {counts[value]}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.searchBox}>
        <Search color={colors.textMuted} size={18} />
        <TextInput accessibilityLabel="Search platform users" value={localQuery} onChangeText={setLocalQuery} placeholder="Search name, phone or user ID" placeholderTextColor={colors.textMuted} style={styles.searchInput} />
      </View>

      <Card variant="outlined" style={styles.listCard}>
        {filtered.length ? filtered.map((row) => {
          const expanded = expandedId === row.id;
          return (
            <Pressable key={row.id} accessibilityRole="button" accessibilityState={{ expanded }} onPress={() => setExpandedId(expanded ? null : row.id)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={[styles.rowTop, compact && styles.rowTopCompact]}>
                <View style={styles.identity}>
                  <View style={styles.avatar}><Users color={colors.primary} size={18} /></View>
                  <View style={styles.identityText}>
                    <Text style={styles.name}>{row.name}</Text>
                    <Text style={styles.meta}>{row.id} · {row.phone}</Text>
                  </View>
                </View>
                <View style={styles.rightMeta}>
                  <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Pending' ? 'warning' : 'danger'}>{row.status}</Badge>
                  <Text style={styles.chamaCount}>{row.chamas} Chama{row.chamas === 1 ? '' : 's'}</Text>
                </View>
              </View>
              {expanded ? (
                <View style={styles.expanded}>
                  <UserRoundCheck color={colors.primary} size={18} />
                  <View style={styles.expandedCopy}>
                    <Text style={styles.expandedTitle}>Current context</Text>
                    <Text style={styles.expandedText}>{row.context}</Text>
                    <Text style={styles.expandedNote}>Administrative status changes are intentionally not simulated until backend authorization and audit actions are connected.</Text>
                  </View>
                </View>
              ) : null}
            </Pressable>
          );
        }) : (
          <View style={styles.empty}><Text style={styles.emptyTitle}>No users match this view</Text><Text style={styles.emptyText}>Change the filter or search term.</Text></View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  titleWrap: { gap: 4, maxWidth: 720 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingHorizontal: 4, paddingVertical: 12 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, maxWidth: 520, paddingHorizontal: spacing.md },
  searchInput: { color: colors.text, flex: 1, minHeight: 44, outlineStyle: 'none' } as any,
  listCard: { padding: 0, overflow: 'hidden' },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  rowTopCompact: { alignItems: 'flex-start', flexDirection: 'column' },
  identity: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: spacing.md },
  avatar: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  identityText: { flex: 1, gap: 2 },
  name: { color: colors.text, fontSize: 14, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 12 },
  rightMeta: { alignItems: 'flex-end', gap: 5 },
  chamaCount: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  expanded: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, marginTop: spacing.md, padding: spacing.md },
  expandedCopy: { flex: 1, gap: 4 },
  expandedTitle: { color: colors.primaryDark, fontSize: 12, fontWeight: '900' },
  expandedText: { color: colors.text, fontSize: 13, fontWeight: '700' },
  expandedNote: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  empty: { alignItems: 'center', gap: 4, padding: spacing.xxl },
  emptyTitle: { color: colors.text, fontWeight: '900' },
  emptyText: { color: colors.textMuted, fontSize: 12 },
});
