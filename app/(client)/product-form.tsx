import { useMyStore, useProductDetails, useProductMutations } from '@/src/features/market/hooks/useMarket';
import { formatAvatarUrl } from '@/src/utils/imageHelper';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductFormScreen() {
  const router = useRouter();
  const { id, storeId } = useLocalSearchParams<{ id?: string; storeId?: string }>(); 
  const isEditing = !!id;
  
  const { data: myStore } = useMyStore();
  const { data: productToEdit, isLoading: loadingData } = useProductDetails(id);
  const { create, update } = useProductMutations();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [priceCents, setPriceCents] = useState(0); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing && productToEdit) {
        setName(productToEdit.name);
        setBrand(productToEdit.brand || '');
        setBarcode(productToEdit.barcode || '');
        setDescription(productToEdit.description || '');
        
        const cents = Math.round(Number(productToEdit.price) * 100);
        setPriceCents(cents);
    }
  }, [productToEdit]);

  const displayPrice = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(priceCents / 100);

  const handlePriceChange = (text: string) => {
    const cleanText = text.replace(/\D/g, '');
    setPriceCents(Number(cleanText));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  const handleSubmit = async () => {
    if (!name || priceCents <= 0) {
        return Alert.alert("Campos Obrigatórios", "Preencha Nome e Preço.");
    }
    if (!isEditing && !imageUri) {
        return Alert.alert("Campos Obrigatórios", "Escolha uma foto.");
    }

    setIsSubmitting(true);
    try {
        const payload = {
            name,
            brand,
            barcode,
            description,
            price: priceCents / 100,
        };

        if (isEditing && id) {
            await update.mutateAsync({ 
                id: id, 
                data: payload, 
                image: imageUri || undefined 
            });
            Alert.alert("Sucesso", "Produto atualizado!");
        } else {
            const targetStoreId = storeId || myStore?.id;
            if (!targetStoreId) throw new Error("Loja não identificada.");

            await create.mutateAsync({ 
                storeId: targetStoreId, 
                data: payload, 
                image: imageUri! 
            });
            Alert.alert("Sucesso", "Produto criado!");
        }
        
        router.back();
    } catch (error: any) {
        console.error(error);
        Alert.alert("Erro", error.message || "Falha ao salvar");
    } finally {
        setIsSubmitting(false);
    }
  };

  const displayImage = imageUri 
    ? { uri: imageUri } 
    : (productToEdit?.imageUrl ? { uri: formatAvatarUrl(productToEdit.imageUrl) } : null);

  if (isEditing && loadingData) {
      return <View className="flex-1 bg-slate-950 justify-center items-center"><ActivityIndicator color="#10B981"/></View>;
  }

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row items-center border-b border-slate-900">
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-slate-900 rounded-full mr-4">
                <ArrowLeft color="white" size={20} />
            </TouchableOpacity>
            <Text className="text-white font-bold text-xl">{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
        </View>

        <ScrollView className="p-6">
            <TouchableOpacity onPress={pickImage} className="h-48 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-700 items-center justify-center mb-6 overflow-hidden">
                {displayImage ? (
                    <Image source={displayImage} className="w-full h-full" resizeMode="cover" />
                ) : (
                    <View className="items-center"><Camera size={40} color="#475569" /><Text className="text-slate-500 mt-2">Foto</Text></View>
                )}
            </TouchableOpacity>

            <View className="space-y-5">
                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Nome</Text>
                    <TextInput value={name} onChangeText={setName} className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 font-bold text-lg" />
                </View>

                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Preço de Venda</Text>
                    <View className="flex-row items-center bg-slate-900 rounded-xl border border-slate-800 px-4 h-14">
                        <Text className="text-emerald-500 font-bold text-xl mr-2">R$</Text>
                        <TextInput 
                            value={displayPrice}
                            onChangeText={handlePriceChange}
                            keyboardType="numeric"
                            className="flex-1 text-white text-xl font-bold h-full"
                        />
                    </View>
                </View>

                <View className="flex-row gap-4">
                    <View className="flex-1">
                        <Text className="text-slate-400 mb-1 ml-1">Marca</Text>
                        <TextInput value={brand} onChangeText={setBrand} className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-slate-400 mb-1 ml-1">Código</Text>
                        <TextInput value={barcode} onChangeText={setBarcode} className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800" />
                    </View>
                </View>

                <View>
                    <Text className="text-slate-400 mb-1 ml-1">Descrição</Text>
                    <TextInput value={description} onChangeText={setDescription} multiline numberOfLines={3} className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800 h-24" textAlignVertical="top" />
                </View>
            </View>
        </ScrollView>

        <View className="p-6 bg-slate-950 border-t border-slate-900">
            <TouchableOpacity onPress={handleSubmit} disabled={isSubmitting} className="bg-emerald-500 py-4 rounded-xl items-center">
                {isSubmitting ? <ActivityIndicator color="#022c22"/> : <Text className="text-slate-950 font-bold text-lg">Salvar</Text>}
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}