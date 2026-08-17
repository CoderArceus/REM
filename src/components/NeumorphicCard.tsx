import React from 'react';
import { View, ViewStyle, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { neumorphicShadows, baseColors, borderRadius, spacing, typography, animation } from '@/constants/neumorphism';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'flat' | 'raised' | 'pressed' | 'deep';
  padding?: number;
  borderRadius?: number;
  onPress?: () => void;
  activeOpacity?: number;
  disabled?: boolean;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  variant = 'raised',
  padding = 20,
  borderRadius: radius = 20,
  onPress,
  activeOpacity = 0.9,
  disabled = false,
}) => {
  const s = neumorphicShadows[variant];
  const actualVariant = onPress && !disabled ? 'pressed' : variant;

  const outerStyle: ViewStyle = {
    borderRadius: radius,
    padding: 0,
    shadowColor: neumorphicShadows[actualVariant].highlight.color,
    shadowOffset: {
      width: neumorphicShadows[actualVariant].highlight.offsetX,
      height: neumorphicShadows[actualVariant].highlight.offsetY,
    },
    shadowOpacity: neumorphicShadows[actualVariant].highlight.opacity,
    shadowRadius: neumorphicShadows[actualVariant].highlight.blur / 2,
  };

  const innerStyle: ViewStyle = {
    backgroundColor: actualVariant === 'pressed' ? baseColors.bgTertiary : baseColors.bg,
    borderRadius: radius,
    padding,
    shadowColor: neumorphicShadows[actualVariant].shadow.color,
    shadowOffset: {
      width: neumorphicShadows[actualVariant].shadow.offsetX,
      height: neumorphicShadows[actualVariant].shadow.offsetY,
    },
    shadowOpacity: neumorphicShadows[actualVariant].shadow.opacity,
    shadowRadius: neumorphicShadows[actualVariant].shadow.blur / 2,
    elevation: actualVariant === 'flat' ? 1 : actualVariant === 'pressed' ? 3 : actualVariant === 'deep' ? 12 : 8,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[{ borderRadius: radius }, style]}
        onPress={onPress}
        activeOpacity={activeOpacity}
        accessible={true}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        {/* Outer highlight (top-left) */}
        <View
          style={[
            { borderRadius: radius, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
            {
              shadowColor: neumorphicShadows[actualVariant].highlight.color,
              shadowOffset: {
                width: neumorphicShadows[actualVariant].highlight.offsetX,
                height: neumorphicShadows[actualVariant].highlight.offsetY,
              },
              shadowOpacity: neumorphicShadows[actualVariant].highlight.opacity,
              shadowRadius: neumorphicShadows[actualVariant].highlight.blur / 2,
            }
          ]}
          pointerEvents="none"
        />
        
        {/* Inner content with shadow (bottom-right) */}
        <View
          style={[
            { 
              borderRadius: radius,
              backgroundColor: actualVariant === 'pressed' ? baseColors.bgTertiary : baseColors.bg,
              padding,
              flex: 1,
            },
            {
              shadowColor: neumorphicShadows[actualVariant].shadow.color,
              shadowOffset: {
                width: neumorphicShadows[actualVariant].shadow.offsetX,
                height: neumorphicShadows[actualVariant].shadow.offsetY,
              },
              shadowOpacity: neumorphicShadows[actualVariant].shadow.opacity,
              shadowRadius: neumorphicShadows[actualVariant].shadow.blur / 2,
              elevation: actualVariant === 'flat' ? 1 : actualVariant === 'pressed' ? 3 : actualVariant === 'deep' ? 12 : 8,
            }
          ]}
        >
          {children}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[{ borderRadius: radius }, style]}>
      {/* Outer highlight (top-left) */}
      <View
        style={[
          { borderRadius: radius, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
          {
            shadowColor: neumorphicShadows[variant].highlight.color,
            shadowOffset: {
              width: neumorphicShadows[variant].highlight.offsetX,
              height: neumorphicShadows[variant].highlight.offsetY,
            },
            shadowOpacity: neumorphicShadows[variant].highlight.opacity,
            shadowRadius: neumorphicShadows[variant].highlight.blur / 2,
          }
        ]}
        pointerEvents="none"
      />
      
      {/* Inner content with shadow (bottom-right) */}
      <View
        style={[
          { 
            borderRadius: radius,
            backgroundColor: baseColors.bg,
            padding,
            flex: 1,
          },
          {
            shadowColor: neumorphicShadows[variant].shadow.color,
            shadowOffset: {
              width: neumorphicShadows[variant].shadow.offsetX,
              height: neumorphicShadows[variant].shadow.offsetY,
            },
            shadowOpacity: neumorphicShadows[variant].shadow.opacity,
            shadowRadius: neumorphicShadows[variant].shadow.blur / 2,
            elevation: variant === 'flat' ? 1 : variant === 'pressed' ? 3 : variant === 'deep' ? 12 : 8,
          }
        ]}
      >
        {children}
      </View>
    </View>
  );
};

export const NeumorphicButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  paddingVertical?: number;
  paddingHorizontal?: number;
  borderRadius?: number;
  disabled?: boolean;
  loading?: boolean;
}> = ({
  children,
  onPress,
  style,
  variant = 'primary',
  paddingVertical = 16,
  paddingHorizontal = 32,
  borderRadius: radius = 16,
  disabled = false,
  loading = false,
}) => {
  const bgColors = {
    primary: baseColors.primary,
    secondary: baseColors.secondary,
    ghost: 'transparent',
    outline: 'transparent',
  };

  const textColors = {
    primary: baseColors.textOnPrimary,
    secondary: baseColors.textOnPrimary,
    ghost: baseColors.primary,
    outline: baseColors.primary,
  };

  const borderColors = {
    primary: 'transparent',
    secondary: 'transparent',
    ghost: baseColors.primary,
    outline: baseColors.primary,
  };

  const baseStyle: ViewStyle = {
    backgroundColor: disabled ? baseColors.textDim : bgColors[variant],
    borderRadius: radius,
    paddingVertical,
    paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'ghost' || variant === 'outline' ? 2 : 0,
    borderColor: borderColors[variant],
    shadowColor: variant === 'ghost' || variant === 'outline' ? 'transparent' : baseColors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: variant === 'ghost' || variant === 'outline' ? 0 : 0.3,
    shadowRadius: 8,
    elevation: variant === 'ghost' || variant === 'outline' ? 0 : 4,
    opacity: disabled || loading ? 0.5 : 1,
    minWidth: 120,
  };

  return (
    <TouchableOpacity
      style={[baseStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
    >
      {loading ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: textColors[variant],
              borderTopColor: 'transparent',
            }}
          />
        </View>
      ) : (
        <Text style={{ color: textColors[variant] }}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export const NeumorphicToggle: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ value, onChange, label, disabled = false, size = 'md' }) => {
  const sizes = {
    sm: { trackWidth: 40, trackHeight: 22, thumbSize: 18, padding: 2 },
    md: { trackWidth: 52, trackHeight: 28, thumbSize: 24, padding: 2 },
    lg: { trackWidth: 64, trackHeight: 34, thumbSize: 30, padding: 2 },
  };

  const s = sizes[size];

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {label && <Text style={{ color: baseColors.text, fontSize: 14 }}>{label}</Text>}
      <TouchableOpacity
        style={{
          width: s.trackWidth,
          height: s.trackHeight,
          borderRadius: s.trackHeight / 2,
          backgroundColor: value ? baseColors.primary : baseColors.bgTertiary,
          borderWidth: value ? 0 : 1,
          borderColor: baseColors.border,
          padding: s.padding,
          justifyContent: 'center',
          ...(value ? {
            shadowColor: baseColors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 4,
          } : {
            shadowColor: '#000000',
            shadowOffset: { width: 1, height: 1 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 2,
          }),
        }}
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
      >
        <View
          style={{
            width: s.thumbSize,
            height: s.thumbSize,
            borderRadius: s.thumbSize / 2,
            backgroundColor: value ? '#ffffff' : baseColors.textDim,
            marginLeft: value ? s.trackWidth - s.thumbSize - s.padding : s.padding,
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NeumorphicCard;
