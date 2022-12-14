import {
  SafeAreaView, StyleSheet, Text, View, TouchableOpacity,KeyboardAvoidingView, ImageBackground, Modal, StatusBar, ScrollView, Image, TextInput,BackHandler  
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { crearLibroStorage } from "../../hooks/Storage";
import { mirarSiTieneOtrosCapitulos } from "../../hooks/FirebaseLibros";
import { getUserAuth } from "../../hooks/Auth/Auth";

function WriteNewBookScreen({ route }) {
  const navigation = useNavigation();
  const { bookId} = route.params;

  
  const [email, setEmail] = useState("");
  const [tituloCapitulo, setTituloCapitulo] = useState("");
  const [contenidoLibro, setContenidoLibro] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);



  const publicarCapituloLibro = async () => {
    setModalVisible(true)
    mirarSiTieneOtrosCapitulos(bookId,tituloCapitulo,contenidoLibro,false);
    setModalVisible(false)
    handleWrite();
  }

  const handleWrite= () => {
    navigation.replace("write");
  }

  const borradorCapituloLibro = async () => {
    setModalVisible(true)
    mirarSiTieneOtrosCapitulos(bookId,tituloCapitulo,contenidoLibro,true);
    setModalVisible(false)
    handleWrite();
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
          borderColor: "#8EAF20",
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
          <TouchableOpacity onPress={e=>borradorCapituloLibro()}>
            <Ionicons name="arrow-back" size={24} color="black" style={{ marginTop: 15, marginRight: 10, }} />
          </TouchableOpacity>
          {/*nombre e inicio*/}
          <View>
            <Text style={styles.fontTitulo}>Nuevo Capítulo</Text>
          </View>
          <TouchableOpacity
            style={{     
              padding: 12,
              borderRadius: 20, 
              alignItems: "center",
              marginLeft: 35,
              marginRight: "auto",
              backgroundColor: isModalVisible ? "#8D8D8D" :"#E39801",     
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.8,
              shadowRadius: 6.00,
              elevation: 15,
            }}
            onPress={e => publicarCapituloLibro()}
          >
            <Text style={{
              fontWeight: "bold",
              color: "white",
              fontSize: 13,
            }}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Contenedor Principal*/}


        <ScrollView>
            <View style={styles.containerView}>
                      {/* Titulo capitulo del libro*/}
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3,width:"50%"  }}>
                        Título del capitulo
                    </Text>
                <TextInput
                    placeholder="Título "
                    placeholderTextColor="black"
                    value={tituloCapitulo}
                    onChangeText={(text) => setTituloCapitulo(text)}
                    style={{
                        marginBottom: 10,
                        marginRight: 20,
                        marginLeft: 20,
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        borderRadius: 10,
                        color: "#429EBD", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8"
                    }}
                    multiline={true}
                    scrollEnabled={true}
                ></TextInput>
                  {/* Descripción capitulo del libro*/}
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3,width:"50%"  }}>
                  Contenido
                  </Text>
                <KeyboardAvoidingView behavior="padding">
                        <TextInput
                            placeholder="Contenido "
                            placeholderTextColor="black"
                            value={contenidoLibro}
                            onChangeText={(text) => setContenidoLibro(text)}
                            style={{
                                paddingHorizontal: 10,
                                borderRadius: 10,
                                color: "#429EBD", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8",
                                textAlign: 'justify'
                            }}
                            multiline={true}
                            scrollEnabled={true}
                        ></TextInput>
                 
                </KeyboardAvoidingView>           
            </View>
            </ScrollView>
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
    borderBottomColor: "#8EAF20",
    borderBottomWidth: 3,
    borderRadius: 60,
  },
  containerView:{
    marginHorizontal:30,
  },
  textWait: {
    marginBottom: 10,
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto"
  }, lottieModalWait: {
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