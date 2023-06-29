/** @jest-environment jsdom */
import React from "react";

import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import PsswForgotScreen from "../../../screens/Auth/PsswForgotScreen";


firebase.initializeTestApp({
    projectId: "tfgbook-f69af",
    auth: { uid: "alice", email: "alice@example.com" }
});

firebase.initializeTestApp({
    databaseName: "my-database",
    auth: { uid: "alice" }
});
firebase.initializeTestApp({
    storageBucket: "tfgbook-f69af.appspot.com",
    auth: { uid: "alice" }
});

jest.mock('@react-native-async-storage/async-storage', () =>
require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockedReplace=jest.fn();
const mockedNavigate=jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            setOptions: jest.fn(),
            replace: mockedReplace,

        }),
    };
});
jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),
    sendPasswordResetEmail: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) } 
  }))


describe('PsswForgot test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render CambioContraseña', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<PsswForgotScreen />)
        expect(component.getByText("Cambiar contraseña"))

    });
    it('Should change email', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<PsswForgotScreen />)
        const emailInput = component.getByPlaceholderText(
            "Email"
        );
        fireEvent.changeText(emailInput,
            "admin@gmail.com"
        );

        expect(emailInput.props.value).toBe('admin@gmail.com');

    });
    it('Should click handleGoBack', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<PsswForgotScreen />)
        const touchableEl = component.queryByTestId('buttonBack');
        fireEvent.press(touchableEl);
        expect(mockedNavigate).toHaveBeenCalledWith("login");

    });

    it('Should click handleReset', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<PsswForgotScreen />)
        const touchableEl = component.queryByTestId('buttonReiniciarContra');
        fireEvent.press(touchableEl);

    });
});
