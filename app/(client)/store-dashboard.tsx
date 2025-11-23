import { useMyStore, useProductMutations, useStoreProducts } from '@/src/features/market/hooks/useMarket';
import { Product } from '@/src/types/schema';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import { useRouter } from 'expo-router';
import { ArrowLeft, Edit2, Package, Plus, Settings, ShoppingBasket, Store, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreDashboard() {
  const router = useRouter();
  
  const { data: myStore, isLoading: loadingStore } = useMyStore();
  
  const { data: products, isLoading: loadingProducts } = useStoreProducts(myStore?.id);
  
  const { remove } = useProductMutations();

  const handleDelete = (id: string) => {
    Alert.alert("Excluir Produto", "Tem certeza?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => remove.mutate(id) }
    ]);
  };

  const renderItem = ({ item }: { item: Product }) => {
    const imageUrl = formatAvatarUrl(item.imageUrl);

    return (
        <View className="bg-slate-900 p-4 mb-3 rounded-xl flex-row items-center border border-slate-800">
           <View className="w-16 h-16 rounded-lg bg-slate-800 mr-4 overflow-hidden items-center justify-center border border-slate-700">
               {imageUrl ? (
                   <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
               ) : (
                   <ShoppingBasket size={24} color="#334155" />
               )}
           </View>

           <View className="flex-1">
              <Text className="text-white font-bold text-base" numberOfLines={1}>{item.name}</Text>
              <Text className="text-emerald-400 font-bold mt-1">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                    .format(Number(item.price || 0))} 
              </Text>
           </View>
           
           <View className="flex-row gap-3 ml-2">
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/(client)/product-form', params: { id: item.id } })}
                className="p-2 bg-slate-800 rounded-lg border border-slate-700"
              >
                 <Edit2 size={18} color="#94a3b8" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleDelete(item.id)}
                className="p-2 bg-red-900/20 rounded-lg border border-red-900/30"
              >
                 <Trash2 size={18} color="#EF4444" />
              </TouchableOpacity>
           </View>
        </View>
    );
  };

  if (loadingStore) {
    return <View className="flex-1 bg-slate-950 justify-center items-center"><ActivityIndicator size="large" color="#10B981" /></View>;
  }

  if (!myStore) {
      return (
        <View className="flex-1 bg-slate-950 justify-center items-center px-6">
            <Store size={64} color="#475569" />
            <Text className="text-white font-bold text-2xl text-center mt-4 mb-2">Torne-se um Parceiro</Text>
            <Text className="text-slate-400 text-center mb-8">Cadastre sua loja para começar a vender.</Text>
            <TouchableOpacity 
                onPress={() => router.push('/(client)/store-form')}
                className="bg-emerald-500 w-full py-4 rounded-xl items-center"
            >
                <Text className="text-slate-950 font-bold text-lg">Cadastrar Minha Loja</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.back()} className="mt-6"><Text className="text-slate-500 font-bold">Voltar</Text></TouchableOpacity>
        </View>
      );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">
        
        <View className="px-6 py-4 border-b border-slate-900 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-900 rounded-full">
               <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            
            <View>
                <Text className="text-white font-bold text-lg text-center">{myStore.name}</Text>
                <Text className="text-slate-500 text-xs text-center">Painel de Vendas</Text>
            </View>

            <TouchableOpacity 
                onPress={() => router.push('/(client)/store-form')}
                className="p-2 bg-slate-900 rounded-full border border-slate-800"
            >
               <Settings color="#10B981" size={20} />
            </TouchableOpacity>
        </View>

        {loadingProducts ? (
            <ActivityIndicator size="large" color="#10B981" className="mt-10"/>
        ) : (
            <FlatList 
               data={products} 
               keyExtractor={item => item.id}
               renderItem={renderItem}
               contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
               ListEmptyComponent={
                   <View className="items-center mt-20 opacity-50">
                       <Package size={64} color="#334155" />
                       <Text className="text-slate-500 mt-4 text-center font-medium">Nenhum produto.</Text>
                   </View>
               }
            />
        )}

        <View className="absolute bottom-6 left-6 right-6">
            <TouchableOpacity 
                onPress={() => router.push({ pathname: '/(client)/product-form', params: { storeId: myStore.id } })}
                className="bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center shadow-lg"
            >
                <Plus size={24} color="#022c22" className="mr-2" />
                <Text className="text-slate-950 font-bold text-lg">Novo Produto</Text>
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}