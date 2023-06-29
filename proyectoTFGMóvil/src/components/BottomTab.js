import {
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign, Entypo,MaterialCommunityIcons  } from '@expo/vector-icons';
import HomeStack from "../navigation/HomeStack";
import BibliotecaStack from "../navigation/BibliotecaStack";
import BookWriteNavigator from "../navigation/BookWriteNavigator";
import ExploreStack from "../navigation/ExploreStack";
import ChatStack from "../navigation/ChatStack";


const Tab = createBottomTabNavigator();
/* istanbul ignore next */
const BottomTab = () => {
  return (

    <Tab.Navigator
      screenOptions={{
        activeBackgroundColor: '#c4461c',
        inactiveBackgroundColor: '#b55031',
        tabBarActiveTintColor: "#E39801",
        tabBarInactiveTintColor: "black",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          marginHorizontal: 20,
          height: 53,
          marginBottom: 10,
          borderRadius: 20,
          borderBottomColor: "#8EAF20",
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

            if (routeName === "detailsBookScreen" || routeName == "bookScreen"||routeName=="reportAutorScreen"||routeName=="reportBookScreen" || routeName == "profileScreen" || routeName == "notificacionScreen" || routeName == "chatConversationScreen" || routeName == "comentariosCapituloScreen"||routeName=="reportcomentariosCapituloScreen") {
              return { display: "none" };
            }
            if (routeName == "" || routeName == "home"|| routeName == "autorScreen"|| routeName ==="chatScreen") {
              return {
                backgroundColor: "white",
                marginHorizontal: 20,
                height: 53,
                marginBottom: 10,
                borderRadius: 20,
                borderBottomColor: "#8EAF20",
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
                color: focused ? "#E39801" : "black",
              }}
            />
          ),
        })}
        component={HomeStack}
      />
      <Tab.Screen
        name="Explorar"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "autorScreen"  || routeName == "profileScreen" || routeName == "chatConversationScreen" ||routeName=="reportAutorScreen"|| routeName == "comentariosCapituloScreen"||routeName=="reportBookScreen"||routeName=="reportcomentariosCapituloScreen") {
              return { display: "none" };
            }
            if (routeName == "" || routeName == "explore"|| routeName ==="chatScreen") {
              return {
                backgroundColor: "white",
                marginHorizontal: 20,
                height: 53,
                marginBottom: 10,
                borderRadius: 20,
                borderBottomColor: "#8EAF20",
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
                color: focused ? "#E39801" : "black",
              }}
            />
          ),
        })}
        component={ExploreStack}
      />
      <Tab.Screen
        name="Biblioteca"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";
            if (routeName === "bookScreen" ||  routeName == "profileScreen" ||routeName == "comentariosCapituloScreen"||routeName == "autorScreen"||routeName=="reportBookScreen"||routeName=="reportcomentariosCapituloScreen"||routeName=="reportAutorScreen") {
              return { display: "none" };
            }else{
            return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#8EAF20",
              borderBottomWidth: 2,
              shadowColor: "#000",
              shadowOpacity: 0.07,
              shadowOffset: {
                width: 10,
                height: 10,
              },}
            };
          })(route),
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="bookshelf"
              size={25}
              style={{
                color: focused ? "#E39801" : "black",
              }}
            />

          ),
        })}
        compo
        component={BibliotecaStack}
      />
      <Tab.Screen
        name="Escribir"
        options={({ route }) => ({
          tabBarStyle: ((route) => {
            const routeName = getFocusedRouteNameFromRoute(route) ?? "";

            if (routeName === "writeNewBook"  || routeName == "profileScreen" || routeName == "writeChapter" || routeName == "editBook" || routeName == "editChapter") {
              return { display: "none" };
            }
            return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#8EAF20",
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
                color: focused ? "#E39801" : "black",
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

  
            if (routeName === "chatConversationScreen" || routeName == "profileScreen" ) {
              return { display: "none" };

            } return {
              backgroundColor: "white",
              marginHorizontal: 20,
              height: 53,
              marginBottom: 10,
              borderRadius: 20,
              borderBottomColor: "#8EAF20",
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
                color: focused ? "#E39801" : "black",
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
