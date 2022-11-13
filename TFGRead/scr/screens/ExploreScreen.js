import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal, StatusBar,TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { Entypo } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import {  getFotoPerfil } from "../hooks/Auth/Firestore";
import { getUserAuth } from "../hooks/Auth/Auth";

function ExploreScreen() {
  const navigation = useNavigation();

  const [fotoPerfil, setFotoPerfil] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
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

  const getFiltrado = async () => {
    
  }
  const hacerCosas = async () => {
    setModalVisible(true)
    let e=await getUserAuth()
    setEmail(e);
    setFotoPerfil(await getFotoPerfil(e));
    setModalVisible(false)
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
            <Text style={styles.fontEscribir}>Explora</Text>
          </View>
        </View>
        {/*User*/}
        <TouchableOpacity onPress={() => {handleProfile() }}>
        <Image
                        source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10 }}
                    />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainerBusqueda}>
         {/*Texto buqueda*/}
         <View style={styles.inputContainerTextBusqueda}>
         <TextInput
            placeholder="Busca un libro, persona..."
            placeholderTextColor="black"
            value={textoBusqueda}
            onChangeText={(text) => setTextoBusqueda(text)}
            style={styles.input}
          ></TextInput>
            </View>
               {/* Boton de filtrar */}
            <TouchableOpacity style={styles.buttonLeer} onPress={()=>getFiltrado()}>
                <Entypo name="magnifying-glass" size={24} color="black" />
                    </TouchableOpacity>
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
  fontEscribir: {
    paddingTop: 10,
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
  },
 
 
  modalView: {
    flex: 1,
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
    inputContainerBusqueda:{
      flexDirection:"row",
    },
    inputContainerTextBusqueda:{
      marginTop:20,
      marginLeft:"auto",
      marginRight:"auto",
      justifyContent:"center",
      borderRadius: 10,
      alignItems:"center",
      backgroundColor: "#f8f8f8",
      width:250,
      height:40,
    },
    input: {
      color: "black",  
    },
    buttonLeer: { 
      marginRight:"auto", 
      marginTop: "auto",
      backgroundColor: "white",
      padding: 12,
      borderRadius: 20,
      borderColor: "#679436",
      borderWidth: 3,
      alignItems: "center",

  },
});
export default ExploreScreen