import { Tabs } from 'expo-router';
import { Home, List, User } from 'lucide-react-native';

export default function ClientTabs() {
  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: '#10B981',
        tabBarStyle: { 
          backgroundColor: '#020617', 
          borderTopColor: '#1e293b',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        headerShown: false 
      }}
    >
      <Tabs.Screen 
        name="home" 
        options={{ 
          title: 'Início',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />
        }} 
      />
      
      <Tabs.Screen 
        name="orders" 
        options={{ 
          title: 'Pedidos',
          tabBarIcon: ({ color }) => <List color={color} size={24} />
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />
        }} 
      />

      <Tabs.Screen name="store/[slug]" options={{ href: null }} />
      <Tabs.Screen name="order-detail/[id]" options={{ href: null }} />
      
      <Tabs.Screen name="profile-edit" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      
      <Tabs.Screen name="store-dashboard" options={{ href: null }} />
      <Tabs.Screen name="store-form" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="product-form" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      
      <Tabs.Screen name="shopping-list" options={{ href: null, tabBarStyle: { display: 'none' } }} />

    </Tabs>
  );
}