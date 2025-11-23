import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useRouter } from 'expo-router';
import {
  ChevronRight, CreditCard, Edit3, LogOut, MapPin, Store, User
} from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MenuOption = ({ icon: Icon, title, subtitle, onPress }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    className="flex-row items-center bg-slate-900 p-4 mb-3 rounded-xl border border-slate-800 active:bg-slate-800"
  >
    <View className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center mr-4">
        <Icon size={20} color="#10B981" />
    </View>
    <View className="flex-1">
        <Text className="text-white font-bold text-base">{title}</Text>
        {subtitle && <Text className="text-slate-500 text-xs">{subtitle}</Text>}
    </View>
    <ChevronRight size={20} color="#475569" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();
  const router = useRouter();

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">

        <View className="items-center py-8 border-b border-slate-900">
           <View className="relative">
              <View className="w-28 h-28 bg-slate-800 rounded-full border-4 border-slate-900 overflow-hidden items-center justify-center">
                  {user?.avatarUrl ? (
                    <Image source={{ uri: user.avatarUrl }} className="w-full h-full" />
                  ) : (
                    <Text className="text-emerald-500 text-4xl font-bold">{user?.name?.[0]}</Text>
                  )}
              </View>
              <TouchableOpacity 
                onPress={() => router.push('/(client)/profile-edit')}
                className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full border-4 border-slate-950"
              >
                <Edit3 size={16} color="#022c22" />
              </TouchableOpacity>
           </View>
           
           <Text className="text-white font-bold text-2xl mt-4">{user?.name}</Text>
           <Text className="text-slate-500">{user?.email}</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6">
            <Text className="text-slate-500 font-bold mb-4 text-xs uppercase tracking-wider">Minha Conta</Text>
            <Text className="text-slate-500 font-bold mb-3 mt-4 text-xs uppercase tracking-wider ml-1">
                Para Parceiros
            </Text>
            <MenuOption 
                  icon={Store} 
                  title="Minha Loja" 
                  subtitle="Gerenciar produtos e vendas"
                  onPress={() => router.push('/(client)/store-dashboard')}
              />
            <MenuOption 
                icon={User} 
                title="Dados Pessoais" 
                subtitle="CPF, Telefone e Foto"
                onPress={() => router.push('/(client)/profile-edit')}
            />
            
            <MenuOption 
                icon={MapPin} 
                title="Endereços" 
                subtitle="Casa, Trabalho..."
                onPress={() => console.log("Ir para endereços")}
            />

            <MenuOption 
                icon={CreditCard} 
                title="Pagamentos" 
                subtitle="Meus cartões"
                onPress={() => console.log("Ir para pagamentos")}
            />

             <Text className="text-slate-500 font-bold mb-4 mt-4 text-xs uppercase tracking-wider">Outros</Text>

             <TouchableOpacity 
                onPress={signOut}
                className="flex-row items-center p-4 rounded-xl border border-red-900/30 bg-red-900/10 active:bg-red-900/20"
            >
                <LogOut size={20} color="#EF4444" />
                <Text className="text-red-500 font-bold text-base ml-4">Sair do App</Text>
            </TouchableOpacity>
        </ScrollView>

      </SafeAreaView>
    </View>
  );
}