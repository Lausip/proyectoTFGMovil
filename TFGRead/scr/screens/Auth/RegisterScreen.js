import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import {handleRegistro} from "../../hooks/Auth/Auth"
import {crearFotoPerfilStorage} from "../../hooks/Storage"

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigation = useNavigation();
  const handleRegistroTodo = async () => {
   await  handleRegistro(email,password,password2);
    await crearFotoPerfilStorage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",email);
  };
  const handleIncioSesion = () => {
    navigation.replace("login");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={styles.headerBar}>
      {/* Registro Texto */}
      <View style={styles.headName}>
        <Text style={styles.fontIncioSesion}>Registro </Text>
      </View>
      <View style={styles.imageContainer}>
        {/* Imagen*/}
        <Image style={styles.image} source={require("../../../assets/logo.png")} />
      </View>
      {/* Form de Registro */}
      <View style={styles.inputContainer}>
        {/* Email de Registro */}
        <View>
          <Text style={{ marginLeft: 30, color: "black" }}> Email del usuario </Text>
          <View style={styles.inputContainerImage}>
            <AntDesign
              name="user"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#05668D"
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="black"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
          </View>
        </View>
        {/* Contraseña de Registro */}
        <View>
          <Text style={{ marginLeft: 30, marginTop: 5, color: "black" }}>
            Contraseña del usuario{" "}
          </Text>
          <View style={styles.inputContainerImage}>
            <AntDesign
              name="lock"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#05668D"
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="black"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
        </View>
        {/* Confirmar Contraseña Registro */}
        <View>
          <Text style={{ marginLeft: 30, marginTop: 5, color: "black" }}>
            Confirmar contraseña del usuario{" "}
          </Text>
          <View style={styles.inputContainerImage}>
            <AntDesign
              name="lock"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#05668D"
            />
            <TextInput
              placeholder="Confirmar Contraseña"
              placeholderTextColor="black"
              value={password2}
              onChangeText={(text) => setPassword2(text)}
              style={styles.input}
              secureTextEntry
            />
          </View>
        </View>
      </View>
      {/* Botón Login*/}
      <View
        style={{
          display: "flex",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={styles.buttonInicio}
          onPress={e=>handleRegistroTodo()}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" }}>
            Registrarse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleIncioSesion}>
          <Text style={{ fontSize: 12, color: "black" }}>
            ¿Ya tienes cuenta?{" "}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#05668D",
                marginLeft: 10,
              }}
            >
              Inicia sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  headerBar: {
    flex: 1,
    backgroundColor: "white"
  },
  headName: {
    height: "15%",
    backgroundColor: "#05668D",
    borderBottomRightRadius: 500,
    alignItems: "center",
    justifyContent: "center",
  },
  fontIncioSesion: {
    fontWeight: "bold",
    color: "white",
    fontSize: 30,
    marginRight: 90,
    marginTop: 20,
  },
  image: {
    width: 80,
    height: 80,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: "white",
    borderColor: "#679436",


  },
  inputContainerImage: {
  
    justifyContent: "center",
  },
  input: {
    marginRight: 30,
    marginLeft: 30,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    color: "black"
  },
  buttonInicio: {
    width: "50%",
    marginTop: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    borderColor: "#679436",
    borderWidth: 3,
    alignItems: "center",
    marginBottom: 10,
  },
});
export default RegisterScreen;
