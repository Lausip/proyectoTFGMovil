/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";


import WriteNewBookScreen from '../../../screens/WriteNewBook/WriteNewBookScreen';
import { pickImage } from '../../../utils/ImagePicker';


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
        crearLibroFirebase: () => jest.fn(),
        cambiarPortadadeLibro:() => jest.fn(),
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



describe('WriteNewBookScreen test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render WriteNewBookScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        expect(component.getByText("Información nuevo libro"))

    });

    it('Should click pickImageF', async () => {
        pickImage.mockImplementation(() => "")
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonPickImage');
        fireEvent.press(touchableEl);


    });

    it('Should click pickImageF undefined', async () => {
        pickImage.mockImplementation(() => undefined)
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonPickImage');
        fireEvent.press(touchableEl);

    });

    it('Should click goBack', async () => {
        pickImage.mockImplementation(() => undefined)
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonGoBack');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("write");

    });


    it('Should change TextInput etiqueta and click añadirEtiquetas', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const etiquetaInput = component.getByPlaceholderText(
            "Etiqueta"
        );
        fireEvent.changeText(etiquetaInput,
            "jiji"
        );
        expect(etiquetaInput.props.value).toBe('jiji');
        const touchableEl = component.queryByTestId('buttonAñadirEtiquetas');
        fireEvent.press(touchableEl);
    });


    it('Should change TextInput etiqueta and click añadirEtiquetas with trim', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const etiquetaInput = component.getByPlaceholderText(
            "Etiqueta"
        );
        fireEvent.changeText(etiquetaInput,
            "  "
        );
        expect(etiquetaInput.props.value).toBe('  ');
        const touchableEl = component.queryByTestId('buttonAñadirEtiquetas');
        fireEvent.press(touchableEl);
    });


    it('Should remove etiquetas', async () => {
        React.useState = jest.fn()
            .mockReturnValue([["jiji","pipi"], {}])
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const touchableEl = component.getAllByTestId('buttonEliminarEtiqueta')[0];
        fireEvent.press(touchableEl)
        
    });

    it('Should view assertCrearLibroTitulo with true', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)
    });

    it('Should view assertCrearLibroTitulo  .trim() with true', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText(
            "Título"
        );
        fireEvent.changeText(tituloInput,
            "    "
        );
        expect(tituloInput.props.value).toBe('    ');
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)
    });

    it('Should view assertCrearLibroDescripcion with true', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText(
            "Título"
        );
        fireEvent.changeText(tituloInput,
            "Hola"
        );
        expect(tituloInput.props.value).toBe('Hola');
       
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)
    });

    it('Should view assertCrearLibroDescripcion with true with trim', async () => {
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText(
            "Título"
        );
        fireEvent.changeText(tituloInput,
            "Hola"
        );
        expect(tituloInput.props.value).toBe('Hola');
        const descripcionInput = component.getByPlaceholderText(
            "Descripción"
        );
        fireEvent.changeText(descripcionInput,
            "    "
        );
        expect(descripcionInput.props.value).toBe('    ');
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)
    });

    it('Should view assertCrearLibroImagen with true', async () => {

        React.useState = jest.fn()
        .mockReturnValue([["pico","jiji"], {}])
        .mockReturnValue([[], {}])
        .mockReturnValue([[], {}])
   
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText(
            "Título"
        );
        fireEvent.changeText(tituloInput,
            "Hola"
        );
        expect(tituloInput.props.value).toBe('Hola');
        const descripcionInput = component.getByPlaceholderText(
            "Descripción"
        );
        fireEvent.changeText(descripcionInput,
            "Holiii"
        );
        expect(descripcionInput.props.value).toBe('Holiii');
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)
    });

    it('Should view click crearLibro ', async () => {

        React.useState = jest.fn()
        .mockReturnValue([["pico","jiji"], {}])
        .mockReturnValue([["Aventura","Romance"], {}])
        .mockReturnValue([["Aventura","Romance"], {}])
   
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<WriteNewBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText(
            "Título"
        );
        fireEvent.changeText(tituloInput,
            "Hola"
        );
        expect(tituloInput.props.value).toBe('Hola');
        const descripcionInput = component.getByPlaceholderText(
            "Descripción"
        );
        fireEvent.changeText(descripcionInput,
            "Holiii"
        );
        expect(descripcionInput.props.value).toBe('Holiii');
        const touchableEl = component.getAllByTestId('buttonSiguiente')[0];
        fireEvent.press(touchableEl)

    });

});
