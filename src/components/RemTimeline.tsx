import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { baseColors, borderRadius, spacing, typography, animation } from '@/constants/neumorphism';

interface RemTimelineProps {
  remPeaks: Date[];
  wakeTime: Date;
  sleepStart?: Date;
}

export const RemTimeline: React.FC<RemTimelineProps> = ({ remPeaks, wakeTime, sleepStart }) => {
  const totalCycles = remPeaks.length;
  const cycleLength = 90; // minutes
  const sleepLatency = 15; // minutes
  
  const totalMinutes = useMemo(() => {
    if (sleepStart) {
      return (wakeTime.getTime() - sleepStart.getTime()) / 60000;
    }
    return totalCycles * 90 + sleepLatency;
  }, [sleepStart, wakeTime, totalCycles]);

  const sleepStartTime = useMemo(() => {
    if (sleepStart) return sleepStart;
    return new Date(wakeTime.getTime() - totalMinutes * 60000);
  }, [sleepStart, wakeTime, totalMinutes]);

  const cycles = useMemo(() => {
    return remPeaks.map((peak, i) => {
      const cycleStart = new Date(sleepStartTime.getTime() + (i * 90 + sleepLatency) * 60000);
      const cycleEnd = new Date(cycleStart.getTime() + 90 * 60000);
      const remStart = new Date(cycleStart.getTime() + 60 * 60000);
      const remEnd = new Date(cycleStart.getTime() + 80 * 60000);
      const peakOffset = i * 90 + sleepLatency + 70; // REM peak at ~70min into cycle
      const percent = (peakOffset / totalMinutes) * 100;
      const cyclePercent = ((i * 90 + sleepLatency) / totalMinutes) * 100;
      const cycleWidth = (90 / totalMinutes) * 100;
      
      return {
        index: i,
        cycleStart,
        cycleEnd,
        remStart,
        remEnd,
        peak,
        percent: Math.min(100, Math.max(0, percent)),
        cyclePercent: Math.min(100, Math.max(0, cyclePercent)),
        cycleWidth: Math.min(100, Math.max(0, cycleWidth)),
        isLast: i === remPeaks.length - 1,
      };
    });
  }, [remPeaks, sleepStartTime, totalMinutes]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sleep Architecture</Text>
        <Text style={styles.subtitle}>
          {remPeaks.length} cycles • {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m total
        </Text>
      </View>

      <View style={styles.timeline}>
        {cycles.map((cycle) => (
          <View key={cycle.index} style={styles.cycleRow}>
            <View style={styles.cycleTrackContainer}>
              <View style={styles.cycleTrack}>
                {/* Cycle background */}
                <View style={[
                  styles.cycleFill,
                  { width: `${cycle.cycleWidth}%`, left: `${cycle.cyclePercent}%` }
                ]} />
                
                {/* Light sleep phase */}
                <View style={[
                  styles.remWindow,
                  { left: `${cycle.cyclePercent}%`, width: '22%' }
                ]} />
                
                {/* REM window */}
                <View style={[
                  styles.remWindowDeep,
                  { left: `${cycle.cyclePercent + 22}%`, width: '33%' }
                ]} />
                
                {/* REM peak indicator */}
                <View style={[
                  styles.remPeakDot,
                  { left: `${cycle.percent}%` }
                ]} />
              </View>
            </View>
            
            <View style={styles.cycleInfo}>
              <Text style={styles.cycleNumber}>Cycle {cycle.index + 1}</Text>
              <Text style={styles.cycleTime}>{format(cycle.peak, 'h:mm a')}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={styles.legendColorLight} />
          <Text style={styles.legendText}>Light Sleep</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorRem} />
          <Text style={styles.legendText}>Deep Sleep</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorRemDeep} />
          <Text style={styles.legendText}>REM Window</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendColorPeak} />
          <Text style={styles.legendText}>REM Peak</Text>
        </View>
      </View>

      {/* Time axis */}
      <View style={styles.timeAxis}>
        <Text style={styles.axisTime}>{format(sleepStartTime, 'h:mm a')}</Text>
        <View style={styles.axisLine} />
        <Text style={styles.axisTime}>{format(wakeTime, 'h:mm a')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    gap: spacing.lg,
    padding: spacing.md,
    backgroundColor: baseColors.bgCard,
    borderRadius: borderRadius.xl,
    // Neumorphic card
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: { 
    fontSize: typography.lg, 
    fontWeight: typography.semibold, 
    color: baseColors.text,
  },
  subtitle: { 
    fontSize: typography.sm, 
    color: baseColors.textMuted,
    fontWeight: typography.medium,
  },
  timeline: { gap: spacing.md },
  cycleRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.lg,
  },
  cycleTrackContainer: { flex: 1 },
  cycleTrack: { 
    height: 32, 
    borderRadius: borderRadius.lg, 
    backgroundColor: baseColors.bgTertiary, 
    position: 'relative', 
    overflow: 'hidden',
    // Inset shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  cycleFill: { 
    position: 'absolute', 
    top: 0, 
    bottom: 0, 
    left: 0, 
    backgroundColor: baseColors.primaryDim, 
    borderRadius: borderRadius.lg,
  },
  remWindow: { 
    position: 'absolute', 
    top: 3, 
    bottom: 3, 
    backgroundColor: baseColors.primary + '30', 
    borderRadius: borderRadius.md,
  },
  remWindowDeep: { 
    position: 'absolute', 
    top: 3, 
    bottom: 3, 
    backgroundColor: baseColors.primary + '50', 
    borderRadius: borderRadius.md,
  },
  remPeakDot: { 
    position: 'absolute', 
    top: -6, 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: baseColors.primary, 
    transform: [{ translateX: -10 }],
    shadowColor: baseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  cycleInfo: { 
    width: 100, 
    alignItems: 'flex-end',
    marginLeft: spacing.md,
  },
  cycleNumber: { 
    fontSize: typography.xs, 
    color: baseColors.textMuted, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5,
    fontWeight: typography.semibold,
    marginBottom: 2,
  },
  cycleTime: { 
    fontSize: typography.md, 
    fontWeight: typography.semibold, 
    color: baseColors.primary, 
    fontFamily: 'monospace',
  },
  legend: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: spacing.lg, 
    marginTop: spacing.lg, 
    flexWrap: 'wrap',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderColor: baseColors.borderDim,
    borderStyle: 'dashed',
  },
  legendItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: spacing.xs 
  },
  legendColorLight: { 
    width: 16, 
    height: 16, 
    borderRadius: borderRadius.sm, 
    backgroundColor: baseColors.primaryDim,
  },
  legendColorRem: { 
    width: 16, 
    height: 16, 
    borderRadius: borderRadius.sm, 
    backgroundColor: baseColors.primary + '50',
  },
  legendColorRemDeep: { 
    width: 16, 
    height: 16, 
    borderRadius: borderRadius.sm, 
    backgroundColor: baseColors.primary + '70',
  },
  legendColorPeak: { 
    width: 16, 
    height: 16, 
    borderRadius: borderRadius.full, 
    backgroundColor: baseColors.primary,
    shadowColor: baseColors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  legendText: { 
    fontSize: typography.xs, 
    color: baseColors.textMuted,
    fontWeight: typography.medium,
  },
  timeAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  axisTime: {
    fontSize: typography.xs,
    color: baseColors.textMuted,
    fontFamily: 'monospace',
    fontWeight: typography.medium,
  },
  axisLine: {
    flex: 1,
    height: 1,
    backgroundColor: baseColors.borderDim,
    borderStyle: 'dashed',
    marginHorizontal: spacing.md,
  },
});

export default RemTimeline;
