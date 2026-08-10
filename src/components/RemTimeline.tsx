import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { format } from 'date-fns';

interface RemTimelineProps {
  remPeaks: Date[];
  wakeTime: Date;
}

export const RemTimeline: React.FC<RemTimelineProps> = ({ remPeaks, wakeTime }) => {
  const totalMinutes = remPeaks.length * 90 + 15;
  const sleepStart = new Date(wakeTime.getTime() - totalMinutes * 60000);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Sleep Architecture</Text>
      <View style={styles.timeline}>
        {remPeaks.map((peak, i) => {
          const startOffset = i * 90 + 15;
          const percent = (startOffset / totalMinutes) * 100;
          const peakOffset = startOffset + 70;
          const peakPercent = (peakOffset / totalMinutes) * 100;
          
          return (
            <View key={i} style={styles.cycleRow}>
              <View style={styles.cycleTrack}>
                <View style={[styles.cycleFill, { width: `${percent}%` }]} />
                <View style={[styles.remWindow, { left: `${percent}%`, width: '22%' }]} />
                <View style={[styles.remPeakDot, { left: `${peakPercent}%` }]} />
              </View>
              <View style={styles.cycleInfo}>
                <Text style={styles.cycleNumber}>Cycle {i + 1}</Text>
                <Text style={styles.cycleTime}>{format(peak, 'h:mm a')}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendColorLight} />
          <Text style={styles.legendText}>Light Sleep</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorRem} />
          <Text style={styles.legendText}>REM Window</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorPeak} />
          <Text style={styles.legendText}>REM Peak</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 16 },
  title: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  timeline: { gap: 12 },
  cycleRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  cycleTrack: { flex: 1, height: 24, borderRadius: 12, backgroundColor: colors.bgTertiary, position: 'relative', overflow: 'hidden' },
  cycleFill: { position: 'absolute', top: 0, bottom: 0, left: 0, backgroundColor: colors.primaryDim, borderRadius: 12 },
  remWindow: { position: 'absolute', top: 2, bottom: 2, backgroundColor: colors.primary + '40', borderRadius: 10 },
  remPeakDot: { position: 'absolute', top: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, transform: [{ translateX: -8 }], shadowColor: colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 4 },
  cycleInfo: { width: 100, alignItems: 'flex-end' },
  cycleNumber: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase' },
  cycleTime: { fontSize: 14, fontWeight: '600', color: colors.primary, fontFamily: 'monospace' },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendColorLight: { width: 16, height: 16, borderRadius: 4, backgroundColor: colors.primaryDim },
  legendColorRem: { width: 16, height: 16, borderRadius: 4, backgroundColor: colors.primary + '60' },
  legendColorPeak: { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary },
  legendText: { fontSize: 11, color: colors.textMuted },
});
