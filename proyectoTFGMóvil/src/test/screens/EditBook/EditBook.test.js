/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";


import EditBookScreen from '../../../screens/EditBookScreen/EditBookScreen';


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
        getUserAuth: () => {return ""},
    };
});
const mockultimoLibro = new Object({
    Autor: "admin@gmail.com",
    Descripción: "Hola que tal estás yo estoy bien porq me dices que no quieres conmigos",
    Estado: "En curso",
    Etiquetas: ["jijiji", "jejej"],
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
jest.mock('../../../hooks/FirebaseLibros', () => {
    return {
        cargarDatosLibro: () => { return mockultimoLibro },
        cambiarPortadadeLibro: () => jest.fn(),
        getCategoriasLibro: () => { return [{ Nombre: "Romance", Color: "#7897" }] },
        cambiarDescripcion: () => jest.fn(),
        cambiarTitulo: () => jest.fn(),
        cambiarEstado: () => jest.fn(),
        cambiarCategoria: () => jest.fn(),
        getCapitulosDelLibro:()=>{return [new Object({
            Contenido:"jfklds",
            Numero:3
        })]},
        eliminarEtiqueta: () => jest.fn(),
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



describe('EditBookScreen test', () => {

    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render EditBookScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        expect(component.getByText("Editar el libro"))

    });

    it('EditBookScreen should click handleWrite', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        expect(component.getByText("Editar el libro"))
        const touchableEl = component.queryByTestId('buttonBack');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("write");
    });

    it('EditBookScreen should click actualizarImage', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        expect(component.getByText("Editar el libro"))
        const touchableEl = component.queryByTestId('buttonActualizarImage');
        fireEvent.press(touchableEl);

    });
    it('EditBookScreen should click actualizarTexto with text empty', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput, "");
        expect(tituloInput.props.value).toBe("");
        const touchableEl = component.queryByTestId('buttonActualizarTexto');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click actualizarTexto with text trim', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput, "  ");
        expect(tituloInput.props.value).toBe("  ");
        const touchableEl = component.queryByTestId('buttonActualizarTexto');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click actualizarTexto', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Título");
        fireEvent.changeText(tituloInput, "Holii");
        expect(tituloInput.props.value).toBe("Holii");
        const touchableEl = component.queryByTestId('buttonActualizarTexto');
        fireEvent.press(touchableEl);

    });
    it('EditBookScreen should click actualizarDescripcion with text empty', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Descripción");
        fireEvent.changeText(tituloInput, "");
        expect(tituloInput.props.value).toBe("");
        const touchableEl = component.queryByTestId('buttonActualizarDescripcion');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click actualizarDescripcion with text trim', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Descripción");
        fireEvent.changeText(tituloInput, "  ");
        expect(tituloInput.props.value).toBe("  ");
        const touchableEl = component.queryByTestId('buttonActualizarDescripcion');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click actualizarDescripcion', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Descripción");
        fireEvent.changeText(tituloInput, "Holii");
        expect(tituloInput.props.value).toBe("Holii");
        const touchableEl = component.queryByTestId('buttonActualizarDescripcion');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click updateCategoria', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonActualizarCategorías');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click handleWriteChapter', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonHandleWriteChapter');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("writeChapter", { "bookId": undefined});

    });

    it('EditBookScreen should click añadirEtiquetas', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const tituloInput = component.getByPlaceholderText("Etiqueta");
        fireEvent.changeText(tituloInput, "Holii");
        expect(tituloInput.props.value).toBe("Holii");
        const touchableEl = component.queryByTestId('buttonAñadirEtiqueta');
        fireEvent.press(touchableEl);

    });

    it('EditBookScreen should click buttonEliminarLibro', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<EditBookScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonEliminarLibro');
        fireEvent.press(touchableEl);

    });



});
