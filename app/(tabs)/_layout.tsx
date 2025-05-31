import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
import { Chrome as Home, Globe, Bookmark, Search } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: true,
      headerStyle: {
        backgroundColor: 'transparent',
      },
      headerBackground: () => (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      ),
      headerTitleStyle: {
        color: '#ffffff',
      },
      tabBarStyle: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
        borderTopWidth: 0,
        elevation: 0,
        height: Platform.OS === 'ios' ? 85 : 60,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
      },
      tabBarBackground: () => (
        <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
      ),
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#8E8E93',
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Indian News',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          title: 'Global',
          tabBarIcon: ({ color, size }) => <Globe size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}