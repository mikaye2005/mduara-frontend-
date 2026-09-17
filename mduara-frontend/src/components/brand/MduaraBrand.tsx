import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import { brand, brandAssets, type BrandTone, type BrandVariant } from '../../theme/brand';

interface MduaraBrandProps {
  variant?: BrandVariant;
  tone?: BrandTone;
  width?: number;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

const ASPECT_RATIO = 1200 / 406;

export function MduaraBrand({
  variant = 'wordmark',
  tone = 'light',
  width = 190,
  style,
  accessibilityLabel = brand.name,
}: MduaraBrandProps) {
  const source =
    tone === 'dark'
      ? variant === 'full'
        ? brandAssets.fullInverse
        : brandAssets.wordmarkInverse
      : variant === 'full'
        ? brandAssets.full
        : brandAssets.wordmark;

  return (
    <Image
      source={source}
      resizeMode="contain"
      accessibilityLabel={accessibilityLabel}
      style={[{ width, height: width / ASPECT_RATIO }, style]}
    />
  );
}
