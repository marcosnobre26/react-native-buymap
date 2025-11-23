import { useStoreDetails, useStoreMutations } from '@/src/features/market/hooks/useMarket';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, MapPin, Save, Store } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StoreFormScreen() {
  const router = useRouter();
  
  const { storeId } = useLocalSearchParams<{ storeId: string }>();
  
  const isEditing = !!storeId;

  const { data: storeToEdit, isLoading: loadingData } = useStoreDetails(storeId || '');
  
  const { createStore, updateStore } = useStoreMutations();

  const [name, setName] = useState('');
  
  const [logoUri, setLogoUri] = useState<string | null>(null);     
  const [avatarUri, setAvatarUri] = useState<string | null>(null); 
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

 useEffect(() => {
    if (isEditing && storeToEdit) {
        setName(storeToEdit.name);
    }
  }, [storeToEdit, isEditing]);

  const pickImage = async (target: 'logo' | 'avatar') => {
    const aspect: [number, number] = target === 'logo' ? [16, 9] : [1, 1];
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspect,
      quality: 0.7,
    });

    if (!result.canceled) {
      if (target === 'logo') setLogoUri(result.assets[0].uri);
      else setAvatarUri(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    setLoadingLocation(true);
    try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return Alert.alert('Permissão negada', 'Precisamos do GPS para definir o endereço.');
        
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
    } catch (error) {
        Alert.alert('Erro', 'Não foi possível obter a localização.');
    } finally {
        setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => { 
    if (!name) return Alert.alert("Erro", "O nome é obrigatório.");
    
    if (!isEditing && (!logoUri || !avatarUri || !coords)) {
        return Alert.alert("Atenção", "Para criar a loja, preencha: Nome, Localização e as duas Fotos.");
    }

    setIsSubmitting(true);
    try {
        const generatedSlug = name.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '') + '-' + Math.floor(Math.random() * 1000);

        if (isEditing && storeToEdit) {
            const updateData: any = { name }; 
            
            if (coords) {
                updateData.latitude = coords.lat;
                updateData.longitude = coords.lng;
            }

            await updateStore.mutateAsync({
                id: storeToEdit.id,
                data: updateData,
                logo: logoUri || undefined,
                avatar: avatarUri || undefined
            });
            Alert.alert("Sucesso", "Loja atualizada!");

        } else {
            if (!coords) return;
            
            console.log("Enviando para criação...", { name, slug: generatedSlug, coords });

            await createStore.mutateAsync({ 
                data: { 
                    name, 
                    slug: generatedSlug,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    commissionRate: 10.0 
                }, 
                logo: logoUri!,
                avatar: avatarUri! 
            });
            
            Alert.alert("Parabéns!", "Sua nova loja foi criada!");
        }
        
        router.back();
    } catch (error: any) {
        console.error("Erro no submit:", error);
        const msg = error?.message || "Falha ao salvar dados.";
        Alert.alert("Erro", msg);
    } finally {
        setIsSubmitting(false);
    }
  };

  const getDisplayImage = (type: 'logo' | 'avatar') => {
    if (type === 'logo' && logoUri) return { uri: logoUri };
    if (type === 'avatar' && avatarUri) return { uri: avatarUri };

    if (isEditing && storeToEdit) {
        const backendUrl = type === 'logo' ? storeToEdit.logoUrl : storeToEdit.avatarUrl;
        if (backendUrl) return { uri: formatAvatarUrl(backendUrl) };
    }

    return null;
  };

  if (isEditing && loadingData) {
      return (
          <View className="flex-1 bg-slate-950 justify-center items-center">
              <ActivityIndicator color="#10B981" size="large" />
          </View>
      );
  }

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center border-b border-slate-900">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-900 rounded-full mr-4">
                <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">
                {isEditing ? 'Editar Loja' : 'Criar Nova Loja'}
            </Text>
        </View>

        <ScrollView className="flex-1">
            
            <View className="relative mb-16">
                <TouchableOpacity 
                    onPress={() => pickImage('logo')}
                    className="w-full h-48 bg-slate-900 items-center justify-center border-b border-slate-800"
                >
                    {getDisplayImage('logo') ? (
                        <Image source={getDisplayImage('logo')!} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <View className="items-center">
                            <ImageIcon size={40} color="#475569" />
                            <Text className="text-slate-500 mt-2 text-xs">Adicionar Capa (16:9)</Text>
                        </View>
                    )}
                    <View className="absolute right-4 bottom-4 bg-black/50 p-2 rounded-full">
                        <Camera size={16} color="white" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity 
                    onPress={() => pickImage('avatar')}
                    className="absolute -bottom-12 left-6 w-24 h-24 bg-slate-900 rounded-full border-4 border-slate-950 items-center justify-center overflow-hidden shadow-lg shadow-black"
                >
                    {getDisplayImage('avatar') ? (
                        <Image source={getDisplayImage('avatar')!} className="w-full h-full" resizeMode="cover" />
                    ) : (
                        <Store size={32} color="#475569" />
                    )}
                    <View className="absolute bottom-0 w-full h-8 bg-black/50 items-center justify-center">
                        <Camera size={12} color="white" />
                    </View>
                </TouchableOpacity>
            </View>

            <View className="px-6 mt-4 space-y-5 pb-10">
                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Nome da Loja</Text>
                    <TextInput 
                        value={name} onChangeText={setName}
                        className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 font-bold"
                        placeholder="Ex: Hamburgueria X" placeholderTextColor="#475569"
                    />
                </View>

                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Endereço / Localização</Text>
                    {!coords && !isEditing ? (
                        <TouchableOpacity 
                            onPress={getLocation}
                            className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/30 flex-row items-center justify-center"
                        >
                            {loadingLocation ? <ActivityIndicator color="#10B981"/> : (
                                <>
                                    <MapPin size={20} color="#10B981" className="mr-2" />
                                    <Text className="text-emerald-400 font-bold">Definir Localização Atual</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <View className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex-row justify-between items-center">
                            <View className="flex-row items-center flex-1">
                                <MapPin size={20} color="#94a3b8" className="mr-3" />
                                <View>
                                    <Text className="text-white text-sm">
                                        {isEditing && !coords ? 'Localização atual mantida' : 'Nova localização definida'}
                                    </Text>
                                    {coords && (
                                        <Text className="text-slate-500 text-[10px]">
                                            Lat: {coords.lat.toFixed(5)}, Lng: {coords.lng.toFixed(5)}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity onPress={getLocation} className="bg-slate-800 px-3 py-2 rounded-lg">
                                <Text className="text-white text-xs">Alterar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>

        <View className="p-6 bg-slate-950 border-t border-slate-900">
            <TouchableOpacity 
                onPress={handleSubmit} 
                disabled={isSubmitting} 
                className="bg-emerald-500 py-4 rounded-xl items-center flex-row justify-center"
            >
                {isSubmitting ? <ActivityIndicator color="#022c22"/> : (
                    <>
                        <Save size={20} color="#022c22" className="mr-2"/>
                        <Text className="text-slate-950 font-bold text-lg">
                            {isEditing ? 'Salvar Alterações' : 'Criar Nova Loja'}
                        </Text>
                    </>
                )}
            </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}