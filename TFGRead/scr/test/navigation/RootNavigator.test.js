/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import RootNavigator from '../../navigation/RootNavigator';


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
describe('RootNavigator test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render RootNavigator', async () => {
 
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        const component = render(<RootNavigator route={{ params: "" }} />)



    });




});
