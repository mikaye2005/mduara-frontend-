import React from 'react';
import { View } from 'react-native';

import { RouteScreen } from './RouteScreen';
import type { AppPath, RouteScreenProps } from '../types';

interface NavigationContentProps {
	path: AppPath;
	routeScreenProps: RouteScreenProps;
}

export function NavigationContent({ path, routeScreenProps }: NavigationContentProps) {
	return (
		<View style={styles.container}>
			<RouteScreen path={path} {...routeScreenProps} />
		</View>
	);
}

const styles = {
	container: {
		flex: 1,
	},
};