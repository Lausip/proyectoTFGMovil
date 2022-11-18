import { View, ActivityIndicator, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { db } from '../../config/firebase';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { updateUltimoCapitulo} from '../../hooks/Auth/Firestore';
import { AntDesign } from '@expo/vector-icons';
function BooksScreen({ route }) {

  const [email, setEmail] = useState("");
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const [hayCapituloSiguiente, setHayCapituloSiguiente] = useState(false);
  const navigation = useNavigation();
  const { bookId, capituloNumero } = route.params;

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
          navigation.navigate("biblioteca")   
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
    let a=await mirarSiHayMasCapitulo(bookId,capituloNumero+1);
    setHayCapituloSiguiente(a);
    await updateUltimoCapitulo(e,bookId,capituloNumero);
  }

  const mirarSiHayMasCapitulo = async (bookId,capSiguiente) => {
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

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>



        <ScrollView

          showsVerticalScrollIndicator={false}>
          <Text style={styles.textChapter}>
            {titulo}
          </Text>
          <Text style={styles.text}>
            {texto}
          </Text>

          {
            hayCapituloSiguiente ?
              < TouchableOpacity onPress={() => irAotroCapitulo()} style={styles.containerEscribeNuevaHistoria} >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 5,
                  }}
                >
                  <AntDesign name="book" size={24} color="black" style={{ marginRight: 10 }} />
                  <Text style={{ fontSize: 14, color: "black" }}>
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
                    <Text style={{ fontSize: 14, color: "black" }}>
                      capítulo</Text>
                  </Text>
                </View>
              </TouchableOpacity> :
              < View style={styles.containerEscribeNuevaHistoria} >
                <View
                  style={{
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 5,
                  }}
                >

                  <Text style={{ fontSize: 14, color: "black" }}>
                    Estas al día </Text>
                </View>
              </View>
          }
        </ScrollView>



      </View>
    </SafeAreaView >


  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerView: {
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical: 30,

  },
  text: {
    fontSize: 14,


  }, containerEscribeNuevaHistoria: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
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
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",

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