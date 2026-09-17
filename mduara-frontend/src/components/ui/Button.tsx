import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { dimensions, radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

export type ButtonVariant = 'primary' | 'outline' | 'secondary' | 'soft' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  compact?: boolean;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  outline: { backgroundColor: colors.surface, borderColor: colors.primaryLine },
  secondary: { backgroundColor: colors.surface, borderColor: colors.border },
  soft: { backgroundColor: colors.primaryLight, borderColor: colors.primaryLine },
  ghost: { backgroundColor: colors.transparent, borderColor: colors.transparent },
  danger: { backgroundColor: colors.danger, borderColor: colors.danger },
};

const textStyles: Record<ButtonVariant, TextStyle> = {
  primary: { color: colors.white },
  outline: { color: colors.primary },
  secondary: { color: colors.text },
  soft: { color: colors.primaryDark },
  ghost: { color: colors.primary },
  danger: { color: colors.white },
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { minHeight: 36, paddingHorizontal: spacing.md, paddingVertical: 7 },
  md: { minHeight: dimensions.controlHeight, paddingHorizontal: spacing.lg, paddingVertical: 10 },
  lg: { minHeight: 50, paddingHorizontal: spacing.xl, paddingVertical: 12 },
};

export function Button({
  children,
  compact = false,
  disabled,
  fullWidth,
  leftIcon,
  loading = false,
  rightIcon,
  size = 'md',
  style,
  variant = 'primary',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' || variant === 'danger' ? colors.white : colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({ pressed, hovered }: any) => [
        styles.base,
        variantStyles[variant],
        sizeStyles[compact ? 'sm' : size],
        fullWidth ? styles.fullWidth : null,
        hovered && !isDisabled ? styles.hovered : null,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}
      {...props}
    >
      {loading ? <ActivityIndicator color={spinnerColor} size="small" /> : leftIcon}
      <Text style={[styles.label, textStyles[variant]]}>{children}</Text>
      {!loading ? rightIcon : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
  },
  fullWidth: { width: '100%' },
  hovered: { transform: [{ translateY: -1 }] },
  pressed: { opacity: 0.92, transform: [{ translateY: 0 }] },
  disabled: { opacity: 0.5 },
});
