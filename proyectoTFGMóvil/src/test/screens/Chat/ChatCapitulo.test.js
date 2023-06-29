/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import ChatCapituloScreen from '../../../screens/BookScreen/ChatCapituloScreen';

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
        getUserAuth: () => { return "" },
      
    };
});

jest.mock('../../../hooks/Auth/Firestore', () => {
    return {

        getFotoPerfil: () => jest.fn(),
    };
});
jest.mock('../../../hooks/ChatFirebase', () => ({

    getSalasDelEmail: () => jest.fn(),
    getFotoPerfilConversaciones: () => jest.fn(),
    getUltimoMensaje: () => jest.fn(),

}));
describe('ChatCapituloScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = () => { return };

    });
    it('Should render ChatCapituloScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatCapituloScreen route={{ params: "" }} />)


    });
    
    it('ChatCapituloScreen Should click  goback', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatCapituloScreen route={{ params: "" }} />)
        const touchableEl = component.getByTestId('buttonGoBack');
        fireEvent.press(touchableEl)

    });

    it('ChatCapituloScreen Should click  enviarComentario', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatCapituloScreen route={{ params: "" }} />)
        const cometarioInput = component.getByPlaceholderText(
            "Escribe un comentario...."
        );
        fireEvent.changeText(cometarioInput,
            "fdsfas"
        );
        expect(cometarioInput.props.value).toBe('fdsfas');
        const touchableEl = component.getByTestId('buttonEnviarComentario');
        fireEvent.press(touchableEl)

    });


});
