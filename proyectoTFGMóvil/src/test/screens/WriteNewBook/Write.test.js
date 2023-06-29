/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";


import WriteScreen from '../../../screens/WriteNewBook/WriteScreen';

import { cargarBooksAutor } from '../../../hooks/FirebaseLibros'


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


jest.mock('../../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => jest.fn(),
    };
});



jest.mock('../../../hooks/FirebaseLibros', () => ({

    cargarBooksAutor: jest.fn()


}));


jest.mock('../../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () => jest.fn(),
        cargarUltimoLibro: () => { return {} },
        cambiarUltimoLibroLeido: () => jest.fn(),
        cargarFirebase: () => jest.fn(),
        contarCapitulosDelLibro: () => jest.fn(),
    };
});
const libros = [new Object({
    Autor: "admin@gmail.com",
    Descripción: "Hola que tal estás yo estoy bien porq me dices que no quieres conmigos",
    Estado: "En curso",
    Etiquetas: [],
    FechaCreación: "10/05/22",
    Portada: "https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/Portadas%2Fadmin%40gmail.com%2FWCAOYujpHqBJrfeplwhv?alt=media&token=54cd5b4a-b39d-45cb-acd7-272236ecbd0d",
    Titulo: "Holaaa",
    borrador: true,
    key: "WCAOYujpHqBJrfeplwhv",

})]

describe('WriteScreen test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render WriteScreen', async () => {
        cargarBooksAutor.mockReturnValue({});
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteScreen />)
        expect(component.getByText("Escribir"))

    });

    it('Should render WriteScreen with books', async () => {
        //Mock
        cargarBooksAutor
            .mockReturnValue(libros);
        React.useState = jest.fn()
            .mockReturnValue([libros, {}])

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteScreen />)
        expect(component.getByText("Holaaa"))

        //Scroll para activar el cargarMas()
        fireEvent.scroll(component.getByTestId('flatlistbooks'), {
            nativeEvent: {
                contentSize: { height: 600, width: 400 },
                contentOffset: { y: 150, x: 0 },
                layoutMeasurement: { height: 500, width: 300 } // Dimensions of the device
            }
        })

    });
    it('WriteScreen Should click handleProfile', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteScreen />)
        const touchableEl = component.queryByTestId('buttonProfile');
        fireEvent.press(touchableEl);
        expect(mockedNavigate).toHaveBeenCalledWith("profileScreen", { "screen": "write" });

    });

    it('WriteScreen Should click handleWriteNewBook ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteScreen />)
        const touchableEl = component.queryByTestId('buttonNewBook');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("writeNewBook");

    });

    it('WriteScreen Should click handleEditBook ', async () => {
        React.useState = jest.fn()
            .mockReturnValue([libros, {}])
        cargarBooksAutor.mockImplementation(() => [])
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteScreen />)
        const touchableEl = component.queryByTestId('buttonEdit');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("editBook", { "bookId": "WCAOYujpHqBJrfeplwhv" });

        //Scroll para activar el cargarMas()
        fireEvent.scroll(component.getByTestId('flatlistbooks'), {
            nativeEvent: {
                contentSize: { height: 600, width: 400 },
                contentOffset: { y: 150, x: 0 },
                layoutMeasurement: { height: 500, width: 300 } // Dimensions of the device
            }
        })

    });

});
