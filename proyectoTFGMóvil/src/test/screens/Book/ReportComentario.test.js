/** @jest-environment jsdom */

import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import * as firebase from "@firebase/testing";

import ReportComentarioScreen from "../../../screens/BookScreen/ReportComentarioScreen"


firebase.initializeTestApp({
    projectId: "tfgbook-f69af",
    auth: { uid: "63ToLd0bNfaiwcxYHpX9kxm99ae2", email: "admin@gmail.com" }
});

firebase.initializeTestApp({
    databaseName: "my-database",
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
        getUserAuth: () => { return "admin@gmail.com" },
    };
});

jest.mock('../../../hooks/FirebaseReportes', () => {
    return {

        enviarReporteAutor: () => jest.fn(),

    };
});


describe('ReportBookScreen test', () => {


    afterEach(async () => {

        console.error = jest.fn();
        console.warn = jest.fn();

    });
    it('Should render ReportBookScreen', async () => {
        React.useState = jest.fn()
            .mockReturnValue([true, {}])
    
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ReportComentarioScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        expect(component.getByText("Motivo"))
    /*     const touchableEl = component.queryByTestId('buttonListAccordation');
        fireEvent.press(touchableEl); */
        const touchableEl2 = component.queryByTestId('buttonCheckboxAccordationDivulgacion');
        fireEvent.press(touchableEl2);
        const touchableEl3 = component.queryByTestId('buttonSpam');
        fireEvent.press(touchableEl3);
        const touchableEl4 = component.queryByTestId('buttonOdio');
        fireEvent.press(touchableEl4);
        const emailInput = component.getByPlaceholderText(
            "Motivo"
        );
        fireEvent.changeText(emailInput,
            "Hola que tal"
        );
        const touchableEl5 = component.queryByTestId('buttonEnviar');
        fireEvent.press(touchableEl5);
    });

 
    it('Should click buttonGoHome', async () => {
    
        await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
        const component = render(<ReportComentarioScreen route={{ params: { autorElegido: "admin@gmail.com" } }} />)
        expect(component.getByText("Motivo"))
        const touchableEl2 = component.queryByTestId('buttonGoHome');
        fireEvent.press(touchableEl2);
    });
});






