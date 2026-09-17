import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Activity, CheckCircle2, Clock3, RefreshCcw, Webhook } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type HealthState = 'Operational' | 'Degraded';
const initialServices = [
  { name: 'Frontend gateway', detail: 'Static app and API client boundary', state: 'Operational' as HealthState, latency: '42 ms' },
  { name: 'Authentication API', detail: 'Login, OTP and session endpoints', state: 'Operational' as HealthState, latency: '84 ms' },
  { name: 'M-Pesa webhooks', detail: 'Callback ingestion and processing', state: 'Operational' as HealthState, latency: '126 ms' },
  { name: 'Background jobs', detail: 'Reminders and scheduled workflow jobs', state: 'Degraded' as HealthState, latency: '2 delayed' },
] as const;

export function AdminSystemHealthScreen() {
  const [lastChecked, setLastChecked] = useState('Prototype snapshot');
  const [selected, setSelected] = useState<string | null>(null);

  const refresh = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLastChecked(`Refreshed locally at ${time}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.titleWrap}><Text style={styles.title}>System Health</Text><Text style={styles.subtitle}>A read-only operational view. Refresh updates the local prototype timestamp only; it does not claim to ping production services.</Text></View>
        <Button variant="secondary" onPress={refresh} leftIcon={<RefreshCcw color={colors.primary} size={16} />}>Refresh view</Button>
      </View>

      <Card variant="outlined" style={styles.summary}>
        <View style={styles.summaryIcon}><Activity color={colors.success} size={24} /></View>
        <View style={styles.summaryCopy}><Text style={styles.summaryTitle}>Platform mostly operational</Text><Text style={styles.summaryText}>{lastChecked}</Text></View>
        <Badge variant="warning">1 degraded service</Badge>
      </Card>

      <View style={styles.serviceList}>
        {initialServices.map((service) => {
          const open = selected === service.name;
          return (
            <Pressable key={service.name} accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setSelected(open ? null : service.name)}>
              <Card variant="outlined" style={styles.serviceCard}>
                <View style={styles.serviceTop}>
                  <View style={styles.serviceIdentity}>
                    <View style={[styles.serviceIcon, service.state === 'Degraded' && styles.serviceIconWarning]}>{service.name.includes('webhook') ? <Webhook color={colors.primary} size={19} /> : service.state === 'Operational' ? <CheckCircle2 color={colors.success} size={19} /> : <Clock3 color={colors.warning} size={19} />}</View>
                    <View style={styles.serviceCopy}><Text style={styles.serviceName}>{service.name}</Text><Text style={styles.serviceDetail}>{service.detail}</Text></View>
                  </View>
                  <View style={styles.serviceMeta}><Badge variant={service.state === 'Operational' ? 'success' : 'warning'}>{service.state}</Badge><Text style={styles.latency}>{service.latency}</Text></View>
                </View>
                {open ? <View style={styles.expanded}><Text style={styles.expandedText}>This prototype exposes status detail only. Restart, retry, queue mutation and webhook replay controls are intentionally omitted until backend operations can enforce authorization, idempotency and audit logging.</Text></View> : null}
              </Card>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  titleWrap: { gap: 4, maxWidth: 760 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  summary: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  summaryIcon: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 20, height: 48, justifyContent: 'center', width: 48 },
  summaryCopy: { flex: 1, gap: 3, minWidth: 220 },
  summaryTitle: { color: colors.text, fontSize: 16, fontWeight: '900' },
  summaryText: { color: colors.textMuted, fontSize: 12 },
  serviceList: { gap: spacing.md },
  serviceCard: { gap: spacing.md },
  serviceTop: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  serviceIdentity: { alignItems: 'center', flexDirection: 'row', flex: 1, gap: spacing.md, minWidth: 230 },
  serviceIcon: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 16, height: 38, justifyContent: 'center', width: 38 },
  serviceIconWarning: { backgroundColor: colors.warningSoft },
  serviceCopy: { flex: 1, gap: 2 },
  serviceName: { color: colors.text, fontSize: 14, fontWeight: '900' },
  serviceDetail: { color: colors.textMuted, fontSize: 12 },
  serviceMeta: { alignItems: 'flex-end', gap: 4 },
  latency: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  expanded: { backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, padding: spacing.md },
  expandedText: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
});
