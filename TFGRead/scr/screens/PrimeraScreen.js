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
  import React, { useLayoutEffect } from "react";
  
  const PrimeraScreen = () => {
    const navigation = useNavigation();
    useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false,
      });
    }, []);
  
    const handleIncioSesion = () => {
      navigation.replace("login")
    }
    const handleRegistro = () => {
      navigation.replace("register");
    };
    return (
      <SafeAreaView style={styles.headerBar}>
        {/* Bienvenido  */}
        <View style={styles.header}>
          <View>
            <Text style={styles.fontBienvenido}>Bienvenido a</Text>
            <Text style={styles.fontNameApp}>BookApp</Text>
          </View>
        </View>
  
        {/* Imagen  */}
        <View style={styles.imageBox}>
          <Image
            source={require("../../assets/homeImage.jpg")}
            style={styles.image}
          />
        </View>
  
        {/* Palabras  */}
        <View style={styles.textEnunciado}>
          <Text>
            <Text style={styles.fontEnunciado}>Lee lo que </Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "bold",
                color: "#05668D",
                marginLeft: 20,
              }}
            >
              tú
            </Text>
            <Text style={styles.fontEnunciado}> quieras </Text>
          </Text>
        </View>
  
        {/* Botones  */}
        <View style={styles.buttonBox}>
          <View>
            <TouchableOpacity style={styles.buttonInicio} onPress={handleIncioSesion}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" }}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonRegistro} onPress={handleRegistro}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "black" }}>
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>
        </View>
  
        {/* Crédito  */}
        <View style={styles.bottom}>
          <Text>
            <Text   style={{
    
                color: "black",
        
              }}>  Aplicación realizada por: </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
              }}
            >
              Laura Vigil Laruelo
            </Text>
          </Text>
        </View>
      </SafeAreaView>
    );
  };
  const styles = StyleSheet.create({
    headerBar: {
      flex: 1,
      paddingHorizontal: 20,
      backgroundColor: "white",
    },
    header: {
      marginLeft: 30,
      marginTop: 70,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fontBienvenido: {
      fontSize: 24,
      fontWeight: "bold",
      color:"black"
    },
    fontNameApp: {
      marginLeft: 100,
      fontSize: 30,
      fontWeight: "bold",
      color: "#679436",
    },
    fontEnunciado: {
      marginTop: 20,
      fontSize: 17,
      color:"black"
    },
    textEnunciado: {
      marginTop: 5,
      alignItems: "flex-start",
      marginLeft: 50,
    },
    imageBox: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom:20,
    },
    image: {
      marginTop: 10,
      height: 250,
      width: 250,
    },
    buttonInicio: {
      backgroundColor: "white",
      padding: 12,
      borderRadius: 20,
      borderLeftColor: "#05668D",
      borderBottomColor: "#05668D",
      borderTopColor: "#679436",
      borderRightColor: "#679436",
      borderWidth: 3,
      alignItems: "center",
      marginBottom: 10,
    },
    buttonRegistro: {
      backgroundColor: "white",
      padding: 12,
      borderRadius: 20,
      borderLeftColor: "#679436",
      borderBottomColor: "#679436",
      borderTopColor: "#05668D",
      borderRightColor: "#05668D",
      borderWidth: 3,
      alignItems: "center",
      marginBottom: 10,
    },
    buttonBox: {
      marginTop:30,
      marginLeft:30,
      marginRight:30,
  
      alignContent: "center",
    },
    bottom: {
      marginTop:100,
      justifyContent: "flex-end",
  
    },
  });
  export default PrimeraScreen;
  