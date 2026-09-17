import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BellRing, Check, Languages, LockKeyhole, Smartphone } from 'lucide-react-native';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { colors } from '../../../theme/colors';
import { radii, spacing } from '../../../theme/layout';
import { typography } from '../../../theme/typography';

type Language = 'English' | 'Kiswahili';

export function SettingsScreen() {
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [meetingReminders, setMeetingReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [language, setLanguage] = useState<Language>('English');
  const [saved, setSaved] = useState(false);

  const toggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    setSaved(false);
    setter((value) => !value);
  };

  return (
    <ScrollView contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.header}><View style={styles.titleWrap}><Text style={styles.eyebrow}>PREFERENCES</Text><Text style={styles.title}>Settings</Text><Text style={styles.subtitle}>Control frontend notification and language preferences. Security-sensitive changes remain backend-verified.</Text></View><Badge variant="brand">Prototype preferences</Badge></View>

      <View style={styles.grid}>
        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardHeading}><View style={styles.icon}><BellRing color={colors.primary} size={20} /></View><View><Text style={styles.cardTitle}>Notifications</Text><Text style={styles.cardSubtitle}>Choose which reminders this frontend should surface.</Text></View></View>
          <ToggleRow label="Payment reminders" value={paymentReminders} onPress={() => toggle(setPaymentReminders)} />
          <ToggleRow label="Meeting reminders" value={meetingReminders} onPress={() => toggle(setMeetingReminders)} />
          <ToggleRow label="Security alerts" value={securityAlerts} onPress={() => toggle(setSecurityAlerts)} locked />
        </Card>

        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardHeading}><View style={styles.icon}><Languages color={colors.primary} size={20} /></View><View><Text style={styles.cardTitle}>Language</Text><Text style={styles.cardSubtitle}>Select the preferred interface language for supported copy.</Text></View></View>
          {(['English', 'Kiswahili'] as Language[]).map((value) => (
            <Pressable key={value} accessibilityRole="radio" accessibilityState={{ checked: language === value }} onPress={() => { setLanguage(value); setSaved(false); }} style={[styles.radioRow, language === value && styles.radioRowActive]}>
              <View style={[styles.radio, language === value && styles.radioActive]}>{language === value ? <Check color={colors.white} size={12} /> : null}</View>
              <Text style={styles.radioLabel}>{value}</Text>
            </Pressable>
          ))}
        </Card>

        <Card variant="outlined" style={styles.card}>
          <View style={styles.cardHeading}><View style={styles.icon}><LockKeyhole color={colors.primary} size={20} /></View><View><Text style={styles.cardTitle}>Security</Text><Text style={styles.cardSubtitle}>PIN and verified-phone changes require identity verification.</Text></View></View>
          <View style={styles.securityRow}><Smartphone color={colors.textMuted} size={18} /><View style={styles.securityCopy}><Text style={styles.securityTitle}>Verified phone & PIN</Text><Text style={styles.cardSubtitle}>Use the Forgot PIN flow for prototype reset validation. Production changes require OTP/backend confirmation.</Text></View></View>
          <Button disabled variant="secondary">Change verified phone after API</Button>
        </Card>
      </View>

      <Button onPress={() => setSaved(true)}>Save prototype preferences</Button>
      {saved ? <View style={styles.saved}><Check color={colors.success} size={17} /><Text style={styles.savedText}>Preferences saved for this screen session. Production persistence will use the settings API.</Text></View> : null}
    </ScrollView>
  );
}

function ToggleRow({ label, locked = false, onPress, value }: { label: string; locked?: boolean; onPress: () => void; value: boolean }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value, disabled: locked }} disabled={locked} onPress={onPress} style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.switch, value && styles.switchOn, locked && styles.switchLocked]}><View style={[styles.knob, value && styles.knobOn]} /></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.md, minWidth: 280 },
  cardHeading: { alignItems: 'center', flexDirection: 'row', gap: spacing.md },
  cardSubtitle: { color: colors.textMuted, fontSize: 11, lineHeight: 17, marginTop: 2 },
  cardTitle: { color: colors.navy, fontSize: 16, fontWeight: '900' },
  eyebrow: { color: colors.primary, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  grid: { alignItems: 'stretch', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  header: { alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  icon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: 18, height: 42, justifyContent: 'center', width: 42 },
  knob: { backgroundColor: colors.white, borderRadius: 8, height: 16, left: 3, position: 'absolute', top: 3, width: 16 },
  knobOn: { left: 21 },
  page: { gap: spacing.lg, padding: spacing.xl, paddingBottom: 110 },
  radio: { alignItems: 'center', borderColor: colors.border, borderRadius: 10, borderWidth: 1.5, height: 20, justifyContent: 'center', width: 20 },
  radioActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  radioLabel: { color: colors.text, fontSize: 13, fontWeight: '800' },
  radioRow: { alignItems: 'center', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  radioRowActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  saved: { alignItems: 'flex-start', backgroundColor: colors.successSoft, borderRadius: radii.md, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  savedText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  securityCopy: { flex: 1 },
  securityRow: { alignItems: 'flex-start', flexDirection: 'row', gap: spacing.sm },
  securityTitle: { color: colors.text, fontSize: 12, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: typography.sizes.body, lineHeight: 22 },
  switch: { backgroundColor: colors.border, borderRadius: 11, height: 22, position: 'relative', width: 40 },
  switchLocked: { opacity: 0.65 },
  switchOn: { backgroundColor: colors.primary },
  title: { color: colors.navy, fontSize: 30, fontWeight: '900' },
  titleWrap: { gap: 4, maxWidth: 720 },
  toggleLabel: { color: colors.text, flex: 1, fontSize: 12, fontWeight: '800' },
  toggleRow: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.md, justifyContent: 'space-between', paddingVertical: spacing.sm },
});
