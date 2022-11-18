import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BooksScreen from "../screens/BookScreen/BooksScreen";
import BibliotecaScreen from '../screens/BibliotecaScreen';
const Stack = createNativeStackNavigator();

export default function BibliotecaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="biblioteca" component={BibliotecaScreen} />
      <Stack.Screen name="bookScreen" component={BooksScreen} /> 
    </Stack.Navigator>
  );
}