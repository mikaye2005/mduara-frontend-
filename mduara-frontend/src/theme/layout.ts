export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#161B2D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#161B2D',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0A0D16',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 48,
    elevation: 10,
  },
} as const;

export const dimensions = {
  cardPadding: 15,
  cardMinHeight: 104,
  borderWidth: 1,
  controlHeight: 40,
  sidebarWidth: 242,
  sidebarCollapsedWidth: 76,
  topbarHeight: 72,
  contentMaxWidth: 1600,
} as const;

export const breakpoints = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
} as const;
