import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii, spacing } from '../../theme/layout';
import { typography } from '../../theme/typography';

interface InputProps extends TextInputProps {
	label?: string;
	hint?: string;
	error?: string;
}

export function Input({ error, hint, label, style, ...props }: InputProps) {
	return (
		<View style={styles.wrapper}>
			{label ? <Text style={styles.label}>{label}</Text> : null}
			<TextInput
				placeholderTextColor={colors.textMuted}
				style={[styles.input, error ? styles.inputError : null, style]}
				{...props}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
		</View>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		gap: spacing.xs,
	},
	label: {
		color: colors.text,
		fontSize: typography.sizes.label,
		fontWeight: typography.weights.semibold,
	},
	input: {
		backgroundColor: colors.surface,
		borderColor: colors.border,
		borderRadius: radii.sm,
		borderWidth: 1,
		color: colors.text,
		fontSize: typography.sizes.body,
		minHeight: 44,
		paddingHorizontal: spacing.md,
		paddingVertical: 10,
	},
	inputError: {
		borderColor: colors.danger,
	},
	hint: {
		color: colors.textMuted,
		fontSize: typography.sizes.caption,
	},
	error: {
		color: colors.danger,
		fontSize: typography.sizes.caption,
		fontWeight: typography.weights.medium,
	},
});
