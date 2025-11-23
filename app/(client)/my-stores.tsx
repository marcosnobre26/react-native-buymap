import { useMyStoresList, useStoreMutations } from '@/src/features/market/hooks/useMarket';
import { Shop } from '@/src/types/schema';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import { useRouter } from 'expo-router';
import { ArrowLeft, Edit2, Eye, EyeOff, Plus, Store, Trash2 } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyStoresScreen() {
  const router = useRouter();
  const { data: stores, isLoading } = useMyStoresList();
  const { deleteStore, updateStore } = useStoreMutations();

    const handleDelete = (id: string) => {
        if (Platform.OS === 'web') {
            if (window.confirm("Tem certeza que deseja excluir esta loja permanentemente?")) {
                deleteStore.mutate(id);
            }
        } else {
            Alert.alert("Excluir Loja", "Esta ação apagará a loja e todos os seus produtos. Continuar?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => deleteStore.mutate(id) }
            ]);
        }
    };

    const handleToggleStatus = (store: any) => {
        const newStatus = store.isActive === false ? true : false;
        
        updateStore.mutate({
            id: store.id,
            data: { isActive: newStatus },
            logo: undefined,
            avatar: undefined
        });
    };

  const renderStoreItem = ({ item }: { item: Shop & { isActive?: boolean } }) => {
    const avatarUrl = formatAvatarUrl(item.avatarUrl);
    const isActive = item.isActive !== false; 

    return (
      <TouchableOpacity 
        onPress={() => router.push({ pathname: '/(client)/store-dashboard', params: { storeId: item.id } })}
        className={`bg-slate-900 p-4 mb-4 rounded-2xl border flex-row items-center
        ${isActive ? 'border-slate-800' : 'border-slate-800 opacity-60'}`}
      >
         <View className="w-16 h-16 bg-slate-950 rounded-full mr-4 items-center justify-center overflow-hidden border border-slate-800">
             {avatarUrl ? (
                 <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
             ) : (
                 <Store size={24} color="#475569" />
             )}
         </View>

         <View className="flex-1">
             <Text className="text-white font-bold text-lg">{item.name}</Text>
             <Text className="text-slate-500 text-xs">
                 {isActive ? '🟢 Loja Ativa' : '🔴 Loja Oculta'}
             </Text>
         </View>

         <View className="flex-row gap-2">
             <TouchableOpacity onPress={() => handleToggleStatus(item)} className="p-2 bg-slate-800 rounded-lg">
                 {isActive ? <Eye size={18} color="#60A5FA" /> : <EyeOff size={18} color="#94a3b8" />}
             </TouchableOpacity>

             <TouchableOpacity 
                onPress={() => router.push({ pathname: '/(client)/store-form', params: { storeId: item.id } })} // Edição da Loja
                className="p-2 bg-slate-800 rounded-lg"
             >
                 <Edit2 size={18} color="#94a3b8" />
             </TouchableOpacity>

             <TouchableOpacity onPress={() => handleDelete(item.id)} className="p-2 bg-red-900/20 rounded-lg">
                 <Trash2 size={18} color="#EF4444" />
             </TouchableOpacity>
         </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 border-b border-slate-900 flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-900 rounded-full mr-4">
               <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">Minhas Lojas</Text>
        </View>

        {isLoading ? <ActivityIndicator className="mt-10" color="#10B981"/> : (
            <FlatList 
               data={stores}
               keyExtractor={item => item.id}
               renderItem={renderStoreItem}
               contentContainerStyle={{ padding: 24 }}
               ListEmptyComponent={
                   <View className="items-center mt-20">
                       <Store size={48} color="#334155" />
                       <Text className="text-slate-500 mt-4">Você não possui lojas.</Text>
                   </View>
               }
            />
        )}

        <View className="absolute bottom-6 left-6 right-6">
            <TouchableOpacity 
                onPress={() => router.push('/(client)/store-form')}
                className="bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center shadow-lg"
            >
                <Plus size={24} color="#022c22" className="mr-2" />
                <Text className="text-slate-950 font-bold text-lg">Nova Loja</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}