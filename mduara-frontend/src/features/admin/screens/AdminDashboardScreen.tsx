import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Activity, Building2, CircleDollarSign, Headphones, ShieldCheck, Users } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

const metrics = [
  { label: 'Registered users', value: '12,486', note: '+3.8% this month', icon: Users },
  { label: 'Active Chamas', value: '318', note: '118 currently recruiting', icon: Building2 },
  { label: 'Payments today', value: 'KSh 4.82M', note: '1,146 confirmed transactions', icon: CircleDollarSign },
  { label: 'Open support tickets', value: '27', note: '8 marked high priority', icon: Headphones },
] as const;

const activity = [
  { title: 'Payment webhook processing', detail: 'All provider callbacks are within the prototype target window.', status: 'Healthy' },
  { title: 'Chama onboarding', detail: '14 Chamas entered recruitment in the last 24 hours.', status: 'Normal' },
  { title: 'Support queue', detail: '8 high-priority tickets require an operator review.', status: 'Attention' },
] as const;

export function AdminDashboardScreen() {
  const { width } = useWindowDimensions();
  const wide = width >= 1050;

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>PLATFORM ADMINISTRATION</Text>
          <Text style={styles.title}>Platform overview</Text>
          <Text style={styles.subtitle}>A high-level operational view of M-Duara. Prototype figures are clearly separated from live backend data.</Text>
        </View>
        <Badge variant="success">System operational</Badge>
      </View>

      <View style={[styles.metricGrid, wide && styles.metricGridWide]}>
        {metrics.map(({ icon: Icon, label, note, value }) => (
          <Card key={label} variant="outlined" style={[styles.metricCard, wide && styles.metricCardWide]}>
            <View style={styles.metricIcon}><Icon color={colors.primary} size={21} /></View>
            <Text style={styles.metricValue}>{value}</Text>
            <Text style={styles.metricLabel}>{label}</Text>
            <Text style={styles.metricNote}>{note}</Text>
          </Card>
        ))}
      </View>

      <View style={[styles.bodyGrid, wide && styles.bodyGridWide]}>
        <Card variant="outlined" style={[styles.panel, wide && styles.mainPanel]}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelTitle}>Operational pulse</Text>
              <Text style={styles.panelText}>Important platform signals for the current review window.</Text>
            </View>
            <Activity color={colors.primary} size={21} />
          </View>
          <View style={styles.activityList}>
            {activity.map((item) => (
              <View key={item.title} style={styles.activityRow}>
                <View style={styles.activityCopy}>
                  <Text style={styles.activityTitle}>{item.title}</Text>
                  <Text style={styles.activityDetail}>{item.detail}</Text>
                </View>
                <Badge variant={item.status === 'Attention' ? 'warning' : 'success'}>{item.status}</Badge>
              </View>
            ))}
          </View>
        </Card>

        <Card variant="outlined" style={[styles.panel, wide && styles.sidePanel]}>
          <View style={styles.securityIcon}><ShieldCheck color={colors.primary} size={24} /></View>
          <Text style={styles.panelTitle}>Admin boundary</Text>
          <Text style={styles.panelText}>Platform administration is separate from Chama membership. Super Admin access never grants automatic access to a member's private Chama financial details.</Text>
          <View style={styles.callout}>
            <Text style={styles.calloutText}>All values on this screen are prototype data until the respective backend endpoints are connected.</Text>
          </View>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.xl, padding: spacing.xl, paddingBottom: 110 },
  headingRow: { gap: spacing.md },
  headingCopy: { gap: 6, maxWidth: 760 },
  eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  metricGrid: { gap: spacing.md },
  metricGridWide: { flexDirection: 'row' },
  metricCard: { gap: 6 },
  metricCardWide: { flex: 1 },
  metricIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.md, height: 40, justifyContent: 'center', marginBottom: 4, width: 40 },
  metricValue: { color: colors.navy, fontSize: 25, fontWeight: '900' },
  metricLabel: { color: colors.text, fontSize: 14, fontWeight: '800' },
  metricNote: { color: colors.textMuted, fontSize: 12 },
  bodyGrid: { gap: spacing.md },
  bodyGridWide: { flexDirection: 'row', alignItems: 'flex-start' },
  panel: { gap: spacing.lg },
  mainPanel: { flex: 1.55 },
  sidePanel: { flex: 0.75 },
  panelHeader: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between' },
  panelTitle: { color: colors.navy, fontSize: 18, fontWeight: '900' },
  panelText: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 3 },
  activityList: { gap: spacing.sm },
  activityRow: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', padding: spacing.md },
  activityCopy: { flex: 1, gap: 3 },
  activityTitle: { color: colors.text, fontSize: 14, fontWeight: '800' },
  activityDetail: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  securityIcon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 52, justifyContent: 'center', width: 52 },
  callout: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, padding: spacing.md },
  calloutText: { color: colors.primaryDark, fontSize: 12, fontWeight: '700', lineHeight: 18 },
});
