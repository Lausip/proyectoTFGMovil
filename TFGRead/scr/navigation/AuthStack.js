import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PrimeraScreen from '../screens/PrimeraScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import PsswForgotScreen from '../screens/Auth/PsswForgotScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
    <Stack.Screen name="principal" component={PrimeraScreen} />
    <Stack.Screen name="login" component={LoginScreen} />
    <Stack.Screen name="register" component={RegisterScreen} />
    <Stack.Screen name="psswforgot" component={PsswForgotScreen} />
  </Stack.Navigator>
  );
}