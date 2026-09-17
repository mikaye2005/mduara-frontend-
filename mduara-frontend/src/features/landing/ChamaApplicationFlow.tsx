import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Check, FileText, ShieldCheck, UsersRound, WalletCards, X } from 'lucide-react-native';

import { MduaraBrand } from '../../components/brand/MduaraBrand';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatCurrency } from '../../shared/date';
import type { PublicChama } from '../../shared/mockData';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

export type ApplicationAccountContext = 'signedIn' | 'verifiedRegistration';

interface ChamaApplicationFlowProps {
  accountContext: ApplicationAccountContext;
  chama: PublicChama | null;
  onClose: () => void;
  onComplete: () => void;
  visible: boolean;
}

type CheckKey = 'constitution' | 'contribution' | 'commitment' | 'accuracy';

const initialChecks: Record<CheckKey, boolean> = {
  constitution: false,
  contribution: false,
  commitment: false,
  accuracy: false,
};

export function ChamaApplicationFlow({
  accountContext,
  chama,
  onClose,
  onComplete,
  visible,
}: ChamaApplicationFlowProps) {
  const { width } = useWindowDimensions();
  const compact = width < 760;
  const [checks, setChecks] = useState(initialChecks);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setChecks(initialChecks);
    setSubmitted(false);
  }, [chama?.id, visible]);

  const allAccepted = useMemo(() => Object.values(checks).every(Boolean), [checks]);

  if (!chama) return null;

  const applicationMode = chama.entryMode === 'APPLICATION';
  const isPrivate = chama.entryMode === 'PRIVATE';
  const reference = `PROTO-${applicationMode ? 'APP' : 'JOIN'}-${String(chama.id).padStart(3, '0')}`;

  const toggle = (key: CheckKey) => {
    setChecks((current) => ({ ...current, [key]: !current[key] }));
  };

  const submit = () => {
    if (!allAccepted || isPrivate) return;
    setSubmitted(true);
  };

  return (
    <Modal visible={visible} onClose={onClose} contentStyle={styles.modalContent}>
      <View style={styles.shell}>
        <View style={styles.header}>
          <MduaraBrand variant="wordmark" width={compact ? 142 : 164} />
          <Pressable
            accessibilityLabel="Close Chama application"
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <X color={colors.textMuted} size={20} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!submitted ? (
            <>
              <View style={styles.heading}>
                <View style={styles.badges}>
                  <Badge variant="brand">APPLICATION FLOW · PROTOTYPE</Badge>
                  <Badge variant={applicationMode ? 'warning' : 'success'}>
                    {applicationMode ? 'Official review required' : 'Public entry'}
                  </Badge>
                </View>
                <Text style={styles.title}>{applicationMode ? 'Review your application' : 'Confirm your joining intent'}</Text>
                <Text style={styles.subtitle}>
                  You are continuing with <Text style={styles.strong}>{chama.name}</Text>. Your selected Chama has been preserved through authentication.
                </Text>
                <Text style={styles.accountNote}>
                  {accountContext === 'signedIn'
                    ? 'Existing account verified for this prototype session.'
                    : 'Registration OTP was verified for this prototype continuation. Production account creation remains backend-controlled.'}
                </Text>
              </View>

              <View style={[styles.summaryGrid, compact && styles.summaryGridCompact]}>
                <View style={styles.summaryCard}>
                  <UsersRound color={colors.primary} size={19} />
                  <Text style={styles.summaryLabel}>Chama</Text>
                  <Text style={styles.summaryValue}>{chama.name}</Text>
                  <Text style={styles.summaryMeta}>{chama.members}/{chama.capacity} members · {chama.recruitmentStatus}</Text>
                </View>
                <View style={styles.summaryCard}>
                  <WalletCards color={colors.primary} size={19} />
                  <Text style={styles.summaryLabel}>Contribution</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(chama.contributionAmount)}</Text>
                  <Text style={styles.summaryMeta}>{chama.contributionFrequency}</Text>
                </View>
                <View style={styles.summaryCard}>
                  <ShieldCheck color={colors.primary} size={19} />
                  <Text style={styles.summaryLabel}>Commitment</Text>
                  <Text style={styles.summaryValue}>{formatCurrency(chama.commitmentAmount)}</Text>
                  <Text style={styles.summaryMeta}>Separate from ordinary platform revenue</Text>
                </View>
                <View style={styles.summaryCard}>
                  <FileText color={colors.primary} size={19} />
                  <Text style={styles.summaryLabel}>Constitution</Text>
                  <Text style={styles.summaryValue}>{chama.constitutionVersion}</Text>
                  <Text style={styles.summaryMeta}>{chama.entryMode} entry mode</Text>
                </View>
              </View>

              <View style={styles.rulesCard}>
                <Text style={styles.sectionTitle}>Before you submit</Text>
                <Text style={styles.sectionIntro}>These acknowledgements are intentionally explicit. A production application must store the accepted Constitution version and backend-confirmed payment/application state.</Text>

                <Acknowledgement
                  checked={checks.constitution}
                  label={`I have reviewed and accept the current Constitution (${chama.constitutionVersion}) and the rules shown for ${chama.name}.`}
                  onPress={() => toggle('constitution')}
                />
                <Acknowledgement
                  checked={checks.contribution}
                  label={`I understand the contribution plan is ${formatCurrency(chama.contributionAmount)} ${chama.contributionFrequency.toLowerCase()}.`}
                  onPress={() => toggle('contribution')}
                />
                <Acknowledgement
                  checked={checks.commitment}
                  label={`I understand the KSh ${chama.commitmentAmount.toLocaleString('en-KE')} commitment mechanism may need backend-confirmed payment before final membership activation.`}
                  onPress={() => toggle('commitment')}
                />
                <Acknowledgement
                  checked={checks.accuracy}
                  label="I confirm that the information attached to my application/account is accurate and can be reviewed under the Chama rules."
                  onPress={() => toggle('accuracy')}
                />

                {isPrivate ? (
                  <View style={styles.blocked}>
                    <ShieldCheck color={colors.textMuted} size={18} />
                    <Text style={styles.blockedText}>This Chama is private. A valid invitation is required, so public submission is disabled.</Text>
                  </View>
                ) : null}

                <Button fullWidth disabled={!allAccepted || isPrivate} onPress={submit}>
                  {applicationMode ? 'Submit application' : 'Confirm joining intent'}
                </Button>
                <Text style={styles.disclaimer}>No real membership, money movement, or official approval is created by this frontend prototype action.</Text>
              </View>
            </>
          ) : (
            <View style={styles.success}>
              <View style={styles.successIcon}><Check color={colors.success} size={26} /></View>
              <Badge variant="success">Frontend prototype state</Badge>
              <Text style={styles.successTitle}>
                {applicationMode ? 'Application submitted for review' : 'Joining intent recorded'}
              </Text>
              <Text style={styles.successText}>
                {applicationMode
                  ? `${chama.name} requires an official decision before membership can be activated.`
                  : `${chama.name} allows public entry, but final activation still depends on the backend Constitution/commitment checks.`}
              </Text>
              <View style={styles.referenceBox}>
                <Text style={styles.referenceLabel}>Prototype reference</Text>
                <Text style={styles.referenceValue}>{reference}</Text>
              </View>
              <View style={styles.nextStep}>
                <ShieldCheck color={colors.primary} size={18} />
                <Text style={styles.nextStepText}>
                  The next production step is backend-confirmed application/join status and, when required, the KSh {chama.commitmentAmount.toLocaleString('en-KE')} commitment payment. The client must never mark either one successful by itself.
                </Text>
              </View>
              <Button fullWidth onPress={onComplete}>Done</Button>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

function Acknowledgement({ checked, label, onPress }: { checked: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
      style={({ pressed }) => [styles.checkRow, checked && styles.checkRowActive, pressed && styles.pressed]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked ? <Check color={colors.white} size={13} /> : null}
      </View>
      <Text style={styles.checkText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  accountNote: { color: colors.primaryDark, fontSize: 11, fontWeight: '700', lineHeight: 17, marginTop: 8 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  blocked: { alignItems: 'flex-start', backgroundColor: colors.surfaceMuted, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  blockedText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  checkbox: { alignItems: 'center', borderColor: colors.border, borderRadius: 6, borderWidth: 1.5, height: 22, justifyContent: 'center', width: 22 },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkRow: { alignItems: 'flex-start', borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  checkRowActive: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  checkText: { color: colors.text, flex: 1, fontSize: 12, lineHeight: 18 },
  closeButton: { alignItems: 'center', borderRadius: 18, height: 38, justifyContent: 'center', width: 38 },
  disclaimer: { color: colors.textMuted, fontSize: 10, lineHeight: 15, textAlign: 'center' },
  header: { alignItems: 'center', borderBottomColor: colors.border, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  heading: { gap: 4 },
  modalContent: { maxWidth: 900, overflow: 'hidden', padding: 0 },
  nextStep: { alignItems: 'flex-start', backgroundColor: colors.primaryLight, borderColor: colors.primaryLine, borderRadius: radii.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  nextStepText: { color: colors.textMuted, flex: 1, fontSize: 11, lineHeight: 17 },
  pressed: { opacity: 0.78 },
  referenceBox: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: radii.md, gap: 3, padding: spacing.md, width: '100%' },
  referenceLabel: { color: colors.textMuted, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  referenceValue: { color: colors.navy, fontSize: 15, fontWeight: '900' },
  rulesCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  scrollContent: { gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xl },
  sectionIntro: { color: colors.textMuted, fontSize: 11, lineHeight: 18 },
  sectionTitle: { color: colors.navy, fontSize: 17, fontWeight: '900' },
  shell: { backgroundColor: colors.background, maxHeight: '90vh' as any },
  strong: { color: colors.navy, fontWeight: '900' },
  subtitle: { color: colors.textMuted, fontSize: 13, lineHeight: 20, marginTop: 5 },
  success: { alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  successIcon: { alignItems: 'center', backgroundColor: colors.successSoft, borderRadius: 28, height: 56, justifyContent: 'center', width: 56 },
  successText: { color: colors.textMuted, fontSize: 13, lineHeight: 20, maxWidth: 620, textAlign: 'center' },
  successTitle: { color: colors.navy, fontSize: 24, fontWeight: '900', textAlign: 'center' },
  summaryCard: { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: radii.md, borderWidth: 1, flex: 1, gap: 4, minWidth: 150, padding: spacing.md },
  summaryGrid: { flexDirection: 'row', gap: spacing.sm },
  summaryGridCompact: { flexWrap: 'wrap' },
  summaryLabel: { color: colors.textMuted, fontSize: 9, fontWeight: '800', marginTop: 5, textTransform: 'uppercase' },
  summaryMeta: { color: colors.textMuted, fontSize: 10, lineHeight: 15 },
  summaryValue: { color: colors.navy, fontSize: 14, fontWeight: '900' },
  title: { color: colors.navy, fontSize: 26, fontWeight: '900', letterSpacing: -0.5, marginTop: 8 },
});
