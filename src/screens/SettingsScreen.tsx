import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { useSleepStore } from '@/store/sleepStore';
import { baseColors, borderRadius, spacing, typography } from '@/constants/neumorphism';
import { NeumorphicCard, NeumorphicToggle } from '@/components/NeumorphicCard';

export const SettingsScreen: React.FC = () => {
  const { wakeTime } = useSleepStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [bedtimeReminder, setBedtimeReminder] = useState(true);
  const [reminderMinutes, setReminderMinutes] = useState(30);
  const [theme, setTheme] = useState<'dark' | 'auto'>('dark');
  const [permissionStatus, setPermissionStatus] = useState<Notifications.PermissionStatus | null>(null);

  useEffect(() => { checkPermissions(); }, []);

  const checkPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionStatus(status);
  };

  const requestPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync({ ios: { allowAlert: true, allowBadge: true, allowSound: true } });
    setPermissionStatus(status);
    if (status !== 'granted') setNotificationsEnabled(false);
  };

  const reminderOptions = [15, 30, 45, 60];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={baseColors.bg} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your sleep experience</Text>
        </View>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Bedtime Reminders</Text>
              <Text style={styles.settingDesc}>Get reminded before your optimal bedtime</Text>
            </View>
            <NeumorphicToggle value={notificationsEnabled && bedtimeReminder} onChange={(val) => setBedtimeReminder(val)} disabled={!notificationsEnabled} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sound</Text>
              <Text style={styles.settingDesc}>Play notification sound</Text>
            </View>
            <NeumorphicToggle value={soundEnabled} onChange={setSoundEnabled} disabled={!notificationsEnabled} />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Vibration</Text>
              <Text style={styles.settingDesc}>Vibrate on notifications</Text>
            </View>
            <NeumorphicToggle value={vibrationEnabled} onChange={setVibrationEnabled} disabled={!notificationsEnabled} />
          </View>

          {permissionStatus !== 'granted' && (
            <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
              <Text style={styles.permissionButtonText}>Enable Notifications</Text>
            </TouchableOpacity>
          )}
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Theme</Text>
              <Text style={styles.settingDesc}>Choose color scheme</Text>
            </View>
            <View style={styles.themeSelector}>
              {(['dark', 'auto'] as const).map((t) => (
                <TouchableOpacity key={t} onPress={() => setTheme(t)} style={[styles.themeOption, theme === t && styles.themeOptionActive]}>
                  <Text style={[styles.themeOptionText, theme === t && styles.themeOptionTextActive]}>{t.charAt(0).toUpperCase() + t.slice(1)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sound & Haptics</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Haptic Feedback</Text>
              <Text style={styles.settingDesc}>Vibrate on interactions</Text>
            </View>
            <NeumorphicToggle value={vibrationEnabled} onChange={setVibrationEnabled} />
          </View>
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard} variant="flat">
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity style={styles.dangerButton}><Text style={styles.dangerButtonText}>Clear Sleep History</Text></TouchableOpacity>
          <TouchableOpacity style={styles.dangerButton}><Text style={styles.dangerButtonText}>Export Sleep Data</Text></TouchableOpacity>
        </NeumorphicCard>

        <NeumorphicCard style={styles.sectionCard} variant="flat">
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutRow}><Text style={styles.aboutLabel}>Version</Text><Text style={styles.aboutValue}>1.0.0</Text></View>
          <View style={styles.aboutRow}><Text style={styles.aboutLabel}>Built with</Text><Text style={styles.aboutValue}>Expo, React Native, TypeScript</Text></View>
        </NeumorphicCard>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: baseColors.bg },
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg },
  header: { alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md, gap: spacing.xs },
  title: { fontSize: typography.xxxl, fontWeight: typography.bold, color: baseColors.text, letterSpacing: -1 },
  subtitle: { fontSize: typography.md, color: baseColors.textMuted, fontWeight: typography.medium },
  sectionCard: { gap: spacing.md },
  sectionTitle: { fontSize: typography.md, fontWeight: typography.semibold, color: baseColors.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.xs },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderColor: baseColors.borderDim, borderStyle: 'dashed' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: typography.md, fontWeight: typography.semibold, color: baseColors.text, marginBottom: 2 },
  settingDesc: { fontSize: typography.xs, color: baseColors.textDim },
  permissionButton: { marginTop: spacing.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, backgroundColor: baseColors.accentDim, borderWidth: 1, borderColor: baseColors.accent, alignSelf: 'flex-start' },
  permissionButtonText: { color: baseColors.accent, fontSize: typography.sm, fontWeight: typography.semibold },
  themeSelector: { flexDirection: 'row', gap: spacing.sm },
  themeOption: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: borderRadius.full, backgroundColor: baseColors.bgTertiary, borderWidth: 1, borderColor: baseColors.borderDim },
  themeOptionActive: { backgroundColor: baseColors.primary, borderColor: baseColors.primary },
  themeOptionText: { fontSize: typography.sm, color: baseColors.textMuted, fontWeight: typography.medium },
  themeOptionTextActive: { color: baseColors.bg, fontWeight: typography.semibold },
  dangerButton: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg, borderRadius: borderRadius.md, backgroundColor: baseColors.accentDim, borderWidth: 1, borderColor: baseColors.accent, alignItems: 'center' },
  dangerButtonText: { color: baseColors.accent, fontSize: typography.md, fontWeight: typography.semibold },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs, borderBottomWidth: 1, borderColor: baseColors.borderDim, borderStyle: 'dashed' },
  aboutLabel: { color: baseColors.textMuted, fontSize: typography.md },
  aboutValue: { color: baseColors.text, fontSize: typography.md, fontWeight: typography.medium },
});

export default SettingsScreen;
