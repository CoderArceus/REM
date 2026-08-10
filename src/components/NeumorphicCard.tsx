import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface NeumorphicCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'flat' | 'raised' | 'pressed';
  padding?: number;
  borderRadius?: number;
}

export const NeumorphicCard: React.FC<NeumorphicCardProps> = ({
  children,
  style,
  variant = 'raised',
  padding = 20,
  borderRadius = 20
}) => {
  const baseStyles = StyleSheet.create({
    raised: {
      backgroundColor: colors.bg,
      borderRadius,
      padding,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    pressed: {
      backgroundColor: colors.bg,
      borderRadius,
      padding,
      shadowColor: colors.shadowDark,
      shadowOffset: { width: 3, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 3,
    },
    flat: {
      backgroundColor: colors.bg,
      borderRadius,
      padding,
      borderWidth: 1,
      borderColor: colors.primaryDim,
    }
  });

  const highlightStyles = StyleSheet.create({
    raised: {
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      borderRadius: borderRadius + 4,
      backgroundColor: 'transparent',
    }
  });

  return (
    <View style={[{ ...baseStyles[variant], ...style } as ViewStyle]}>
      {children}
    </View>
  );
};

export const NeumorphicButton: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary' | 'ghost';
  paddingVertical?: number;
  paddingHorizontal?: number;
  borderRadius?: number;
  disabled?: boolean;
}> = ({
  children,
  onPress,
  style,
  variant = 'primary',
  paddingVertical = 14,
  paddingHorizontal = 28,
  borderRadius = 16,
  disabled = false
}) => {
  const bgColors = {
    primary: colors.primary,
    secondary: colors.secondary,
    ghost: 'transparent'
  };
  
  const textColors = {
    primary: colors.bg,
    secondary: colors.bg,
    ghost: colors.primary
  };

  const borderColors = {
    primary: 'transparent',
    secondary: 'transparent',
    ghost: colors.primary
  };

  const baseStyle: ViewStyle = {
    backgroundColor: disabled ? colors.textDim : bgColors[variant],
    borderRadius,
    paddingVertical,
    paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: variant === 'ghost' ? 2 : 0,
    borderColor: borderColors[variant],
    shadowColor: variant === 'ghost' ? 'transparent' : colors.shadowColored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: variant === 'ghost' ? 0 : 0.3,
    shadowRadius: 8,
    elevation: variant === 'ghost' ? 0 : 4,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <View
      style={[baseStyle, style]}
      onPress={onPress}
      accessible={true}
      accessibilityRole="button"
    >
      <View style={{ color: textColors[variant] }}>
        {children}
      </View>
    </View>
  );
};
