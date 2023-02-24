/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import AutoresScreen from "../../screens/AutoresScreen";


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




const mockedReplace = jest.fn();
const mockedNavigate = jest.fn();
jest.mock('react-native-popup-menu', () => ({
    Menu: 'Menu',
    MenuContext: 'MenuContext',
    MenuOptions: 'MenuOptions',
    MenuOption: 'MenuOption',
    MenuTrigger: 'MenuTrigger',
}));

jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            setOptions: jest.fn(),
            replace: mockedReplace,

        }),
        useIsFocused: () => true,
    };
});


jest.mock('../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => { return "admin@gmail.com" },
    };
});
jest.mock('../../hooks/FirebaseLibros', () => {
    return {
        cargarBooksAutor: () => { return [{ Titulo: "Holaaa" }] },

    };
});
jest.mock('../../hooks/ChatFirebase', () => {
    return {
        existeSala: () => { return false },
        addSala: () => jest.fn(),
        cogerSala: () => jest.fn(),
    };
});
jest.mock('../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () => jest.fn(),
        cargarUltimoLibro: () => { return {} },
        cambiarUltimoLibroLeido: () => jest.fn(),
        cargarFirebase: () => jest.fn(),
        getDescripcionUsuario: () => jest.fn(),
        getNumeroLibrosUsuario: () => jest.fn(),
        getNumAutoresSeguidos: () => jest.fn(),
        getNumSeguidores: () => jest.fn(),
        getEstaSeguido: () => { return true },
        mirarSiSonAmigos: () => { return false },
        enviarPeticion: () => jest.fn(),
        getFechaCreaciónUsuario: () => jest.fn(),
        dejarSeguirAutor: () => jest.fn(),
    };
});

describe('AutoresScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render AutoresScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        expect(component.getByText("admin"))

    });

    it('AutoresScreen Should click goBack ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        const touchableEl = component.queryByTestId('buttonGoBack');
        fireEvent.press(touchableEl);

    });

    it('AutoresScreen Should click addAmigo ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        const touchableEl = component.queryByTestId('buttonAddAmigo');
        fireEvent.press(touchableEl);

    });


    it('AutoresScreen Should click enviarMensaje ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        const touchableEl = component.queryByTestId('buttonEnviarMensaje');
        fireEvent.press(touchableEl);

    });
    it('AutoresScreen Should click buttonReportar ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        const touchableEl = component.queryByTestId('buttonReportar');
        fireEvent.press(touchableEl);

    });

    it('AutoresScreen Should click buttonDejarSeguir ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        const component = await waitFor(() =>
            render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        );
        const touchableEl = component.queryByTestId('buttonDejarSeguir');
        fireEvent.press(touchableEl);



    });

    it('AutoresScreen Should click handleBook ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        const component = await waitFor(() =>
            render(<AutoresScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        );
        const touchableEl = component.queryByTestId('buttonHandleBook');
        fireEvent.press(touchableEl);



    });
});
