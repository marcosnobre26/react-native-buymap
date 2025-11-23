import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrdersScreen() {
  return (
    <View className="flex-1 bg-slate-950 justify-center items-center">
      <SafeAreaView>
        <Text className="text-white text-xl font-bold">Meus Pedidos</Text>
        <Text className="text-slate-500 mt-2">Histórico de compras aparecerá aqui.</Text>
      </SafeAreaView>
    </View>
  );
}