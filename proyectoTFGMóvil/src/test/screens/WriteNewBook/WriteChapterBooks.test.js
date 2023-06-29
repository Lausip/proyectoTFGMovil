/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import WriteChapterBooksScreen from '../../../screens/WriteNewBook/WriteChapterBooksScreen';



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

jest.mock('../../../hooks/FirebaseLibros', () => {
    return {
        mirarSiTieneOtrosCapitulos: () => jest.fn(),
        cambiarFechaModificaciónLibro: () => jest.fn(),
    };
});

jest.mock('../../../hooks/Storage', () => {
    return {
        crearLibroStorage: () => jest.fn(),
    };
});

jest.mock('../../../hooks/CategoriasFirebase', () => {
    return {
        getCategorias: () => jest.fn(),
    };
});

jest.mock('../../../utils/ImagePicker', () => ({

    pickImage: jest.fn(),
}));



describe('WriteChapterBooksScreen test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render WriteChapterBooksScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        expect(component.getByText("Título del capitulo"))

    });
    it('WriteChapterBooksScreen Should click publicarCapituloLibro', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        const touchableEl = component.getByTestId('buttonPublicar');
        fireEvent.press(touchableEl)
    });

    it('WriteChapterBooksScreen Should view assertCrearLibroTitulo with true trim', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput,"    ");
        expect(tituloInput.props.value).toBe("    ");
        const touchableEl = component.getByTestId('buttonPublicar');
        fireEvent.press(touchableEl)
    });

    it('WriteChapterBooksScreen Should view assertCrearLibroContenido with true trim', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput,"Holiii");
        expect(tituloInput.props.value).toBe("Holiii");
        const contenidoInput = component.getByPlaceholderText("Contenido");
        fireEvent.changeText(contenidoInput,"      ");
        expect(contenidoInput.props.value).toBe("      ");
        const touchableEl = component.getByTestId('buttonPublicar');
        fireEvent.press(touchableEl)
    });

    it('WriteChapterBooksScreen Should click publicarCapituloLibro ', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput,"Holiii");
        expect(tituloInput.props.value).toBe("Holiii");

        const contenidoInput = component.getByPlaceholderText("Contenido");
        fireEvent.changeText(contenidoInput,"HIHIHIHI");
        expect(contenidoInput.props.value).toBe("HIHIHIHI");
        const touchableEl = component.getByTestId('buttonPublicar');
        fireEvent.press(touchableEl)
    });

    it('WriteChapterBooksScreen Should click borradorCapituloLibro ', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteChapterBooksScreen route={{ params: "" }} />)
        const touchableEl = component.getByTestId('buttonBorrador');
        fireEvent.press(touchableEl)
        expect(mockedReplace).toHaveBeenCalledWith("write");
    });
});
