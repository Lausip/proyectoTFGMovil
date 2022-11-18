import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import {
  useNavigation,
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import HomeStack from "../navigation/HomeStack";
import BibliotecaStack from "../navigation/BibliotecaStack";
import BookWriteNavigator from "../navigation/BookWriteNavigator";
import ExploreStack from "../navigation/ExploreStack";
import ChatStack from "../navigation/ChatStack";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const Tab = createBottomTabNavigator();

const BottomTab = () => {
  return (

    <Tab.Navigator
      screenOptions={{
        activeBackgroundColor: '#c4461c',
        inactiveBackgroundColor: '#b55031',
        tabBarActiveTintColor: "#05668D",
        tabBarInactiveTintColor: "black",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          marginHorizontal: 20,
          height: 53,
          marginBottom: 10,
          borderRadius: 20,
          borderBottomColor: "#679436",
          borderBottomWidth: 2,
          shadowColor: "#000",
          shadowOpacity: 0.07,
          shadowOffset: {
            width: 10,
            height: 10,
          },
        },
      }}
    >
      <Tab.Screen
        name="Home"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "detailsBookScreen" || routeName == "bookScreen" || routeName == "profileScreen" || routeName == "notificacionScreen" || routeName == "chatConversationScreen") {
              return { display: "none" };
            }
            if (routeName == "" || routeName == "home") {
              return {
                backgroundColor: "white",
                marginHorizontal: 20,
                height: 53,
                marginBottom: 10,
                borderRadius: 20,
                borderBottomColor: "#679436",
                borderBottomWidth: 2,
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
              };
            }
          })(route),
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={25}
              style={{
                color: focused ? "#05668D" : "black",
              }}
            />
          ),
        })}
        component={HomeStack}
      />
      <Tab.Screen
        name="Explore"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "autorScreen" || routeName == "chatConversationScreen") {
              return { display: "none" };
            }
            if (routeName == "" || routeName == "explore") {
              return {
                backgroundColor: "white",
                marginHorizontal: 20,
                height: 53,
                marginBottom: 10,
                borderRadius: 20,
                borderBottomColor: "#679436",
                borderBottomWidth: 2,
                shadowColor: "#000",
                shadowOpacity: 0.07,
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
              };
            }
          })(route),

          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="search1"
              size={25}
              style={{
                color: focused ? "#05668D" : "black",
              }}
            />
          ),
        })}
        component={ExploreStack}
      />
      <Tab.Screen
        name="Books"
        options=
        {({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "bookScreen") {
              return { display: "none" };
            }
            return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#679436",
              borderBottomWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowOffset: {
                width: 10,
                height: 10,
              },
            };
          })(route),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={25}
              style={{
                color: focused ? "#05668D" : "black",
              }}
            />

          ),
        })}
        compo
        component={BibliotecaStack}
      />
      <Tab.Screen
        name="Write"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "writeNewBook" || routeName == "writeChapter" || routeName == "editBook" || routeName == "editChapter") {
              return { display: "none" };
            }
            return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#679436",
              borderBottomWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowOffset: {
                width: 10,
                height: 10,
              },
            };
          })(route),
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="pencil"
              size={25}
              style={{
                color: focused ? "#05668D" : "black",
              }}
            />
          ),
        })}
        component={BookWriteNavigator}
      />
      <Tab.Screen
        name="Chat"
        options={({ route }) => ({

          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            console.log(routeName);
            if (routeName === "chatConversationScreen") {
              return { display: "none" };

            } return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#679436",
              borderBottomWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowOffset: {
                width: 10,
                height: 10,
              },
            };
          })(route),
          tabBarIcon: ({ focused }) => (
            <Entypo
              name="chat"
              size={25}
              style={{
                color: focused ? "#05668D" : "black",
              }}
            />
          ),
        })}
        component={ChatStack}
      />
    </Tab.Navigator>

  );
};

export default BottomTab;
