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
import { Ionicons, Foundation, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import { db } from '../config/firebase';
import LottieView from 'lottie-react-native';
import { getFotoPerfil, cargarUltimoLibro } from "../hooks/Auth/Firestore";

function HomeScreen() {
  const [newBooks, setNewBooks] = useState([]);
  const [ultimoLibro, setUltimoLibro] = useState({});
  const [email, setEmail] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [ultimoCapituloLeido, setUltimoCapituloLeido] = useState(1);
  const [capitulosLeido, setCapitulosLeido] = useState(4);

  useEffect(() => {
    hacerCosas();
  }, [ultimoLibro]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [ultimoLibro]);

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
  const handleBook = (item) => {
    navigation.navigate("detailsBookScreen", {
      bookId: item.key,
    });
  }
  const hacerCosas = async () => {
    setModalVisible(true)
    let e = await getUserAuth();
    setEmail(e);
    setFotoPerfil(await getFotoPerfil(e));

    let ultimo = await cargarUltimoLibro(e);
    setUltimoLibro(ultimo);
    setUltimoCapituloLeido(ultimo.UltimoCapitulo)
    setCapitulosLeido(ultimo.NumCapitulos)

    await cargarFirebase();


  }
  const handleLeerLibro = async () => {
    //Ir al capitulo escogido
    navigation.navigate("bookScreen", {
      bookId: ultimoLibro.key,
      capituloNumero: capituloNumero,
      screen: "home",
    });
  }
  const cargarFirebase = async () => {

    await db
      .collection("libros")
      .orderBy("FechaCreación", "asc")
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
          onPress={() => handleBook(item)}
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

  const CardUltimoLibro = () => {
    return (
      <View>
        <Text
          style={styles.ultimoLibroSigueLeyendo}>
          Sigue Leyendo
        </Text>

        <View style={styles.ultimoLibrocontainer}>
          {/*Foto del libro seguir leyendo*/}
          <View style={styles.fotodelLibrocontainer}>
            <View style={styles.fotodelLibrocontainer2}>
              <Image
                blurRadius={15}
                style={{ width: 130, height: 75 }}
                source={{ uri: `${ultimoLibro.Portada}` }}
              />
            </View>

            <ImageBackground
              source={{ uri: `${ultimoLibro.Portada}` }}
              style={styles.ultimoLibroImagen}
            ></ImageBackground>
          </View>
          {/*Cosas del libro seguir leyendo*/}
          <View style={{ justifyContent: "center", marginLeft: 20, }}>
            <View style={{ width: 130, height: 100, borderRadius: 15, }}>
              <View style={{ alignItems: "center", justifyContent: "center", }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#429EBD",
                    fontWeight: "bold",
                  }}
                >
                  {ultimoLibro.Titulo}
                </Text>
                <Text style={styles.ultimoLibroAutor}>
                  {ultimoLibro.Autor}
                </Text>
                <Text style={styles.ultimoLibroPorcentaje}>
                  {Math.round((ultimoLibro.UltimoCapitulo / ultimoLibro.NumCapitulos) * 100)}%
                  <Foundation name="page-multiple" size={15} color="#8EAF20" />
                </Text>
                <View style={styles.ultimoLibroviewPorcentaje}>
                  <View
                    style={{
                      position: "absolute",
                      width: (ultimoCapituloLeido / capitulosLeido) * 100,
                      height: 5,
                      backgroundColor: "#8EAF20",
                      borderRadius: 15,
                    }}
                  ></View>
                </View>
                <View style={{ marginTop: 15, }}>
                  {/* Botón Continuar seguir Leyendo */}
                  <TouchableOpacity
                    onPress={() => {
                      handleLeerLibro();
                    }}
                  >
                    <ImageBackground style={styles.ultimoLibroVieButton}>
                      <AntDesign name="arrowright" size={24} color="white" />
                    </ImageBackground>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.back}>
      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent>
          
        <View style={styles.modalView}>
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
            source={require("../../assets/note.png")}
          />
          {/*nombre e inicio*/}
          <View>
            <Text style={{ fontSize: 13, color: "#429EBD", fontWeight: "bold", }}>Readly </Text>
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
        <TouchableOpacity onPress={e => handleNotificacion()} style={{ marginTop: "auto",marginLeft:10 }}>
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
      <CardUltimoLibro />

    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "white",
  },
  modalView: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    height: 150,
    borderColor: "#8EAF20",
    borderRadius: 20,
    borderWidth: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.89,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 10,
    elevation: 12,
  },
  head: {
    paddingTop: 20,
    paddingBottom: 13,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "#8EAF20",
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
  ultimoLibroSigueLeyendo: {
 fontWeight: "bold", color: "black", 
    marginBottom: 10, 
    borderBottomColor: "#8EAF20", 
    borderBottomWidth: 3, 
    width: "60%" ,
    marginTop: 15,
    fontSize: 20,

    paddingHorizontal: 20,

  },
  ultimoLibrocontainer: {
    marginTop: 5,
    marginLeft: 20,
    height: 170,
    flexDirection: "row",
    marginRight: 30,
    borderRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.78,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: "white",
  },
  fotodelLibrocontainer: {
    justifyContent: "center",
    marginLeft: 10,
    marginBottom: 5,
  },
  fotodelLibrocontainer2: {

    elevation: 12,
    position: "absolute",
    top: 87,
    borderRadius: 25,
    overflow: "hidden",
    opacity: 0.3,
  },
  ultimoLibroImagen: {
    marginHorizontal: 10,
    width: 110,
    height: 140,
    borderRadius: 15,
    overflow: "hidden",
  },
  ultimoLibroAutor: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 13,
    color: "black",
  },
  ultimoLibroPorcentaje: {
    marginTop: 5,
    fontSize: 13,
    color: "black",
    fontWeight: "bold",
  },
  ultimoLibroviewPorcentaje: {
    marginTop: 5,
    width: 100,
    height: 5,
    backgroundColor: "#D8D8D8",
    borderRadius: 15,
  },
  ultimoLibroVieButton: {
    width: 90,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E39801",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default HomeScreen