import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AutoresScreen from "../screens/AutoresScreen";
import BooksScreen from "../screens/BookScreen/BooksScreen";
import BibliotecaScreen from '../screens/BibliotecaScreen';
import ChatCapituloScreen from '../screens/BookScreen/ChatCapituloScreen';
const Stack = createNativeStackNavigator();

export default function BibliotecaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="biblioteca" component={BibliotecaScreen} />
      <Stack.Screen name="bookScreen" component={BooksScreen} /> 
      <Stack.Screen name="comentariosCapituloScreen" component={ChatCapituloScreen} /> 
      <Stack.Screen  name="autorScreen" component={AutoresScreen} />
    </Stack.Navigator>
  );
}