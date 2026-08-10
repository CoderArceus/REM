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
  content: { padding: 16, paddingBottom: 48, gap: 24 },
  header: { alignItems: 'center', marginTop: 8, marginBottom: 24, gap: 4 },
  title: { fontSize: 36, fontWeight: '700', color: '#ffffff', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#8892b0', fontWeight: '500' },
  sectionCard: { gap: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#8892b0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#1e1e3a', borderStyle: 'dashed' },
  settingInfo: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: '#ffffff', marginBottom: 2 },
  settingDesc: { fontSize: 11, color: '#4a5568' },
  permissionButton: { marginTop: 8, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, backgroundColor: '#ff6b6b33', borderWidth: 1, borderColor: '#ff6b6b', alignSelf: 'flex-start' },
  permissionButtonText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600' },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4, borderBottomWidth: 1, borderColor: '#1e1e3a', borderStyle: 'dashed' },
  aboutLabel: { color: '#8892b0', fontSize: 15 },
  aboutValue: { color: '#ffffff', fontSize: 15, fontWeight: '500' },
});

export default SettingsScreen;
