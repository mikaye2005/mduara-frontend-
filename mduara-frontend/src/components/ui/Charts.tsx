import React, { useMemo, useState } from 'react';
import {
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

type Datum = { label: string; value: number };

type TooltipState = { label: string; value: number } | null;

const chartPalette = [colors.primary, colors.info, colors.success, colors.warning, colors.danger, colors.navySoft];

function ChartTooltip({ item, formatter }: { item: TooltipState; formatter?: (value: number) => string }) {
  if (!item) return null;
  return (
    <View pointerEvents="none" style={styles.tooltip}>
      <Text style={styles.tooltipLabel}>{item.label}</Text>
      <Text style={styles.tooltipValue}>{formatter ? formatter(item.value) : item.value.toLocaleString()}</Text>
    </View>
  );
}

function Segment({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: (x1 + x2) / 2 - length / 2,
        top: (y1 + y2) / 2 - 1,
        width: length,
        height: 2,
        backgroundColor: color,
        borderRadius: 2,
        transform: [{ rotateZ: `${angle}deg` }],
      }}
    />
  );
}

export function LineChart({
  data,
  color = colors.primary,
  height = 220,
  valueFormatter,
}: {
  data: Datum[];
  color?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const [width, setWidth] = useState(0);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const max = Math.max(...data.map((item) => item.value), 1);
  const min = Math.min(...data.map((item) => item.value), 0);
  const range = Math.max(max - min, 1);
  const plotHeight = height - 46;
  const left = 10;
  const right = 10;
  const usableWidth = Math.max(width - left - right, 0);
  const points = data.map((item, index) => ({
    ...item,
    x: data.length <= 1 ? usableWidth / 2 + left : left + (index / (data.length - 1)) * usableWidth,
    y: 12 + (1 - (item.value - min) / range) * (plotHeight - 24),
  }));

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={[styles.chart, { height }]}
    >
      <ChartTooltip item={tooltip} formatter={valueFormatter} />
      {[0.25, 0.5, 0.75].map((ratio) => (
        <View key={ratio} style={[styles.gridLine, { top: 12 + ratio * (plotHeight - 24) }]} />
      ))}
      {points.slice(0, -1).map((point, index) => (
        <Segment
          key={`${point.label}-${index}`}
          x1={point.x}
          y1={point.y}
          x2={points[index + 1].x}
          y2={points[index + 1].y}
          color={color}
        />
      ))}
      {points.map((point) => (
        <Pressable
          key={point.label}
          onHoverIn={() => setTooltip(point)}
          onHoverOut={() => setTooltip(null)}
          onPress={() => setTooltip((current) => current?.label === point.label ? null : point)}
          style={[styles.pointHit, { left: point.x - 12, top: point.y - 12 }]}
        >
          <View style={[styles.point, { backgroundColor: color }]} />
        </Pressable>
      ))}
      <View style={styles.axisLabels}>
        {data.map((item, index) => {
          const show = data.length <= 7 || index % Math.ceil(data.length / 6) === 0 || index === data.length - 1;
          return show ? <Text key={`${item.label}-${index}`} style={styles.axisText}>{item.label}</Text> : null;
        })}
      </View>
    </View>
  );
}

export function BarChart({
  data,
  height = 220,
  valueFormatter,
}: {
  data: Datum[];
  height?: number;
  valueFormatter?: (value: number) => string;
}) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <View style={[styles.chart, { height }]}>
      <ChartTooltip item={tooltip} formatter={valueFormatter} />
      <View style={styles.barPlot}>
        {data.map((item, index) => {
          const pct = Math.max((item.value / max) * 100, item.value > 0 ? 4 : 0);
          return (
            <Pressable
              key={`${item.label}-${index}`}
              onHoverIn={() => setTooltip(item)}
              onHoverOut={() => setTooltip(null)}
              onPress={() => setTooltip((current) => current?.label === item.label ? null : item)}
              style={styles.barColumn}
            >
              <View style={styles.barTrack}>
                <View style={[styles.bar, { height: `${pct}%`, backgroundColor: chartPalette[index % chartPalette.length] }]} />
              </View>
              <Text numberOfLines={1} style={styles.axisText}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function DonutChart({
  parts,
  size = 180,
  centerLabel = 'Total',
  valueFormatter,
}: {
  parts: Datum[];
  size?: number;
  centerLabel?: string;
  valueFormatter?: (value: number) => string;
}) {
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const total = parts.reduce((sum, part) => sum + Math.max(part.value, 0), 0);
  const wedges = useMemo(() => {
    const count = 60;
    const output: Array<{ color: string; part: Datum }> = [];
    let cursor = 0;
    const thresholds = parts.map((part) => {
      cursor += total > 0 ? part.value / total : 0;
      return cursor;
    });
    for (let i = 0; i < count; i += 1) {
      const ratio = (i + 0.5) / count;
      const partIndex = Math.max(0, thresholds.findIndex((threshold) => ratio <= threshold));
      output.push({ color: chartPalette[partIndex % chartPalette.length], part: parts[partIndex] ?? { label: 'No data', value: 0 } });
    }
    return output;
  }, [parts, total]);

  const ringRadius = size * 0.39;
  const spokeHeight = size * 0.16;

  return (
    <View style={styles.donutWrap}>
      <View style={[styles.donut, { width: size, height: size }]}> 
        <ChartTooltip item={tooltip} formatter={valueFormatter} />
        {wedges.map((wedge, index) => {
          const angle = (index * 360) / wedges.length;
          const radians = ((angle - 90) * Math.PI) / 180;
          const centerRadius = ringRadius - spokeHeight / 2;
          const x = size / 2 + Math.cos(radians) * centerRadius;
          const y = size / 2 + Math.sin(radians) * centerRadius;
          return (
            <Pressable
              key={index}
              onHoverIn={() => setTooltip(wedge.part)}
              onHoverOut={() => setTooltip(null)}
              onPress={() => setTooltip(wedge.part)}
              style={{
                position: 'absolute',
                width: 8,
                height: spokeHeight,
                borderRadius: 5,
                backgroundColor: wedge.color,
                left: x - 4,
                top: y - spokeHeight / 2,
                transform: [{ rotateZ: `${angle}deg` }],
              }}
            />
          );
        })}
        <View style={[styles.donutCenter, { width: size * 0.53, height: size * 0.53, borderRadius: size }]}>
          <Text style={styles.donutValue}>{valueFormatter ? valueFormatter(total) : total.toLocaleString()}</Text>
          <Text style={styles.donutLabel}>{centerLabel}</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {parts.map((part, index) => (
          <View key={`${part.label}-${index}`} style={styles.legendRow}>
            <View style={[styles.legendDot, { backgroundColor: chartPalette[index % chartPalette.length] }]} />
            <Text style={styles.legendLabel}>{part.label}</Text>
            <Text style={styles.legendValue}>{valueFormatter ? valueFormatter(part.value) : part.value.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function ProgressList({
  items,
  valueFormatter,
}: {
  items: Array<{ label: string; value: number; max?: number }>;
  valueFormatter?: (value: number) => string;
}) {
  return (
    <View style={styles.progressList}>
      {items.map((item) => {
        const max = item.max ?? 100;
        const pct = Math.max(0, Math.min(100, (item.value / Math.max(max, 1)) * 100));
        return (
          <View key={item.label} style={styles.progressItem}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{item.label}</Text>
              <Text style={styles.progressValue}>{valueFormatter ? valueFormatter(item.value) : `${Math.round(pct)}%`}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${pct}%` }]} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

export type Timeframe = '1M' | '3M' | '6M' | '1Y' | 'ALL';

export function TimeframeFilter({ value, onChange }: { value: Timeframe; onChange: (value: Timeframe) => void }) {
  const values: Timeframe[] = ['1M', '3M', '6M', '1Y', 'ALL'];
  return (
    <View style={styles.timeframeWrap}>
      {values.map((option) => {
        const active = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.timeframeButton, active ? styles.timeframeButtonActive : null]}
          >
            <Text style={[styles.timeframeText, active ? styles.timeframeTextActive : null]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { position: 'relative', width: '100%', overflow: 'hidden' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.border },
  pointHit: { position: 'absolute', width: 24, height: 24, alignItems: 'center', justifyContent: 'center', zIndex: 4 },
  point: { width: 8, height: 8, borderRadius: 99, borderWidth: 2, borderColor: colors.white },
  axisLabels: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', justifyContent: 'space-between' },
  axisText: { color: colors.textMuted, fontSize: typography.sizes.caption },
  tooltip: { position: 'absolute', top: 4, right: 4, zIndex: 20, backgroundColor: colors.navy, borderRadius: radii.sm, paddingHorizontal: spacing.sm, paddingVertical: 6 },
  tooltipLabel: { color: '#CBD1E2', fontSize: typography.sizes.caption },
  tooltipValue: { color: colors.white, fontSize: typography.sizes.label, fontWeight: typography.weights.bold },
  barPlot: { flex: 1, flexDirection: 'row', gap: spacing.sm, alignItems: 'stretch', paddingTop: 26 },
  barColumn: { flex: 1, alignItems: 'center', gap: 6 },
  barTrack: { flex: 1, width: '72%', backgroundColor: colors.surfaceMuted, borderRadius: radii.sm, justifyContent: 'flex-end', overflow: 'hidden' },
  bar: { width: '100%', borderRadius: radii.sm },
  donutWrap: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xl },
  donut: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  donutCenter: { position: 'absolute', backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  donutValue: { color: colors.text, fontSize: typography.sizes.h4, fontWeight: typography.weights.extrabold },
  donutLabel: { color: colors.textMuted, fontSize: typography.sizes.caption, marginTop: 2 },
  legend: { flex: 1, minWidth: 180, gap: spacing.sm },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  legendDot: { width: 9, height: 9, borderRadius: 99 },
  legendLabel: { flex: 1, color: colors.textMuted, fontSize: typography.sizes.label },
  legendValue: { color: colors.text, fontSize: typography.sizes.label, fontWeight: typography.weights.bold },
  progressList: { gap: spacing.lg },
  progressItem: { gap: spacing.sm },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm },
  progressLabel: { color: colors.text, fontSize: typography.sizes.body, fontWeight: typography.weights.semibold },
  progressValue: { color: colors.textMuted, fontSize: typography.sizes.label, fontWeight: typography.weights.bold },
  progressTrack: { height: 8, backgroundColor: colors.surfaceMuted, borderRadius: radii.pill, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: radii.pill },
  timeframeWrap: { flexDirection: 'row', backgroundColor: colors.surfaceMuted, borderRadius: radii.sm, padding: 3, gap: 2 },
  timeframeButton: { paddingHorizontal: 9, paddingVertical: 6, borderRadius: 7 },
  timeframeButtonActive: { backgroundColor: colors.surface },
  timeframeText: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold },
  timeframeTextActive: { color: colors.primary, fontWeight: typography.weights.bold },
});
