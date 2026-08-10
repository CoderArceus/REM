/**
 * True Neumorphic Design System
 * Based on: dual-shadow technique (light source top-left)
 * 
 * Key principles:
 * - Light source: top-left (-45deg)
 * - Raised: light shadow top-left, dark shadow bottom-right
 * - Pressed: inverted (dark top-left, light bottom-right)
 * - Flat: subtle border + inner shadow
 */

export interface NeumorphicShadows {
  // Light shadow (top-left highlight)
  highlight: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };
  // Dark shadow (bottom-right depth)
  shadow: {
    offsetX: number;
    offsetY: number;
    blur: number;
    spread: number;
    color: string;
    opacity: number;
  };
  // Inner highlight (top-left edge)
  innerHighlight?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
    opacity: number;
  };
  // Inner shadow (bottom-right edge)
  innerShadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
    opacity: number;
  };
}

// Base color tokens
export const baseColors = {
  // Background
  bg: '#1a1a2e',
  bgSecondary: '#16213e',
  bgTertiary: '#0f0f23',
  bgCard: '#1e1e3a',
  
  // Primary accent
  primary: '#00d4aa',
  primaryDim: '#00d4aa33',
  primaryLight: '#00d4aa66',
  
  // Secondary/Warm
  secondary: '#ffb800',
  secondaryDim: '#ffb80033',
  warm: '#ff8c00',
  
  // Accent/Error
  accent: '#ff6b6b',
  accentDim: '#ff6b6b33',
  
  // Text
  text: '#ffffff',
  textMuted: '#8892b0',
  textDim: '#4a5568',
  textOnPrimary: '#1a1a2e',
  
  // Borders
  border: '#2a2a4a',
  borderDim: '#1e1e3a',
  
  // Neumorphic specific
  shadowDark: '#000000',
  shadowLight: '#ffffff',
  highlightColor: '#ffffff',
  shadowColor: '#000000',
} as const;

// Neumorphic shadow presets
export const neumorphicShadows: Record<'flat' | 'raised' | 'pressed' | 'deep', NeumorphicShadows> = {
  flat: {
    highlight: { offsetX: -1, offsetY: -1, blur: 2, spread: 0, color: baseColors.highlightColor, opacity: 0.08 },
    shadow: { offsetX: 1, offsetY: 1, blur: 2, spread: 0, color: baseColors.shadowColor, opacity: 0.15 },
    innerHighlight: { offsetX: -1, offsetY: -1, blur: 1, color: baseColors.highlightColor, opacity: 0.05 },
    innerShadow: { offsetX: 1, offsetY: 1, blur: 1, color: baseColors.shadowColor, opacity: 0.1 },
  },
  raised: {
    highlight: { offsetX: -8, offsetY: -8, blur: 20, spread: 0, color: baseColors.highlightColor, opacity: 0.12 },
    shadow: { offsetX: 8, offsetY: 8, blur: 20, spread: 0, color: baseColors.shadowColor, opacity: 0.35 },
    innerHighlight: { offsetX: -2, offsetY: -2, blur: 4, color: baseColors.highlightColor, opacity: 0.08 },
    innerShadow: { offsetX: 2, offsetY: 2, blur: 4, color: baseColors.shadowColor, opacity: 0.15 },
  },
  pressed: {
    highlight: { offsetX: -3, offsetY: -3, blur: 8, spread: 0, color: baseColors.shadowColor, opacity: 0.25 },
    shadow: { offsetX: 3, offsetY: 3, blur: 8, spread: 0, color: baseColors.highlightColor, opacity: 0.15 },
    innerHighlight: { offsetX: -1, offsetY: -1, blur: 2, color: baseColors.shadowColor, opacity: 0.1 },
    innerShadow: { offsetX: 1, offsetY: 1, blur: 2, color: baseColors.highlightColor, opacity: 0.05 },
  },
  deep: {
    highlight: { offsetX: -12, offsetY: -12, blur: 30, spread: 0, color: baseColors.highlightColor, opacity: 0.15 },
    shadow: { offsetX: 12, offsetY: 12, blur: 30, spread: 0, color: baseColors.shadowColor, opacity: 0.45 },
    innerHighlight: { offsetX: -3, offsetY: -3, blur: 6, color: baseColors.highlightColor, opacity: 0.1 },
    innerShadow: { offsetX: 3, offsetY: 3, blur: 6, color: baseColors.shadowColor, opacity: 0.2 },
  },
};

// Shadow generation for React Native StyleSheet
export function createNeumorphicStyle(variant: keyof typeof neumorphicShadows, borderRadius: number = 20, padding: number = 20) {
  const s = neumorphicShadows[variant];
  
  // React Native doesn't support spread, so we approximate with shadowRadius
  return {
    backgroundColor: baseColors.bg,
    borderRadius,
    padding,
    // Highlight (top-left)
    shadowColor: s.highlight.color,
    shadowOffset: { width: s.highlight.offsetX, height: s.highlight.offsetY },
    shadowOpacity: s.highlight.opacity,
    shadowRadius: s.highlight.blur / 2,
    // Shadow (bottom-right) - RN combines both, so we layer via elevation on Android
    elevation: variant === 'flat' ? 1 : variant === 'pressed' ? 3 : variant === 'deep' ? 12 : 8,
    // Android-specific: use separate shadow for dual-shadow effect
    // We'll use a wrapper View for true dual-shadow on iOS
  };
}

// Wrapper component style for true dual-shadow (iOS)
export function createNeumorphicWrapper(variant: keyof typeof neumorphicShadows, borderRadius: number = 20) {
  const s = neumorphicShadows[variant];
  
  return {
    // Outer highlight (top-left)
    shadowColor: s.highlight.color,
    shadowOffset: { width: s.highlight.offsetX, height: s.highlight.offsetY },
    shadowOpacity: s.highlight.opacity,
    shadowRadius: s.highlight.blur / 2,
    // Outer shadow (bottom-right)
    // Note: RN only supports one shadow, so we use elevation on Android
    // For true dual-shadow on iOS, we need nested Views
    elevation: 0, // We'll handle via nested views
  };
}

// Color exports
export const colors = {
  ...baseColors,
  // Neumorphic variants
  card: {
    flat: { bg: baseColors.bg, border: baseColors.border },
    raised: { bg: baseColors.bg },
    pressed: { bg: baseColors.bgTertiary },
    deep: { bg: baseColors.bg },
  },
  // Text variants
  text: {
    primary: baseColors.text,
    muted: baseColors.textMuted,
    dim: baseColors.textDim,
    onPrimary: baseColors.textOnPrimary,
  },
  // Accent variants
  accent: {
    primary: baseColors.primary,
    primaryDim: baseColors.primaryDim,
    primaryLight: baseColors.primaryLight,
    secondary: baseColors.secondary,
    secondaryDim: baseColors.secondaryDim,
    warm: baseColors.warm,
    error: baseColors.accent,
    errorDim: baseColors.accentDim,
  },
} as const;

// Spacing & sizing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  full: 9999,
};

export const typography = {
  // Sizes
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 56,
  // Weights
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  // Font families
  mono: 'monospace',
  system: 'System',
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 250,
  slow: 350,
  spring: { damping: 15, stiffness: 150 },
};

export type ColorTokens = typeof colors;
export type SpacingTokens = typeof spacing;
export type BorderRadiusTokens = typeof borderRadius;
export type TypographyTokens = typeof typography;
export type AnimationTokens = typeof animation;

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  animation,
  neumorphicShadows,
  createNeumorphicStyle,
  createNeumorphicWrapper,
};
