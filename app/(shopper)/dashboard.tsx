import { useAuthStore } from '@/src/features/auth/store/authStore';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ShopperDashboard() {
  const signOut = useAuthStore(s => s.signOut);
  const user = useAuthStore(s => s.user);

  return (
    <View className="flex-1 bg-slate-950 justify-center items-center p-6">
      <SafeAreaView>
        <Text className="text-emerald-400 font-bold text-2xl mb-2 text-center">
            Modo Entregador
        </Text>
        <Text className="text-white text-lg mb-8 text-center">
            Olá, {user?.name}. Aguardando pedidos...
        </Text>

        <TouchableOpacity 
            onPress={() => signOut()} 
            className="bg-red-500/20 border border-red-500 p-4 rounded-xl"
        >
            <Text className="text-red-400 font-bold text-center">Encerrar Turno (Sair)</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}