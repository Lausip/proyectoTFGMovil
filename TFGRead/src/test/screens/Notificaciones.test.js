/** @jest-environment jsdom */
import React from "react";

import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import NotificacionesScreen from "../../screens/NotificacionesScreen";

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

jest.mock('../../hooks/Auth/Auth', () => {
    return {
        getUserAuth: () => { return "" },
        hanldeSignOut: () => jest.fn(),
    };
});
jest.mock('firebase/auth', () => ({
    getAuth: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) }
}))
jest.mock('../../hooks/Auth/Firestore', () => {
    return {
        getPeticionesAmistad: () => { return [{ Nombre: "hfdsak" }] },
        getPeticionesConversacion: () => { return [{ Titulo: "hfdsak" }] },
        getComentarios: () => { return [{ Tiutlo: "hfdsak" }] },
        cambiarFotoPerfilFirebase: () => jest.fn(),
        getDescripcionUsuario: () => { return "Holaaa" },
        cambiarDescripcion: () => jest.fn(),
        getFotoPerfil: () => jest.fn(),
        aceptarPeticionAmistad: () => jest.fn(),
        rechazarPeticionAmistad: () => jest.fn(),
    };
});

jest.mock('../../hooks/Storage', () => {
    return {
        crearFotoPerfilStorage: () => jest.fn(),

    };
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


jest.mock('../../utils/ImagePicker', () => {
    return {
        pickImage: () => { return "iela" },
    };
});


describe('NotificacionesScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render NotificacionesScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<NotificacionesScreen route={{ params: "" }} />)
        expect(component.getByText("Notificaciones"))

    });
    it('NotificacionesScreen Should click goBack', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        let component =render(<NotificacionesScreen route={{ params: "" }} />)
        const touchableEl = component.queryByTestId('buttonGoBack');
        fireEvent.press(touchableEl);

        
    })

    it('NotificacionesScreen Should click cargarCategorias', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        let component =render(<NotificacionesScreen route={{ params: "" }} />)
        const touchableEl = component.getAllByTestId('buttonCargarCategorias')[1];
        fireEvent.press(touchableEl);
        const touchableEl2 = component.getAllByTestId('buttonCargarCategorias')[2];
        fireEvent.press(touchableEl2);

        
    })
    it('NotificacionesScreen seleccionadoCategoriaIndex 1', async () => {
        React.useState = jest.fn()

        .mockReturnValue([1, {}])


        
    })

    it('NotificacionesScreen seleccionadoCategoriaIndex 2', async () => {
        React.useState = jest.fn()
        .mockReturnValue([2, {}])
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        let component =render(<NotificacionesScreen route={{ params: "" }} />)


        
    })

})

