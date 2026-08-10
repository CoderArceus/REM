import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { colors } from '@/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
