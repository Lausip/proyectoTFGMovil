import { StatusBar } from "expo-status-bar";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,LogBox
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState,useEffect } from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import {handleIncioSesion} from "../../hooks/Auth/Auth"

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
   const navigation = useNavigation();
   
  const handlePsswOlvidada = () => {
    navigation.replace("psswforgot");
  }
  const handleRegistro = () => {
    navigation.replace("register");
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={styles.headerBar}>
      {/* Inicio de Sesión Texto */}
      <View style={styles.headName}>
        <Text style={styles.fontIncioSesion}>Inicia Sesión </Text>
      </View>
      <View style={styles.imageContainer}>
        {/* Imagen*/}
        <Image style={styles.image} source={require("../../../assets/logo.png")} />
      </View>
      {/* Form de Inicio de Sesión */}
      <View style={styles.inputContainer}>
        {/* Email de Inicio de Sesión */}
        <View>
          <Text style={{ marginLeft: 30, fontSize: 14,color:"black" }}>
            {" "}
            Correo del usuario{" "}
          </Text>

          <View style={styles.inputContainerImage}>
            <AntDesign
              name="user"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#05668D"
            />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor="black"
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.input}
            />
          </View>
        </View>
        {/* Contraseña de Inicio de Sesión */}
        <View>
          <Text style={{ marginLeft: 30, marginTop: 5, fontSize: 14,color:"black" }}>
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
            placeholder="Constraseña"
            placeholderTextColor="black"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          ></TextInput>
              </View>
          {/* Olvidaste Contraseña de Inicio de Sesión */}
          <TouchableOpacity style={{ marginLeft: 30 }} onPress={handlePsswOlvidada}>
            <Text style={{ fontSize: 12, color: "black" }}>
              ¿Has olvidadado la{" "}
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "bold",
                  color: "#05668D",
                  marginLeft: 10,
                }}
              >
                contraseña
              </Text>
              <Text style={{ fontSize: 12, color: "black" }}>?</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
          onPress={e=>handleIncioSesion(email,password)}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" }}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegistro}>
          <Text style={{ fontSize: 12, color: "black" }}>
            ¿No tienes cuenta?{" "}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#05668D",
                marginLeft: 10,
              }}
            >
              Registrate
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
    backgroundColor: "white",
    color: "black",

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
  inputContainerImage: {
    justifyContent: "center",
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    marginTop: 15,
    marginLeft:20,
    marginRigth:20,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: "white",
    borderColor: "#679436",
  },
  input: {
    marginRight: 30,
    marginLeft: 30,
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    color:"black"
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
/*   buttonGoogle: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "70%",
    marginTop: 10,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 20,
    borderColor: "#437C90",
    borderWidth: 3,
    marginBottom: 10,
  }, */
});
export default LoginScreen;
