import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';



import AuthStack from './AuthStack';
import BottomTab from '../components/BottomTab';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase"
export default function RootNavigator() {
  const [user, setUser] = useState(null);


  useEffect(() => {

  /* istanbul ignore next */
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(auth, authenticatedUser => {
      authenticatedUser ? setUser(authenticatedUser) : setUser(null);

    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);


  return (
    <NavigationContainer>
      {user ? <BottomTab /> : <AuthStack />}
    </NavigationContainer>
  );
}