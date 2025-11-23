import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useProducts, useShops } from '@/src/features/market/hooks/useMarket'; // Importando hooks
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ClientHomeDebug() {
  const { user, signOut } = useAuthStore();
  
  // Chamada dos Hooks
  const shopsQuery = useShops();
  const productsQuery = useProducts();

  // DEBUG LOG: Se você não vir isso no Console, o componente está falhando ao montar.
  console.log("--- HOME RENDER START ---");
  console.log("User:", user?.name);
  console.log("Shops Query Status:", shopsQuery.status);
  console.log("Products Query Status:", productsQuery.status);
  console.log("--- HOME RENDER END ---");

  if (shopsQuery.isLoading || productsQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-slate-400 mt-4">Carregando dados da API...</Text>
      </View>
    );
  }
  
  // Se houver erro (401, 500, etc)
  if (shopsQuery.isError || productsQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-950 p-8">
        <Text className="text-red-500 font-bold text-lg mb-4">
            ERRO NA CONEXÃO DA API
        </Text>
        <Text className="text-slate-400 text-center mb-6">
            Não foi possível buscar lojas ou produtos. Verifique o console do DevTools para o erro detalhado.
        </Text>
        <Text className="text-slate-600 text-sm">
            Erro: {shopsQuery.error?.message || productsQuery.error?.message}
        </Text>
      </View>
    );
  }

  // Retorno simplificado para teste
  return (
    <SafeAreaView className="flex-1 bg-slate-950 p-6">
        <Text className="text-white text-xl font-bold mb-4">
            Status do Mercado
        </Text>
        <Text className="text-slate-300">
            Shops Encontradas: {shopsQuery.data?.length ?? 0}
        </Text>
        <Text className="text-slate-300">
            Produtos Encontrados: {productsQuery.data?.length ?? 0}
        </Text>
        
        <View className="mt-8">
            <TouchableOpacity onPress={() => shopsQuery.refetch()} className="bg-blue-600 p-3 rounded-lg mb-3">
                <Text className="text-white text-center">Tentar Novamente (Refetch)</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={signOut} className="bg-red-600 p-3 rounded-lg">
                <Text className="text-white text-center">Logout</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  );
}