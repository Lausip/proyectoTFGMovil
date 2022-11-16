import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import { db } from '../config/firebase';
import LottieView from 'lottie-react-native';
import { getFotoPerfil } from "../hooks/Auth/Firestore";

function HomeScreen() {
  const [newBooks, setNewBooks] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [fotoPerfil, setFotoPerfil] = useState("");


  useEffect(() => {
    hacerCosas();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const handleProfile = () => {
    navigation.navigate("profileScreen", {
      screen: "home",
    });
  }
  const handleNotificacion = () => {
    navigation.navigate("notificacionScreen", {
      screen: "home",
    });
  }

  const hacerCosas = async () => {
    setModalVisible(true)
    let e = await getUserAuth();
    setFotoPerfil(await getFotoPerfil(e));
    await cargarFirebase();

  }

  const cargarFirebase = async () => {

    await db
      .collection("libros")
      .onSnapshot(querySnapshot => {
        const books = [];
        querySnapshot.forEach(documentSnapshot => {
          books.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setNewBooks(books);
      });

    setModalVisible(false)
  }

  function renderNewBooks(item, index) {
    return (
      <View style={{ marginTop: 15, }}>
        {/* Imagenes Books nuevos blur */}
        <View
          style={{
            elevation: 12,
            position: "absolute",
            bottom: 20,
            left: 5,
            borderRadius: 15,
            overflow: "hidden",
            opacity: 0.3,
          }}
        >
          <Image
            blurRadius={15}
            style={{ width: 110, height: 90 }}
            source={{ uri: `${item.Portada}` }}
          />
        </View>
        {/* Imagenes Books nuevos */}
        <TouchableOpacity
          style={{
            marginHorizontal: 10,
          }}
          onPress={e => handleBook(item)}
        >
          <ImageBackground
            source={{ uri: `${item.Portada}` }}
            style={{
              width: 100,
              height: 120,
              borderRadius: 15,
              overflow: "hidden",
            }}
          ></ImageBackground>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: 10,
            marginTop: 10,
            fontSize: 13,
            color: "black",
            fontWeight: "bold",
          }}
        >
          {item.Titulo}
        </Text>
      </View>
    );
  }


  return (
    <SafeAreaView style={styles.back}>
      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent
      >
        <View style={{
          marginTop: "auto",
          marginBottom: "auto",
          marginLeft: "auto",
          marginRight: "auto",
          height: 150,
          borderColor: "#679436",
          borderRadius: 20,
          borderWidth: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: "center",
          shadowColor: "black",
          shadowOpacity: 0.89,
          shadowOffset: { width: 0, height: 9 },
          shadowRadius: 10,
          elevation: 12,
        }}>
          <LottieView style={styles.lottieModalWait}
            source={require('../../assets/animations/waitFunction.json')} autoPlay loop />
          <Text style={styles.textWait}>Cargando.....</Text>
        </View>
      </Modal>

      {/* Head */}
      <StatusBar
        translucent={false}
        backgroundColor="white"
        barStyle="dark-content"
      />

      {/* Head Cosas */}
      <View style={styles.head}>
        <View style={{ flexDirection: "row" }}>
          {/*Logo Imagen*/}
          <Image
            style={styles.image}
            source={require("../../assets/logo.png")}
          />
          {/*nombre e inicio*/}
          <View>
            <Text style={{ fontSize: 13, color: "#05668D" }}>Readly </Text>
            <Text style={styles.fontIncioSesion}>Inicio </Text>
          </View>
        </View>
        {/*User*/}
        <TouchableOpacity onPress={e => handleProfile()}>
          <Image
            source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10, left: 60 }}
          />

        </TouchableOpacity>
        {/*Notifications*/}
        <TouchableOpacity onPress={e => handleNotificacion()} style={{ marginTop: "auto" }}>
          <Ionicons name="notifications" size={33} color="black" />
        </TouchableOpacity>
      </View>

      {/*Nuevos libros*/}
      <View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 25,
            color: "black",
            paddingHorizontal: 20,
            fontWeight: "bold",
          }}
        >
          Nuevo!
        </Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newBooks}
            renderItem={({ item, index }) => renderNewBooks(item, index)}
          ></FlatList>
        </View>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "white",
  },
  head: {
    paddingTop: 20,
    paddingBottom: 13,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#679436",
    borderBottomWidth: 3,
    borderRadius: 60,
  },
  fontIncioSesion: {
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
  },
  image: {
    marginRight: 10,
    width: 37,
    height: 37,
  },
  lottieModalWait: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    height: '100%',
    width: '100%'
  },
  textWait: {
    marginBottom: 10,
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto"
  },
});
export default HomeScreen