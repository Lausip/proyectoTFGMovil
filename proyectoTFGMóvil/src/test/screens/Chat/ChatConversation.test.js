/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import ChatConversationScreen from "../../../screens/ChatScreen/ChatConversationScreen";


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
        getUserAuth: () => { return "Admin@gmail.com" },
    };
});
jest.mock('../../../hooks/Auth/Firestore', () => {
    return {
        getFotoPerfil: () =>  jest.fn(),
        anadirAAmigos: () =>  jest.fn(),

        cambiarUltimoLibroLeido:() =>  jest.fn(),
        getFotoPerfilConversaciones:() =>  jest.fn(),
        getAmigos:() => {return ["admin1@gmail.com"]}
    };
});

jest.mock('../../../hooks/ChatFirebase', () => {
    return {
        getMessage: () =>  jest.fn(),
        updateAmigosSala: () =>  jest.fn(),

       
    };
});

const salaJEje={
 Usuario1:"Admin@gmail.com",
 Usuario2:"Lauravl@gmail.com",
 Enviado:"Lauravl@gmail.com",
 Bloqueado:false,
 Amigo:false,
}

const salaJEj2e={
    Usuario1:"Lauravl@gmail.com",
    Usuario2:"Admin@gmail.com",
    Enviado:"Lauravl@gmail.com",
    Bloqueado:true,
    Amigo:false,
   }
describe('ChatConversationScreen test', () => {


    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = ()=>{return };

    });
    it('Should render ChatConversationScreen', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatConversationScreen  route={{ params:{sala:salaJEje,screen:"fjdskl"} }} />)



    });

    it('ChatConversationScreen Should click buttonGoBack ', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ChatConversationScreen  route={{ params:{sala:salaJEj2e,screen:"fjdskl"} }} />)
        const touchableEl = component.getByTestId('buttonGoBack');
        fireEvent.press(touchableEl)

    });

});
