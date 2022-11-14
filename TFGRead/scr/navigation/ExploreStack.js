import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ExploreScreen from "../screens/ExploreScreen/ExploreScreen";
import AutoresScreen from "../screens/AutoresScreen";
import ProfileScreen from "../screens/ProfileScreen";


const Stack = createNativeStackNavigator();

export default function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen initialRouteName name="explore" component={ExploreScreen} />
      <Stack.Screen  name="autorScreen" component={AutoresScreen} />
      <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
    </Stack.Navigator>
  );
}