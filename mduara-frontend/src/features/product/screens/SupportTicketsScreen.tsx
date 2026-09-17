import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { CheckCircle2, Headphones, MessageSquarePlus, Search } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import type { VerifiedTokenPayload } from '../../../shared/mockData';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type TicketStatus = 'Open' | 'Resolved';
type TicketFilter = 'All' | TicketStatus;

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  updated: string;
  detail: string;
}

const seedTickets: Ticket[] = [
  { id: 'TKT-1042', subject: 'Contribution receipt clarification', category: 'Payments', status: 'Open', updated: '17 Sep 2026', detail: 'Member requested clarification on how a contribution receipt will appear after provider confirmation.' },
  { id: 'TKT-1038', subject: 'Update meeting location', category: 'Chama administration', status: 'Resolved', updated: '15 Sep 2026', detail: 'Meeting-location guidance was provided and the ticket was resolved.' },
];

export function SupportTicketsScreen({ user }: { user: VerifiedTokenPayload }) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [tickets, setTickets] = useState<Ticket[]>(seedTickets);
  const [filter, setFilter] = useState<TicketFilter>('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(seedTickets[0].id);
  const [creating, setCreating] = useState(false);
  const [category, setCategory] = useState('General');
  const [subject, setSubject] = useState('');
  const [detail, setDetail] = useState('');
  const [note, setNote] = useState<string | null>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((ticket) =>
      (filter === 'All' || ticket.status === filter) &&
      (!q || `${ticket.id} ${ticket.subject} ${ticket.category}`.toLowerCase().includes(q)),
    );
  }, [filter, query, tickets]);

  const selectedTicket = tickets.find((ticket) => ticket.id === selected) ?? null;
  const canSubmit = subject.trim().length >= 5 && detail.trim().length >= 12;

  const submitPrototypeTicket = () => {
    if (!canSubmit) return;
    const ticket: Ticket = {
      id: `PROTO-TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      subject: subject.trim(),
      category: category.trim() || 'General',
      status: 'Open',
      updated: 'Prototype now',
      detail: detail.trim(),
    };
    setTickets((current) => [ticket, ...current]);
    setSelected(ticket.id);
    setSubject('');
    setDetail('');
    setCategory('General');
    setCreating(false);
    setNote('Ticket added to this frontend session. Production submission requires the support API.');
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.eyebrow}>SUPPORT</Text>
          <Text style={styles.title}>Support Tickets</Text>
          <Text style={styles.subtitle}>Track questions and issues for {user.fullName}. Prototype actions remain local until the support API is connected.</Text>
        </View>
        <Button onPress={() => { setCreating((value) => !value); setNote(null); }} leftIcon={<MessageSquarePlus color={colors.white} size={16} />}>
          {creating ? 'Close form' : 'New ticket'}
        </Button>
      </View>

      {creating ? (
        <Card variant="outlined" style={styles.formCard}>
          <Text style={styles.cardTitle}>Create a support ticket</Text>
          <View style={[styles.formGrid, compact && styles.formGridCompact]}>
            <Input label="Category" value={category} onChangeText={setCategory} placeholder="Payments, Account, Chama..." />
            <Input label="Subject" value={subject} onChangeText={setSubject} placeholder="Brief issue summary" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Details</Text>
            <TextInput
              accessibilityLabel="Support ticket details"
              multiline
              onChangeText={setDetail}
              placeholder="Describe what happened and what you need help with"
              placeholderTextColor={colors.textMuted}
              style={styles.textarea}
              value={detail}
            />
          </View>
          <Button disabled={!canSubmit} onPress={submitPrototypeTicket}>Save prototype ticket</Button>
        </Card>
      ) : null}

      {note ? <View style={styles.note}><CheckCircle2 color={colors.success} size={17} /><Text style={styles.noteText}>{note}</Text></View> : null}

      <View style={styles.controls}>
        <View style={styles.tabs}>
          {(['All', 'Open', 'Resolved'] as TicketFilter[]).map((value) => (
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
        <View style={styles.searchBox}>
          <Search color={colors.textMuted} size={17} />
          <TextInput accessibilityLabel="Search support tickets" value={query} onChangeText={setQuery} placeholder="Search tickets" placeholderTextColor={colors.textMuted} style={styles.searchInput} />
        </View>
      </View>

      <View style={[styles.layout, compact && styles.layoutCompact]}>
        <Card variant="outlined" style={styles.listCard}>
          {visible.length ? visible.map((ticket) => (
            <Pressable
              key={ticket.id}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === ticket.id }}
              onPress={() => setSelected(ticket.id)}
              style={[styles.ticketRow, selected === ticket.id && styles.ticketRowActive]}
            >
              <View style={styles.rowTop}>
                <Text style={styles.ticketSubject}>{ticket.subject}</Text>
                <Badge variant={ticket.status === 'Open' ? 'warning' : 'success'}>{ticket.status}</Badge>
              </View>
              <Text style={styles.meta}>{ticket.id} · {ticket.category} · {ticket.updated}</Text>
            </Pressable>
          )) : <View style={styles.empty}><Text style={styles.emptyTitle}>No tickets match this view</Text><Text style={styles.meta}>Change the filter or search term.</Text></View>}
        </Card>

        <Card variant="outlined" style={styles.detailCard}>
          {selectedTicket ? (
            <>
              <View style={styles.detailIcon}><Headphones color={colors.primary} size={20} /></View>
              <Text style={styles.cardTitle}>{selectedTicket.subject}</Text>
              <Text style={styles.meta}>{selectedTicket.id} · {selectedTicket.category}</Text>
              <Text style={styles.detailText}>{selectedTicket.detail}</Text>
              <View style={styles.boundary}>
                <Text style={styles.boundaryTitle}>Prototype boundary</Text>
                <Text style={styles.boundaryText}>Status updates shown here are frontend-only. Real support replies, assignment, SLA timestamps and resolution must come from the backend.</Text>
              </View>
            </>
          ) : <Text style={styles.meta}>Select a ticket to view its details.</Text>}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boundary: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, gap: 4, marginTop: spacing.sm, padding: spacing.md },
  boundaryText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  boundaryTitle: { color: colors.primaryDark, fontSize: 11, fontWeight: '900' },
  cardTitle: { color: colors.navy, fontSize: 17, fontWeight: '900' },
  controls: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  detailCard: { flex: 1.3, gap: spacing.sm, minWidth: 280 },
  detailIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 42, justifyContent: 'center', width: 42 },
  detailText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  empty: { alignItems: 'center', gap: 4, padding: spacing.xl },
  emptyTitle: { color: colors.text, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  field: { gap: 6 },
  formCard: { gap: spacing.md },
  formGrid: { flexDirection: 'row', gap: spacing.md },
  formGridCompact: { flexDirection: 'column' },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  label: { color: colors.text, fontSize: 12, fontWeight: '800' },
  layout: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  layoutCompact: { flexDirection: 'column' },
  listCard: { flex: 1, minWidth: 280, overflow: 'hidden', padding: 0 },
  meta: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  note: { alignItems: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  noteText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  searchBox: { alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, minWidth: 240, paddingHorizontal: spacing.md },
  searchInput: { color: colors.text, flex: 1, minHeight: 42, outlineStyle: 'none' } as any,
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  tab: { borderBottomColor: 'transparent', borderBottomWidth: 2, paddingHorizontal: 4, paddingVertical: 10 },
  tabActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 12, fontWeight: '800' },
  tabTextActive: { color: colors.primary },
  tabs: { flexDirection: 'row', gap: spacing.lg },
  textarea: { borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, color: colors.text, minHeight: 120, outlineStyle: 'none', padding: spacing.md, textAlignVertical: 'top' } as any,
  ticketRow: { borderBottomColor: colors.border, borderBottomWidth: 1, gap: 4, padding: spacing.md },
  ticketRowActive: { backgroundColor: colors.primaryLight },
  ticketSubject: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '900' },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
});
