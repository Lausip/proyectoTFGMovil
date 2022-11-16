import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import BooksScreen from "../screens/BookScreen/BooksScreen";
import DetailBookScreen from "../screens/BookScreen/DetailBookScreen";
import ProfileScreen from "../screens/ProfileScreen";
import NotificacionesScreen from "../screens/NotificacionesScreen";



const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="home" component={HomeScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
      <Stack.Screen name="notificacionScreen" component={NotificacionesScreen} /> 
      <Stack.Screen name="detailsBookScreen" component={DetailBookScreen} /> 
     <Stack.Screen name="bookScreen" component={BooksScreen} /> 

    </Stack.Navigator>
  );
}