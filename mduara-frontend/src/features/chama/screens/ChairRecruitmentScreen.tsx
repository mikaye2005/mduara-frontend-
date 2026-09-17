import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Check, Minus, Plus, ShieldCheck, UserRoundPlus, Users } from 'lucide-react-native';

import { useAuth } from '../../../app/providers/AuthContext';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { publicChamas } from '../../../shared/prototype';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type RecruitmentState = 'Open' | 'Paused';

export function ChairRecruitmentScreen() {
  const { activeMembership } = useAuth();
  const source = useMemo(() => publicChamas.find((chama) => chama.id === activeMembership?.chamaId), [activeMembership?.chamaId]);
  const [state, setState] = useState<RecruitmentState>(source?.recruitmentStatus === 'Open' ? 'Open' : 'Paused');
  const [capacity, setCapacity] = useState(source?.capacity ?? 25);
  const [saved, setSaved] = useState(false);

  const members = source?.members ?? 0;
  const remaining = Math.max(0, capacity - members);

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>CHAIR WORKSPACE</Text><Text style={styles.title}>Recruitment</Text><Text style={styles.subtitle}>Control the frontend recruitment state for {activeMembership?.chamaName ?? 'the active Chama'} without changing production membership records.</Text></View><Badge variant={state === 'Open' ? 'success' : 'warning'}>{state}</Badge></View>

      <View style={styles.metrics}>
        <Card variant="outlined" style={styles.metric}><Users color={colors.primary} size={21} /><Text style={styles.metricValue}>{members}</Text><Text style={styles.metricLabel}>Current members</Text></Card>
        <Card variant="outlined" style={styles.metric}><UserRoundPlus color={colors.primary} size={21} /><Text style={styles.metricValue}>{capacity}</Text><Text style={styles.metricLabel}>Prototype capacity</Text></Card>
        <Card variant="outlined" style={styles.metric}><ShieldCheck color={colors.success} size={21} /><Text style={styles.metricValue}>{remaining}</Text><Text style={styles.metricLabel}>Remaining spaces</Text></Card>
      </View>

      <Card variant="outlined" style={styles.card}>
        <Text style={styles.cardTitle}>Recruitment status</Text>
        <Text style={styles.help}>Use these controls to demonstrate the Chair workflow. A production change must be authorised and audited by the backend.</Text>
        <View style={styles.stateRow}>
          {(['Open', 'Paused'] as RecruitmentState[]).map((value) => (
            <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: state === value }} onPress={() => { setState(value); setSaved(false); }} style={[styles.stateOption, state === value && styles.stateOptionActive]}>
              <View style={[styles.radio, state === value && styles.radioActive]}>{state === value ? <Check color={colors.white} size={12} /> : null}</View>
              <View><Text style={styles.stateTitle}>{value}</Text><Text style={styles.help}>{value === 'Open' ? 'Allow eligible discovery/application flows.' : 'Pause new public applications while keeping the Chama active.'}</Text></View>
            </Pressable>
          ))}
        </View>

        <View style={styles.capacityRow}>
          <View><Text style={styles.cardTitle}>Member capacity</Text><Text style={styles.help}>Cannot be set below the current member count.</Text></View>
          <View style={styles.stepper}>
            <Pressable accessibilityLabel="Decrease capacity" accessibilityRole="button" disabled={capacity <= Math.max(members, 2)} onPress={() => { setCapacity((value) => Math.max(members, value - 1)); setSaved(false); }} style={styles.stepButton}><Minus color={colors.primary} size={17} /></Pressable>
            <Text style={styles.capacity}>{capacity}</Text>
            <Pressable accessibilityLabel="Increase capacity" accessibilityRole="button" onPress={() => { setCapacity((value) => value + 1); setSaved(false); }} style={styles.stepButton}><Plus color={colors.primary} size={17} /></Pressable>
          </View>
        </View>

        <Button onPress={() => setSaved(true)}>Save prototype recruitment state</Button>
        {saved ? <View style={styles.saved}><Check color={colors.success} size={16} /><Text style={styles.savedText}>Recruitment settings saved in this frontend screen only. Production mutation remains backend-gated.</Text></View> : null}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  capacity: { color: colors.navy, fontSize: 18, fontWeight: '900', minWidth: 34, textAlign: 'center' },
  capacityRow: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between', paddingTop: spacing.lg },
  card: { gap: spacing.lg },
  cardTitle: { color: colors.navy, fontSize: 16, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  help: { color: colors.textMuted, fontSize: 11, lineHeight: 17 },
  metric: { flex: 1, gap: 5, minWidth: 180 },
  metricLabel: { color: colors.textMuted, fontSize: 11, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metricValue: { color: colors.navy, fontSize: 24, fontWeight: '900' },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  radio: { alignItems: 'center', borderColor: colors.border, borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', width: 20 },
  radioActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  saved: { alignItems: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  savedText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  stateOption: { alignItems: 'flex-start', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.sm, minWidth: 250, padding: spacing.md },
  stateOptionActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  stateRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  stateTitle: { color: colors.text, fontSize: 13, fontWeight: '900' },
  stepButton: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 12, height: 36, justifyContent: 'center', width: 36 },
  stepper: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
});
