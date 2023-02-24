/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import HomeScreen from "../../screens/HomeScreen";


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



const ultimoLibro = new Object({
    Autor: "admin@gmail.com",
    Descripción: "Hola que tal estás yo estoy bien porq me dices que no quieres conmigos",
    Estado: "En curso",
    Etiquetas: [],
    FechaCreación: "10/05/22",
    FechaModificación: {
        nanoseconds: 460000000,
        seconds: 1671283551,
    },
    Portada: "https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/Portadas%2Fadmin%40gmail.com%2FWCAOYujpHqBJrfeplwhv?alt=media&token=54cd5b4a-b39d-45cb-acd7-272236ecbd0d",
    Titulo: "Holaaa",
    borrador: true,
    key: "WCAOYujpHqBJrfeplwhv",

})
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


jest.mock('../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => jest.fn(),
    };
});
jest.mock('../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () => jest.fn(),
        cargarUltimoLibro: () => { return {} },
        cambiarUltimoLibroLeido: () => jest.fn(),
        cargarFirebase: () => jest.fn(),
        contarCapitulosDelLibro: () => jest.fn(),
    };
});

describe('HomeScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render HomeScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        expect(component.getByText("Inicio"))

    });

    it('Should click handleProfile', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        const touchableEl = component.queryByTestId('buttonProfile');
        fireEvent(touchableEl, 'pressIn');
        expect(mockedNavigate).toHaveBeenCalledWith("profileScreen", { "screen": "home" });

    });

    it('Should retrive image user', async () => {
        const fotoPerfil = 'https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/Perfil%2Fadmin%40gmail.com%2FFoto?alt=media&token=c9c1b96e-69d1-4152-a006-3b0f9d83ccef'
        React.useState = jest.fn().mockReturnValue([fotoPerfil, {}])
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        const img = component.getByTestId("imageProfile");
        //TODO:hacer expect
    });

    it('Should click handleNotificacion', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        const touchableNo = component.queryByTestId('buttonNotificacion');
        fireEvent.press(touchableNo);
        expect(mockedNavigate).toHaveBeenCalledWith("notificacionScreen", { "screen": "home" });

    });

    it('Should click handleLeerLibro', async () => {

        React.useState = jest.fn()
            .mockReturnValue(["", {}])
            .mockReturnValue([[], {}])
            .mockReturnValue([1, {}])
            .mockReturnValue([ultimoLibro, {}])
    
            .mockReturnValue([2, {}]);
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        const touchableNo = component.queryByTestId('buttonLeerLibro');
        fireEvent.press(touchableNo);

    });

    it('Should click handleBook ', async () => {
        const libros = [new Object({
            Autor: "admin@gmail.com",
            Descripción: "Hola que tal estás yo estoy bien porq me dices que no quieres conmigos",
            Estado: "En curso",
            Etiquetas: [],
            FechaCreación: "10/05/22",
            FechaModificación: {
                nanoseconds: 460000000,
                seconds: 1671283551,
            },
            Portada: "https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/Portadas%2Fadmin%40gmail.com%2FWCAOYujpHqBJrfeplwhv?alt=media&token=54cd5b4a-b39d-45cb-acd7-272236ecbd0d",
            Titulo: "Holaaa",
            borrador: true,
            key: "WCAOYujpHqBJrfeplwhv",
        })]

        React.useState = jest.fn()
            .mockReturnValue(["", {}])
            .mockReturnValue([libros, {}])

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<HomeScreen />)
        const touchableNo = component.queryByTestId('buttonBook');
        fireEvent.press(touchableNo);
        expect(mockedNavigate).toHaveBeenCalledWith("detailsBookScreen", { "bookId": "WCAOYujpHqBJrfeplwhv" });
    });

});
