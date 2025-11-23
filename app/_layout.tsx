import { useAuthStore } from '@/src/features/auth/store/authStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const { isHydrated, isAuthenticated, user, loadSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    if (isAuthenticated && inAuthGroup) {
      const route = user?.role === 'SHOPPER' ? '/(shopper)/dashboard' : '/(client)/home';
      router.replace(route);
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
  }, [isHydrated, isAuthenticated, segments]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#020617' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#020617" />
        <Slot />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}