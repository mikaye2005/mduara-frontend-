export const brand = {
  name: 'M-Duara',
  tagline: 'Together We Save. Together We Grow.',
  shortTagline: 'Together we save. Together we grow.',
} as const;

export const brandAssets = {
  full: require('../assets/mduara-brand-full.png'),
  wordmark: require('../assets/mduara-brand-wordmark.png'),
  fullInverse: require('../assets/mduara-brand-full-inverse.png'),
  wordmarkInverse: require('../assets/mduara-brand-wordmark-inverse.png'),
} as const;

export type BrandVariant = 'full' | 'wordmark';
export type BrandTone = 'light' | 'dark';
