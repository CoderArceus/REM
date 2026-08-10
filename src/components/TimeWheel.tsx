import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Dimensions, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { baseColors, borderRadius, spacing, typography } from '@/constants/neumorphism';

interface TimeWheelProps {
  value: number; // minutes since midnight (0-1439)
  onChange: (minutes: number) => void;
  step?: number;
  label?: string;
  disabled?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WHEEL_RADIUS = Math.min(SCREEN_WIDTH * 0.8, 280);
const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;
const STEP = 5; // minutes

export const TimeWheel: React.FC<TimeWheelProps> = ({
  value,
  onChange,
  step = STEP,
  label,
  disabled = false,
}) => {
  const [dragValue, setDragValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [lastSnapValue, setLastSnapValue] = useState(Math.round(value / step) * step);
  
  const translateY = useRef(new Animated.Value(0)).current;
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => !disabled,
    onPanResponderGrant: () => {
      setIsDragging(true);
      if (!disabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    },
    onPanResponderMove: (_, gesture) => {
      if (disabled) return;
      
      const delta = -gesture.dy * 0.6; // sensitivity
      const newVal = Math.max(0, Math.min(1439, dragValue + delta));
      setDragValue(newVal);
      
      // Animate the wheel smoothly
      Animated.timing(translateY, {
        toValue: -(newVal / step) * ITEM_HEIGHT,
        duration: 50,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: () => {
      if (disabled) return;
      
      const snapped = Math.round(dragValue / step) * step;
      const clamped = Math.max(0, Math.min(1439, snapped));
      
      setLastSnapValue(clamped);
      setDragValue(clamped);
      setIsDragging(false);
      
      // Haptic feedback on final snap
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Animate to exact snap position
      Animated.timing(translateY, {
        toValue: -(clamped / step) * ITEM_HEIGHT,
        duration: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      
      onChange(clamped);
    },
  })).current;

  // Sync with external value changes
  useEffect(() => {
    if (!isDragging) {
      const targetVal = value;
      setDragValue(targetVal);
      setLastSnapValue(Math.round(targetVal / step) * step);
      Animated.timing(translateY, {
        toValue: -(targetVal / step) * ITEM_HEIGHT,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [value, isDragging]);

  const hours = Math.floor(dragValue / 60);
  const mins = dragValue % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  // Generate wheel items for visual feedback
  const centerIndex = Math.round(dragValue / step);
  const items = Array.from({ length: VISIBLE_ITEMS }, (_, i) => {
    const offset = i - Math.floor(VISIBLE_ITEMS / 2);
    const itemVal = Math.max(0, Math.min(1439, (centerIndex + offset) * step));
    const h = Math.floor(itemVal / 60);
    const m = itemVal % 60;
    const p = h >= 12 ? 'PM' : 'AM';
    const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const isCenter = offset === 0;
    return {
      value: itemVal,
      display: `${String(dh).padStart(2, '0')}:${String(m).padStart(2, '0')} ${p}`,
      isCenter,
      offset,
    };
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={styles.wheelContainer}>
        {/* Center highlight line */}
        <View style={styles.centerLine} />
        
        {/* Wheel items */}
        <Animated.View
          style={[
            styles.wheelItems,
            { transform: [{ translateY }] }
          ]}
        >
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.wheelItem,
                item.isCenter && styles.wheelItemCenter,
              ]}
            >
              <Text style={[
                styles.itemText,
                item.isCenter && styles.itemTextCenter,
              ]}>
                {item.display}
              </Text>
            </View>
          ))}
        </Animated.View>
        
        {/* Gradient overlays for fade effect */}
        <View style={styles.fadeTop} />
        <View style={styles.fadeBottom} />
      </View>
      
      <Text style={styles.hint}>
        {isDragging ? 'Release to set' : 'Swipe up/down to adjust'}
      </Text>
    </View>
  );
};

import { Easing } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    alignItems: 'center', 
    gap: spacing.sm,
    width: '100%',
  },
  label: { 
    color: baseColors.textMuted, 
    fontSize: typography.sm, 
    textTransform: 'uppercase', 
    letterSpacing: 1,
    fontWeight: typography.semibold,
  },
  wheelContainer: { 
    position: 'relative',
    width: WHEEL_RADIUS,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: baseColors.bgTertiary,
    // Neumorphic inset shadow for wheel track
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  centerLine: {
    position: 'absolute',
    top: '50%',
    left: spacing.md,
    right: spacing.md,
    height: 2,
    marginTop: -1,
    backgroundColor: baseColors.primary,
    borderWidth: 0,
    zIndex: 10,
  },
  wheelItems: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wheelItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  wheelItemCenter: {
    backgroundColor: baseColors.primaryDim,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.md,
  },
  itemText: {
    fontSize: typography.lg,
    fontWeight: typography.light,
    color: baseColors.textMuted,
    fontFamily: typography.mono,
    textAlign: 'center',
    letterSpacing: -1,
  },
  itemTextCenter: {
    fontSize: typography.xl,
    fontWeight: typography.semibold,
    color: baseColors.primary,
    letterSpacing: -2,
    textShadowColor: baseColors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: 'transparent',
    // Gradient via overlay
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: 'transparent',
  },
  hint: { 
    color: baseColors.textDim, 
    fontSize: typography.xs,
    marginTop: spacing.xs,
  },
});

export default TimeWheel;
