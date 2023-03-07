import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExploreScreen from "../screens/ExploreScreen/ExploreScreen";
import AutoresScreen from "../screens/AutoresScreen/AutoresScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ChatConversationScreen from "../screens/ChatScreen/ChatConversationScreen";
import ChatCapituloScreen from '../screens/BookScreen/ChatCapituloScreen';
import ReportarComentarioScreen from '../screens/BookScreen/ReportComentarioScreen';
import ReportAutorScreen from '../screens/AutoresScreen/ReportAutorScreen';
const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="explore" component={ExploreScreen} />
      <Stack.Screen  name="autorScreen" component={AutoresScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
      <Stack.Screen name="chatConversationScreen" component={ChatConversationScreen} />
      <Stack.Screen name="reportcomentariosCapituloScreen" component={ReportarComentarioScreen} /> 
      <Stack.Screen name="comentariosCapituloScreen" component={ChatCapituloScreen} /> 
      <Stack.Screen name="reportAutorScreen" component={ReportAutorScreen} /> 
    </Stack.Navigator>
  );
}