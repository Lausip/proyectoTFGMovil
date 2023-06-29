import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AutoresScreen from "../screens/AutoresScreen/AutoresScreen";
import BooksScreen from "../screens/BookScreen/BooksScreen";
import ReportarBookScreen from "../screens/BookScreen/ReportBookScreen";
import BibliotecaScreen from '../screens/BibliotecaScreen';
import ChatCapituloScreen from '../screens/BookScreen/ChatCapituloScreen';
import ExploreScreen from "../screens/ExploreScreen/ExploreScreen";
import ReportarComentarioScreen from '../screens/BookScreen/ReportComentarioScreen';
import ReportAutorScreen from '../screens/AutoresScreen/ReportAutorScreen';
import HomeScreen from "../screens/HomeScreen";
import ChatScreen from "../screens/ChatScreen/ChatScreen";
const Stack = createNativeStackNavigator();

export default function BibliotecaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="biblioteca" component={BibliotecaScreen} />
      <Stack.Screen name="bookScreen" component={BooksScreen} /> 
      <Stack.Screen name="reportBookScreen" component={ReportarBookScreen} /> 
      <Stack.Screen name="comentariosCapituloScreen" component={ChatCapituloScreen} /> 
      <Stack.Screen name="reportcomentariosCapituloScreen" component={ReportarComentarioScreen} /> 
      <Stack.Screen name="reportAutorScreen" component={ReportAutorScreen} /> 
      <Stack.Screen  name="autorScreen" component={AutoresScreen} />
      <Stack.Screen  name="explore" component={ExploreScreen} />
      <Stack.Screen  name="home" component={HomeScreen} />
      <Stack.Screen  name="chatScreen" component={ChatScreen} /> 
    </Stack.Navigator>
  );
}