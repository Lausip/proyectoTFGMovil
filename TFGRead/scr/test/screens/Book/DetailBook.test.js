/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'

import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import DetailBookScreen from '../../../screens/BookScreen/DetailBookScreen';


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



const mockultimoLibro = {
    Autor: "admin@gmail.com",
    Descripción: "Hola que tal estás yo estoy bien porq me dices que no quieres conmigos",
    Estado: "En curso",
    Etiquetas: ["jejeje", "fjdlks"],
    FechaCreación: "10/05/22",
    FechaModificación: {
        nanoseconds: 460000000,
        seconds: 1671283551,
    },
    Portada: "https://firebasestorage.googleapis.com/v0/b/tfgbook-f69af.appspot.com/o/Portadas%2Fadmin%40gmail.com%2FWCAOYujpHqBJrfeplwhv?alt=media&token=54cd5b4a-b39d-45cb-acd7-272236ecbd0d",
    Titulo: "Holaaa",
    borrador: true,
    key: "WCAOYujpHqBJrfeplwhv",

}
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
            addListener: jest.fn().mockImplementation((event, callback) => {
                callback();
                //returning value for `navigationSubscription`
                return {
                    remove: jest.fn()
                }
            }),

        }),
        useIsFocused: () => true,
        useFocusEffect: () => jest.fn(),
    };
});


jest.mock('../../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => { return "" },
    };
});
jest.mock('../../../hooks/Auth/Firestore', () => {
    return {
        handleElLibroEstaEnMeGusta: () => { return true },
        cambiarUltimoLibroLeido: () => jest.fn(),

    };
});
jest.mock('../../../hooks/FirebaseLibros', () => {
    return {
        cargarDatosLibro: () => { return mockultimoLibro },
        getCategoriasLibro: () => { return [{ Nombre: "Holaa",Color:"#2349"}, { Nombre: "jijiji" }] },
        getCapitulosDelLibro: () => { return [{ Titulo: "Holaa"}] },
    };
});

describe('DetailBookScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render DetailBookScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        const component = render(<DetailBookScreen route={{ params: "" }} />)



    });

    it('DetailBookScreen should click handleHome', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<DetailBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonGoHome');
        fireEvent.press(touchableEl);

    });

    it('DetailBookScreen should click handleLeerLibro', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<DetailBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonLeer');
        fireEvent.press(touchableEl);

    });

    it('DetailBookScreen should click goAutor', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<DetailBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonGoAutor');
        fireEvent.press(touchableEl);

    });


});
