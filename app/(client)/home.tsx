import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useShops } from '@/src/features/market/hooks/useMarket'; // Apenas useShops
import { Shop } from '@/src/types/schema';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import { useRouter } from 'expo-router';
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ClipboardList,
  Search,
  Star
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORIES = [
  { id: '1', name: 'Mercado', icon: '🍎' },
  { id: '2', name: 'Farmácia', icon: '💊' },
  { id: '3', name: 'Bebidas', icon: '🥤' },
  { id: '4', name: 'Pet', icon: '🐶' },
  { id: '5', name: 'Express', icon: '⚡' },
];

const SectionTitle = ({ title, action }: { title: string, action?: string }) => (
  <View className="flex-row justify-between items-center px-6 mb-4 mt-6">
    <Text className="text-white font-bold text-xl">{title}</Text>
    {action && (
      <TouchableOpacity>
        <Text className="text-emerald-500 text-sm font-semibold">{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const CategoryPill = ({ name, icon }: { name: string, icon: string }) => (
  <TouchableOpacity className="items-center mr-6">
    <View className="w-16 h-16 bg-slate-800 rounded-2xl items-center justify-center mb-2 border border-slate-700 shadow-sm shadow-black">
      <Text className="text-2xl">{icon}</Text>
    </View>
    <Text className="text-slate-400 text-xs font-medium">{name}</Text>
  </TouchableOpacity>
);

const Banner = () => (
  <View className="mx-6 mt-4 mb-2 h-36 bg-emerald-900/40 rounded-3xl border border-emerald-500/20 overflow-hidden relative justify-center px-6">
    <View className="absolute right-0 bottom-0 w-32 h-32 bg-emerald-500/20 rounded-full translate-y-10 translate-x-10 blur-2xl" />
    <Text className="text-emerald-400 font-bold text-xs uppercase mb-1">Oferta Relâmpago</Text>
    <Text className="text-white font-extrabold text-2xl w-2/3">Frete Grátis no primeiro pedido!</Text>
    <TouchableOpacity className="bg-emerald-500 self-start px-4 py-2 rounded-lg mt-3">
      <Text className="text-slate-950 font-bold text-xs">Aproveitar agora</Text>
    </TouchableOpacity>
  </View>
);

export default function ClientHome() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const { data: shops, isLoading: loadingShops, refetch: refetchShops } = useShops();
  
  const isLoading = loadingShops;
  const userAvatarSource = formatAvatarUrl(user?.avatarUrl);
  const safeShops: Shop[] = Array.isArray(shops) ? shops : (shops as any)?.data || [];

  const onRefresh = async () => {
    await refetchShops();
  };

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView edges={['top']} className="bg-slate-950 z-10">
        
        <View className="px-6 py-2 flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <Text className="text-slate-400 text-xs font-medium">Entregar em</Text>
            <TouchableOpacity className="flex-row items-center mt-0.5">
              <Text className="text-white font-bold text-base mr-1" numberOfLines={1}>
                Rua das Palmeiras, 420
              </Text>
              <ChevronDown size={16} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row gap-3">
             <TouchableOpacity className="bg-slate-900 p-2 rounded-full border border-slate-800 relative justify-center items-center">
                <Bell size={20} color="#94a3b8" />
                <View className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full border border-slate-900" />
             </TouchableOpacity>
             
             <TouchableOpacity 
                onPress={() => router.push('/(client)/profile')}
                className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 items-center justify-center overflow-hidden"
             >
                {userAvatarSource ? (
                    <Image 
                        source={{ uri: userAvatarSource }} 
                        className="w-full h-full" 
                        resizeMode="cover"
                        key={userAvatarSource} 
                    />
                ) : (
                    <Text className="text-emerald-400 font-bold text-lg">
                        {user?.name?.[0]?.toUpperCase()}
                    </Text>
                )}
             </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 pb-4 mt-2">
          <View className="bg-slate-900 h-12 rounded-xl flex-row items-center px-4 border border-slate-800">
            <Search size={20} color="#64748b" />
            <TextInput 
              placeholder="Buscar em ShopRunner..." 
              placeholderTextColor="#64748b"
              className="flex-1 ml-3 text-white font-medium h-full"
            />
          </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        className="flex-1"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#10B981"/>}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        
        <View className="px-6 mt-2 mb-6">
    <TouchableOpacity 
        onPress={() => router.push('/(client)/shopping-list')}
        className="bg-[#FEF9E7] p-4 rounded-xl flex-row items-center justify-between shadow-md border-l-4 border-amber-400"
    >
        <View className="flex-row items-center">
            <View className="bg-amber-200/50 p-2 rounded-lg mr-3">
                <ClipboardList size={24} color="#D97706" />
            </View>
            <View>
                <Text className="text-slate-800 font-bold text-base">Minha Lista</Text>
                <Text className="text-slate-500 text-xs">Não esqueça de nada!</Text>
            </View>
        </View>
        <ArrowRight size={20} color="#94a3b8" />
    </TouchableOpacity>
</View>

        

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 10 }}>
          {CATEGORIES.map(cat => <CategoryPill key={cat.id} name={cat.name} icon={cat.icon} />)}
        </ScrollView>

        <Banner />

        <SectionTitle title="Lojas Favoritas" action="Ver todas" />
        
        {loadingShops ? <ActivityIndicator color="#10B981" className="self-start ml-6"/> : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24 }}>
             {safeShops.map((shop) => (
                <TouchableOpacity 
                    key={shop.id} 
                    className="mr-4 w-36"
                    onPress={() => router.push(`/(client)/store/${shop.slug}`)}
                >
                    <View className="w-36 h-24 bg-slate-900 rounded-2xl mb-2 border border-slate-700 overflow-hidden relative items-center justify-center">
                        {shop.avatarUrl ? (
                            <Image source={{ uri: formatAvatarUrl(shop.avatarUrl) }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                            <View className="flex-1 items-center justify-center w-full h-full bg-slate-800">
                                <Text className="text-slate-500 text-2xl font-bold">
                                    {shop.name?.[0]?.toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <View className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded-md flex-row items-center backdrop-blur-md">
                            <Star size={10} color="#FBBF24" fill="#FBBF24" />
                            <Text className="text-white text-[10px] font-bold ml-1">4.8</Text>
                        </View>
                    </View>
                    <Text className="text-white font-bold text-sm" numberOfLines={1}>{shop.name}</Text>
                    <Text className="text-slate-500 text-xs">30-40 min • Grátis</Text>
                </TouchableOpacity>
             ))}
          </ScrollView>
        )}

        <View className="h-20" /> 
      </ScrollView>
    </View>
  );
}