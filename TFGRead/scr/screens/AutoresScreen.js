import { View, ActivityIndicator, Text, FlatList, ScrollView, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, ImageBackground, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, Foundation, Entypo } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { seguirAutor, enviarPeticion, getFotoPerfil, getDescripcionUsuario, getEstaSeguido, getNumeroLibrosUsuario, getNumAutoresSeguidos, getNumSeguidores, dejarSeguirAutor,mirarSiSonAmigos } from "../hooks/Auth/Firestore";
import { existeSala, addSala } from "../hooks/ChatFirebase";
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { db } from '../config/firebase';
function AutoresScreen({ route }) {

    const [email, setEmail] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleEnviarMensaje, setModalVisibleEnviarMensaje] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [seguidores, setSeguidores] = useState(0);
    const [libros, setLibros] = useState(0);
    const [seguidos, setSeguidos] = useState(0);
    const [estaSeguido, setEstaSeguido] = useState(false);
    const { autorElegido, screen } = route.params;


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


    const hacerCosas = async () => {

        setModalVisible(true)
        let e = await getUserAuth()
        setEmail(e);
        setFotoPerfil(await getFotoPerfil(autorElegido));
        setDescripcion(await getDescripcionUsuario(autorElegido));
        setLibros(await getNumeroLibrosUsuario(autorElegido));
        let seguidoss = await getNumAutoresSeguidos(autorElegido);
        setSeguidos(seguidoss);
        setSeguidores(await getNumSeguidores(autorElegido));
        setEstaSeguido(await getEstaSeguido(e, autorElegido, seguidoss))
        setModalVisible(false);

    }

    const addAmigo = async () => {
        setModalVisibleEnviarMensaje(true);
        enviarPeticion(email, autorElegido, "Amistad");
        setModalVisibleEnviarMensaje(false);
    }

    const seguir = async () => {
        setEstaSeguido(true);
        await seguirAutor(email, autorElegido);
        setSeguidores(await getNumSeguidores(autorElegido));

    }
    const dejarSeguir = async () => {
        setEstaSeguido(false);
        await dejarSeguirAutor(email, autorElegido);
        setSeguidores(await getNumSeguidores(autorElegido));

    }

    const cogerSala = async (usuarioa, usuariob) => {
        let salaaaaa = [];
        await db
            .collection('salas').doc(usuarioa + "-" + usuariob).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {

                    salaaaaa.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,

                    });
                    navigation.replace("chatConversationScreen", {
                        sala: salaaaaa[0],
                        screen: "explore",
                
                    });
                }
                return false;

            })


    }
    const enviarMensaje = async () => {
        setModalVisibleEnviarMensaje(true);
        let existe = await existeSala(email, autorElegido)
        console.log("Sala:"+existe)
        //Mirar si ya hay sala
        if (!existe) {
            //Mirar si son amigos:
            let sonAmigos = await mirarSiSonAmigos(email, autorElegido);
            if (sonAmigos) {
                console.log("entre")
                await addSala(email, autorElegido, true);
            }
            else {
                //Añadir Sala
                await addSala(email, autorElegido,false);
                //Mandar notificación:
                await enviarPeticion(email, autorElegido, "Conversacion");
            }
            await cogerSala(email, autorElegido);
            setModalVisibleEnviarMensaje(false);
        }
        else {
            setModalVisibleEnviarMensaje(false);
            let existe = false;
            existe = await cogerSala(email, autorElegido);

            if (!existe) {
                await cogerSala(autorElegido, email);
            }

        }


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
            <Modal
                animationType="fade"
                visible={isModalVisibleEnviarMensaje}
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
                    <Text style={styles.textWait}>Enviando petición...</Text>
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
                backgroundColor: "#679436",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity onPress={() => { goBack() }}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>  {autorElegido.split("@")[0]}</Text>
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


            }}>
                {/* Menu de acciones*/}
                <View style={{
                    marginTop: 20,
                    alignItems: "flex-end",
                    marginHorizontal: 20,

                }}>

                    <Menu>
                        <MenuTrigger>
                            <Entypo name="dots-three-vertical" size={24} color="black" />
                        </MenuTrigger>
                        <MenuOptions style={{
                            alignItems: "center",

                            borderRadius: 8,
                            shadowColor: "black",
                            shadowOpacity: 0.78,
                            shadowOffset: { width: 0, height: 9 },
                            shadowRadius: 10,
                            elevation: 11,
                            backgroundColor: isModalVisible ? "#A7A7A7" : "white",

                        }}>
                            <MenuOption onSelect={() => addAmigo()} text='Añadir a amigos' />
                            <MenuOption onSelect={() => enviarMensaje()} text='Enviar Mensaje privado' />
                            <MenuOption onSelect={() => alert(`Delete`)}>

                                <Text style={{ color: 'red' }}>Reportar</Text>
                            </MenuOption>

                        </MenuOptions>
                    </Menu>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity>
                        <Image
                            source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                            style={{ width: 100, height: 100, borderRadius: 100 / 2 }}
                        />
                    </TouchableOpacity >

                    {/* Boton seguir autor */}
                    <View style={{
                        marginBottom: 20,


                    }}>
                        {!estaSeguido ?
                            <TouchableOpacity
                                style={{

                                    width: "50%",
                                    marginTop: 20,
                                    backgroundColor: isModalVisible ? "#8D8D8D" : "white",
                                    padding: 12,
                                    borderRadius: 20,
                                    borderColor: "#679436",
                                    borderWidth: 3,
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    flexDirection: "row"
                                }}
                                onPress={() => seguir()}
                            >
                                <Foundation name="foot" size={24} color="black" />
                                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                    Seguir
                                </Text>
                            </TouchableOpacity> : <TouchableOpacity
                                style={{

                                    width: "50%",
                                    marginTop: 20,
                                    backgroundColor: isModalVisible ? "#8D8D8D" : "white",
                                    padding: 12,
                                    borderRadius: 20,
                                    borderColor: "#679436",
                                    borderWidth: 3,
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    flexDirection: "row"
                                }}
                                onPress={() => dejarSeguir()}
                            >
                                <Foundation name="foot" size={24} color="black" />
                                <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                    Dejar de seguir
                                </Text>
                            </TouchableOpacity>}
                    </View>

                    {/* Informacion sobre autor */}
                    <View style={{

                        flexDirection: "row", marginBottom: 20,
                    }}>

                        {/* Informacion obras*/}
                        <View style={{

                            flexDirection: "column", alignItems: "center", marginRight: 20,
                        }}>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                {libros}
                            </Text>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                Libros
                            </Text>
                        </View>
                        {/* Informacion seguidores */}
                        <View style={{

                            flexDirection: "column", alignItems: "center", marginRight: 20,
                        }}>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                {seguidores}
                            </Text>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                Seguidores
                            </Text>
                        </View>

                        {/* Informacion seguidos*/}
                        <View style={{

                            flexDirection: "column", alignItems: "center",
                        }}>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                {seguidos}
                            </Text>
                            <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: "bold", color: "black" }}>
                                Seguidos
                            </Text>
                        </View>

                    </View>
                </View>
            </View>
            {/*Contenedor Descripcion del autor*/}

            <View style={{
                marginTop: 20,
                marginHorizontal: 30,
                borderRadius: 8,
                shadowColor: "black",
                shadowOpacity: 0.78,
                shadowOffset: { width: 0, height: 9 },
                shadowRadius: 10,
                elevation: 11,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white",


            }}>
                <Text style={{
                    marginHorizontal: 30,
                    marginVertical: 10,

                }}>{descripcion}</Text>
            </View>
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
export default AutoresScreen