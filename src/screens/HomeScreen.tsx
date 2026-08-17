import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';
import { useSleepStore } from '@/store/sleepStore';
import { calculateBedtimes } from '@/utils/sleepMath';
import { baseColors, borderRadius, spacing, typography, animation } from '@/constants/neumorphism';
import { TimeWheel } from '@/components/TimeWheel';
import { SleepOptionCard } from '@/components/SleepOptionCard';
import { RemTimeline } from '@/components/RemTimeline';
import { NeumorphicCard, NeumorphicButton } from '@/components/NeumorphicCard';

export const HomeScreen: React.FC = () => {
  const { wakeTime, selectedCycles, setWakeTime, setSelectedCycles, addToHistory, history } = useSleepStore();
  const [parsedWakeTime, setParsedWakeTime] = useState<Date>(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  });
  const [sleepStartTime, setSleepStartTime] = useState<Date | null>(null);

  const options = useMemo(() => calculateBedtimes(parsedWakeTime), [parsedWakeTime]);

  useEffect(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setParsedWakeTime(d);
  }, [wakeTime]);

  useEffect(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    const sleepStart = new Date(d.getTime() - (6 * 90 + 15) * 60000);
    setSleepStartTime(sleepStart);
  }, [wakeTime]);

  const handleWakeTimeChange = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setWakeTime(timeStr);
  };

  const handleOptionPress = async (option: ReturnType<typeof calculateBedtimes>[0]) => {
    setSelectedCycles(option.cycles);
    addToHistory({ wakeTime, bedtime: option.displayTime, cycles: option.cycles, date: new Date().toISOString() });
    await scheduleBedtimeReminder(option.displayTime);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const scheduleBedtimeReminder = async (bedtime: string) => {
    try {
      const [hours, minutes] = bedtime.replace(' ', '').split(':').map(Number);
      const bedtimeDate = new Date();
      bedtimeDate.setHours(hours % 12 + (bedtime.includes('PM') && hours !== 12 ? 12 : 0), minutes, 0, 0);
      bedtimeDate.setMinutes(bedtimeDate.getMinutes() - 30);
      if (bedtimeDate <= new Date()) {
        bedtimeDate.setDate(bedtimeDate.getDate() + 1);
      }
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Bedtime Reminder', body: `Time to wind down for optimal sleep!` },
        trigger: { date: bedtimeDate, repeats: true } as any,
      });
    } catch (e) {
      console.log('Notification scheduling failed:', e);
    }
  };

  const selectedOption = options.find(o => o.cycles === selectedCycles) || options[1];

  const sleepStart = useMemo(() => {
    const wake = new Date();
    const [h, m] = wakeTime.split(':').map(Number);
    wake.setHours(h, m, 0, 0);
    const cycles = selectedOption.cycles;
    return new Date(wake.getTime() - (cycles * 90 + 15) * 60000);
  }, [wakeTime, selectedOption.cycles]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={baseColors.bg} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>REM Sleep Cycle</Text>
          <Text style={styles.subtitle}>Wake up refreshed, every time</Text>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>When do you need to wake up?</Text>
          <TimeWheel value={parsedWakeTime.getHours() * 60 + parsedWakeTime.getMinutes()} onChange={handleWakeTimeChange} label="WAKE UP TIME" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Bedtimes</Text>
          <View style={styles.optionsList}>
            {options.map((option, index) => (
              <SleepOptionCard key={option.cycles} option={option} isSelected={option.cycles === selectedCycles} onPress={() => handleOptionPress(option)} index={index} />
            ))}
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Your Sleep Plan</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>In Bed By</Text>
              <Text style={styles.detailTime}>{selectedOption.displayTime}</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Sleep Duration</Text>
              <Text style={styles.detailTime}>{selectedOption.totalSleepMinutes / 60}h {selectedOption.totalSleepMinutes % 60}m</Text>
            </View>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Cycles</Text>
              <Text style={styles.detailTime}>{selectedOption.cycles}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <RemTimeline remPeaks={selectedOption.remPeaks} wakeTime={parsedWakeTime} sleepStart={sleepStart} />
        </View>

        <NeumorphicButton style={styles.alarmButton} onPress={async () => {
          await Notifications.scheduleNotificationAsync({
            content: { title: 'Bedtime Reminder', body: `Time to wind down for ${selectedOption.displayTime}!` },
            trigger: { seconds: 5 } as any,
          });
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }} variant="primary">
          Set bedtime reminder for {selectedOption.displayTime}
        </NeumorphicButton>

        {history.length > 0 && (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Recent History</Text>
            <View style={styles.historyList}>
              {history.slice(0, 5).map((entry, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={styles.historyTime}>
                    <Text style={styles.historyBedtime}>{entry.bedtime}</Text>
                    <Text style={styles.historyWake}>{entry.wakeTime}</Text>
                  </View>
                  <View style={styles.historyDetails}>
                    <Text style={styles.historyCycles}>{entry.cycles} cycles</Text>
                    <Text style={styles.historyDate}>{new Date(entry.date).toLocaleDateString()}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: baseColors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.xl },
  header: { alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md, gap: spacing.xs },
  appTitle: { fontSize: typography.xxxl, fontWeight: typography.bold, color: baseColors.text, letterSpacing: -1 },
  subtitle: { fontSize: typography.md, color: baseColors.textMuted, fontWeight: typography.medium },
  sectionCard: { padding: spacing.lg, gap: spacing.md, backgroundColor: baseColors.bgCard, borderRadius: borderRadius.xl, shadowColor: '#000000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  section: { gap: spacing.md },
  sectionTitle: { fontSize: typography.md, fontWeight: typography.semibold, color: baseColors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs },
  optionsList: { gap: spacing.md },
  detailCard: { padding: spacing.lg, backgroundColor: baseColors.bgCard, borderRadius: borderRadius.xl, shadowColor: baseColors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6 },
  detailTitle: { fontSize: typography.lg, fontWeight: typography.semibold, color: baseColors.text, marginBottom: spacing.lg, textAlign: 'center' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-around', gap: spacing.md },
  detailCol: { alignItems: 'center', flex: 1 },
  detailLabel: { fontSize: typography.xs, color: baseColors.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontWeight: typography.semibold, marginBottom: spacing.xs },
  detailTime: { fontSize: typography.xl, fontWeight: typography.semibold, color: baseColors.primary, fontFamily: 'monospace' },
  alarmButton: { marginTop: spacing.sm },
  historyList: { gap: spacing.sm },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, backgroundColor: baseColors.bgTertiary, borderRadius: borderRadius.md },
  historyTime: { alignItems: 'flex-start' },
  historyBedtime: { fontSize: typography.lg, fontWeight: typography.semibold, color: baseColors.primary, fontFamily: 'monospace' },
  historyWake: { fontSize: typography.sm, color: baseColors.textMuted },
  historyDetails: { alignItems: 'flex-end' },
  historyCycles: { fontSize: typography.md, fontWeight: typography.semibold, color: baseColors.primary },
  historyDate: { fontSize: typography.xs, color: baseColors.textDim },
});

export default HomeScreen;
