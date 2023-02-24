/** @jest-environment jsdom */
import React from "react";

import { screen } from '@testing-library/dom'
import { render } from '@testing-library/react-native'

import '@testing-library/jest-dom'
import App from '../../App';
import * as firebase from "@firebase/testing";

const mockedNavigate = jest.fn();
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
  auth: { uid: "alice" },
  getReactNativePersistence:""
});
jest.mock('firebase/auth', () => ({
  getReactNativePersistence: () => jest.fn(),
  initializeAuth: () => jest.fn(),
  getAuth: () => jest.fn(),
  onAuthStateChanged: () => jest.fn(),
}))

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigate,
      setOptions: jest.fn()

    }),
  };
});
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
describe('App test', () => {
  it('Should render App', async () => {
    console.error = jest.fn();
    console.warn = jest.fn();
    await firebase.initializeTestApp({ projectId: "tfgbook-f69af" }).firestore();
    const component =render(<App />)
    expect(component.getByText("Laura Vigil Laruelo"))

  });
});
