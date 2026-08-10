import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SleepOption } from '@/utils/sleepMath';
import { colors } from '@/constants/colors';
import { NeumorphicCard } from './NeumorphicCard';

interface SleepOptionCardProps {
  option: SleepOption;
  isSelected: boolean;
  onPress: () => void;
}

export const SleepOptionCard: React.FC<SleepOptionCardProps> = ({
  option,
  isSelected,
  onPress
}) => {
  const qualityColor = option.quality === 'optimal' ? '#00d4aa' 
    : option.quality === 'good' ? '#ffb800' : '#ff6b6b';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.container}>
      <NeumorphicCard variant={isSelected ? 'pressed' : 'raised'} style={styles.card}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.cycleCount, { color: qualityColor }]}>
              {option.cycles} Cycles
            </Text>
            <Text style={[styles.qualityBadge, { backgroundColor: qualityColor }]}>
              {option.quality.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.mainTime}>
            <Text style={styles.bedtimeLabel}>IN BED BY</Text>
            <Text style={styles.bedtimeTime}>{option.displayTime}</Text>
          </View>
          
          <View style={styles.details}>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{option.totalSleepMinutes / 60}h {option.totalSleepMinutes % 60}m</Text>
              <Text style={styles.detailLabel}>Total Sleep</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{option.cycles}</Text>
              <Text style={styles.detailLabel}>Full Cycles</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>
                {option.remPeaks.length} peaks
              </Text>
              <Text style={styles.detailLabel}>REM Windows</Text>
            </View>
          </View>
          
          <View style={styles.remTimeline}>
            <Text style={styles.remLabel}>REM Peaks:</Text>
            <View style={styles.remDots}>
              {option.remPeaks.map((peak, i) => (
                <View key={i} style={[
                  styles.remDot,
                  i === option.cycles - 1 && styles.remDotLast
                ]} />
              ))}
            </View>
          </View>
        </View>
      </NeumorphicCard>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  card: { overflow: 'hidden' },
  content: { gap: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cycleCount: { fontSize: 16, fontWeight: '600', color: colors.text },
  qualityBadge: { fontSize: 10, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  mainTime: { alignItems: 'center', paddingVertical: 4 },
  bedtimeLabel: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  bedtimeTime: { fontSize: 42, fontWeight: '300', color: colors.text, fontFamily: 'monospace' },
  details: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8, borderTopWidth: 1, borderColor: colors.primaryDim, borderStyle: 'dashed' },
  detailItem: { alignItems: 'center' },
  detailValue: { fontSize: 18, fontWeight: '600', color: colors.primary },
  detailLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },
  remTimeline: { paddingTop: 4 },
  remLabel: { fontSize: 11, color: colors.textMuted, marginBottom: 6 },
  remDots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  remDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primaryDim, borderWidth: 2, borderColor: colors.primary },
  remDotLast: { backgroundColor: colors.primary, transform: [{ scale: 1.2 }] },
});
