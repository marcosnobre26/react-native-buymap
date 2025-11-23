import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useProductMutations, useStoreProfile } from '@/src/features/market/hooks/useMarket';
import { Product } from '@/src/types/schema';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import {
    ArrowLeft,
    Edit,
    Eye,
    EyeOff,
    Plus,
    Search,
    Settings,
    ShoppingBasket,
    Star,
    Store,
    Trash2
} from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreProfileScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { data: store, isLoading } = useStoreProfile(slug);
  
  const { remove: removeProduct, update: updateProduct } = useProductMutations();

  const isOwner = user && store && user.id === store.ownerId;

    const formatPrice = (price: string | number) => {
        const value = Number(price);
        if (isNaN(value)) return 'R$ --';
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleDeleteProduct = (id: string) => {
        Alert.alert("Excluir Produto", "Deseja remover este item?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: () => removeProduct.mutate(id) }
        ]);
    };

    const handleToggleStatus = (item: Product) => {
        const newStatus = item.isAvailable === false ? true : false;
        updateProduct.mutate({
            id: item.id,
            data: { isAvailable: newStatus }
        });
    };

    if (isLoading) {
        return (
        <View className="flex-1 bg-slate-950 justify-center items-center">
            <ActivityIndicator size="large" color="#10B981" />
        </View>
        );
    }

    if (!store) {
        return (
        <View className="flex-1 bg-slate-950 justify-center items-center">
            <Store size={64} color="#334155" />
            <Text className="text-slate-400 mt-4 mb-6 font-medium">Loja não encontrada.</Text>
            <TouchableOpacity onPress={() => router.back()} className="bg-slate-800 px-6 py-3 rounded-xl">
                <Text className="text-emerald-500 font-bold">Voltar</Text>
            </TouchableOpacity>
        </View>
        );
    }

  const bannerSource = formatAvatarUrl(store.logoUrl);
  const avatarSource = formatAvatarUrl(store.avatarUrl);

 const renderHeader = () => (
    <View className="mb-6">
      <View className="h-48 relative">
        {bannerSource ? (
            <Image source={{ uri: bannerSource }} className="w-full h-full" resizeMode="cover" />
        ) : (
            <View className="w-full h-full bg-slate-800 items-center justify-center">
                <Store size={48} color="#334155" />
            </View>
        )}
        <View className="absolute inset-0 bg-black/40" />
        
        <SafeAreaView className="absolute top-0 left-0 w-full flex-row justify-between px-4">
            <TouchableOpacity 
                onPress={() => router.back()} 
                className="mt-2 bg-black/50 w-10 h-10 rounded-full items-center justify-center"
            >
                <ArrowLeft size={20} color="white" />
            </TouchableOpacity>

            {isOwner && (
                <TouchableOpacity 
                    onPress={() => router.push({ pathname: '/(client)/store-form', params: { storeId: store.id } })}
                    className="mt-2 bg-black/50 w-10 h-10 rounded-full items-center justify-center"
                >
                    <Settings size={20} color="white" />
                </TouchableOpacity>
            )}
        </SafeAreaView>
      </View>

      <View className="px-6 -mt-10 flex-row items-end">
        <View className="w-24 h-24 bg-slate-900 rounded-2xl border-4 border-slate-950 shadow-lg items-center justify-center overflow-hidden">
            {avatarSource ? (
                <Image source={{ uri: avatarSource }} className="w-full h-full" resizeMode="cover" />
            ) : (
                <Text className="text-white text-2xl font-bold">{store.name[0]}</Text>
            )}
        </View>
        <View className="ml-4 mb-2 flex-1">
            <Text className="text-white font-bold text-2xl" numberOfLines={2}>{store.name}</Text>
            <View className="flex-row items-center mt-1">
                <Star size={14} color="#FBBF24" fill="#FBBF24" />
                <Text className="text-amber-400 font-bold text-sm ml-1">5.0</Text>
            </View>
        </View>
      </View>

      <View className="px-6 mt-6">
        <View className="bg-slate-900 h-12 rounded-xl flex-row items-center px-4 border border-slate-800">
            <Search size={20} color="#64748b" />
            <Text className="text-slate-500 ml-3">Buscar em {store.name}...</Text>
        </View>
      </View>

      <Text className="text-white font-bold text-xl px-6 mt-8">Cardápio</Text>
    </View>
  );

    const renderItem = ({ item }: { item: Product }) => {
        const imageUrl = formatAvatarUrl(item.imageUrl);
        const isAvailable = item.isAvailable !== false;

        return (
            <View className="px-6 mb-4">
                <View className={`rounded-xl p-3 flex-row border shadow-sm
                    ${isAvailable ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/40 border-slate-800/40'}`}
                >
                    <View className={`flex-row flex-1 ${isAvailable ? 'opacity-100' : 'opacity-50'}`}>
                        <View className="w-24 h-24 bg-slate-950 rounded-lg mr-4 overflow-hidden items-center justify-center">
                            {imageUrl ? (
                                <Image source={{ uri: imageUrl }} className="w-full h-full" resizeMode="cover" />
                            ) : (
                                <ShoppingBasket size={24} color="#334155" />
                            )}
                        </View>

                        <View className="flex-1 justify-between py-1">
                            <View>
                                <Text className="text-white font-bold text-base mb-1">
                                    {item.name} {isAvailable ? '' : '(Inativo)'}
                                </Text>
                                <Text className="text-slate-500 text-xs" numberOfLines={2}>
                                    {item.description || 'Sem descrição'}
                                </Text>
                            </View>
                            
                            <View className="flex-row justify-between items-center mt-2">
                                <Text className={isAvailable ? "text-emerald-400 font-extrabold text-lg" : "text-slate-500 font-bold text-lg"}>
                                    {formatPrice(item.price)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="justify-end ml-2">
                        {isOwner ? (
                            <View className="flex-col gap-3 justify-end h-full pb-1">
                                <TouchableOpacity 
                                    onPress={() => handleToggleStatus(item)}
                                    className={`p-2 rounded-full border ${isAvailable ? 'bg-blue-900/20 border-blue-900/50' : 'bg-slate-800 border-slate-700'}`}
                                >
                                    {isAvailable ? <Eye size={16} color="#60A5FA" /> : <EyeOff size={16} color="#94a3b8" />}
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => router.push({ pathname: '/(client)/product-form', params: { id: item.id } })}
                                    className="bg-slate-800 p-2 rounded-full border border-slate-700"
                                >
                                    <Edit size={16} color="#94a3b8" />
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => handleDeleteProduct(item.id)}
                                    className="bg-red-900/20 p-2 rounded-full border border-red-900/50"
                                >
                                    <Trash2 size={16} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View className="justify-end h-full pb-1">
                                <TouchableOpacity 
                                    disabled={!isAvailable}
                                    className={`w-10 h-10 rounded-full items-center justify-center border 
                                    ${isAvailable ? 'bg-slate-800 border-slate-700 active:bg-emerald-500 active:border-emerald-500' : 'bg-slate-900 border-slate-800'}`}
                                >
                                    <Plus size={20} color={isAvailable ? "white" : "#475569"} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        );
    };

  return (
    <View className="flex-1 bg-slate-950">
      <Stack.Screen options={{ headerShown: false }} />

      <FlatList
        data={store.products}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={renderItem}
        ListEmptyComponent={
            <View className="items-center py-10 opacity-50">
                <ShoppingBasket size={48} color="#334155" />
                <Text className="text-slate-500 mt-4 font-medium">Nenhum produto.</Text>
            </View>
        }
      />

      {isOwner && (
        <View className="absolute bottom-6 left-6 right-6">
            <TouchableOpacity 
                onPress={() => router.push({ pathname: '/(client)/product-form', params: { storeId: store.id } })}
                className="bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center shadow-lg shadow-emerald-900/50"
            >
                <Plus size={24} color="#022c22" className="mr-2" />
                <Text className="text-slate-950 font-bold text-lg">Novo Produto</Text>
            </TouchableOpacity>
        </View>
      )}
    </View>
  );
}