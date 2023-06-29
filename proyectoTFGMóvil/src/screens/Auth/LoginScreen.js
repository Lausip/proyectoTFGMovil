
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign"
import { handleIncioSesion } from "../../hooks/Auth/Auth"

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
        <Image style={styles.image} source={require("../../../assets/note.png")} />
      </View>
      {/* Form de Inicio de Sesión */}
      <View style={styles.inputContainer}>
        {/* Email de Inicio de Sesión */}
        <View>
          <Text style={styles.inputTextoDescripctivo}>
            {" "}
            Correo del usuario{" "}
          </Text>

          <View style={styles.inputContainerImage}>
            <AntDesign
              name="user"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#2B809C"
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
          <Text style={styles.inputTextoDescripctivo}>
            Contraseña del usuario{" "}
          </Text>
          <View style={styles.inputContainerImage}>
            <AntDesign
              name="lock"
              style={{ position: "absolute", left: 10 }}
              size={20}
              color="#2B809C"
            />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="black"
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            ></TextInput>
          </View>
          {/* Olvidaste Contraseña de Inicio de Sesión */}
          <TouchableOpacity testID="buttonOlvidoContra" style={{ marginLeft: 30 }} onPress={() => handlePsswOlvidada()}>
            <Text style={{ fontSize: 12, color: "black" }}>
              ¿Has olvidadado la{" "}
              <Text style={styles.textoLetraPequeña}
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
        {/* Iniciar Sesión */}
        <TouchableOpacity
        testID="buttonIniciarSesion"
          style={styles.buttonInicio}
          onPress={() => handleIncioSesion(email, password)}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
        {/* Crear cuenta */}
        <TouchableOpacity testID="buttonRegistrarse" onPress={() => handleRegistro()}>
          <Text style={{ fontSize: 12, color: "black" }}>
            ¿No tienes cuenta?{" "}
            <Text
              style={styles.textoLetraPequeña}>
              Regístrate
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
    backgroundColor: "#2B809C",
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
  inputTextoDescripctivo: {
    marginLeft: 30,
    fontSize: 14,
    color: "black",
    marginTop: 5
  },
  inputContainer: {
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderRadius: 30,
    borderWidth: 3,
    backgroundColor: "white",
    borderColor: "#8EAF20",
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
    backgroundColor: "#E39801",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.00,
    elevation: 15,

    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 15,
  },
  textoLetraPequeña: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#8EAF20",
    marginLeft: 10,
  }
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
