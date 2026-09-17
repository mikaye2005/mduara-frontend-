import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ShieldCheck } from 'lucide-react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface ChamaTrustIndicatorProps {
  score: number;
  signals?: string[];
  compact?: boolean;
}

function trustLevel(score: number) {
  if (score >= 85) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 55) return 'Developing';
  return 'Needs attention';
}

export function ChamaTrustIndicator({ score, signals = [], compact = false }: ChamaTrustIndicatorProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));
  const level = trustLevel(normalized);

  return (
    <View style={[styles.card, compact && styles.compactCard]} accessibilityLabel={`Prototype Chama trust indicator ${normalized} out of 100, ${level}`}>
      <View style={styles.topRow}>
        <View style={styles.icon}><ShieldCheck color={colors.primary} size={compact ? 15 : 18} /></View>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>CHAMA TRUST · PROTOTYPE</Text>
          <Text style={styles.level}>{level}</Text>
        </View>
        <View style={styles.scoreRow}><Text style={styles.score}>{normalized}</Text><Text style={styles.outOf}>/100</Text></View>
      </View>

      {!compact ? (
        <>
          <View style={styles.track}><View style={[styles.fill, { width: `${normalized}%` }]} /></View>
          {signals.length ? (
            <View style={styles.signalList}>
              {signals.map((signal) => (
                <View key={signal} style={styles.signalRow}><View style={styles.dot} /><Text style={styles.signalText}>{signal}</Text></View>
              ))}
            </View>
          ) : null}
          <Text style={styles.note}>Illustrative frontend indicator only. Final score inputs and weighting require the approved backend/product scoring contract.</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderColor: colors.primaryLine, borderRadius: radii.lg, borderWidth: 1, gap: spacing.md, padding: spacing.lg },
  compactCard: { backgroundColor: colors.primaryLight, borderRadius: radii.md, gap: 0, paddingHorizontal: spacing.sm, paddingVertical: 8 },
  topRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.sm },
  icon: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: radii.md, height: 34, justifyContent: 'center', width: 34 },
  heading: { flex: 1 },
  eyebrow: { color: colors.primaryDark, fontSize: 9, fontWeight: typography.weights.bold, letterSpacing: .65 },
  level: { color: colors.navy, fontSize: typography.sizes.caption, fontWeight: typography.weights.bold, marginTop: 2 },
  scoreRow: { alignItems: 'baseline', flexDirection: 'row' },
  score: { color: colors.navy, fontSize: 20, fontWeight: typography.weights.extrabold },
  outOf: { color: colors.textMuted, fontSize: 9, fontWeight: typography.weights.bold },
  track: { backgroundColor: colors.primaryLight, borderRadius: 99, height: 6, overflow: 'hidden' },
  fill: { backgroundColor: colors.primary, borderRadius: 99, height: '100%' },
  signalList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  signalRow: { alignItems: 'center', backgroundColor: colors.surfaceMuted, borderRadius: 999, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  dot: { backgroundColor: colors.success, borderRadius: 99, height: 6, width: 6 },
  signalText: { color: colors.textMuted, fontSize: 9, fontWeight: typography.weights.semibold },
  note: { color: colors.textSubtle, fontSize: 9, lineHeight: 15 },
});
