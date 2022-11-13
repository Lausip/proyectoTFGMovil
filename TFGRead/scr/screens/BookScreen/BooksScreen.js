import { View, ActivityIndicator, Text, ScrollView, SafeAreaView,StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { db } from '../../config/firebase';

function BooksScreen({ route }) {
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");
  const navigation = useNavigation();
  const { bookId,capituloNumero} = route.params;

  useEffect(() => {
    cargarCapituloLibros();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

 const cargarCapituloLibros = async () => {
   console.log(bookId)
    let querySnapshot  = await db.collection("libros").doc(bookId).collection("Capitulos")
    .where("Numero", "==", capituloNumero).get()
    querySnapshot.forEach((queryDocumentSnapshot) => {
      setTexto( queryDocumentSnapshot.data().Contenido) 
      setTitulo(queryDocumentSnapshot.data().Titulo)
    })


 
}

  return (

    <SafeAreaView style={styles.container}>
      <View style={styles.containerView}>
        <Text style={styles.textChapter}>
          {titulo}
        </Text>
      <ScrollView 
      showsVerticalScrollIndicator={false}>
        <Text style={styles.text}>
          {texto}
        </Text>
      </ScrollView>
      </View>
    </SafeAreaView>


  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  containerView:{
    backgroundColor: 'white',
    marginHorizontal: 30,
    marginVertical:30,
  },
  text: {
    fontSize: 14,
    

  },
  textChapter: {
    marginLeft:"auto",
    marginRight:"auto",
    marginVertical:30,
    fontSize: 20,
    color:"#05668D",
    fontWeight: "bold",
  },
});
export default BooksScreen