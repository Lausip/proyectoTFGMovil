/** @jest-environment jsdom */
import React from "react";

import { render ,fireEvent} from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import PrimeraScreen from "../../screens/PrimeraScreen";


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
            replace:mockedDispatch,

        }),
    };
});


describe('PrimeraScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

      });
    it('Should render PrimeraScreen', async () => {
    
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<PrimeraScreen />)
        expect(component.getByText("Laura Vigil Laruelo"))

    });

    it('Should click handleIncioSesion', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component =  render(<PrimeraScreen />)
        const touchableEl = component.queryByTestId('buttonInicio');
        fireEvent.press(touchableEl);
        expect(mockedDispatch).toHaveBeenCalledWith("login");
   
    })


    it('Should click handleRegistro ', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component =  render(<PrimeraScreen />)
        const touchableEl = component.queryByTestId('buttonRegistro');
        fireEvent.press(touchableEl);
        expect(mockedDispatch).toHaveBeenCalledWith("register");

    });
});
