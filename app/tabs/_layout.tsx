import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FEFAE0',
        tabBarInactiveTintColor: '#DDA15E',
        headerStyle: {
          backgroundColor: '#606C38',
        },
        headerShadowVisible: false,
        headerTintColor: '#FEFAE0',
        tabBarStyle: {
          backgroundColor: '#606C38',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Hjem',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="omkring"
        options={{
          title: 'Omkring',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}