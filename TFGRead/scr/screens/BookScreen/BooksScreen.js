import { View, ActivityIndicator, Text, ScrollView, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, BackHandler, TouchableWithoutFeedback, Modal, ImageBackground } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { db } from '../../config/firebase';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { updateUltimoCapitulo, cambiarUltimoLibroLeido } from '../../hooks/Auth/Firestore';
import { AntDesign, MaterialCommunityIcons, Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { getPortadaLibro, getCapituloId } from '../../hooks/FirebaseLibros';



function BooksScreen({ route }) {

  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [tamanoText, setTamanoText] = useState(14);
  const [titulo, setTitulo] = useState("");
  const [portada, setPortada] = useState("");


  const [nocheDia, setNocheDia] = useState(false);
  const [fondoColor, setFondoColor] = useState("white");
  const [textoColor, setTextoColor] = useState("black");

  const [hayCapituloSiguiente, setHayCapituloSiguiente] = useState(false);
  const [sacarCapitulos, setSacarCapitulos] = useState(false);
  const [modalOpciones, setModalOpciones] = useState(false);

  const [capitulos, setCapitulos] = useState(false);

  const navigation = useNavigation();
  const { bookId, capituloNumero, screen } = route.params;

  useEffect(() => {
    hacerCosas();
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);

  }, [capituloNumero]);


  const backAction = async () => {
    if (navigation.isFocused()) {

      if (screen == "detailsBookScreen" || screen == undefined) {
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

    let e = await getUserAuth();
    setEmail(e);
    await cargarCapituloLibros();
    let a = await mirarSiHayMasCapitulo(bookId, capituloNumero + 1);
    setPortada(await getPortadaLibro(bookId))
    await db.collection("libros").doc(bookId).collection("Capitulos").orderBy("Numero", "asc").onSnapshot(querySnapshot => {
      const caps = [];
      querySnapshot.forEach(documentSnapshot => {
        caps.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,
        });
      });
      setCapitulos(caps);
    });

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
    //Cambiar el ultimo libro leido:
    await cambiarUltimoLibroLeido(bookId, email, capituloNumero + 1);

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
      setFondoColor("#111111");
      setTextoColor("white");
      setNocheDia(true);
    }
    else {
      setFondoColor("white");
      setTextoColor("#111111");
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

  const sacarCapitulosView = (s) => {
    console.log(s)
    if (s)
      setFondoColor("#A7A7A7")
    else {
      setFondoColor("#FFFF")
    }
    setSacarCapitulos(s)
  }

  const siguienteCapitulo = async () => {
    if (hayCapituloSiguiente) {
      irAotroCapitulo();
    }
  }

  const handleLeerLibroCapitulo = async (capituloNumero) => {

    setFondoColor("white")

    //Cambiar el ultimo libro leido:
    await cambiarUltimoLibroLeido(bookId, email, capituloNumero);

    //Ir al capitulo escogido
    navigation.navigate("bookScreen", {
      bookId: bookId,
      capituloNumero: capituloNumero,
      screen: "detailsBookScreen",
    });
  }

  const CardCapitulosLibros = ({ libro }) => {
    return (
      <TouchableOpacity key={libro.id} onPress={e => handleLeerLibroCapitulo(libro.Numero)}>
        <View style={{
          marginTop: 5, borderBottomColor: "#8EAF20",
          borderBottomWidth: 1,
          borderBottomEndRadius: 1,

          width: libro.Titulo.length ? 150 : libro.Titulo.length + 50
        }}>
          <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 15, color: "black", }}>
            {libro.Titulo}
          </Text>
        </View>
      </TouchableOpacity >
    );
  };


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
          {/* Contenido */}
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

          {/* Contenedor de siguiente o no capitulo */}
            {
              hayCapituloSiguiente ?
                < TouchableOpacity onPress={() => irAotroCapitulo()} style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                  marginBottom: 50,
                  borderStyle: "dotted",
                  borderWidth: 2,
                  borderColor: "#E39801",
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
                          color: "#E39801",
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
                  borderColor: "#8EAF20",
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

                      {/* Menu de capitulo */}

        {
          sacarCapitulos ?

            <View style={styles.modalCapitulos}>
              <View style={{ alignItems: 'center', marginBottom: 10 }}>

                <View style={styles.fotodelLibrocontainer}>
                  <View style={styles.fotodelLibrocontainer2}>
                    <ImageBackground
                      blurRadius={15}
                      style={{ width: 130, height: 75 }}
                      source={{ uri: `${portada}` }}
                    />
                  </View>

                  <ImageBackground
                    source={{ uri: `${portada}` }}
                    style={styles.libroImagen}
                  ></ImageBackground>
                </View>


                <Text style={{ fontSize: 20, color: "#429EBD", fontWeight: "bold", }}>
                  {titulo}
                </Text>
              </View >

              <View style={{ marginHorizontal: 20 }}>

                <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                  Capitulos{":    "}
                </Text>

                <FlatList
                  style={{ backgroundColor: "white", borderRadius: 20, marginBottom: 10 }}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  data={capitulos}
                  renderItem={({ item, index }) => (
                    <CardCapitulosLibros key={index} libro={item} />
                  )}
                />
              </View>
            </View>
            : <Text></Text>
        }


           {/* Modal de opciones */}
        {
          modalOpciones ?
            <View
              style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", }}
            >
              <View
                style={styles.modalOpciones}>

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginHorizontal: 20 }}>
                  <TouchableOpacity style={{ flexDirection: "row", marginLeft: 10, }} onPress={sumarTexto}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ flexDirection: "row", marginLeft: 10, }} onPress={restarTexto}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>-</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 10, }} onPress={cambiarNocheDia}>

                    {!nocheDia ?
                      <Ionicons name="md-sunny-outline" size={30} color="black" /> :
                      <Ionicons name="md-sunny" size={30} color="black" />
                    }

                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 10, }} onPress={() => siguienteCapitulo()}>
                    <Feather name="arrow-right" size={30} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity style={{ marginLeft: 50, }} onPress={() => sacarCapitulosView(!sacarCapitulos)}>
                    <Entypo name="menu" size={30} color="black" />
                  </TouchableOpacity>

                </View >
                <View style={{ justifyContent: "flex-end", marginRight: 20 }}>
                  <TouchableOpacity style={{}} onPress={irALosComentarios}>
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
    color: "#429EBD",
    fontWeight: "bold",
  }
  ,
  libroImagen: {
    marginVertical: 10,
    marginHorizontal: 20,
    width: 110,
    height: 140,
    borderRadius: 15,
    overflow: "hidden",
  },
  modalCapitulos: {
    marginBottom: 250,
    marginLeft: "auto",
    marginRight: "auto",
    width: 250,
    borderColor: "#8EAF20",
    borderRadius: 20,
    borderWidth: 2, backgroundColor: 'white',
    shadowColor: "black",
    shadowOpacity: 0.89,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 10,
    elevation: 12,
  },
  fotodelLibrocontainer: {
    justifyContent: "center",

  },
  fotodelLibrocontainer2: {
    elevation: 12,
    position: "absolute",
    top: 87,
    left: 10,
    borderRadius: 25,
    overflow: "hidden",
    opacity: 0.3,
  },
  modalOpciones: {
    height: 60,
    width: 350,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: "white",
    borderColor: "#E39801",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    justifyContent: 'space-between',
  },
});
export default BooksScreen