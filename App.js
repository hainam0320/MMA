import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen'
import ImageListScreen from './src/screens/ImageListScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="heart-outline" size={size} color={color} />
            )
          }} 
        />
        <Tab.Screen 
          name="Kho Ảnh" 
          component={ImageListScreen} 
          options={{ 
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" size={size} color={color} />
            )
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
