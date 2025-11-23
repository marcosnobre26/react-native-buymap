import { useRouter } from 'expo-router';
import { ArrowLeft, Check, Plus, Square, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    FlatList,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTEBOOK_BG = { uri: 'https://i.pinimg.com/736x/55/e7/0b/55e70b8562546c8343435b3832e20142.jpg' };

interface ListItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function ShoppingListScreen() {
  const router = useRouter();
  const [items, setItems] = useState<ListItem[]>([]);
  const [newItemText, setNewItemText] = useState('');

  const addItem = () => {
    if (newItemText.trim().length === 0) return;
    
    const newItem: ListItem = { 
        id: Date.now().toString(), 
        text: newItemText, 
        completed: false 
    };
    setItems(prev => [...prev, newItem]);
    setNewItemText('');
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearList = () => setItems([]);

  const renderItem = ({ item }: { item: ListItem }) => (
    <View className="flex-row items-center py-3.5 pl-16 pr-6">
      <TouchableOpacity onPress={() => toggleItem(item.id)} className="mr-3 hit-slop-10">
        {item.completed ? (
            <View className="bg-green-600/80 rounded p-0.5 transform -rotate-6">
                <Check size={20} color="white" strokeWidth={4} />
            </View>
        ) : (
            <Square size={26} color="#555" strokeWidth={2} />
        )}
      </TouchableOpacity>

      <Text 
        className={`flex-1 text-2xl ${item.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-900'}`}
        style={{ 
            fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
            fontWeight: '600',
            marginTop: -4 
        }}
      >
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => removeItem(item.id)} className="p-2">
        <Trash2 size={22} color="#EF4444" opacity={0.8} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground source={NOTEBOOK_BG} className="flex-1" resizeMode="cover">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>

        <View className="px-6 py-4 flex-row items-center justify-between mb-2 z-10">
            <View className="flex-row items-center">
                <TouchableOpacity onPress={() => router.back()} className="mr-4 p-1 bg-white/50 rounded-full">
                    <ArrowLeft size={28} color="#1e293b" />
                </TouchableOpacity>
                <Text 
                    className="text-3xl font-bold text-slate-900" 
                    style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}
                >
                    Lista
                </Text>
            </View>
            {items.length > 0 && (
                <TouchableOpacity onPress={clearList} className="bg-white/80 px-3 py-1.5 rounded-lg border border-slate-300">
                    <Text className="text-red-600 font-bold text-xs uppercase tracking-widest">Limpar</Text>
                </TouchableOpacity>
            )}
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View className="mt-20 px-16 opacity-60">
                <Text 
                    className="text-center text-slate-700 text-xl leading-9" 
                    style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}
                >
                    Sua lista está em branco...{'\n'}
                    O que vamos comprar hoje?
                </Text>
            </View>
          }
        />

        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            className="absolute bottom-0 left-0 right-0 p-4 bg-transparent"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
        >
            <View className="flex-row items-center bg-white rounded-full px-4 py-3 shadow-xl border border-slate-300">
                <TextInput 
                    className="flex-1 text-xl text-slate-900 py-1 ml-2"
                    placeholder="Novo item (ex: Café)..."
                    placeholderTextColor="#94a3b8"
                    value={newItemText}
                    onChangeText={setNewItemText}
                    onSubmitEditing={addItem}
                    returnKeyType="done"
                    style={{ fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }}
                />
                <TouchableOpacity 
                    onPress={addItem}
                    activeOpacity={0.7}
                    className="bg-blue-600 w-12 h-12 rounded-full items-center justify-center ml-3 shadow-md"
                >
                    <Plus size={28} color="white" strokeWidth={3} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </ImageBackground>
  );
}