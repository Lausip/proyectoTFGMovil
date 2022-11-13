import {
  SafeAreaView, StyleSheet, Text, View, TouchableOpacity, ImageBackground, Modal, StatusBar, ScrollView, Image, TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { crearLibroStorage } from "../../hooks/Storage";
import { cambiarPortadadeLibro, crearLibroFirebase } from "../../hooks/FirebaseLibros";
import { getUserAuth } from "../../hooks/Auth/Auth";

function WriteNewBookScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState("https://leadershiftinsights.com/wp-content/uploads/2019/07/no-book-cover-available.jpg");
  const [email, setEmail] = useState("");
  const [tituloLibro, setTituloLibro] = useState("");
  const [descripcionLibro, setDescripcionLibro] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const goBack = () => {
    navigation.replace("write");
  }
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  const contarPalabras = (texto) => {
    if (texto.length < 2000) {
      setDescripcionLibro(texto)
    }

  }
  const crearLibro = async () => {
    setModalVisible(true)
     let id = await crearLibroFirebase(tituloLibro, descripcionLibro, email);
    let urlPortada = await crearLibroStorage(image, email, id)
    await cambiarPortadadeLibro(id, urlPortada)
    setModalVisible(false)
    navigation.navigate("writeChapter",{
      bookId: id,
    });
  }
  const fetchData = async () => {
    setEmail(await getUserAuth());
  }
  useEffect(() => {
    fetchData();
  }, [email]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isModalVisible ? "#A7A7A7" : "white",
    }}>

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
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginTop: "auto", marginRight: 10, }} />
          </TouchableOpacity>
          {/*nombre e inicio*/}
          <View>
            <Text style={styles.fontTitulo}>Información nuevo libro</Text>
          </View>
        </View>
      </View>
      {/* Contenedor Principal*/}

      <View
        style={{
          flex: 1,
          marginVertical: 5,
          marginHorizontal: 30
        }}
      >
        {/* Portada del libro */}
        <View style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
        }}>
          <Text style={{ fontSize: 17, color: "black", marginBottom: 5 }}>
            Cambiar portada del libro
          </Text>

          {/* Imagenes Books nuevos blur */}
          <View
            style={{
              elevation: 12,
              position: "absolute",
              top: 120,
              borderRadius: 15,
              overflow: "hidden",
              opacity: 0.3,
            }}
          >
            <Image
              blurRadius={15}
              style={{ width: 130, height: 80 }}
              source={{ uri: `${image}` }}
            />
          </View>
          {/* Imagenes Books nuevos */}
          <TouchableOpacity
            style={{
              marginHorizontal: 10,
            }}
            onPress={e=>pickImage()}
          >
            <ImageBackground
              source={{ uri: `${image}` }}
              style={{
                width: 110,
                height: 150,
                borderRadius: 15,
                overflow: "hidden",
              }}
            ></ImageBackground>
          </TouchableOpacity>
        </View>

        {/* Titulo del libro*/}
        <View style={{ marginTop: 10, }}>
          <Text style={{ fontSize: 17, color: "black", marginBottom: 10 }}>
            Título del libro
          </Text>
          <TextInput
            placeholder="Título "
            placeholderTextColor="#05668D"
            value={tituloLibro}
            onChangeText={(text) => setTituloLibro(text)}
            style={{
              marginRight: 20,
              marginLeft: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              color: "#05668D", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8"
            }}
          ></TextInput>
        </View>
        {/* Descripción del libro */}
        <View style={{ marginTop: 10, }}>
          <Text style={{ fontSize: 17, color: "black", marginBottom: 10 }}>
            Descripción del libro
          </Text>
          <TextInput
            placeholder="Descripción"
            placeholderTextColor="#05668D"
            value={descripcionLibro}
            onChangeText={(text) => contarPalabras(text)}
            style={{
              marginRight: 20,
              marginLeft: 20,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
              color: "#05668D", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8"
            }}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          ></TextInput>
          <Text style={{
            marginLeft: "80%"
          }}> {descripcionLibro.length}/2000</Text>
        </View>
        <TouchableOpacity
          style={{
            width: "50%",
            marginTop: 25,
            backgroundColor: isModalVisible ? "#8D8D8D" : "white",
            padding: 12,
            borderRadius: 20,
            borderColor: "#679436",
            borderWidth: 3,
            alignItems: "center",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          onPress={e => crearLibro()}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" }}>
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
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
  textWait: {
    marginBottom: 10,
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto"
  }, 
  lottieModalWait: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    height: '100%',
    width: '100%'
  },
  fontTitulo: {
    paddingTop: 10,
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
  },
  containerPrincipal: {
    backgroundColor: "white",
  },
  modalContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: 'center',
    height: '100%', width: '100%',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
    top: 100,
    width: '85%', height: 50,
    backgroundColor: 'white',
    borderRadius: 8
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    marginLeft: 20
  }
});
export default WriteNewBookScreen