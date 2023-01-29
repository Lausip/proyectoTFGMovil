/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import ChatScreen from "../../../screens/ChatScreen/ChatScreen";


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
jest.mock('../../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () => jest.fn(),

        cambiarUltimoLibroLeido: () => jest.fn(),
        getFotoPerfilConversaciones: () => jest.fn(),
        getAmigos: () => { return ["admin1@gmail.com", "jfldsa@gmail.com"] }
    };
});

jest.mock('../../../hooks/ChatFirebase', () => {
    return {
        getSalasDelEmail: () => jest.fn(),
        getUltimoMensaje: () => { return [{ Usuario1: "admin1", UltimoMensaje: "jijiji" }] },
        cambiarUltimoLibroLeido: () => jest.fn(),
        getFotoPerfilConversaciones: () => jest.fn(),
        existeSala: () => { return false },
        cogerSala: () => jest.fn(),
        addSala: () => jest.fn(),

    };
});

describe('ChatScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render ChatScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatScreen />)
        expect(component.getByText("Chats"))

    });
    it('ChatScreen Should click handleProfile', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatScreen />)
        const touchableEl = component.queryByTestId('buttonProfile');
        fireEvent.press(touchableEl);
        expect(mockedNavigate).toHaveBeenCalledWith("profileScreen", { "screen": "chatScreen" });

    });


    it('ChatScreen Should click modalAnadirSala', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatScreen />)
        const touchableEl = component.queryByTestId('buttonModalAñadirSala');
        fireEvent.press(touchableEl);

    });


    it('ChatScreen Should click buttonAñadirSala', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = await waitFor(() =>
            render(<ChatScreen />)
        );
        await waitFor(() => {
            const touchableEl = component.queryByTestId('buttonModalAñadirSala');
            fireEvent.press(touchableEl);
        });
        const touchableEl2 = component.getAllByTestId('buttonAñadirSala')[0];
        fireEvent.press(touchableEl2);

    });

    it('ChatScreen Should click buttonAñadirSala', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = await waitFor(() =>
            render(<ChatScreen />)
        );

        const touchableEl = component.queryByTestId('buttonEnterChat');
        fireEvent.press(touchableEl);



    });

});
