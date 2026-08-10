import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { colors } from '@/constants/colors';

interface TimeWheelProps {
  value: number; // minutes since midnight
  onChange: (minutes: number) => void;
  step?: number;
  label?: string;
}

export const TimeWheel: React.FC<TimeWheelProps> = ({
  value,
  onChange,
  step = 5,
  label
}) => {
  const [dragValue, setDragValue] = useState(value);
  const anim = useRef(new Animated.Value(value)).current;
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const delta = -gesture.dy * 0.5;
        const newVal = Math.max(0, Math.min(1439, dragValue + delta));
        const stepped = Math.round(newVal / step) * step;
        setDragValue(stepped);
        anim.setValue(stepped);
      },
      onPanResponderRelease: () => {
        onChange(dragValue);
      },
    })
  ).current;

  useEffect(() => {
    setDragValue(value);
    anim.setValue(value);
  }, [value]);

  const hours = Math.floor(dragValue / 60);
  const mins = dragValue % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  return (
    <View style={styles.container} {...pan.panHandlers}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.wheelContainer}>
        <View style={styles.highlight} />
        <Text style={styles.timeText}>
          {String(displayHours).padStart(2, '0')}:{String(mins).padStart(2, '0')} {period}
        </Text>
      </View>
      <Text style={styles.hint}>Swipe up/down to adjust</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 8 },
  label: { color: colors.textMuted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  wheelContainer: { position: 'relative', paddingVertical: 20 },
  highlight: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    height: 48,
    marginTop: -24,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  timeText: {
    fontSize: 56,
    fontWeight: '300',
    color: colors.text,
    fontFamily: 'monospace',
    textAlign: 'center',
    letterSpacing: -2,
  },
  hint: { color: colors.textDim, fontSize: 11 },
});
