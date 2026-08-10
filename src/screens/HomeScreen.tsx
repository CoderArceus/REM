import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useSleepStore } from '@/store/sleepStore';
import { calculateBedtimes, formatTime } from '@/utils/sleepMath';
import { colors } from '@/constants/colors';
import { TimeWheel } from '@/components/TimeWheel';
import { SleepOptionCard } from '@/components/SleepOptionCard';
import { RemTimeline } from '@/components/RemTimeline';
import { NeumorphicCard } from '@/components/NeumorphicCard';

export const HomeScreen: React.FC = () => {
  const { wakeTime, selectedCycles, setWakeTime, setSelectedCycles, addToHistory } = useSleepStore();
  const [parsedWakeTime, setParsedWakeTime] = React.useState<Date>(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  });

  const options = useMemo(() => calculateBedtimes(parsedWakeTime), [parsedWakeTime]);

  useEffect(() => {
    const [h, m] = wakeTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    setParsedWakeTime(d);
  }, [wakeTime]);

  const handleWakeTimeChange = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    setWakeTime(timeStr);
  };

  const handleOptionPress = (option: ReturnType<typeof calculateBedtimes>[0]) => {
    setSelectedCycles(option.cycles);
    addToHistory({
      wakeTime,
      bedtime: option.displayTime,
      cycles: option.cycles,
      date: new Date().toISOString()
    });
  };

  const selectedOption = options.find(o => o.cycles === selectedCycles) || options[1];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>REM Sleep Cycle</Text>
          <Text style={styles.subtitle}>Wake up refreshed, every time</Text>
        </View>

        {/* Wake Time Selector */}
        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>When do you need to wake up?</Text>
          <TimeWheel
            value={parsedWakeTime.getHours() * 60 + parsedWakeTime.getMinutes()}
            onChange={handleWakeTimeChange}
            label="WAKE UP TIME"
          />
        </NeumorphicCard>

        {/* Bedtime Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Bedtimes</Text>
          <View style={styles.optionsList}>
            {options.map((option) => (
              <SleepOptionCard
                key={option.cycles}
                option={option}
                isSelected={option.cycles === selectedCycles}
                onPress={() => handleOptionPress(option)}
              />
            ))}
          </View>
        </View>

        {/* Selected Option Details */}
        <NeumorphicCard style={styles.detailCard}>
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
        </NeumorphicCard>

        {/* REM Timeline */}
        <NeumorphicCard style={styles.sectionCard}>
          <RemTimeline remPeaks={selectedOption.remPeaks} wakeTime={parsedWakeTime} />
        </NeumorphicCard>

        {/* Quick Set Alarm Button */}
        <NeumorphicCard variant="flat" style={styles.alarmCard}>
          <Text style={styles.alarmText}>
            Set bedtime reminder for {selectedOption.displayTime}?
          </Text>
        </NeumorphicCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40, gap: 24 },
  header: { alignItems: 'center', marginTop: 10, gap: 4 },
  appTitle: { fontSize: 32, fontWeight: '700', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: colors.textMuted },
  sectionCard: { gap: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  section: { gap: 12 },
  optionsList: { gap: 12 },
  detailCard: { padding: 16 },
  detailTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-around' },
  detailCol: { alignItems: 'center' },
  detailLabel: { fontSize: 11, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  detailTime: { fontSize: 18, fontWeight: '600', color: colors.primary, marginTop: 4 },
  alarmCard: { paddingVertical: 16, paddingHorizontal: 20, alignItems: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primary },
  alarmText: { color: colors.primary, fontSize: 14, fontWeight: '500' },
});
