import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { baseColors } from '@/constants/neumorphism';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: baseColors.primary,
        tabBarInactiveTintColor: baseColors.textMuted,
        tabBarStyle: {
          backgroundColor: baseColors.bgCard,
          borderTopWidth: 1,
          borderColor: '#1e1e3a',
          borderStyle: 'dashed',
          height: 72,
          paddingBottom: 8,
          paddingTop: 4,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        },
        tabBarIndicatorStyle: {
          backgroundColor: baseColors.primary,
          height: 3,
          borderRadius: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
