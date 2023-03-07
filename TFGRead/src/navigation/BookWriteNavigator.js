import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WriteScreen from '../screens/WriteNewBook/WriteScreen';
import WriteNewBookScreen from '../screens/WriteNewBook/WriteNewBookScreen';
import WriteChapterBooksScreen from '../screens/WriteNewBook/WriteChapterBooksScreen';
import ProfileScreen from "../screens/ProfileScreen";
import EditBookScreen from "../screens/EditBookScreen/EditBookScreen";
import EditChapterScreen from "../screens/EditBookScreen/EditChapterScreen";
import ReportAutorScreen from '../screens/AutoresScreen/ReportAutorScreen';
const Stack = createNativeStackNavigator();
function BookWriteNavigator() {

    return (
        <Stack.Navigator>
            <Stack.Screen name="write" component={WriteScreen} />
            <Stack.Screen name="editBook" component={EditBookScreen} />
            <Stack.Screen name="editChapter" component={EditChapterScreen} />
            <Stack.Screen name="writeNewBook" component={WriteNewBookScreen} />
            <Stack.Screen name="writeChapter" component={WriteChapterBooksScreen} />
            <Stack.Screen name="profileScreen" component={ProfileScreen} /> 
            <Stack.Screen name="reportAutorScreen" component={ReportAutorScreen} /> 
        </Stack.Navigator>
    );
}

export default BookWriteNavigator