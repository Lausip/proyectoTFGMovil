/** @jest-environment jsdom */
import React from "react";

import { render,  fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import BibliotecaScreen from "../../screens/BibliotecaScreen";
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
const mockedAddListener = jest.fn();
jest.mock('@react-navigation/native', () => {
    const actualNav = jest.requireActual('@react-navigation/native');
    return {
        ...actualNav,
        useNavigation: () => ({
            navigate: mockedNavigate,
            setOptions: jest.fn(),
            replace: mockedReplace,
            addListener:  jest.fn().mockImplementation((event, callback) => {
                callback();
                //returning value for `navigationSubscription`
                return {
                   remove: jest.fn()
                }
              }),

        }),
        useIsFocused: () => true,
    
    };
});
jest.mock('../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () => jest.fn(),
        getFavoritosDelUsuario: () => jest.fn(),
        handleAutoresSeguidos: () => { return [{ Nombre: "Hola", Foto: "" }, { Nombre: "Hola2", Foto: "fdsfs" }] },
    };
});

jest.mock('../../hooks/FirebaseLibros', () => {
    return {
        getFavoritos: () => { return [{ Titulo: "Hola" }, { Titulo: "Hola", Foto: "" }] },
    };
});
jest.mock('../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => { return "" },
    };
});

describe('BibliotecaScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render BibliotecaScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BibliotecaScreen />)
        expect(component.getByText("Biblioteca"))

    });

    it('Should render BibliotecaScreen click handleProfile', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BibliotecaScreen />)
        const touchableEl = component.queryByTestId('buttonhandleProfile');
        fireEvent.press(touchableEl);
        expect(mockedNavigate).toHaveBeenCalledWith("profileScreen", { screen: "home" });
    });
    it('BibliotecaScreen click busqueda ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BibliotecaScreen />)
        const tituloInput = component.getByPlaceholderText("Busca un libro, persona...");
        fireEvent.changeText(tituloInput, "fdsf");
        expect(tituloInput.props.value).toBe("fdsf");
        const touchableEl = component.queryByTestId('buttonFiltrar');
        fireEvent.press(touchableEl);
    });



    it('BibliotecaScreen click busqueda empty', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BibliotecaScreen />)
        const tituloInput = component.getByPlaceholderText("Busca un libro, persona...");
        fireEvent.changeText(tituloInput, "");
        expect(tituloInput.props.value).toBe("");
        const touchableEl = component.queryByTestId('buttonFiltrar');
        fireEvent.press(touchableEl);
    });

    it('BibliotecaScreen click busqueda trim', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<BibliotecaScreen />)
        const tituloInput = component.getByPlaceholderText("Busca un libro, persona...");
        fireEvent.changeText(tituloInput, "  ");
        expect(tituloInput.props.value).toBe("  ");
        const touchableEl = component.queryByTestId('buttonFiltrar');
        fireEvent.press(touchableEl);
    });

    it('BibliotecaScreen click handleLeerLibroCapitulo and click goAutorProfile ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();

        let component = render(<BibliotecaScreen />)

        const touchableEl = component.getAllByTestId('buttoncargarCategorias')[1];
        fireEvent.press(touchableEl);



    });
});
