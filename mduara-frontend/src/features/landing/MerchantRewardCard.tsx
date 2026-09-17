import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronDown, ChevronUp, Gift, LockKeyhole, Store } from 'lucide-react-native';

import type { GoalMerchant } from '../../shared/goalMarketplace';
import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface MerchantRewardCardProps {
  merchant: GoalMerchant;
}

const statusLabel = {
  locked: 'Locked',
  eligible: 'Eligible',
  redeemed: 'Redeemed',
} as const;

export function MerchantRewardCard({ merchant }: MerchantRewardCardProps) {
  const [expanded, setExpanded] = useState(false);
  const status = merchant.rewardStatus;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.icon}><Store color={colors.primary} size={17} /></View>
        <View style={styles.copy}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{merchant.name}</Text>
            {merchant.isPrototype ? <Text style={styles.prototypeBadge}>PROTOTYPE MERCHANT</Text> : null}
          </View>
          <Text style={styles.offer}>{merchant.offer}</Text>
        </View>
        <View style={[styles.statusBadge, status === 'eligible' && styles.statusEligible, status === 'redeemed' && styles.statusRedeemed]}>
          {status === 'locked' ? <LockKeyhole color={colors.textMuted} size={12} /> : <Gift color={status === 'eligible' ? colors.success : colors.primary} size={12} />}
          <Text style={[styles.statusText, status === 'eligible' && styles.statusEligibleText, status === 'redeemed' && styles.statusRedeemedText]}>{statusLabel[status]}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={({ pressed }) => [styles.disclosure, pressed && styles.pressed]}
      >
        <Text style={styles.disclosureText}>Reward eligibility</Text>
        {expanded ? <ChevronUp color={colors.primary} size={15} /> : <ChevronDown color={colors.primary} size={15} />}
      </Pressable>

      {expanded ? (
        <View style={styles.detail}>
          <Text style={styles.detailText}>{merchant.eligibilityNote}</Text>
          <Text style={styles.guardrail}>This frontend never unlocks or redeems a reward by itself. Production eligibility and redemption must be confirmed by the backend.</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderBottomColor: colors.border, borderBottomWidth: 1, paddingVertical: spacing.sm },
  topRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  icon: { alignItems: 'center', backgroundColor: colors.primaryLight, borderRadius: radii.sm, height: 34, justifyContent: 'center', width: 34 },
  copy: { flex: 1, minWidth: 0 },
  nameRow: { alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  name: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.bold },
  prototypeBadge: { backgroundColor: colors.warningSoft, borderRadius: 999, color: colors.warning, fontSize: 7, fontWeight: typography.weights.bold, overflow: 'hidden', paddingHorizontal: 7, paddingVertical: 3 },
  offer: { color: colors.textMuted, fontSize: typography.sizes.caption, lineHeight: 17, marginTop: 2 },
  statusBadge: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 999, flexDirection: 'row', gap: 4, paddingHorizontal: 8, paddingVertical: 5 },
  statusEligible: { backgroundColor: colors.successSoft },
  statusRedeemed: { backgroundColor: colors.primaryLight },
  statusText: { color: colors.textMuted, fontSize: 8, fontWeight: typography.weights.bold },
  statusEligibleText: { color: colors.success },
  statusRedeemedText: { color: colors.primaryDark },
  disclosure: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginLeft: 42, paddingTop: 7 },
  disclosureText: { color: colors.primary, fontSize: 9, fontWeight: typography.weights.bold },
  pressed: { opacity: .72 },
  detail: { backgroundColor: colors.surfaceMuted, borderRadius: radii.sm, gap: 5, marginLeft: 42, marginTop: 7, padding: spacing.sm },
  detailText: { color: colors.text, fontSize: 9, lineHeight: 15 },
  guardrail: { color: colors.textMuted, fontSize: 8, lineHeight: 14 },
});
