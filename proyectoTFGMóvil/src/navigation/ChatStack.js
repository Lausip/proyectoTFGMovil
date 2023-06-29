import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatScreen from "../screens/ChatScreen/ChatScreen";

import ChatConversationScreen from "../screens/ChatScreen/ChatConversationScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
const Stack = createNativeStackNavigator();

export default function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen  name="chatScreen" component={ChatScreen} /> 
      <Stack.Screen name="chatConversationScreen" component={ChatConversationScreen} /> 
      <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
      <Stack.Screen  name="home" component={HomeScreen} />
    </Stack.Navigator>
  );
}