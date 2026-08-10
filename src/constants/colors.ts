import { colors as neumoColors } from './neumorphism';

export const colors = {
  // Base colors from neumorphism system
  ...neumoColors,
  
  // Legacy compatibility
  bg: neumoColors.bg,
  bgSecondary: neumoColors.bgSecondary,
  bgTertiary: neumoColors.bgTertiary,
  primary: neumoColors.accent.primary,
  primaryDim: neumoColors.accent.primaryDim,
  secondary: neumoColors.accent.secondary,
  accent: neumoColors.accent.error,
  text: neumoColors.text.primary,
  textMuted: neumoColors.text.muted,
  textDim: neumoColors.text.dim,
  shadowLight: neumoColors.highlightColor + '20',
  shadowDark: neumoColors.shadowColor + '80',
  shadowColored: neumoColors.accent.primary + '40',
  gradientStart: neumoColors.bg,
  gradientEnd: neumoColors.bgSecondary,
  gradientPrimary: neumoColors.accent.gradientPrimary || [neumoColors.accent.primary, '#0099ff'],
  gradientWarm: neumoColors.accent.gradientWarm || [neumoColors.accent.secondary, neumoColors.accent.warm],
  gradientCool: neumoColors.accent.gradientCool || ['#667eea', '#764ba2'],
};

export default colors;
