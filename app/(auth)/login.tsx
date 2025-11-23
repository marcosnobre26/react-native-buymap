import { AuthService } from '@/src/features/auth/services/authService';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  
  const login = useAuthStore((state) => state.login);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const data = await AuthService.login(email, password);
      
      await login(data.user, data.access_token);
    } catch (error: any) {
      Alert.alert("Erro", "Credenciais inválidas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950 justify-center px-6">

      <View className="items-center mb-10">
          <Text className="text-white text-3xl font-bold">ShopRunner</Text>
          <Text className="text-slate-400 mt-2">Login de Acesso</Text>
      </View>

      <View className="gap-4">
        <TextInput 
          className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
          placeholder="Email"
          placeholderTextColor="#64748b"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput 
          className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
          placeholder="Senha"
          placeholderTextColor="#64748b"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        
        <TouchableOpacity 
          onPress={handleLogin}
          className="bg-emerald-500 p-4 rounded-xl items-center mt-2"
        >
          {isLoading ? (
            <ActivityIndicator color="#022c22" />
          ) : (
            <Text className="text-slate-950 font-bold text-lg">Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="mt-6 items-center">
        <Text className="text-slate-500">Não tem conta? <Text className="text-emerald-500 font-bold">Criar conta</Text></Text>
      </TouchableOpacity>
    </View>
  );
}