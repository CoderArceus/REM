import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Switch } from 'react-native';
import { useSleepStore } from '@/store/sleepStore';
import { colors } from '@/constants/colors';
import { NeumorphicCard, NeumorphicButton } from '@/components/NeumorphicCard';

export const SettingsScreen: React.FC = () => {
  const { clearHistory } = useSleepStore();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your sleep experience</Text>
        </View>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sleep Preferences</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Sleep Latency</Text>
              <Text style={styles.settingValue}>15 minutes</Text>
            </View>
          </View>
          
          <View style={[styles.settingRow, { borderTopWidth: 1, borderColor: colors.primaryDim, borderStyle: 'dashed' }]}>
            <View>
              <Text style={styles.settingLabel}>Cycle Length</Text>
              <Text style={styles.settingValue}>90 minutes</Text>
            </View>
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderColor: colors.primaryDim, borderStyle: 'dashed' }]}>
            <View>
              <Text style={styles.settingLabel}>REM Window</Text>
              <Text style={styles.settingValue}>60-80 min into cycle</Text>
            </View>
          </View>
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Bedtime Reminders</Text>
              <Text style={styles.settingHint}>Get notified when it's time to sleep</Text>
            </View>
            <Switch
              trackColor={{ false: colors.textDim, true: colors.primary }}
              thumbColor={colors.bg}
              value={true}
              onValueChange={() => {}}
            />
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderColor: colors.primaryDim, borderStyle: 'dashed' }]}>
            <View>
              <Text style={styles.settingLabel}>Wake-up Alarm</Text>
              <Text style={styles.settingHint}>Gentle alarm at your wake time</Text>
            </View>
            <Switch
              trackColor={{ false: colors.textDim, true: colors.secondary }}
              thumbColor={colors.bg}
              value={false}
              onValueChange={() => {}}
            />
          </View>
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingLabel}>Sleep History</Text>
              <Text style={styles.settingHint}>View your past sleep plans</Text>
            </View>
            <NeumorphicButton 
              variant="ghost" 
              onPress={() => {}} 
              style={{ paddingVertical: 8, paddingHorizontal: 16 }}
            >
              <Text style={{ color: colors.primary }}>View History</Text>
            </NeumorphicButton>
          </View>

          <View style={[styles.settingRow, { borderTopWidth: 1, borderColor: colors.primaryDim, borderStyle: 'dashed' }]}>
            <View>
              <Text style={styles.settingLabel}>Clear All Data</Text>
              <Text style={styles.settingHint}>Reset history and preferences</Text>
            </View>
            <NeumorphicButton 
              variant="secondary" 
              onPress={clearHistory} 
              style={{ paddingVertical: 8, paddingHorizontal: 16 }}
            >
              <Text>Clear</Text>
            </NeumorphicButton>
          </View>
        </NeumorphicCard>

        <NeumorphicCard variant="flat" style={styles.aboutCard}>
          <Text style={styles.aboutText}>REM Sleep Cycle v1.0.0</Text>
          <Text style={styles.aboutSubtext}>Built with Expo & React Native</Text>
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
  title: { fontSize: 32, fontWeight: '700', color: colors.text, letterSpacing: -1 },
  subtitle: { fontSize: 14, color: colors.textMuted },
  sectionCard: { gap: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 1 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  settingLabel: { fontSize: 16, color: colors.text, fontWeight: '500' },
  settingValue: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  settingHint: { fontSize: 12, color: colors.textDim, marginTop: 2 },
  aboutCard: { alignItems: 'center', paddingVertical: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.primaryDim },
  aboutText: { fontSize: 16, fontWeight: '600', color: colors.text },
  aboutSubtext: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
