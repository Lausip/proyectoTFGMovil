/** @jest-environment jsdom */
import React from "react";

import { render,  fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import ExploreScreen from "../../screens/ExploreScreen/ExploreScreen";
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
        handleAutores: () => { return [{ Nombre: "Hola", Foto: "" }, { Nombre: "Hola2", Foto: "fdsfs" }] },
    };
});

jest.mock('../../hooks/FirebaseLibros', () => {
    return {
        getFavoritos: () => { return [{ Titulo: "Hola" }, { Titulo: "Hola", Foto: "" }] },
        cargarDatosLibros: () => { return [{ Titulo: "Hola" }, { Titulo: "Hola", Foto: "" }] },
        cargarDatosLibrosFiltro: () => { return [{ Titulo: "Hola" }, { Titulo: "Hola", Foto: "" }] },

    };
});

jest.mock('../../hooks/CategoriasFirebase', () => {
    return {
        getCategorias: () => { return [{ label: "Hola" }, { label: "Heeeey"}] },
    };
});
jest.mock('../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => { return "" },
    };
});

describe('ExploreScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render ExploreScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)
        expect(component.getByText("Explorar"))

    });
    it('ExploreScreen Should click handleProfile ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)
        const touchableEl = component.queryByTestId('buttonHandleProfile');
        fireEvent.press(touchableEl);

    });

    it('ExploreScreen Should click cargarCategorias with autor', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)
        const touchableEl = component.getAllByTestId('buttonCargarCategorias')[1];
        fireEvent.press(touchableEl);
        
        const tituloInput = component.getByPlaceholderText("Busca historias,personas...");
        fireEvent.changeText(tituloInput, "Holi");
        expect(tituloInput.props.value).toBe("Holi");
        const touchableEl3 = component.queryByTestId('buttonFiltrado');
        fireEvent.press(touchableEl3);
    });

    it('ExploreScreen Should click buttonFiltrado no vacio y titulo ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)
        const tituloInput = component.getByPlaceholderText("Busca historias,personas...");
        fireEvent.changeText(tituloInput, "Holi");
        expect(tituloInput.props.value).toBe("Holi");
        const touchableEl = component.queryByTestId('buttonFiltrado');
        fireEvent.press(touchableEl);

    });


    it('ExploreScreen Should click getTagsto Etiqueta ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)

        const touchableEl = component.queryByTestId('buttongetTagsNoPulsado');
        fireEvent.press(touchableEl);

        const touchableEl4 = component.queryByTestId('buttongetTagsPulsado');
        fireEvent.press(touchableEl4);

        
        const touchableEl5 = component.queryByTestId('buttongetTagsNoPulsado');
        fireEvent.press(touchableEl5);

        const touchableEl2 = component.getAllByTestId('buttonclickTag')[1];
        fireEvent.press(touchableEl2);

        const tituloInput = component.getByPlaceholderText("Busca historias,personas...");
        fireEvent.changeText(tituloInput, "Holi");
        expect(tituloInput.props.value).toBe("Holi");
        const touchableEl3 = component.queryByTestId('buttonFiltrado');
        fireEvent.press(touchableEl3);

    });
    it('ExploreScreen Should click buttonFiltrado vacio  ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)
        const tituloInput = component.getByPlaceholderText("Busca historias,personas...");
        fireEvent.changeText(tituloInput, "");
        expect(tituloInput.props.value).toBe("");
        const touchableEl = component.queryByTestId('buttonFiltrado');
        fireEvent.press(touchableEl);

    });

    it('ExploreScreen Should click getTags Categoria and clickCategoriaFiltro ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ExploreScreen />)

        const touchableEl = component.queryByTestId('buttongetTagsNoPulsado');
        fireEvent.press(touchableEl);

        const touchableEl2 = component.getAllByTestId('buttonclickTag')[2];
        fireEvent.press(touchableEl2);

        const touchableEl4 = component.queryByTestId('buttongetTagsNoPulsado');
        fireEvent.press(touchableEl4);

        const touchableEl3 = component.queryByTestId('buttongetTagsPulsado');
        fireEvent.press(touchableEl3);

    });
    it('ExploreScreen Should click cargarMasLibros ', async () => {
        const component = render(<ExploreScreen />)
        fireEvent.scroll(component.getByTestId('flatlistbooks'), {
            nativeEvent: {
                contentSize: { height: 600, width: 400 },
                contentOffset: { y: 150, x: 0 },
                layoutMeasurement: { height: 500, width: 300 } // Dimensions of the device
            }
        })

    });
});
