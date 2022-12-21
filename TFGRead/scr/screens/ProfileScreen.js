import { View, ActivityIndicator, Text, FlatList, TextInput, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, ImageBackground, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import { crearFotoPerfilStorage } from "../hooks/Storage";
import { signOut } from "../hooks/Auth/Auth";
import { cambiarFotoPerfilFirebase, getFotoPerfil, cambiarDescripcion, getDescripcionUsuario } from "../hooks/Auth/Firestore";
import { pickImage } from "../utils/ImagePicker";

function ProfileScreen({ route }) {
    const [email, setEmail] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [texto, setTexto] = useState("");

    const navigation = useNavigation();

    const [isModalVisible, setModalVisible] = useState(false);

    const { screen } = route.params;

    useEffect(() => {
        hacerCosas();
    }, [email, fotoPerfil])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const goBack = () => {
        navigation.replace(screen);
    }

    const actualizarDescripcion = async () => {
        setModalVisible(true)
        await cambiarDescripcion(email, texto)
        setModalVisible(false)
    }

    const hacerCosas = async () => {

        setModalVisible(true)
        let e = await getUserAuth()
        setEmail(e);
        setFotoPerfil(await getFotoPerfil(e));
        setTexto(await getDescripcionUsuario(e));
        setModalVisible(false)

    }
    const cambiarFotoPerfil = async () => {
        let image = await pickImage();
        if (image != undefined) {
            setModalVisible(true)
            let urlImage = await crearFotoPerfilStorage(image, email)
            setFotoPerfil(urlImage);
            await cambiarFotoPerfilFirebase(email, urlImage)
            setModalVisible(false)
        }
    }
    const salir = async () => {
        await signOut();
    }

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
                        source={require('../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>
            {/* Head */}
            <StatusBar
                translucent={false}
                backgroundColor="white"
                barStyle="dark-content"
            />
            {/* Head Cosas */}
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#429EBD",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity onPress={() => goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Perfil</Text>
            </View>
            {/* Contenedor Perfil*/}
            <View style={{
                marginTop: 20,
                marginHorizontal: 30,
                flexDirection: "column",
                borderRadius: 8,
                shadowColor: "black",
                shadowOpacity: 0.78,
                shadowOffset: { width: 0, height: 9 },
                shadowRadius: 10,
                elevation: 11,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white",
                alignItems: "center"


            }}>
                <TouchableOpacity onPress={e => cambiarFotoPerfil()}>
                    <Image
                        source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 100, height: 100, borderRadius: 100 / 2, marginTop: 20 }}
                    />
                </TouchableOpacity >
                <Text style={{ marginTop: 20, fontWeight: "bold", fontSize: 20, color: "#429EBD" }}>
                    {email.split("@")[0]}
                </Text>
                <View style={{
                  marginVertical:20,
                }}>
                    <TextInput
                        placeholder="Descripción "
                        placeholderTextColor="black"
                        value={texto}
                        onChangeText={(text) => setTexto(text)}
                        style={{
         
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                            borderRadius: 10,
                            color: "black", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8",
                            textAlign: 'justify'
                        }}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    ></TextInput>
                    <TouchableOpacity
                        style={{
                            marginTop: 10,
                            backgroundColor: isModalVisible ? "#8D8D8D" : "#E39801",
                            padding: 4,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginBottom: 10,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 6.00,
                            elevation: 15,
                        }}
                        onPress={e => actualizarDescripcion()}
                    >
                        <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                            Actualizar
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>

            {/* Descripción del libro*/}



            <TouchableOpacity
                style={{
                    width: "50%",
                    marginTop: 25,
                    backgroundColor: isModalVisible ? "#8D8D8D" : "#E39801",
                    padding: 12,
                    borderRadius: 20,
                    alignItems: "center",
                    marginLeft: "auto",
                    marginRight: "auto",

                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 12,
                    },
                    shadowOpacity: 0.8,
                    shadowRadius: 6.00,
                    elevation: 15,
                }}
                onPress={e => salir()}
            >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                    Desconectarse
                </Text>
            </TouchableOpacity>
        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerView: {
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 30,
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

    fontTitulo: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: 170,
        marginVertical: 30,
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },

});
export default ProfileScreen