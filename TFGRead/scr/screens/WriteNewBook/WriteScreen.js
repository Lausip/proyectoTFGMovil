import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground, Image,
  Modal, StatusBar, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Foundation } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { contarCapitulosDelLibro, cargarBooksAutor } from "../../hooks/FirebaseLibros";
import LottieView from 'lottie-react-native';
import { getFotoPerfil } from "../../hooks/Auth/Firestore";

function WriteScreen() {
  const navigation = useNavigation();
  const [books, setBooks] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [email, setEmail] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    hacerCosas();
  }, [email]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

  }, []);

  const handleProfile = () => {
    navigation.navigate("profileScreen", {
      screen: "write",
    });
  }

  const hacerCosas = async () => {
    setModalVisible(true)
    let e = await getUserAuth()
    setEmail(e);
    setFotoPerfil(await getFotoPerfil(e));
    let libros = await cargarBooks();
    let item;
    const booksA = [];
    for (item in libros) {
      let numeroCapt = await contarCapitulosDelLibro(libros[item].key);
      booksA.push({
        ...libros[item],
        nCapitulos: numeroCapt,
      });
    }
    setBooks(booksA)
    setModalVisible(false)
  }

  const handleWriteNewBook = () => {
    navigation.replace("writeNewBook");
  }

  const handleEditBook = (bookId) => {
    navigation.replace("editBook", {
      bookId: bookId
    });
  }
  const cargarBooks = async () => {
    return cargarBooksAutor(email)
  }

  /* Books nuevos */
  const Card = ({ libro }) => {
    return (
      <View
        style={{
          marginHorizontal: 10, marginBottom: 10, flexDirection: "row", borderRadius: 8,
          shadowColor: "black", shadowOpacity: 0.78, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
          backgroundColor: "white",
        }}>
        <ImageBackground
          source={{ uri: libro.Portada }}
          style={{
            width: 100,
            height: 120,
            borderRadius: 15,
            overflow: "hidden",
            marginBottom: 10,
            marginLeft: 10,
            marginTop: 10,
            borderWidth: 1,
            borderColor: "black",
          }}
        ></ImageBackground>
        <View style={{ marginTop: 15, width: 180, marginLeft: 10, alignItems: "center", justifyContent: "flex-start" }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "#05668D" }}>
            {libro.Titulo}
          </Text>
          <Text style={{ marginTop: 5, fontSize: 13, color: "black" }}>
            {libro.nCapitulos} {""}
            <Foundation name="page-multiple" size={12} color="#679436" />
          </Text>
          <Text style={{ marginTop: 5, fontSize: 11, color: "black" }}>
            Última modificación:
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              width: 90,
              height: 30,
              borderWidth: 2,
              borderColor: "#679436",
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              handleEditBook(libro.key)
            }}
          >
            <AntDesign name="edit" size={24} color="#679436" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
          <Text style={styles.textWait}>Cargando.....</Text>
        </View>
      </Modal>
      {/* Pantalla normal*/}
      {/* Head */}
      <StatusBar
        translucent={false}
        backgroundColor="white"
        barStyle="dark-content"
      />
      {/* Head Cosas */}
      <View style={styles.head}>
        <View style={{ flexDirection: "row" }}>
          {/*nombre e inicio*/}
          <View>
            <Text style={styles.fontEscribir}>Escribir</Text>
          </View>
        </View>
        {/*User*/}
        <TouchableOpacity onPress={() => { handleProfile() }}>
          <Image
            source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10 }}
          />
        </TouchableOpacity>
      </View>
      {/* Contenedor Botón escribir nuevo libro  */}
      <TouchableOpacity style={styles.containerEscribeNuevaHistoria} onPress={handleWriteNewBook}>
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
            Escribe una {""}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: "#437C90",
                marginLeft: 10,
              }}
            >
              nueva {""}
            </Text>
            <Text style={{ fontSize: 14, color: "black" }}>
              historia</Text>
          </Text>
        </View>
      </TouchableOpacity>
      {/* Libros creados*/}
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginHorizontal: 10, marginTop: 10, borderBottomColor: "#679436", borderBottomWidth: 3, }}>
        Editar libros
      </Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {
          books.map((item, index) => <Card key={index} libro={item} />)
        }

      </ScrollView>

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
  fontEscribir: {
    paddingTop: 10,
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
  },
  containerEscribeNuevaHistoria: {
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
  renderCategoriaMisLibros: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
  },
  categoriaText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modalView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 10,

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
export default WriteScreen