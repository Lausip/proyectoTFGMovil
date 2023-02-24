/** @jest-environment jsdom */
import React from "react";

import { render,fireEvent } from '@testing-library/react-native'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";
import ProfileScreen from "../../screens/ProfileScreen";

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
        getUserAuth:  () => {return ""},

    };
});


jest.mock('firebase/auth', () => ({
    getReactNativePersistence: () => jest.fn(),
    initializeAuth: () => jest.fn(),
    getAuth: () => jest.fn(),
    onAuthStateChanged: () => jest.fn(),
    signInWithEmailAndPassword: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) } ,
    signOut: () => { return new Promise((resolve) => { resolve({ email: "admin@gmail.com" }) }) } 
  }))


jest.mock('../../hooks/Auth/Firestore', () => {
    return {
      
        cambiarFotoPerfilFirebase:() =>  jest.fn(),
        getDescripcionUsuario:() =>  {return "Holaaa"},
        cambiarDescripcion:() =>  jest.fn(),
        getFotoPerfil:() =>  jest.fn(),
        
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
        pickImage: () => {return "iela"},
    };
});


describe('ProfileScreen test', () => {
    afterEach(async () => {
        jest.clearAllMocks();
        console.error = jest.fn();
        console.warn = jest.fn();

      });
    it('Should render ProfileScreen', async () => {
      
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ProfileScreen route={{params:""}}/>)
        expect(component.getByText("Actualizar"))

    });

    it('Should click cambiarFotoPerfil', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ProfileScreen route={{params:""}}/>)
        const touchableEl = component.queryByTestId('buttonFotoPerfil');
        fireEvent.press(touchableEl);

    });

    it('Should click actualizarDescripcion', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ProfileScreen route={{params:""}}/>)
        const edescripcionInput = component.getByPlaceholderText(
            "Descripción"
        );
        fireEvent.changeText(edescripcionInput,
            "Holiiii"
        );
        const touchableEl = component.queryByTestId('buttonDescripcion');
        fireEvent.press(touchableEl);
        expect(edescripcionInput.props.value).toBe('Holiiii');

    });

    
    it('Should click salir', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ProfileScreen route={{params:""}}/>)
        const touchableEl = component.queryByTestId('buttonSalir');
        fireEvent.press(touchableEl);

    });

    it('Should click goBack', async () => {

        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ProfileScreen route={{params:{screen:"home"}}}/>)
        const touchableEl = component.queryByTestId('buttonGoBack');
        fireEvent.press(touchableEl);
        expect(mockedReplace).toHaveBeenCalledWith("home");
    });



});
