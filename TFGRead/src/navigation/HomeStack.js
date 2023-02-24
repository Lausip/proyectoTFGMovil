import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import BooksScreen from "../screens/BookScreen/BooksScreen";
import DetailBookScreen from "../screens/BookScreen/DetailBookScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificacionesScreen from "../screens/NotificacionesScreen";
import ChatConversationScreen from "../screens/ChatScreen/ChatConversationScreen";
import ChatCapituloScreen from '../screens/BookScreen/ChatCapituloScreen';
import AutoresScreen from "../screens/AutoresScreen";
const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="home" component={HomeScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
      <Stack.Screen name="notificacionScreen" component={NotificacionesScreen} /> 
      <Stack.Screen name="detailsBookScreen" component={DetailBookScreen} /> 
     <Stack.Screen name="bookScreen" component={BooksScreen} /> 
     <Stack.Screen name="chatConversationScreen" component={ChatConversationScreen} />
     <Stack.Screen name="comentariosCapituloScreen" component={ChatCapituloScreen} /> 
     <Stack.Screen  name="autorScreen" component={AutoresScreen} />
    </Stack.Navigator>
  );
}