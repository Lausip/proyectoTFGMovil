import { View, ActivityIndicator, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, BackHandler, TouchableWithoutFeedback, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { db } from '../../config/firebase';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { updateUltimoCapitulo } from '../../hooks/Auth/Firestore';
import { AntDesign, MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { getCapituloId } from '../../hooks/FirebaseLibros';
import { ColorSpace } from 'react-native-reanimated';

function BooksScreen({ route }) {

  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [tamanoText, setTamanoText] = useState(14);
  const [titulo, setTitulo] = useState("");

  const [nocheDia, setNocheDia] = useState(false);
  const [fondoColor, setFondoColor] = useState("white");
  const [textoColor, setTextoColor] = useState("black");

  const [hayCapituloSiguiente, setHayCapituloSiguiente] = useState(false);
  const [sacarCapitulos, setSacarCapitulos] = useState(false);
  const [modalOpciones, setModalOpciones] = useState(false);
  const navigation = useNavigation();
  const { bookId, capituloNumero, screen } = route.params;

  useEffect(() => {
    hacerCosas();
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);

  }, []);

  /* 
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Hold on!', 'Are you sure you want to exit app?', [
          {
            text: 'Cancelar',
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: 'SI', onPress: () =>
              navigation.navigate("biblioteca")
          },
        ]);
        return true;
      }
    }; */



  const backAction = async () => {
    if (navigation.isFocused()) {
      if (screen == "detailsBookScreen") {
        navigation.navigate("detailsBookScreen", {
          bookId: bookId,
        });
      }
      else {
        navigation.navigate(screen)
      }
      return true;
    }


  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const hacerCosas = async () => {
    console.log(screen)
    let e = await getUserAuth();
    setEmail(e);
    await cargarCapituloLibros();
    let a = await mirarSiHayMasCapitulo(bookId, capituloNumero + 1);
    setHayCapituloSiguiente(a);
    setSacarCapitulos(false)
    await updateUltimoCapitulo(e, bookId, capituloNumero);
  }

  const mirarSiHayMasCapitulo = async (bookId, capSiguiente) => {
    let hay = false;
    let querySnapshot = await db.collection("libros").doc(bookId).collection("Capitulos")
      .where("Numero", "==", capSiguiente).get()
    if (!querySnapshot.empty) {
      hay = true;
    }

    return hay;
  }
  const cargarCapituloLibros = async () => {

    let querySnapshot = await db.collection("libros").doc(bookId).collection("Capitulos")
      .where("Numero", "==", capituloNumero).get()
    querySnapshot.forEach((queryDocumentSnapshot) => {
      setTexto(queryDocumentSnapshot.data().Contenido)
      setTitulo(queryDocumentSnapshot.data().Titulo)
    })

  }

  const irAotroCapitulo = async () => {

    navigation.push("bookScreen", {
      bookId: bookId,
      capituloNumero: capituloNumero + 1
    });
  }

  const cargarOpciones = async () => {

    setModalOpciones(!modalOpciones);
  }
  const sumarTexto = async () => {

    let nuevoTamanoText = tamanoText + 1;
    if (nuevoTamanoText <= 25)
      setTamanoText(nuevoTamanoText)
  }
  const restarTexto = async () => {

    let nuevoTamanoText = tamanoText - 1;
    if (nuevoTamanoText >= 14)
      setTamanoText(nuevoTamanoText)
  }
  const cambiarNocheDia = async () => {
    //Mirar si es de día: si lo es cambiar a noche
    if (!nocheDia) {
      setFondoColor("black");
      setTextoColor("white");
      setNocheDia(true);
    }
    else {
      setFondoColor("white");
      setTextoColor("black");
      setNocheDia(false);
    }
  }
  const irALosComentarios = async () => {
    let capituloId = await getCapituloId(bookId, capituloNumero);

    navigation.replace("comentariosCapituloScreen", {
      bookId: bookId,
      capituloId: capituloId,
      capituloNumero: capituloNumero
    });

  }

  const sacarCapitulosView = async () => {

    setSacarCapitulos(!sacarCapitulos)
  }
  return (

    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={() => cargarOpciones()}>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: fondoColor,
      }}>

        <ScrollView
          showsVerticalScrollIndicator={true}>
          <View onStartShouldSetResponder={() => true} style={{
            backgroundColor: fondoColor,
            marginHorizontal: 20,
            marginVertical: 30,
          }}>

            <Text style={styles.textChapter}>
              {titulo}
            </Text>
            <Text style={{
              fontSize: tamanoText,
              textAlign: "left",
              color: textoColor
            }}  >
              {texto}
            </Text>

            {
              hayCapituloSiguiente ?
                < TouchableOpacity onPress={() => irAotroCapitulo()} style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                  marginBottom: 50,
                  borderStyle: "dotted",
                  borderWidth: 2,
                  borderColor: "#679436",
                  flexDirection: "row",
                  borderRadius: 8,
                  shadowColor: "black",
                  shadowOpacity: 0.78,
                  shadowOffset: { width: 0, height: 9 },
                  shadowRadius: 10,
                  elevation: 6,
                  backgroundColor: fondoColor,
                  alignItems: "center",
                  justifyContent: "center",
                }} >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                    }}
                  >
                    <AntDesign name="book" size={24} color={textoColor} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 14, color: textoColor }}>
                      Ir al  {""}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "bold",
                          color: "#437C90",
                          marginLeft: 10,
                        }}
                      >
                        siguiente {""}
                      </Text>
                      <Text style={{ fontSize: 14, color: textoColor }}>
                        capítulo</Text>
                    </Text>
                  </View>
                </TouchableOpacity> :
                < View style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                  marginBottom: 50,
                  borderStyle: "dotted",
                  borderWidth: 2,
                  borderColor: "#679436",
                  flexDirection: "row",
                  borderRadius: 8,
                  shadowColor: "black",
                  shadowOpacity: 0.78,
                  shadowOffset: { width: 0, height: 9 },
                  shadowRadius: 10,
                  elevation: 6,
                  backgroundColor: fondoColor,
                  alignItems: "center",
                  justifyContent: "center",
                }} >
                  <View
                    style={{
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 5,
                    }}
                  >

                    <Text style={{ fontSize: 14, color: textoColor }}>
                      Estas al día </Text>
                  </View>
                </View>
            }
          </View>
        </ScrollView>

        {
          modalOpciones ?
            <View
              style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", }}
            >
              <View
                style={{
                  height: 60,
                  width: 350,
                  borderRadius: 30,
                  borderWidth: 3,
                  backgroundColor: "white",
                  borderLeftColor: "#05668D",
                  borderBottomColor: "#05668D",
                  borderTopColor: "#679436",
                  borderRightColor: "#679436",
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 20,
                  flexDirection: "row",
                  justifyContent: 'space-between',
                }}>

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginHorizontal: 20 }}>
                  <TouchableOpacity style={{ flexDirection: "row", marginLeft: 10, }} onPress={() => sumarTexto()}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flexDirection: "row", marginLeft: 10, }} onPress={() => restarTexto()}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>-</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 10, }} onPress={() => cambiarNocheDia()}>

                    {!nocheDia ?
                      <Ionicons name="md-sunny-outline" size={30} color="black" /> :
                      <Ionicons name="md-sunny" size={30} color="black" />
                    }

                  </TouchableOpacity>
                </View >
                {/*      <TouchableOpacity style={{ marginLeft: 10, }} onPress={() => sacarCapitulosView()}>
                  <Entypo name="menu" size={30} color="black" />
                </TouchableOpacity> */}
                <View style={{ justifyContent: "flex-end", marginHorizontal: 20 }}>
                  <TouchableOpacity style={{ marginLeft: 10, }} onPress={() => irALosComentarios()}>
                    <Ionicons name="ios-chatbox-outline" size={30} color="black" />
                  </TouchableOpacity>
                </View >
              </View>
            </View>

            : <Text></Text>
        }



      </SafeAreaView >

    </TouchableWithoutFeedback >

  )
}
const styles = StyleSheet.create({

  containerView: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 30,

  },

  textChapter: {
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: 30,
    fontSize: 20,
    color: "#05668D",
    fontWeight: "bold",
  },
});
export default BooksScreen