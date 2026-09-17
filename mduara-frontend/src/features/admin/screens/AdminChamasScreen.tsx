import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { Building2, ChevronRight, Search, UsersRound, WalletCards } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { publicChamas } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type ChamaAdminStatus = 'Active' | 'Recruiting' | 'Completed' | 'Closed';
type ChamaTab = 'all' | 'active' | 'recruiting' | 'completed' | 'closed';

interface AdminChamaRow {
  id: string;
  name: string;
  goal: string;
  type: string;
  members: number;
  pooledAmount: number;
  status: ChamaAdminStatus;
  location: string;
}

const aggregateCounts: Record<ChamaTab, number> = {
  all: 436,
  active: 318,
  recruiting: 118,
  completed: 24,
  closed: 16,
};

const seedRows: AdminChamaRow[] = [
  ...publicChamas.map((chama): AdminChamaRow => ({
    id: `chama-${chama.id}`,
    name: chama.name,
    goal: chama.goal,
    type: chama.type,
    members: chama.members,
    pooledAmount: chama.pooled,
    location: chama.location,
    status: chama.recruitmentStatus === 'Closed' ? 'Closed' : chama.recruitmentStatus === 'Open' ? 'Recruiting' : 'Active',
  })),
  { id: 'chama-completed-1', name: 'Campus Laptop Circle', goal: 'Completed laptop purchase cycle', type: 'Goal-Based', members: 14, pooledAmount: 1260000, status: 'Completed', location: 'Nyeri' },
  { id: 'chama-active-1', name: 'Biashara Growth Circle', goal: 'Working-capital savings', type: 'Investment', members: 31, pooledAmount: 2740000, status: 'Active', location: 'Nairobi' },
  { id: 'chama-closed-1', name: 'Mara December 2025', goal: 'Completed travel group', type: 'Goal-Based', members: 20, pooledAmount: 1980000, status: 'Closed', location: 'Nairobi' },
];

const tabs: Array<{ key: ChamaTab; label: string }> = [
  { key: 'all', label: 'All Chamas' },
  { key: 'active', label: 'Active' },
  { key: 'recruiting', label: 'Recruiting' },
  { key: 'completed', label: 'Completed' },
  { key: 'closed', label: 'Closed' },
];

const statusForTab: Partial<Record<ChamaTab, ChamaAdminStatus>> = {
  active: 'Active',
  recruiting: 'Recruiting',
  completed: 'Completed',
  closed: 'Closed',
};

function money(value: number) {
  if (value >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(1)}M`;
  return `KSh ${value.toLocaleString('en-KE')}`;
}

export function AdminChamasScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 820;
  const [activeTab, setActiveTab] = useState<ChamaTab>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const rows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const status = statusForTab[activeTab];

    return seedRows.filter((row) => {
      const statusMatch = !status || row.status === status;
      const searchMatch = !normalizedQuery || `${row.name} ${row.goal} ${row.type} ${row.location} ${row.status}`.toLowerCase().includes(normalizedQuery);
      return statusMatch && searchMatch;
    });
  }, [activeTab, query]);

  const selected = seedRows.find((row) => row.id === selectedId) ?? null;

  const exportCurrentView = () => {
    if (Platform.OS !== 'web' || !rows.length) return;
    const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const header = ['Name', 'Goal', 'Type', 'Members', 'Pooled Amount', 'Status', 'Location'];
    const csv = [
      header.map(escape).join(','),
      ...rows.map((row) => [row.name, row.goal, row.type, row.members, row.pooledAmount, row.status, row.location].map(escape).join(',')),
    ].join('\n');

    const BlobCtor = (globalThis as any).Blob;
    const URLApi = (globalThis as any).URL;
    const documentApi = (globalThis as any).document;
    if (!BlobCtor || !URLApi || !documentApi) return;

    const blob = new BlobCtor([csv], { type: 'text/csv;charset=utf-8' });
    const url = URLApi.createObjectURL(blob);
    const anchor = documentApi.createElement('a');
    anchor.href = url;
    anchor.download = `mduara-chamas-${activeTab}.csv`;
    documentApi.body.appendChild(anchor);
    anchor.click();
    documentApi.body.removeChild(anchor);
    URLApi.revokeObjectURL(url);
  };

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Chamas</Text>
          <Text style={styles.subtitle}>Manage all Chamas on the platform</Text>
        </View>
        <View style={styles.exportWrap}>
          <Button
            variant="secondary"
            disabled={Platform.OS !== 'web' || rows.length === 0}
            onPress={exportCurrentView}
            leftIcon={<Building2 color={colors.text} size={17} />}
          >
            {Platform.OS === 'web' ? 'Export current view' : 'Export on web'}
          </Button>
          {Platform.OS !== 'web' ? <Text style={styles.exportHint}>CSV export is available in the web app.</Text> : null}
        </View>
      </View>

      <View style={styles.tabs} accessibilityRole="tablist">
        {tabs.map((tab) => {
          const selectedTab = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: selectedTab }}
              onPress={() => setActiveTab(tab.key)}
              style={({ pressed }) => [styles.tab, selectedTab && styles.tabActive, pressed && styles.tabPressed]}
            >
              <Text style={[styles.tabLabel, selectedTab && styles.tabLabelActive]}>{tab.label}</Text>
              <Text style={[styles.tabCount, selectedTab && styles.tabCountActive]}>{aggregateCounts[tab.key]}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.toolbar, isCompact && styles.toolbarCompact]}>
        <View style={styles.searchBox}>
          <Search color={colors.textMuted} size={17} />
          <TextInput
            accessibilityLabel="Search Chamas"
            onChangeText={setQuery}
            placeholder="Search Chama, goal, type, location or status"
            placeholderTextColor={colors.textSubtle}
            style={styles.searchInput}
            value={query}
          />
        </View>
        <View style={styles.resultPill}><Text style={styles.resultPillText}>{rows.length} sample record{rows.length === 1 ? '' : 's'} in this prototype view</Text></View>
      </View>

      {rows.length ? (
        <View style={styles.list}>
          {!isCompact ? (
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.chamaColumn]}>Chama</Text>
              <Text style={styles.headerCell}>Status</Text>
              <Text style={styles.headerCell}>Members</Text>
              <Text style={styles.headerCell}>Pooled</Text>
              <Text style={[styles.headerCell, styles.actionColumn]}>Action</Text>
            </View>
          ) : null}

          {rows.map((row) => (
            <Pressable
              key={row.id}
              accessibilityRole="button"
              onPress={() => setSelectedId((current) => current === row.id ? null : row.id)}
              style={({ pressed, hovered }: any) => [styles.rowCard, hovered && styles.rowHover, pressed && styles.rowPressed]}
            >
              <View style={[styles.row, isCompact && styles.rowCompact]}>
                <View style={styles.chamaColumn}>
                  <View style={styles.chamaNameRow}>
                    <View style={styles.iconBox}><Building2 color={colors.primary} size={18} /></View>
                    <View style={styles.nameCopy}>
                      <Text style={styles.chamaName}>{row.name}</Text>
                      <Text style={styles.meta}>{row.goal} · {row.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.cell}><StatusBadge status={row.status} /></View>
                <View style={styles.cell}><View style={styles.inlineStat}><UsersRound color={colors.textMuted} size={15} /><Text style={styles.cellStrong}>{row.members}</Text></View></View>
                <View style={styles.cell}><View style={styles.inlineStat}><WalletCards color={colors.textMuted} size={15} /><Text style={styles.cellStrong}>{money(row.pooledAmount)}</Text></View></View>
                <View style={styles.actionColumn}><ChevronRight color={selectedId === row.id ? colors.primary : colors.textSubtle} size={18} /></View>
              </View>

              {selectedId === row.id ? (
                <View style={styles.expanded}>
                  <View style={styles.expandedGrid}>
                    <Detail label="Type" value={row.type} />
                    <Detail label="Location" value={row.location} />
                    <Detail label="Members" value={String(row.members)} />
                    <Detail label="Pooled value" value={money(row.pooledAmount)} />
                  </View>
                  <Text style={styles.expandedNote}>This is mock platform-admin data. Production actions such as suspend, close, export or inspect financial records will be wired only to authorised backend endpoints.</Text>
                </View>
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : (
        <View style={styles.empty}>
          <Search color={colors.primary} size={26} />
          <Text style={styles.emptyTitle}>No Chamas match this view</Text>
          <Text style={styles.emptyText}>Change the tab or clear the search query. The tabs are real filters; they are no longer decorative labels.</Text>
          {query ? <Button variant="secondary" onPress={() => setQuery('')}>Clear search</Button> : null}
        </View>
      )}

      {selected ? <Text style={styles.selectionHint}>Selected: {selected.name}</Text> : null}
    </ScrollView>
  );
}

function StatusBadge({ status }: { status: ChamaAdminStatus }) {
  const variant = status === 'Active' ? 'success' : status === 'Recruiting' ? 'brand' : status === 'Completed' ? 'info' : 'neutral';
  return <Badge variant={variant}>{status}</Badge>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

const styles = StyleSheet.create({
  page: { backgroundColor: colors.background, flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 90 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  exportWrap: { alignItems: 'flex-end', gap: 4 },
  exportHint: { color: colors.textSubtle, fontSize: 9 },
  title: { color: colors.navy, fontSize: 30, fontWeight: typography.weights.extrabold, letterSpacing: -0.5 },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, marginTop: 4 },
  tabs: { borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 24, marginTop: spacing.xl },
  tab: { alignItems: 'center', borderBottomColor: 'transparent', borderBottomWidth: 2, flexDirection: 'row', gap: 7, marginBottom: -1, paddingBottom: 12, paddingHorizontal: 2 },
  tabActive: { borderBottomColor: colors.primary },
  tabPressed: { opacity: .72 },
  tabLabel: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold },
  tabLabelActive: { color: colors.primary },
  tabCount: { color: colors.textSubtle, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold },
  tabCountActive: { color: colors.primary },
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', marginTop: spacing.lg },
  toolbarCompact: { alignItems: 'stretch', flexDirection: 'column' },
  searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.sm, maxWidth: 560, minHeight: 44, paddingHorizontal: spacing.md },
  searchInput: { color: colors.text, flex: 1, fontSize: typography.sizes.body, outlineStyle: 'none' as any },
  resultPill: { backgroundColor: colors.surfaceMuted, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: 9 },
  resultPillText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  list: { gap: 0, marginTop: spacing.lg },
  tableHeader: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  headerCell: { color: colors.textSubtle, flex: 1, fontSize: 10, fontWeight: typography.weights.bold, letterSpacing: .8, textTransform: 'uppercase' },
  chamaColumn: { flex: 2.4 },
  actionColumn: { alignItems: 'flex-end', flex: .3 },
  rowCard: { backgroundColor: colors.surface, borderColor: colors.border, borderTopWidth: 1 },
  rowHover: { backgroundColor: '#FCFBFF' },
  rowPressed: { opacity: .88 },
  row: { alignItems: 'center', flexDirection: 'row', gap: spacing.md, minHeight: 72, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  rowCompact: { alignItems: 'flex-start', flexDirection: 'column' },
  cell: { flex: 1 },
  chamaNameRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  iconBox: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 38, justifyContent: 'center', width: 38 },
  nameCopy: { flex: 1 },
  chamaName: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  meta: { color: colors.textMuted, fontSize: typography.sizes.caption, marginTop: 3 },
  inlineStat: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  cellStrong: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.semibold },
  expanded: { backgroundColor: colors.surfaceMuted, borderTopColor: colors.border, borderTopWidth: 1, gap: spacing.md, padding: spacing.lg },
  expandedGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  detail: { minWidth: 140 },
  detailLabel: { color: colors.textMuted, fontSize: typography.sizes.caption },
  detailValue: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold, marginTop: 3 },
  expandedNote: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 18 },
  empty: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.xl, borderWidth: 1, gap: spacing.sm, marginTop: spacing.xl, padding: 42 },
  emptyTitle: { color: colors.text, fontSize: 19, fontWeight: typography.weights.bold },
  emptyText: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 21, maxWidth: 560, textAlign: 'center' },
  selectionHint: { color: colors.textSubtle, fontSize: typography.sizes.caption, marginTop: spacing.md },
});
