import { AuthService } from '@/src/features/auth/services/authService';
import { useAuthStore } from '@/src/features/auth/store/authStore';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Save } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileEditScreen() {
  const { user, token, signIn } = useAuthStore();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const currentAvatar = imageUri || formatAvatarUrl(user?.avatarUrl);

  const pickImage = async () => {
    console.log("Iniciando pickImage...");

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permissão Negada", "Você precisa permitir o acesso à galeria para trocar a foto.");
      return;
    }

    console.log("Permissão concedida. Abrindo galeria...");

    try {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        console.log("Resultado do Picker:", result.canceled ? "Cancelado" : "Sucesso");

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    } catch (error) {
        console.error("Erro ao abrir galeria:", error);
        Alert.alert("Erro", "Não foi possível abrir a galeria.");
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsLoading(true);

    try {
      const updatedUser = await AuthService.updateProfile(
          user.id, 
          { name, phone }, 
          imageUri || undefined
      );

      if (token) {
          await signIn(updatedUser, token);
      }

      Alert.alert("Sucesso", "Perfil atualizado!");
      router.back();

    } catch (error: any) {
      Alert.alert("Erro", "Falha ao atualizar perfil.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">
        
        <View className="px-6 py-4 flex-row items-center border-b border-slate-900">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-900 rounded-full mr-4">
                <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">Editar Perfil</Text>
        </View>

        <ScrollView className="flex-1 px-6 py-8">
            
            <View className="items-center mb-8">
                <TouchableOpacity onPress={pickImage} className="relative active:opacity-80">
                    <View className="w-32 h-32 bg-slate-900 rounded-full border-2 border-dashed border-slate-700 items-center justify-center overflow-hidden">
                        {currentAvatar ? (
                            <Image 
                                source={{ uri: currentAvatar }} 
                                className="w-full h-full" 
                                resizeMode="cover"
                            />
                        ) : (
                            <Camera size={32} color="#475569" />
                        )}
                    </View>
                    <View className="absolute bottom-0 right-0 bg-emerald-500 p-2 rounded-full border-4 border-slate-950">
                        <Camera size={16} color="#022c22" />
                    </View>
                </TouchableOpacity>
                <Text className="text-slate-500 text-xs mt-3">Toque na imagem para alterar</Text>
            </View>

            {/* Formulário */}
            <View className="space-y-5">
                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Nome Completo</Text>
                    <TextInput 
                        value={name}
                        onChangeText={setName}
                        className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 focus:border-emerald-500"
                        placeholderTextColor="#475569"
                    />
                </View>

                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Telefone</Text>
                    <TextInput 
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="(00) 00000-0000"
                        placeholderTextColor="#475569"
                        className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 focus:border-emerald-500"
                    />
                </View>
                
                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Email</Text>
                    <View className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                        <Text className="text-slate-500">{user?.email}</Text>
                    </View>
                </View>
            </View>

        </ScrollView>

        <View className="p-6 border-t border-slate-900 bg-slate-950">
            <TouchableOpacity 
                onPress={handleSave}
                disabled={isLoading}
                className={`bg-emerald-500 py-4 rounded-xl flex-row justify-center items-center ${isLoading ? 'opacity-50' : ''}`}
            >
                {isLoading ? (
                    <ActivityIndicator color="#022c22" />
                ) : (
                    <>
                        <Save size={20} color="#022c22" className="mr-2" />
                        <Text className="text-slate-950 font-bold text-lg">Salvar Alterações</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}