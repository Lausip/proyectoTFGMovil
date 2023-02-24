/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import EditChapterScreen from '../../../screens/EditBookScreen/EditChapterScreen';


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
        cambiarTituloCapitulo: ()  => jest.fn(),
        cambiarContenidoCapitulo: ()  => jest.fn(),
        getCapitulo: ()  => jest.fn(),
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
    pickImage: () => { return "" },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),

  }))

describe('EditChapterScreen test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render EditChapterScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditChapterScreen route={{ params: "" }} />)
        expect(component.getByText("Editar Capítulo"))

    });

    it('EditChapterScreen should click textInput', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditChapterScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput, "Holii");
        expect(tituloInput.props.value).toBe("Holii");
        const contenidoInput = component.getByPlaceholderText("Contenido");
        fireEvent.changeText(contenidoInput, "Pepepe");
        expect(contenidoInput.props.value).toBe("Pepepe");
    
      
    });
    it('EditChapterScreen should click handleEdit', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditChapterScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonGoBackEdit');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("editBook", {"bookId": undefined});
    });
    it('EditChapterScreen should click actualizarCapituloLibro', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditChapterScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonActualizar');
        fireEvent.press(touchableEl);
    
      
    });


});
