/** @jest-environment jsdom */

import React from 'react'
import { render } from '@testing-library/react-native'

import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import { NavigationContainer } from '@react-navigation/native';

import BibliotecaStack from '../../navigation/BibliotecaStack';
import AuthStack from '../../navigation/AuthStack';
import BookWriteNavigator from '../../navigation/BookWriteNavigator';
import ChatStack from '../../navigation/ChatStack';
import ExploreStack from '../../navigation/ExploreStack';
import HomeStack from '../../navigation/HomeStack';


firebase.initializeTestApp({
    projectId: "tfgbook-f69af",
    auth: { uid: "63ToLd0bNfaiwcxYHpX9kxm99ae2", email: "admin@gmail.com" }
});

firebase.initializeTestApp({
    databaseName: "my-database",
    auth: { uid: "63ToLd0bNfaiwcxYHpX9kxm99ae2" }
});
firebase.initializeTestApp({
    storageBucket: "tfgbook-f69af.appspot.com",
    auth: { uid: "63ToLd0bNfaiwcxYHpX9kxm99ae2" }
});




jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn().mockReturnThis(),
    currentUser: {
        email: 'test',
        uid: '123',
        emailVerified: true
    },
    onAuthStateChanged: () => { return { email: "admin@gmail.com" } },

}))
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
describe('Navigation test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render BibliotecaStack', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        render(
            <NavigationContainer>
        <BibliotecaStack route={{ params: "" }} />
        </NavigationContainer>)



    });

    it('Should render AuthStack', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        render(
            <NavigationContainer>
        <AuthStack route={{ params: "" }} />
        </NavigationContainer>)

    });



    it('Should render BookWriteNavigator', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

       render(
            <NavigationContainer>
        <BookWriteNavigator route={{ params: "" }} />
        </NavigationContainer>)

    });

    it('Should render ChatStack', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        render(
            <NavigationContainer>
        <ChatStack route={{ params: "" }} />
        </NavigationContainer>)

    });

    it('Should render ExploreStack', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        render(
            <NavigationContainer>
        <ExploreStack route={{ params: "" }} />
        </NavigationContainer>)

    });

    it('Should render HomeStack', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        render(
            <NavigationContainer>
        <HomeStack route={{ params: "" }} />
        </NavigationContainer>)

    });

});

