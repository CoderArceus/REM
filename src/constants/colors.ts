import { baseColors } from './neumorphism';

export const colors = {
  // Base colors from neumorphism system
  ...baseColors,
  
  // Legacy compatibility
  bg: baseColors.bg,
  bgSecondary: baseColors.bgSecondary,
  bgTertiary: baseColors.bgTertiary,
  primary: baseColors.primary,
  primaryDim: baseColors.primaryDim,
  primaryLight: baseColors.primaryLight,
  secondary: baseColors.secondary,
  secondaryDim: baseColors.secondaryDim,
  accent: baseColors.accent,
  accentDim: baseColors.accentDim,
  text: baseColors.text,
  textMuted: baseColors.textMuted,
  textDim: baseColors.textDim,
  textOnPrimary: baseColors.textOnPrimary,
  shadowLight: baseColors.highlightColor + '20',
  shadowDark: baseColors.shadowColor + '80',
  shadowColored: baseColors.primary + '40',
  gradientStart: baseColors.bg,
  gradientEnd: baseColors.bgSecondary,
  gradientPrimary: [baseColors.primary, '#0099ff'],
  gradientWarm: [baseColors.secondary, baseColors.warm],
  gradientCool: ['#667eea', '#764ba2'],
};

export default colors;
