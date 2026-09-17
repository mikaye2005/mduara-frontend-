import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { CheckCircle2, ClipboardCheck, ShieldCheck, XCircle } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type Decision = 'Pending Chair Review' | 'Approved' | 'Declined';

interface ApplicationRow {
  id: string;
  name: string;
  goal: string;
  submitted: string;
  commitment: 'Confirmed' | 'Pending';
  secretaryReview: 'Complete' | 'Pending';
  decision: Decision;
}

const seed: ApplicationRow[] = [
  { id: 'APP-301', name: 'Mary Wanjiku', goal: 'Travel fund', submitted: '17 Sep 2026', commitment: 'Confirmed', secretaryReview: 'Complete', decision: 'Pending Chair Review' },
  { id: 'APP-300', name: 'Eric Kamau', goal: 'Travel fund', submitted: '16 Sep 2026', commitment: 'Pending', secretaryReview: 'Complete', decision: 'Pending Chair Review' },
  { id: 'APP-296', name: 'Faith Muthoni', goal: 'Travel fund', submitted: '14 Sep 2026', commitment: 'Confirmed', secretaryReview: 'Complete', decision: 'Approved' },
];

export function ChairApplicationsScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [applications, setApplications] = useState<ApplicationRow[]>(seed);
  const [selected, setSelected] = useState(seed[0].id);
  const [note, setNote] = useState<string | null>(null);

  const current = applications.find((item) => item.id === selected) ?? applications[0];
  const pendingCount = useMemo(() => applications.filter((item) => item.decision === 'Pending Chair Review').length, [applications]);
  const canApprove = current.decision === 'Pending Chair Review' && current.secretaryReview === 'Complete' && current.commitment === 'Confirmed';

  const decide = (decision: 'Approved' | 'Declined') => {
    setApplications((items) => items.map((item) => item.id === current.id ? { ...item, decision } : item));
    setNote(`${decision} recorded in this frontend prototype only. Production approval requires an audited backend action.`);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>CHAIR WORKSPACE</Text><Text style={styles.title}>Applications</Text><Text style={styles.subtitle}>Review Secretary-complete applications and demonstrate a Chair decision without bypassing production audit controls.</Text></View><Badge variant="warning">{pendingCount} pending</Badge></View>

      <View style={[styles.layout, compact && styles.layoutCompact]}>
        <Card variant="outlined" style={styles.listCard}>
          {applications.map((item) => (
            <Pressable key={item.id} accessibilityRole="button" accessibilityState={{ selected: selected === item.id }} onPress={() => { setSelected(item.id); setNote(null); }} style={[styles.row, selected === item.id && styles.rowActive]}>
              <View style={styles.rowTop}><Text style={styles.name}>{item.name}</Text><Badge variant={item.decision === 'Approved' ? 'success' : item.decision === 'Declined' ? 'danger' : 'warning'}>{item.decision}</Badge></View>
              <Text style={styles.meta}>{item.id} · {item.submitted}</Text>
            </Pressable>
          ))}
        </Card>

        <Card variant="outlined" style={styles.detailCard}>
          <View style={styles.detailHeader}><View style={styles.icon}><ClipboardCheck color={colors.primary} size={21} /></View><View><Text style={styles.detailTitle}>{current.name}</Text><Text style={styles.meta}>{current.id} · {current.goal}</Text></View></View>
          <View style={styles.facts}>
            <View style={styles.fact}><Text style={styles.factLabel}>Secretary review</Text><Text style={styles.factValue}>{current.secretaryReview}</Text></View>
            <View style={styles.fact}><Text style={styles.factLabel}>Commitment</Text><Text style={styles.factValue}>{current.commitment}</Text></View>
            <View style={styles.fact}><Text style={styles.factLabel}>Decision</Text><Text style={styles.factValue}>{current.decision}</Text></View>
          </View>

          {!canApprove && current.decision === 'Pending Chair Review' ? <View style={styles.warning}><ShieldCheck color={colors.warning} size={17} /><Text style={styles.warningText}>Approval is disabled until Secretary review and commitment are both confirmed. Decline remains available as a prototype decision.</Text></View> : null}

          <View style={styles.actions}>
            <Button disabled={!canApprove} onPress={() => decide('Approved')} leftIcon={<CheckCircle2 color={colors.white} size={16} />}>Approve prototype</Button>
            <Button disabled={current.decision !== 'Pending Chair Review'} onPress={() => decide('Declined')} variant="secondary" leftIcon={<XCircle color={colors.primary} size={16} />}>Decline prototype</Button>
          </View>

          {note ? <View style={styles.note}><Text style={styles.noteText}>{note}</Text></View> : null}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  detailCard: { flex: 1.4, gap: spacing.lg, minWidth: 300 },
  detailHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  detailTitle: { color: colors.navy, fontSize: 18, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  fact: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, flex: 1, gap: 3, minWidth: 130, padding: spacing.md },
  factLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800' },
  facts: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  factValue: { color: colors.text, fontSize: 13, fontWeight: '900' },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  icon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 42, justifyContent: 'center', width: 42 },
  layout: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md },
  layoutCompact: { flexDirection: 'column' },
  listCard: { flex: 0.8, minWidth: 280, overflow: 'hidden', padding: 0 },
  meta: { color: colors.textMuted, fontSize: 11 },
  name: { color: colors.text, flex: 1, fontSize: 13, fontWeight: '900' },
  note: { backgroundColor: colors.primaryLight, borderRadius: radii.md, padding: spacing.md },
  noteText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  row: { borderBottomColor: colors.border, borderBottomWidth: 1, gap: 4, padding: spacing.md },
  rowActive: { backgroundColor: colors.primaryLight },
  rowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
  warning: { alignItems: 'flex-start', backgroundColor: colors.warningSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  warningText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
});
