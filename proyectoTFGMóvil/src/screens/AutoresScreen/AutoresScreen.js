import { View, Text, FlatList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, ImageBackground, Modal, BackHandler } from 'react-native';
import { useNavigation,CommonActions } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, Foundation, Entypo } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { seguirAutor, enviarPeticion, getFotoPerfil, getDescripcionUsuario, getFechaCreaciónUsuario, getEstaSeguido, getNumeroLibrosUsuario, getNumAutoresSeguidos, getNumSeguidores, dejarSeguirAutor, mirarSiSonAmigos } from "../../hooks/Auth/Firestore";
import { existeSala, addSala, cogerSala } from "../../hooks/ChatFirebase";
import {
    Menu,
    MenuOptions,
    MenuTrigger,
    MenuOption ,
} from 'react-native-popup-menu';

import { cargarBooksAutorPerfil } from "../../hooks/FirebaseLibros";
function AutoresScreen({ route }) {

    const [email, setEmail] = useState("");
    const [fotoPerfil, setFotoPerfil] = useState("");
    const navigation = useNavigation();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleEnviarMensaje, setModalVisibleEnviarMensaje] = useState(false);
    const [descripcion, setDescripcion] = useState("");
    const [fechaCreacion, setFechaCreacion] = useState("");
    const [seguidores, setSeguidores] = useState(0);
    const [libros, setLibros] = useState(0);
    const [seguidos, setSeguidos] = useState(0);
    const [estaSeguido, setEstaSeguido] = React.useState(true);
    const [sonAmigos, setSonAmigos] = useState(false);
    const { autorElegido, screen } = route.params;

    const [librosArray, setLibrosArray] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', goBack);
        hacerCosas();

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', goBack);
    }, [email, fotoPerfil])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const goBack = () => {

        navigation.navigate(screen);
    }

    const hacerCosas = async () => {

        setModalVisible(true)
        let e = await getUserAuth()
        setEmail(e);
        setSonAmigos(await mirarSiSonAmigos(e, autorElegido));
        setEstaSeguido(await getEstaSeguido(e, autorElegido));
        setFotoPerfil(await getFotoPerfil(autorElegido));
        setDescripcion(await getDescripcionUsuario(autorElegido));
        setFechaCreacion(await getFechaCreaciónUsuario(autorElegido))
        setLibros(await getNumeroLibrosUsuario(autorElegido));
        let seguidoss = await getNumAutoresSeguidos(autorElegido);
        setSeguidos(seguidoss);
        setSeguidores(await getNumSeguidores(autorElegido));
        setModalVisible(false);
        let con=await cargarBooksAutorPerfil(autorElegido);
        setLibrosArray(con);



    }
    const handleBook = (item) => {
        navigation.navigate("detailsBookScreen", {
            bookId: item.key,
        });
    }


    const addAmigo = async () => {
        setOpenMenu(false)
        setModalVisibleEnviarMensaje(true);
        enviarPeticion(email, autorElegido, "Amistad");
        setModalVisibleEnviarMensaje(false);
    }

    const seguir = async () => {
        setEstaSeguido(true);
        await seguirAutor(email, autorElegido);
        setSeguidores(await getNumSeguidores(autorElegido));

    }
    const reportarAutor = async () => {
        setOpenMenu(false);
        navigation.navigate("reportAutorScreen", {
            autorElegido: autorElegido
        });

    }
    const dejarSeguir = async () => {
        setEstaSeguido(false);
        await dejarSeguirAutor(email, autorElegido);
        setSeguidores(await getNumSeguidores(autorElegido));

    }


    const enviarMensaje = async () => {
        setOpenMenu(false)
        let salaaaaa;
        let existe = await existeSala(email, autorElegido)
     
        //Mirar si ya hay sala
        if (!existe) {
            //Mirar si son amigos:
            if (sonAmigos) {
                await addSala(email, autorElegido, true);
                salaaaaa = await cogerSala(autorElegido, email);
                navigation.navigate("chatConversationScreen", {
                    sala: salaaaaa,
                    screen: "autorScreen",

                });
            }
            else {
                //Añadir Sala
                await addSala(email, autorElegido, false);

                //Mandar notificación:
                await enviarPeticion(email, autorElegido, "Conversacion");
                salaaaaa = await cogerSala(autorElegido, email);

                navigation.navigate("chatConversationScreen", {
                    sala: salaaaaa,
                    screen: "autorScreen",

                });
            }
         
        }
        else {
            salaaaaa = await cogerSala(autorElegido, email);
            navigation.navigate("chatConversationScreen", {
                sala: salaaaaa,
                screen: "autorScreen",

            });
        }
   
    }
    function renderNewBooks(item, index) {
        return (
            <View style={{ marginTop: 15, }}>
                {/* Imagenes Books nuevos blur */}
                <View
                    style={{
                        elevation: 12,
                        position: "absolute",
                        bottom: 45,
                        left: 5,
                        borderRadius: 15,
                        overflow: "hidden",
                        opacity: 0.3,
                    }}
                >
                    <Image
                        blurRadius={15}
                        style={{ width: 100, height: 60 }}
                        source={{ uri: `${item.Portada}` }}
                    />
                </View>
                {/* Imagenes Books nuevos */}
                <TouchableOpacity
                    testID='buttonHandleBook'
                    style={{
                        marginHorizontal: 10,
                    }}
                    onPress={() => handleBook(item)}
                >
                    <ImageBackground
                        source={{ uri: `${item.Portada}` }}
                        style={{
                            width: 90,
                            height: 110,
                            borderRadius: 15,
                            overflow: "hidden",
                        }}
                    ></ImageBackground>
                </TouchableOpacity>

                <Text
                    style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontSize: 13,
                        color: "black",
                        fontWeight: "bold",
                        width:100
                    }}
                >
                    {item.Titulo}
                </Text>
            </View>
        );
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
                <View style={styles.modalView} >
                    <LottieView style={styles.lottieModalWait}
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                visible={isModalVisibleEnviarMensaje}
                transparent
            >
                <View style={styles.modalView}>
                    <LottieView style={styles.lottieModalWait}
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
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
            <View style={styles.headView}>
                <TouchableOpacity testID='buttonGoBack' onPress={() => { goBack() }}>
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
                <View style={{ marginTop: 20, alignItems: "flex-end", marginHorizontal: 20 }}>
                    <Menu onBackdropPress={() => setOpenMenu(false)} opened={openMenu} >
                        <MenuTrigger onPress={() => setOpenMenu(true)}>
                            <Entypo name="dots-three-vertical" size={24} color="black" />
                        </MenuTrigger>
                        <MenuOptions optionsContainerStyle={{ marginLeft: -20, }} style={{

                            alignItems: "center",
                            borderRadius: 8,
                            shadowColor: "black",
                            shadowOpacity: 0.78,
                            shadowOffset: { width: 0, height: 9 },
                            shadowRadius: 10,
                            elevation: 11,
                            backgroundColor: isModalVisible ? "#A7A7A7" : "white",


                        }}>
                            {!sonAmigos &&
                                <MenuOption  style={{ marginBottom: 5 }} testID="buttonAddAmigo" onSelect={() => addAmigo()} text='Añadir a amigos' />
                            }
                            <MenuOption  style={{ marginBottom: 5 }} testID="buttonEnviarMensaje" onSelect={() => enviarMensaje()} text='Enviar Mensaje privado' />
                            <MenuOption  style={{
                                marginBottom: 5
                            }} testID="buttonReportar" onSelect={() => reportarAutor()}>
                                <Text style={{ color: '#B00020' }}>Reportar</Text>
                            </MenuOption >

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
                    <View >
                        {!estaSeguido ?
                            <TouchableOpacity
                                testID='buttonSeguir'
                                style={{
                                    marginTop: 20,
                                    backgroundColor: isModalVisible ? "#8D8D8D" : "#E39801",
                                    padding: 12,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    flexDirection: "row",
                                    width: "50%",
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6.00,
                                    elevation: 15,
                                    marginBottom: 15,
                                }}
                                onPress={() => seguir()}
                            >
                                <Foundation name="foot" size={24} color="white" />
                                <Text style={styles.lineaH1}>
                                    Seguir
                                </Text>
                            </TouchableOpacity> : <TouchableOpacity
                                testID='buttonDejarSeguir'
                                style={{
                                    marginTop: 20,
                                    backgroundColor: isModalVisible ? "#8D8D8D" : "#E39801",
                                    padding: 12,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    flexDirection: "row",
                                    width: "50%",
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: 12,
                                    },
                                    shadowOpacity: 0.8,
                                    shadowRadius: 6.00,
                                    elevation: 15,
                                    marginBottom: 15,
                                }}
                                onPress={() => dejarSeguir()}
                            >
                                <Foundation name="foot" size={24} color="white" />
                                <Text style={styles.lineaH1}>
                                    Dejar de seguir
                                </Text>
                            </TouchableOpacity>}
                    </View>
                    <Text style={styles.fechaCreacion2}>
                        Desde:  {fechaCreacion}
                    </Text>
                    {/* Informacion sobre autor */}
                    <View style={{ flexDirection: "row", marginBottom: 20, }}>
                        {/* Informacion obras*/}
                        <View style={{ flexDirection: "column", alignItems: "center", marginRight: 20, }}>
                            <Text style={styles.lineaH2}>
                                {libros}
                            </Text>
                            <Text style={styles.lineaH2}>
                                Libros
                            </Text>
                        </View>
                        {/* Informacion seguidores */}
                        <View style={{ flexDirection: "column", alignItems: "center", marginRight: 20, }}>
                            <Text style={styles.lineaH2}>
                                {seguidores}
                            </Text>
                            <Text style={styles.lineaH2}>
                                Seguidores
                            </Text>
                        </View>

                        {/* Informacion seguidos*/}
                        <View style={{ flexDirection: "column", alignItems: "center" }}>
                            <Text style={styles.lineaH2}>
                                {seguidos}
                            </Text>
                            <Text style={styles.lineaH2}>
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
                marginBottom: 20,

            }}>
                <Text style={{
                    marginHorizontal: 30,
                    marginVertical: 10,


                }}>{descripcion}</Text>
            </View>
            <View style={{ marginHorizontal: 40, marginBottom: 20, }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", borderBottomColor: "#8EAF20", borderBottomWidth: 3, marginBottom: 5 }}>
                    Libros{":"}
                </Text>
                {
                    librosArray.length != 0 ?
                        <FlatList
                            contentContainerStyle={{ paddingLeft: 5 }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={librosArray}
                            renderItem={({ item, index }) => renderNewBooks(item, index)}
                        ></FlatList>
                        :
                        <View style={{ marginHorizontal: 30 }}  >
                            <Image
                                resizeMode={'center'}
                                source={require("../../../assets/NoLibros.png")}
                                style={styles.image}
                            />
                            <Text style={styles.textImage}>No hay libros......</Text>
                        </View>
                }
            </View>
        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
    lineaH1: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: "bold",
        color: "white"
    },
    lineaH2: {
        marginLeft: 5,
        fontSize: 15,
        fontWeight: "bold",
        color: "black"
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerView: {
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 30,
    },
    headView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#2B809C",
        borderBottomRightRadius: 500,
        height: 70,
    },
    lottieModalWait: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        height: '100%',
        width: '100%'
    },
    modalView: {
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
    fechaCreacion2: {
        fontSize: 15,
        color: "#B1B1B1",
        marginBottom: 5,
        marginTop: 5
    },
    image: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 30,
        height: 100,
        width: 180,
    },
    textImage: {
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 15,

    },
});
export default AutoresScreen