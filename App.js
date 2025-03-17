import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreenMemory from './src/screens/HomeScreenMemory';
import AddAnniversaryScreen from './src/screens/AddAnniversaryScreen';
import EditAnniversary from './src/screens/EditAnniversary';
import ImageListScreen from './src/screens/ImageListScreen';
import * as Notifications from 'expo-notifications';
import { requestNotificationPermission, scheduleNotification } from './src/components/notificationService';




const MemoryStack = createStackNavigator();
function MemoryStackNavigator() {
  return (
    <MemoryStack.Navigator>
      <MemoryStack.Screen name="HomeMemory" component={HomeScreenMemory} options={{ title: 'Ngày Kỷ Niệm' }} />
      <MemoryStack.Screen name="AddAnniversary" component={AddAnniversaryScreen} options={{ title: 'Thêm Kỷ Niệm' }} />
      <MemoryStack.Screen name="EditAnniversary" component={EditAnniversary} options={{ title: 'Chỉnh Sửa Kỷ Niệm' }} />
    </MemoryStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {

  useEffect(() => {
    requestNotificationPermission();
    scheduleNotification("Sự kiện sắp tới!", "Đừng quên kỷ niệm của bạn vào ngày mai!", Date.now() + 24 * 60 * 60 * 1000);
  }, []);
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

         {/* Tab Kỷ Niệm (HomeMemory + Edit + Add) */}
         <Tab.Screen 
          name="Kỷ Niệm" 
          component={MemoryStackNavigator} 
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
