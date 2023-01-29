/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import BooksScreen from '../../../screens/BookScreen/BooksScreen';
import {getCapitulo,getCapitulosDelLibro} from "../../../hooks/FirebaseLibros";

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



const mockultimoLibro = new Object({
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
        useFocusEffect: () => jest.fn(),
    };
});

jest.mock('../../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => {return ""},
    };
});

jest.mock('../../../hooks/Auth/Firestore', () => {
    return {
        updateUltimoCapitulo: () => jest.fn(),
        handleElLibroEstaEnMeGusta: () => jest.fn(),
        cambiarUltimoLibroLeido: () => jest.fn(),
    };
});
jest.mock('../../../hooks/FirebaseLibros', () => ({
 
        cargarDatosLibro: () => { return mockultimoLibro },
        getCategoriasLibro: () => { return [{ Nombre: "Romance", Color: "#7897" }] },
        cambiarDescripcion: () => jest.fn(),
        cambiarTitulo: () => jest.fn(),
        cambiarEstado: () => jest.fn(),
        cambiarCategoria: () => jest.fn(),
        getPortadaLibro: () => jest.fn(),
        getCapitulosDelLibro: jest.fn(),
        eliminarEtiqueta:  jest.fn(),
        getCapitulo:  jest.fn()

}));
describe('BooksScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render BooksScreen', async () => {
        getCapitulo.mockReturnValue({mockultimoLibro});
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)


    });

    
    it('Should render  wuhotu capituloSiguiente', async () => {
        getCapitulo.mockReturnValue("");
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)


    });

    it('BooksScreen Should click cargarOpciones with sumarTexto', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonCargarOpciones');
        fireEvent.press(touchableEl);
        const touchableEl2 = component.queryByTestId('buttonSumarLetra');
        fireEvent.press(touchableEl2);
        const touchableEl3 = component.queryByTestId('buttonRestarLetra');
        fireEvent.press(touchableEl3);


    });

    
    it('BooksScreen Should click cargarOpciones with cambiarNocheDia', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonCargarOpciones');
        fireEvent.press(touchableEl);

        const touchableEl2 = component.queryByTestId('buttonCambiarSol');
        fireEvent.press(touchableEl2);

        const touchableEl3 = component.queryByTestId('buttonCambiarSol');
        fireEvent.press(touchableEl3);


    });

    it('BooksScreen Should click cargarOpciones with siguienteCapitulo', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonCargarOpciones');
        fireEvent.press(touchableEl);

        const touchableEl2 = component.queryByTestId('buttonSiguienteCapitulo');
        fireEvent.press(touchableEl2);

    });

    it('BooksScreen Should click cargarOpciones with sacarCapitulosView', async () => {
        getCapitulosDelLibro.mockReturnValue([new Object({Titulo:"hey"})]);
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BooksScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonCargarOpciones');
        fireEvent.press(touchableEl);
        const touchableEl2 = component.queryByTestId('buttonSacarCapitulos');
        fireEvent.press(touchableEl2);

        const touchableEl3 = component.queryByTestId('buttonSacarCapitulos');
        fireEvent.press(touchableEl3);

        const touchableEl4 = component.queryByTestId('buttonSacarCapitulos');
        fireEvent.press(touchableEl4);


    });
});
