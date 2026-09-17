import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radii } from '../../theme/layout';

interface ProgressBarProps {
	progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
	const safeProgress = Math.min(100, Math.max(0, progress));

	return (
		<View style={styles.track}>
			<View style={[styles.fill, { width: `${safeProgress}%` }]} />
		</View>
	);
}

const styles = StyleSheet.create({
	track: {
		backgroundColor: colors.border,
		borderRadius: radii.sm,
		height: 10,
		overflow: 'hidden',
		width: '100%',
	},
	fill: {
		backgroundColor: colors.primary,
		borderRadius: radii.sm,
		height: '100%',
	},
});
