import { Stack } from 'expo-router';

export default function AppLayout() {
  // This simple layout just shows the screen content without any tabs.
  return <Stack screenOptions={{ headerShown: false }} />;
}