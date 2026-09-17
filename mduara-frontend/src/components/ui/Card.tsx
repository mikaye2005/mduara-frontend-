import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Pressable,
    PressableProps,
    StyleSheet,
    Text,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { dimensions, radii, shadows, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

export type CardVariant = 'default' | 'outlined' | 'flat' | 'interactive';

export interface CardProps extends ViewProps {
    variant?: CardVariant;
    children?: React.ReactNode;
    onPress?: PressableProps['onPress'];
}

export interface CardActionButton {
    label: string;
    onClick: () => void;
}

export interface CardTrend {
    value: string;
    positive: boolean;
}

export interface MetricCardProps extends Omit<CardProps, 'children'> {
    title: string;
    value: React.ReactNode;
    subtext?: string;
    icon?: React.ReactNode;
    trend?: CardTrend;
    actionButton?: CardActionButton;
    loading?: boolean;
}

export interface CardSectionProps extends ViewProps {
    children?: React.ReactNode;
    className?: string;
}

const variantStyles: Record<CardVariant, ViewStyle> = {
    default: { ...shadows.sm },
    outlined: {},
    flat: { borderColor: 'transparent', elevation: 0, shadowOpacity: 0 },
    interactive: { ...shadows.sm },
};

function SkeletonBar({ width, height }: { width: number; height: number }) {
    const opacity = useRef(new Animated.Value(0.45)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.9, duration: 750, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.45, duration: 750, useNativeDriver: true }),
            ]),
        );
        animation.start();
        return () => animation.stop();
    }, [opacity]);

    return <Animated.View style={[styles.skeleton, { height, opacity, width }]} />;
}

export function Card({ variant = 'default', children, onPress, style, ...props }: CardProps) {
    const cardStyle = [styles.card, variantStyles[variant], style];
    const [hovered, setHovered] = useState(false);

    if (!onPress && variant !== 'interactive') {
        return <View style={cardStyle} {...props}>{children}</View>;
    }

    return (
        <Pressable
            onPress={onPress}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            style={({ pressed }) => [cardStyle, hovered ? styles.hovered : null, pressed ? styles.pressed : null]}
            {...props}
        >
            {children}
        </Pressable>
    );
}

export function CardHeader({ children, ...props }: CardSectionProps) {
    return <View {...props}>{children}</View>;
}

export function CardContent({ children, ...props }: CardSectionProps) {
    return <View {...props}>{children}</View>;
}

export function CardFooter({ children, ...props }: CardSectionProps) {
    return <View {...props}>{children}</View>;
}

function MetricCardSkeleton() {
    return (
        <View>
            <SkeletonBar width={72} height={10} />
            <View style={styles.skeletonGapLarge} />
            <SkeletonBar width={112} height={22} />
            <View style={styles.skeletonGapSmall} />
            <SkeletonBar width={92} height={10} />
        </View>
    );
}

interface MetricCardContentProps {
    title: string;
    value: React.ReactNode;
    subtext?: string;
    icon?: React.ReactNode;
    trend?: CardTrend;
    actionButton?: CardActionButton;
}

function MetricCardAction({ actionButton }: { actionButton: CardActionButton }) {
    return (
        <Pressable onPress={actionButton.onClick} style={styles.actionButton}>
            <Text style={styles.actionLabel}>{actionButton.label}</Text>
        </Pressable>
    );
}

function MetricCardContent({ title, value, subtext, icon, trend, actionButton }: MetricCardContentProps) {
    const supportingText = trend?.value ?? subtext;
    const supportingColor = trend ? (trend.positive ? colors.success : colors.danger) : colors.textMuted;

    return (
        <View>
            <View style={styles.titleRow}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                {icon ? <View>{icon}</View> : null}
            </View>
            <Text style={styles.value} numberOfLines={1}>{value}</Text>
            {supportingText ? <Text style={[styles.subtext, { color: supportingColor }]}>{supportingText}</Text> : null}
            {actionButton ? <MetricCardAction actionButton={actionButton} /> : null}
        </View>
    );
}

export function MetricCard({
    title,
    value,
    subtext,
    icon,
    trend,
    actionButton,
    loading = false,
    variant = 'default',
    ...cardProps
}: MetricCardProps) {
    return (
        <Card variant={variant} {...cardProps}>
            {loading ? <MetricCardSkeleton /> : (
                <MetricCardContent
                    title={title}
                    value={value}
                    subtext={subtext}
                    icon={icon}
                    trend={trend}
                    actionButton={actionButton}
                />
            )}
        </Card>
    );
}

export { colors, radii };

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
        borderRadius: radii.md,
        borderWidth: dimensions.borderWidth,
        minHeight: dimensions.cardMinHeight,
        padding: dimensions.cardPadding,
    },
    titleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
    title: { color: colors.textMuted, fontSize: typography.sizes.label, fontWeight: typography.weights.medium },
    value: { color: colors.text, fontSize: typography.sizes.value, fontWeight: typography.weights.bold },
    subtext: { color: colors.textMuted, fontSize: typography.sizes.caption, fontWeight: typography.weights.semibold, marginTop: spacing.xs },
    actionButton: { alignSelf: 'flex-start', marginTop: spacing.md },
    actionLabel: { color: colors.primary, fontSize: typography.sizes.label, fontWeight: typography.weights.semibold },
    hovered: { ...shadows.md },
    pressed: { ...shadows.md, transform: [{ scale: 0.99 }] },
    skeleton: { backgroundColor: colors.border, borderRadius: radii.sm },
    skeletonGapLarge: { height: spacing.md },
    skeletonGapSmall: { height: spacing.xs },
});
