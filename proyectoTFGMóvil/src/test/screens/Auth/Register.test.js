/** @jest-environment jsdom */
import React from "react";

import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import RegisterScreen from "../../../screens/Auth/RegisterScreen";


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



const mockedReplace = jest.fn();
const mockedNavigate = jest.fn();
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
jest.mock('@react-native-async-storage/async-storage', () =>
require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),
    createUserWithEmailAndPassword: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) } 

  }))


  jest.mock('../../../hooks/Storage', () => {
    return {
        crearFotoPerfilStorage: () => jest.fn(),

    };
});

describe('RegisterScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render RegisterScreen', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)
        expect(component.getByText("Registro"))

    });



    it('Should change email', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)
        const emailInput = component.getByPlaceholderText(
            "Email"
        );
        fireEvent.changeText(emailInput,
            "admin@gmail.com"
        );

        expect(emailInput.props.value).toBe('admin@gmail.com');

    });

    it('Should change password', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)
        const passwInput = component.getByPlaceholderText(
            "Contraseña"
        );
        fireEvent.changeText(passwInput,
            "123456"
        );
        expect(passwInput.props.value).toBe('123456');

    });

    it('Should change password2', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)
        
        const passwInput = component.getByPlaceholderText(
            "Confirmar Contraseña"
        );
        fireEvent.changeText(passwInput,
            "123456"
        );
        expect(passwInput.props.value).toBe('123456');

    });

    it('Should click handleIncioSesion', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)

        const touchableEl = component.queryByTestId('buttonInicioSesion');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("login");


    });

    it('Should click handleRegistroTodo', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<RegisterScreen />)
        const emailInput = component.getByPlaceholderText(
            "Email"
        );
        fireEvent.changeText(emailInput,
            "admin@gmail.com"
        );

        const passwInput = component.getByPlaceholderText(
            "Contraseña"
        );
        fireEvent.changeText(passwInput,
            "123456"
        );
        const passwInput2 = component.getByPlaceholderText(
            "Confirmar Contraseña"
        );
        fireEvent.changeText(passwInput2,
            "123456"
        );
        const touchableEl = component.queryByTestId('buttonRegistroTodo');
        fireEvent.press(touchableEl);

    });
});
