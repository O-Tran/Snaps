import { Platform } from 'react-native';

export const fonts = {
  ios: {
    primary: 'SF Pro Text',
    display: 'SF Pro Display',
    decorative: 'Dancing Script',
  },
  android: {
    primary: 'Roboto',
    display: 'Roboto',
    decorative: 'Dancing Script',
  },
};

export const theme = {
  light: {
    colors: {
      primary: '#E27D60',
      secondary: '#8E9B90',
      background: '#F9F6F1',
      surface: '#F5F1E8',
      text: '#2C1810',
      accent: '#7B9EA8',
      border: 'rgba(44, 24, 16, 0.12)',
      overlay: 'rgba(44, 24, 16, 0.5)',
    },
  },
  dark: {
    colors: {
      primary: '#8B1E3F',
      secondary: '#C3A343',
      background: '#1C1C1E',
      surface: '#2C2C2E',
      text: '#F5F5DC',
      accent: '#B87333',
      border: 'rgba(245, 245, 220, 0.12)',
      overlay: 'rgba(245, 245, 220, 0.5)',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: Platform.select({ ios: 8, android: 4 }),
    md: Platform.select({ ios: 12, android: 8 }),
    lg: Platform.select({ ios: 16, android: 12 }),
    xl: Platform.select({ ios: 24, android: 16 }),
  },
  typography: {
    h1: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: Platform.select({ ios: '700', android: '500' }),
      fontFamily: Platform.select(fonts),
      letterSpacing: Platform.select({ ios: 0.37, android: 0 }),
    },
    h2: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: Platform.select({ ios: '600', android: '500' }),
      fontFamily: Platform.select(fonts),
      letterSpacing: Platform.select({ ios: 0.35, android: 0 }),
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400',
      fontFamily: Platform.select(fonts),
      letterSpacing: Platform.select({ ios: -0.32, android: 0.15 }),
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400',
      fontFamily: Platform.select(fonts),
      letterSpacing: Platform.select({ ios: 0, android: 0.4 }),
    },
    decorative: {
      fontFamily: fonts[Platform.OS].decorative,
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700',
    },
  },
  elevation: Platform.select({
    ios: {
      small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1.0,
      },
      medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
      },
    },
    android: {
      small: { elevation: 2 },
      medium: { elevation: 4 },
      large: { elevation: 8 },
    },
  }),
};