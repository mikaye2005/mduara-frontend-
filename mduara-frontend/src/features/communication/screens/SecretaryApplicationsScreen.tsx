import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ClipboardCheck, FileText, ShieldCheck } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type ReviewStatus = 'Awaiting Review' | 'Reviewed' | 'Decision Recorded';
const applications = [
  { id: 'APP-301', name: 'Mary Wanjiku', goal: 'Travel fund', submitted: '17 Sep 2026', commitment: 'Pending', status: 'Awaiting Review' as ReviewStatus, note: 'Constitution acknowledgement complete.' },
  { id: 'APP-300', name: 'Eric Kamau', goal: 'Travel fund', submitted: '16 Sep 2026', commitment: 'Confirmed', status: 'Reviewed' as ReviewStatus, note: 'Secretary review complete; awaiting Chair decision.' },
  { id: 'APP-296', name: 'Faith Muthoni', goal: 'Travel fund', submitted: '14 Sep 2026', commitment: 'Confirmed', status: 'Decision Recorded' as ReviewStatus, note: 'Approved by Chair; onboarding confirmation queued.' },
] as const;

export function SecretaryApplicationsScreen() {
  const [selected, setSelected] = useState<string | null>(applications[0].id);
  const counts = useMemo(() => ({ pending: applications.filter((a) => a.status === 'Awaiting Review').length, reviewed: applications.filter((a) => a.status !== 'Awaiting Review').length }), []);
  const selectedApplication = applications.find((application) => application.id === selected) ?? applications[0];

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.eyebrow}>SECRETARY WORKSPACE</Text><Text style={styles.title}>Applications Review</Text><Text style={styles.subtitle}>Verify that applicant records and Constitution acknowledgements are complete. Final approval remains a Chair responsibility.</Text></View>
        <View style={styles.headerBadges}><Badge variant="warning">{counts.pending} awaiting review</Badge><Badge variant="success">{counts.reviewed} processed</Badge></View>
      </View>

      <View style={styles.layout}>
        <Card variant="outlined" style={styles.listCard}>
          {applications.map((application) => <Pressable key={application.id} accessibilityRole="button" accessibilityState={{ selected: selected === application.id }} onPress={() => setSelected(application.id)} style={[styles.listRow, selected === application.id && styles.listRowActive]}><View style={styles.listRowTop}><Text style={styles.applicant}>{application.name}</Text><Badge variant={application.status === 'Awaiting Review' ? 'warning' : application.status === 'Reviewed' ? 'info' : 'success'}>{application.status}</Badge></View><Text style={styles.meta}>{application.id} · {application.submitted}</Text></Pressable>)}
        </Card>

        <Card variant="outlined" style={styles.detailCard}>
          <View style={styles.detailHeader}><View style={styles.detailIcon}><FileText color={colors.primary} size={21} /></View><View style={styles.detailHeading}><Text style={styles.detailTitle}>{selectedApplication.name}</Text><Text style={styles.meta}>{selectedApplication.id}</Text></View></View>
          <View style={styles.factGrid}>
            <View style={styles.fact}><Text style={styles.factLabel}>Saving goal</Text><Text style={styles.factValue}>{selectedApplication.goal}</Text></View>
            <View style={styles.fact}><Text style={styles.factLabel}>Commitment</Text><Text style={styles.factValue}>{selectedApplication.commitment}</Text></View>
            <View style={styles.fact}><Text style={styles.factLabel}>Submitted</Text><Text style={styles.factValue}>{selectedApplication.submitted}</Text></View>
          </View>
          <View style={styles.check}><ShieldCheck color={colors.success} size={18} /><View style={styles.checkCopy}><Text style={styles.checkTitle}>Secretary review boundary</Text><Text style={styles.checkText}>{selectedApplication.note}</Text><Text style={styles.checkText}>The Secretary may verify completeness, but cannot grant Chair approval from this workspace.</Text></View></View>
          <View style={styles.readOnly}><ClipboardCheck color={colors.primary} size={18} /><Text style={styles.readOnlyText}>Backend review actions are not connected yet, so this prototype keeps decision-changing controls read-only instead of simulating an approval that would not be audited.</Text></View>
        </Card>
      </View>
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
  headerBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  layout: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, alignItems: 'flex-start' },
  listCard: { flexGrow: 1, minWidth: 280, maxWidth: 430, padding: 0, overflow: 'hidden' },
  listRow: { borderBottomColor: colors.border, borderBottomWidth: 1, gap: 3, padding: spacing.md },
  listRowActive: { backgroundColor: colors.primaryLight },
  listRowTop: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  applicant: { color: colors.text, fontSize: 13, fontWeight: '900' },
  meta: { color: colors.textMuted, fontSize: 11 },
  detailCard: { flexGrow: 2, minWidth: 300, gap: spacing.lg },
  detailHeader: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  detailIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 42, justifyContent: 'center', width: 42 },
  detailHeading: { gap: 2 },
  detailTitle: { color: colors.navy, fontSize: 18, fontWeight: '900' },
  factGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  fact: { backgroundColor: colors.surfaceMuted, borderRadius: radii.md, flexGrow: 1, gap: 3, minWidth: 140, padding: spacing.md },
  factLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '700' },
  factValue: { color: colors.text, fontSize: 13, fontWeight: '900' },
  check: { backgroundColor: colors.successSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  checkCopy: { flex: 1, gap: 4 },
  checkTitle: { color: colors.success, fontSize: 12, fontWeight: '900' },
  checkText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  readOnly: { borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, padding: spacing.md },
  readOnlyText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
});
