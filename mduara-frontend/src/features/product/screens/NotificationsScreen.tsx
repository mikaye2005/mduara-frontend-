import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bell, CheckCheck, Circle } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import type { NotificationItem } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type Filter = 'All' | 'Unread';

export function NotificationsScreen({ notifications }: { notifications: NotificationItem[] }) {
  const [items, setItems] = useState(() => notifications.map((item) => ({ ...item })));
  const [filter, setFilter] = useState<Filter>('All');
  const [expanded, setExpanded] = useState<string | null>(null);

  const visible = useMemo(() => items.filter((item) => filter === 'All' || !item.read), [filter, items]);
  const unread = items.filter((item) => !item.read).length;

  const openItem = (id: string) => {
    setExpanded((current) => current === id ? null : id);
    setItems((current) => current.map((item) => item.id === id ? { ...item, read: true } : item));
  };

  const markAllRead = () => setItems((current) => current.map((item) => ({ ...item, read: true })));

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.eyebrow}>INBOX</Text><Text style={styles.title}>Notifications</Text><Text style={styles.subtitle}>Review role-scoped updates in one place. Read state changes are local to this frontend session.</Text></View>
        <Button disabled={unread === 0} onPress={markAllRead} variant="secondary" leftIcon={<CheckCheck color={colors.primary} size={16} />}>Mark all read</Button>
      </View>

      <View style={styles.tabs}>
        {(['All', 'Unread'] as Filter[]).map((value) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: filter === value }} onPress={() => setFilter(value)} style={[styles.tab, filter === value && styles.tabActive]}><Text style={[styles.tabText, filter === value && styles.tabTextActive]}>{value}{value === 'Unread' ? ` (${unread})` : ''}</Text></Pressable>)}
      </View>

      <Card variant="outlined" style={styles.list}>
        {visible.length ? visible.map((item) => {
          const open = expanded === item.id;
          return (
            <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => openItem(item.id)} style={({ pressed }) => [styles.row, !item.read && styles.rowUnread, pressed && styles.rowPressed]}>
              <View style={styles.icon}>{item.read ? <Bell color={colors.textMuted} size={18} /> : <Circle color={colors.primary} fill={colors.primary} size={11} />}</View>
              <View style={styles.copy}><View style={styles.rowTop}><Text style={[styles.itemTitle, !item.read && styles.itemTitleUnread]}>{item.title}</Text>{!item.read ? <Badge variant="brand">New</Badge> : null}</View><Text style={styles.meta}>{item.timeLabel}</Text>{open ? <Text style={styles.description}>{item.description}</Text> : <Text numberOfLines={1} style={styles.description}>{item.description}</Text>}</View>
            </Pressable>
          );
        }) : <View style={styles.empty}><Bell color={colors.textMuted} size={24} /><Text style={styles.emptyTitle}>No notifications in this view</Text></View>}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  copy: { flex: 1, gap: 4 },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  empty: { alignItems: 'center', gap: spacing.sm, padding: spacing.xxl },
  emptyTitle: { color: colors.textMuted, fontWeight: '800' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  icon: { alignItems: 'center', height: 38, justifyContent: 'center', width: 38 },
  itemTitle: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '700' },
  itemTitleUnread: { color: colors.navy, fontWeight: '900' },
  list: { overflow: 'hidden', padding: 0 },
  meta: { color: colors.textMuted, fontSize: 10 },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  row: { alignItems: 'flex-start', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  rowPressed: { backgroundColor: colors.surfaceMuted },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  rowUnread: { backgroundColor: colors.primaryLight },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingVertical: 10 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  tabs: { flexDirection: 'row', gap: spacing.lg },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
});
