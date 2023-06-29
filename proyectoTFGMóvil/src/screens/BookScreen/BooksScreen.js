import { View, Text, ScrollView, SafeAreaView, StyleSheet, FlatList, TouchableOpacity, BackHandler, TouchableWithoutFeedback, Modal, ImageBackground } from 'react-native';
import { useNavigation,useIsFocused  } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { getUserAuth } from "../../hooks/Auth/Auth";
import { updateUltimoCapitulo, cambiarUltimoLibroLeido, handleElLibroEstaEnMeGusta, handleAñadirLibroMeGustaFirebaseCapitulo } from '../../hooks/Auth/Firestore';
import { AntDesign, MaterialCommunityIcons, Ionicons, Feather, Entypo } from '@expo/vector-icons';
import { getPortadaLibro, getCapituloId, getCapitulo, getCapitulosDelLibro } from '../../hooks/FirebaseLibros';
import * as Progress from 'react-native-progress';

function BooksScreen({ route }) {

  const [email, setEmail] = useState("");

  const [tamanoText, setTamanoText] = useState(14);
  const [titulo, setTitulo] = useState("");
  const [portada, setPortada] = useState("");


  const [nocheDia, setNocheDia] = useState(false);
  const [fondoColor, setFondoColor] = useState("white");
  const [textoColor, setTextoColor] = useState("black");

  const [hayCapituloSiguiente, setHayCapituloSiguiente] =  React.useState(false);
  const [texto, setTexto] = React.useState("");
  const [modalAñadirMeGusta, setModalAñadirMeGusta] = React.useState(false);
  const [sacarCapitulos, setSacarCapitulos] = useState(false);
  const [modalOpciones, setModalOpciones] = useState(false);


  const [capitulos, setCapitulos] = useState(false);

  const navigation = useNavigation();
  const { bookId, capituloNumero, screen } = route.params;

  const [scrollView_height, setScrollView_height] = useState(0)
  const [scrollViewContent_height, setScrollViewContent_height] = useState(0)
  const [progress, setProgress] = useState(0)
  useEffect(() => {

    hacerCosas();
    BackHandler.addEventListener('hardwareBackPress', preguntarBibliotecaMegusta);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', preguntarBibliotecaMegusta);

  }, [capituloNumero]);

  const preguntarBibliotecaMegusta = async () => {
    let e = await getUserAuth();
    let megusta = await handleElLibroEstaEnMeGusta(e, bookId)
    if (!megusta) {
      setModalAñadirMeGusta(true);
    } else {
      goBack();
    }
  }

  const añadirElLibroABiblioteca = async () => {
    let e = await getUserAuth();
    await handleAñadirLibroMeGustaFirebaseCapitulo(e, bookId, capituloNumero)
    setTimeout(() => 1000);
    goBack();
  }

  const goBack = () => {
      if (screen == "detailsBookScreen" || screen == undefined) {
        navigation.navigate("detailsBookScreen", {
          bookId: bookId,
        });
      }
      else {
        navigation.navigate(screen)
      }
 
    
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const UpdateProgressBar = (value) => {

    setProgress(
      Math.abs(
        value.nativeEvent.contentOffset.y /
        (scrollView_height - scrollViewContent_height),
      ),
    );
  };

  const hacerCosas = async () => {

    let e = await getUserAuth();
    setEmail(e);
    await cargarCapituloLibros();
    let a = await getCapitulo(bookId, capituloNumero + 1);

    if (a == undefined) {
      setHayCapituloSiguiente(false)
    }
    else {
      setHayCapituloSiguiente(true)
    }
    setPortada(await getPortadaLibro(bookId))
    await updateUltimoCapitulo(e, bookId, capituloNumero);
    setCapitulos(await getCapitulosDelLibro(bookId));
    setSacarCapitulos(false)

  }

  const cargarCapituloLibros = async () => {

    let d = await getCapitulo(bookId, capituloNumero);
    setTexto(d.Contenido)
    setTitulo(d.Titulo)


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
      capituloNumero: capituloNumero,
      screen: "bookScreen"
    });

  }

  const sacarCapitulosView = (s) => {
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
      <TouchableOpacity testID="buttonLeerCapitulo" key={libro.id} onPress={() => handleLeerLibroCapitulo(libro.Numero)}>
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

    <TouchableWithoutFeedback testID="buttonCargarOpciones" style={{ flex: 1, }} onPress={() => cargarOpciones()}>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: modalAñadirMeGusta ? "#8D8D8D" : fondoColor,
      }}>
        <Progress.Bar
          height={3}
          borderWidth={0}
          progress={progress}
          color="#8EAF20"
          width={null}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={UpdateProgressBar}
          onContentSizeChange={(width, height) => {
            setScrollViewContent_height(height);
          }}

          onLayout={(event) => {


            setScrollView_height(event.nativeEvent.layout.height)
          }
          }

          bounces={false}
        >
          <View onStartShouldSetResponder={() => true} style={{
            backgroundColor: modalAñadirMeGusta ? "#8D8D8D" : fondoColor,
            marginHorizontal: 20,

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
                < TouchableOpacity testID="buttonIrCapitulo" onPress={() => irAotroCapitulo()} style={{
                  marginTop: 20,
                  marginHorizontal: 20,
                  marginBottom: 10,
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
                  backgroundColor: modalAñadirMeGusta ? "#8D8D8D" : fondoColor,
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
                  marginBottom: 10,
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
                  backgroundColor: modalAñadirMeGusta ? "#8D8D8D" : fondoColor,
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


                <Text style={{ fontSize: 20, color: "#2B809C", fontWeight: "bold", }}>
                  {titulo}
                </Text>
              </View >

              <View style={{ marginHorizontal: 20,maxHeight:200 }}>

                <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                  Capítulos{":    "}
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


        <Modal
          animationType="fade"
          visible={modalAñadirMeGusta}
          transparent
        >

          <View style={styles.modalBiblioteca}>
            <AntDesign name="warning" size={35} color="#E39801" />
            <Text style={{
              marginVertical: 20,
              marginHorizontal: 20,
            }}>¿Quieres añadir el libro a la biblioteca?</Text>
            <View style={{
              flexDirection: "row"
            }}>
              <TouchableOpacity
                style={styles.modalBotonesBiblioteca2}
                testID='buttonGoBack'
                onPress={() => goBack()}
   
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalBotonesBiblioteca}
                testID='buttonAñadirMegusta'
                onPress={() => añadirElLibroABiblioteca()}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                  Añadir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal de opciones */}
        {
          modalOpciones ?
            <View
              style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: modalAñadirMeGusta ? "#8D8D8D" : fondoColor, }}
            >
              <View
                style={styles.modalOpciones}>

                <View style={{ justifyContent: "flex-start", flexDirection: "row", marginHorizontal: 20 }}>
                  <TouchableOpacity testID="buttonSumarLetra" style={{ flexDirection: "row", marginLeft: 10, }} onPress={() => sumarTexto()}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>+</Text>
                  </TouchableOpacity>

                  <TouchableOpacity testID="buttonRestarLetra" style={{ flexDirection: "row", marginLeft: 10, }} onPress={() => restarTexto()}>
                    <MaterialCommunityIcons name="format-letter-case" size={30} color="black" />
                    <Text>-</Text>
                  </TouchableOpacity>

                  <TouchableOpacity testID="buttonCambiarSol" style={{ marginLeft: 10, }} onPress={() => cambiarNocheDia()}>

                    {!nocheDia ?
                      <Ionicons name="md-sunny-outline" size={30} color="black" /> :
                      <Ionicons name="md-sunny" size={30} color="black" />
                    }

                  </TouchableOpacity>
                  {hayCapituloSiguiente ?
                    <TouchableOpacity testID="buttonSiguienteCapitulo" style={{ marginLeft: 10, }} onPress={() => siguienteCapitulo()}>
                      <Feather name="arrow-right" size={30} color="black" />
                    </TouchableOpacity> : <View > </View>
                  }
                  <TouchableOpacity testID="buttonSacarCapitulos" style={{ marginLeft: 50, }} onPress={() => sacarCapitulosView(!sacarCapitulos)}>
                    <Entypo name="menu" size={30} color="black" />
                  </TouchableOpacity>

                </View >
                <View style={{ justifyContent: "flex-end", marginRight: 20 }}>
                  <TouchableOpacity style={{}}  testID='buttonIrComentarios' onPress={() =>irALosComentarios()}>
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
    color: "#2B809C",
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
    position:"absolute",
    marginBottom: 250,
    marginLeft: "auto",
    marginRight: "auto",
    left: "20%",
    top:"20%",
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
  modalBotonesBiblioteca: {
    width: "30%",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#E39801",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.00,
    elevation: 15,
  },
  modalBotonesBiblioteca2: {
    width: "30%",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#B00020",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.00,
    elevation: 15,
  },
  modalBiblioteca: {
    marginHorizontal: 30,
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    height: 200,
    borderColor: "#8EAF20",
    borderRadius: 20,
    borderWidth: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.89,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 10,
    elevation: 12,

  }
});
export default BooksScreen