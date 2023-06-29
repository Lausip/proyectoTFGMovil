/** @jest-environment jsdom */
import React from "react";

import { render, fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import LoginScreen from "../../../screens/Auth/LoginScreen";


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

const mockedDispatch = jest.fn();

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: jest.fn(),
            setOptions: jest.fn(),
            replace: mockedDispatch,

        }),
    };
});

jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),
    signInWithEmailAndPassword: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) } 
  }))
  jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
describe('Login test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render Login', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        expect(component.getByText("Inicia Sesión"))

    });

    it('Should click handlePsswOlvidada', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        const touchableEl = component.queryByTestId('buttonOlvidoContra');
        fireEvent.press(touchableEl);
        expect(mockedDispatch).toHaveBeenCalledWith("psswforgot");
    });

    it('Should click handleRegistro', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        const touchableEl = component.queryByTestId('buttonRegistrarse');
        fireEvent.press(touchableEl);
        expect(mockedDispatch).toHaveBeenCalledWith("register");

    });

    it('Should click handleIncioSesion', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        const touchableEl = component.queryByTestId('buttonIniciarSesion');
        fireEvent.press(touchableEl);

    });
    it('Should change email', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        const emailInput = component.getByPlaceholderText(
            "Usuario"
        );
        fireEvent.changeText(emailInput,
            "admin@gmail.com"
        );
 
        expect(emailInput.props.value).toBe('admin@gmail.com');

    });

    it('Should change password', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<LoginScreen />)
        const passwInput = component.getByPlaceholderText(
            "Contraseña"
        );
        fireEvent.changeText(passwInput,
            "123456"
        );
        expect(passwInput.props.value).toBe('123456');

    });
});
