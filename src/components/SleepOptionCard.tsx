import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SleepOption } from '@/utils/sleepMath';
import { baseColors, borderRadius, spacing, typography, neumorphicShadows, animation } from '@/constants/neumorphism';

interface SleepOptionCardProps {
  option: SleepOption;
  isSelected: boolean;
  onPress: () => void;
  index?: number;
}

export const SleepOptionCard: React.FC<SleepOptionCardProps> = ({
  option,
  isSelected,
  onPress,
  index = 0,
}) => {
  const [pressAnim] = useState(new Animated.Value(0));
  const [selectAnim] = useState(new Animated.Value(isSelected ? 1 : 0));
  const [qualityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(selectAnim, {
      toValue: isSelected ? 1 : 0,
      duration: animation.normal,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    Animated.timing(qualityAnim, {
      toValue: 1,
      duration: animation.normal + index * 100,
      delay: index * 80,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: false,
    }).start();
  }, [isSelected, selectAnim, qualityAnim, index]);

  const qualityColors = {
    optimal: baseColors.primary,
    good: baseColors.secondary,
    minimal: baseColors.accent,
  };

  const qualityColor = qualityColors[option.quality];
  const qualityLabels = {
    optimal: 'OPTIMAL',
    good: 'GOOD',
    minimal: 'MINIMAL',
  };

  const animatedScale = selectAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.98],
  });

  const animatedBorderWidth = selectAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const animatedShadowOpacity = selectAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.25, 0.45],
  });

  const qualityScale = qualityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const qualityOpacity = qualityAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePressIn = () => {
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: 80,
      useNativeDriver: false,
    }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: 80,
      useNativeDriver: false,
    }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: animatedScale }] }, styles.container]}>
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        style={styles.touchWrapper}
      >
        {/* Outer shadow (selected state) */}
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              shadowColor: isSelected ? baseColors.primary : '#000000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: animatedShadowOpacity,
              shadowRadius: 24,
              elevation: isSelected ? 12 : 8,
            },
          ]}
        >
          {/* Main card */}
          <Animated.View
            style={[
              styles.card,
              {
                borderWidth: animatedBorderWidth,
                borderColor: isSelected ? qualityColor : 'transparent',
                backgroundColor: isSelected ? baseColors.bgCard : baseColors.bg,
                shadowColor: isSelected ? qualityColor : '#000000',
                shadowOffset: { width: 0, height: isSelected ? 12 : 8 },
                shadowOpacity: isSelected ? 0.35 : 0.25,
                shadowRadius: isSelected ? 24 : 16,
                elevation: isSelected ? 12 : 8,
              },
            ]}
          >
            <View style={styles.content}>
              {/* Header */}
              <View style={styles.header}>
                <Animated.View style={[
                  styles.qualityBadge,
                  {
                    backgroundColor: qualityColor,
                    transform: [{ scale: qualityScale }],
                    opacity: qualityOpacity,
                  }
                ]}>
                  <Text style={styles.qualityBadgeText}>
                    {qualityLabels[option.quality]}
                  </Text>
                </Animated.View>

                <Animated.Text
                  style={[
                    styles.cycleCount,
                    { color: isSelected ? qualityColor : baseColors.text }
                  ]}>
                  {option.cycles} {'\u2009'}Cycles
                </Animated.Text>
              </View>

              {/* Main time */}
              <View style={styles.mainTime}>
                <Text style={styles.bedtimeLabel}>IN BED BY</Text>
                <Animated.Text
                  style={[
                    styles.bedtimeTime,
                    { color: isSelected ? qualityColor : baseColors.text }
                  ]}>
                  {option.displayTime}
                </Animated.Text>
              </View>

              {/* Details */}
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Animated.Text style={[
                    styles.detailValue,
                    { color: isSelected ? qualityColor : baseColors.primary }
                  ]}>
                    {option.totalSleepMinutes / 60}h {option.totalSleepMinutes % 60}m
                  </Animated.Text>
                  <Text style={styles.detailLabel}>Total Sleep</Text>
                </View>
                <View style={styles.detailItem}>
                  <Animated.Text style={[
                    styles.detailValue,
                    { color: isSelected ? qualityColor : baseColors.primary }
                  ]}>
                    {option.cycles}
                  </Animated.Text>
                  <Text style={styles.detailLabel}>Cycles</Text>
                </View>
                <View style={styles.detailItem}>
                  <Animated.Text style={[
                    styles.detailValue,
                    { color: isSelected ? qualityColor : baseColors.primary }
                  ]}>
                    {option.remPeaks.length}
                  </Animated.Text>
                  <Text style={styles.detailLabel}>REM Windows</Text>
                </View>
              </View>

              {/* Mini REM timeline */}
              <View style={styles.remTimeline}>
                <Text style={styles.remLabel}>REM PEAKS</Text>
                <View style={styles.remDots}>
                  {option.remPeaks.map((_, i) => (
                    <Animated.View
                      key={i}
                      style={[
                        styles.remDot,
                        i === option.cycles - 1 && styles.remDotLast,
                        {
                          backgroundColor: isSelected ? qualityColor : baseColors.primaryDim,
                          borderColor: qualityColor,
                          transform: [{ scale: isSelected && i === option.cycles - 1 ? 1.2 : 1 }],
                        }
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { 
    width: '100%', 
    marginBottom: spacing.xs,
  },
  touchWrapper: {
    width: '100%',
  },
  cardWrapper: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  content: { gap: spacing.md },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  qualityBadge: {
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  qualityBadgeText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    color: '#1a1a2e',
    letterSpacing: 0.5,
  },
  cycleCount: { 
    fontSize: typography.lg, 
    fontWeight: typography.semibold, 
    color: baseColors.text,
    letterSpacing: -0.5,
  },
  mainTime: { 
    alignItems: 'center', 
    paddingVertical: spacing.sm,
    marginVertical: spacing.xs,
  },
  bedtimeLabel: { 
    fontSize: typography.xs, 
    color: baseColors.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 1.5,
    fontWeight: typography.semibold,
    marginBottom: spacing.xs,
  },
  bedtimeTime: { 
    fontSize: typography.xxxl, 
    fontWeight: typography.light, 
    color: baseColors.text, 
    fontFamily: 'monospace',
    letterSpacing: -2,
    includeFontPadding: false,
  },
  details: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderColor: baseColors.borderDim,
    borderStyle: 'dashed',
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  detailItem: { alignItems: 'center', flex: 1 },
  detailValue: { 
    fontSize: typography.lg, 
    fontWeight: typography.semibold, 
    color: baseColors.primary,
    marginBottom: 2,
  },
  detailLabel: { 
    fontSize: typography.xs, 
    color: baseColors.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    fontWeight: typography.medium,
  },
  remTimeline: { 
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderColor: baseColors.borderDim,
    borderStyle: 'dashed',
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
  },
  remLabel: { 
    fontSize: typography.xs, 
    color: baseColors.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 1,
    fontWeight: typography.semibold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  remDots: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: spacing.sm 
  },
  remDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: baseColors.primaryDim,
    borderWidth: 2,
    borderColor: baseColors.primary,
  },
  remDotLast: { 
    backgroundColor: baseColors.primary, 
    transform: [{ scale: 1.2 }],
    shadowColor: baseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default SleepOptionCard;
