import React from 'react';
import { Modal as NativeModal, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../../theme/colors';

interface ModalProps {
	visible: boolean;
	children: React.ReactNode;
	onClose: () => void;
	contentStyle?: StyleProp<ViewStyle>;
}

export function Modal({ children, contentStyle, onClose, visible }: ModalProps) {
	return (
		<NativeModal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
			<Pressable style={styles.overlay} onPress={onClose}>
				<Pressable style={[styles.content, contentStyle]} onPress={(event) => event.stopPropagation()}>
					{children}
				</Pressable>
			</Pressable>
		</NativeModal>
	);
}

const styles = StyleSheet.create({
	overlay: {
		alignItems: 'center',
		backgroundColor: 'rgba(15, 23, 42, 0.6)',
		flex: 1,
		justifyContent: 'center',
		padding: 16,
	},
	content: {
		backgroundColor: colors.surface,
		borderRadius: 16,
		maxWidth: 560,
		padding: 20,
		width: '100%',
	},
});
