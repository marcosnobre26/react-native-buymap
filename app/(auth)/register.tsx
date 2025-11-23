import { AuthService } from '@/src/features/auth/services/authService';
import clsx from 'clsx';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'CLIENT' as 'CLIENT' | 'SHOPPER'
  });

  async function handleRegister() {
    const { fullName, email, password, phone, role } = formData;

    if (!fullName || !email || !password || !phone) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.register({
        fullName,
        email,
        password,
        phone,
        role
      });

      if (Platform.OS === 'web') {
        window.alert('Conta Criada! Faça login para continuar.');
        router.back(); 
      } else {
        Alert.alert(
          'Conta Criada! 🎉',
          'Seu cadastro foi realizado com sucesso. Faça login para continuar.',
          [
            { 
              text: 'Ir para Login', 
              onPress: () => router.back(),
              style: 'default'
            }
          ]
        );
      }

    } catch (error: any) {
      const msg = error.response?.data?.message || 'Não foi possível criar a conta.';
      Alert.alert('Erro', Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-slate-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 24, flexGrow: 1, justifyContent: 'center' }}>
          
          <TouchableOpacity onPress={() => router.back()} className="mb-6">
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>

          <Text className="text-3xl font-bold text-white mb-8">Criar Conta</Text>

          <View className="flex-row mb-6 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <TouchableOpacity 
                onPress={() => setFormData({...formData, role: 'CLIENT'})}
                className={clsx("flex-1 py-3 rounded-lg items-center", formData.role === 'CLIENT' ? "bg-emerald-600" : "bg-transparent")}
            >
                <Text className={clsx("font-bold", formData.role === 'CLIENT' ? "text-white" : "text-slate-400")}>Sou Cliente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                onPress={() => setFormData({...formData, role: 'SHOPPER'})}
                className={clsx("flex-1 py-3 rounded-lg items-center", formData.role === 'SHOPPER' ? "bg-emerald-600" : "bg-transparent")}
            >
                <Text className={clsx("font-bold", formData.role === 'SHOPPER' ? "text-white" : "text-slate-400")}>Sou Entregador</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
                <Text className="text-slate-400 mb-1 ml-1">Nome Completo</Text>
                <TextInput 
                  className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
                  placeholder="Ex: Marcos Nobre" 
                  placeholderTextColor="#64748b"
                  value={formData.fullName}
                  onChangeText={t => setFormData({...formData, fullName: t})}
                />
            </View>

            <View>
                <Text className="text-slate-400 mb-1 ml-1">Email</Text>
                <TextInput 
                  className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
                  placeholder="seu@email.com" 
                  placeholderTextColor="#64748b"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={t => setFormData({...formData, email: t})}
                />
            </View>

            <View>
                <Text className="text-slate-400 mb-1 ml-1">Telefone</Text>
                <TextInput 
                  className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
                  placeholder="11999999999" 
                  placeholderTextColor="#64748b"
                  keyboardType="phone-pad"
                  value={formData.phone}
                  onChangeText={t => setFormData({...formData, phone: t})}
                />
            </View>

            <View>
                <Text className="text-slate-400 mb-1 ml-1">Senha</Text>
                <TextInput 
                  className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800"
                  placeholder="••••••" 
                  placeholderTextColor="#64748b"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={t => setFormData({...formData, password: t})}
                />
            </View>

            <TouchableOpacity 
              onPress={handleRegister}
              className="bg-emerald-500 py-4 rounded-xl items-center mt-4"
              disabled={isLoading}
            >
              {isLoading ? <ActivityIndicator color="#022c22" /> : <Text className="text-slate-950 font-bold text-lg">Cadastrar</Text>}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}