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
            source={require("../../assets/homeImage.png")}
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
                color: "#429EBD",
                marginLeft: 20,
              }}
            >
              tú
            </Text>
            <Text style={styles.fontEnunciado}> quieras </Text>
          </Text>
        </View>
        
        <View
        style={{
          display: "flex",
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
 
        }}
      >
        {/* Botones  */}
 
            <TouchableOpacity style={styles.buttonInicio} onPress={handleIncioSesion}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "#FFFFFF" }}>
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
 

          <TouchableOpacity onPress={handleRegistro}>
          <Text style={{ fontSize: 13, color: "black" }}>
            ¿No tienes cuenta?{" "}
            <Text
              style={{
                fontSize: 12,
                fontWeight: "bold",
                color: "#8EAF20",
                marginLeft: 10,
              }}
            >
              Registrate
            </Text>
          </Text>
        </TouchableOpacity>
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
      color: "#429EBD",
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
      width: "50%",
      marginHorizontal:20,
      marginVertical:20,
    },
    buttonBox: {
      marginVertical:20,
      marginHorizontal:20,
      alignContent: "center",
    },
    bottom: {
      marginTop:100,
      justifyContent: "flex-end",
  
    },
  });
  export default PrimeraScreen;
  