import { View, BackHandler, Text, FlatList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { getPeticionesAmistad, rechazarPeticionAmistad, aceptarPeticionAmistad, getPeticionesConversacion, eliminarPeticion, getComentarios, eliminarNotificacionConversacion } from "../hooks/Auth/Firestore";
import { cogerSala } from "../hooks/ChatFirebase";
import { getNumeroCapitulo } from "../hooks/FirebaseLibros";

function NotificacionesScreen({ route }) {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const { screen } = route.params;
    const [peticionAmistad, setPeticionAmistad] = useState([]);
    const [peticionConversacion, setPeticionConversacion] = useState([]);

    const [notificacionComentario, setNotificacionComentario] = useState([]);
    const [notificacionTablon, setNotificacionTablon] = useState([]);

    const categorias = ["Amistades", "Conversaciones", "Comentarios"];

    const [isModalVisible, setModalVisible] = useState(false);


    const [seleccionadoCategoriaIndex, setSeleccionadoCategoriaIndex] =
       React.useState(0);

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', goBack);
        hacerCosas();

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', goBack);
    }, [email])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const goBack = () => {
        navigation.replace(screen);
    }
      /* istanbul ignore next */
    const aceptarAmistad = async (peticion, emailAceptado) => {
        aceptarPeticionAmistad(email, peticion, emailAceptado);
        let a = await getPeticionesAmistad(email);
        setPeticionAmistad(a);

    }
      /* istanbul ignore next */
    const rechazarAmistad = async (peticion) => {
        rechazarPeticionAmistad(email, peticion);
        let a = await getPeticionesAmistad(email);
        setPeticionAmistad(a);
    }

    const cargarCategorias = async (index) => {
        setModalVisible(true);

        setSeleccionadoCategoriaIndex(index);
        if (index == 0) {
            let a = await getPeticionesAmistad(email);
            setPeticionAmistad(a);
            setPeticionConversacion([]);
            setNotificacionComentario([]);
        }
        if (index == 1) {
            let a = await getPeticionesConversacion(email);
            setPeticionConversacion(a);
            setPeticionAmistad([]);
            setNotificacionComentario([]);
        }
        if (index == 2) {

            let a = await getComentarios(email);
            setNotificacionComentario(a);
            setPeticionAmistad([]);
            setPeticionConversacion([]);
        }
        setModalVisible(false);
    };
      /* istanbul ignore next */
    const irALaConversacion = async (emailQueLoEnvia, keyPeticion) => {
        //Eliminar la notificacion:
        await eliminarPeticion(email, keyPeticion);
        //Ir a la sala de la conversacion
        await cogerSala(emailQueLoEnvia, email);

    }
          /* istanbul ignore next */
    const funcionEliminarNotificacionConversacion = async (idNotificacion) => {

        await eliminarNotificacionConversacion(email, idNotificacion);

    }
      /* istanbul ignore next */
    const irAlComentario = async (idBook, idCapitulo, idNotificacion) => {
        //Eliminar la notificacion:
        funcionEliminarNotificacionConversacion(idNotificacion);
        //Ir a la sala de la conversacion
        let numeroCapitulo = await getNumeroCapitulo(idBook, idCapitulo);
        navigation.replace("comentariosCapituloScreen", {
            bookId: idBook,
            capituloId: idCapitulo,
            capituloNumero: numeroCapitulo,
            screen: "notificacionScreen"
        });
    }

    const hacerCosas = async () => {

        let e = await getUserAuth();
        setEmail(e);
        cargarCategorias(0);

    }

    const RenderCategorias = () => {
        return (
            <View style={styles.renderCategoriaMisLibros}>
                {categorias.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        testID="buttonCargarCategorias"
                        onPress={() => cargarCategorias(index)}
                    >
                        <View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                    color: seleccionadoCategoriaIndex == index ? "#000" : "#D8D8D8",
                                }}
                            >
                                {item}
                            </Text>
                            {seleccionadoCategoriaIndex == index && (
                                <View
                                    style={{
                                        height: 2,
                                        width: 40,
                                        backgroundColor: "#8EAF20",
                                        marginTop: 2,
                                    }}
                                ></View>
                            )}
                        </View>

                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    /* Peticiones de amistad */
    const CardAmistad = ({ peticion }) => {
        return (

            <View style={{
                display: "flex",
                marginVertical: 5,
                marginHorizontal: 30, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white", flexDirection: "row"


            }}>
                <View style={{
                    flexDirection: "row", marginHorizontal: 20
                }} >

                    <Text style={{ marginVertical: 10, fontSize: 14, fontWeight: "bold", color: "#2B809C", marginRight: 60, justifyContent: "flex-start" }}>
                        {peticion.Nombre.split("@")[0]}
                    </Text>

                    <View style={{
            
                        flexDirection: "row", marginTop: "auto", marginBottom: "auto"
                    }}>
                        <TouchableOpacity testID='buttonAceptarAmistad' onPress={() => aceptarAmistad(peticion.key, peticion.Nombre)}>
                            <AntDesign name="checkcircleo" size={24} color="#8EAF20" />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            marginLeft: 10,

                        }} onPress={() => rechazarAmistad(peticion.key)}>
                            <AntDesign name="closecircleo" size={24} color="#B00020" />
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

        );
    };
    /* Peticiones de amistad */
    const CardConversacion = ({ peticion }) => {
        return (

            <View style={{
                marginVertical: 5,
                marginHorizontal: 30, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white", flexDirection: "row"

            }}>
                <View style={{
                    flexDirection: "row", marginHorizontal: 20,
                }} >

                    <Text style={{ marginVertical: 10, fontSize: 14, fontWeight: "bold", color: "#2B809C", marginRight: 60, }}>
                        {peticion.Nombre.split("@")[0]}
                    </Text>
                    <TouchableOpacity testID="buttonIrAlaconversacion"onPress={() => irALaConversacion(peticion.Nombre, peticion.key)}>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="rightcircleo" size={24} color="black" />
                    </TouchableOpacity>

                </View>

            </View>

        );
    };

    /* Notificacion de Conversacion */
    const CardComentario = ({ notificacion }) => {
        return (

            <View style={{
                marginVertical: 5,
                marginHorizontal: 30, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white", flexDirection: "row"

            }}>


                <View style={{ flexDirection: "row", marginHorizontal: 20 }}>
                    <Text style={{ marginVertical: 10, fontSize: 14, fontWeight: "bold", color: "#2B809C" }}>
                        {notificacion.Nombre.split("@")[0] + " "}
                    </Text>
                    <Text style={{ marginVertical: 10, fontSize: 14, color: "black" }}>
                        ha realizado un comentario
                    </Text>
                    <View onPress={{ marginLeft: 10, }}>
                        <TouchableOpacity onPress={() => irAlComentario(notificacion.Libro, notificacion.CapituloId, notificacion.key)}>
                            <AntDesign style={{
                                marginHorizontal: 15,
                                marginVertical: 10,
                            }} name="rightcircleo" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => funcionEliminarNotificacionConversacion(notificacion.key)}>
                            <AntDesign style={{
                                marginVertical: 10,
                            }} name="closecircleo" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        );
    };


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
                backgroundColor: "#2B809C",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity testID='buttonGoBack' onPress={() => goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 30, marginRight: 10 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Notificaciones</Text>
            </View>
            {/* Cargar Categorias AMISTADES Y CONVERSACIONES */}
            <RenderCategorias />
            <View style={styles.list}>
                {seleccionadoCategoriaIndex == 0 &&
                    <View>
                        {
                            peticionAmistad.length != 0 ?
                                <FlatList
                                    contentContainerStyle={{ flexGrow: 0 }}
                                    vertical
                                    showsHorizontalScrollIndicator={true}
                                    data={peticionAmistad}
                                    keyExtractor={(item, index) => {
                                        return index.toString();
                                    }}
                                    renderItem={({ item, index }) => <CardAmistad key={index} peticion={item} />}
                                ></FlatList>
                                :

                                <View style={{ marginHorizontal: 30 }}  >
                                    <Image
                                        resizeMode={'center'}
                                        source={require("../../assets/NotificacionVacia.png")}
                                        style={styles.image}
                                    />
                                    <Text style={styles.textImage}>Amistades vacíos......</Text>
                                </View>
                        }
                    </View>
                }
                {seleccionadoCategoriaIndex == 1 &&
                    <View>
                        {
                            peticionConversacion.length != 0 ?
                                <ScrollView contentContainerStyle={styles.contentContainer}>
                                    {
                                        peticionConversacion.map((item, index) => <CardConversacion key={index} peticion={item} />)
                                    }

                                </ScrollView> :

                                <View style={{ marginHorizontal: 30 }}  >
                                    <Image
                                        resizeMode={'center'}
                                        source={require("../../assets/NotificacionVacia.png")}
                                        style={styles.image}
                                    />
                                    <Text style={styles.textImage}>Conversaciones vacíos......</Text>
                                </View>
                        }
                    </View>
                }

                {seleccionadoCategoriaIndex == 2 &&
                    <View>
                        {
                            notificacionComentario.length != 0 ?
                                <FlatList
                                    contentContainerStyle={{}}
                                    vertical
                                    showsHorizontalScrollIndicator={true}
                                    data={notificacionComentario}
                                    keyExtractor={(item, index) => {
                                        return index.toString();
                                    }}
                                    renderItem={({ item, index }) => <CardComentario key={index} notificacion={item} />}
                                ></FlatList>

                                :

                                <View style={{ marginHorizontal: 30 }}  >
                                    <Image
                                        resizeMode={'center'}
                                        source={require("../../assets/NotificacionVacia.png")}
                                        style={styles.image}
                                    />
                                    <Text style={styles.textImage}>Comentarios vacías......</Text>
                                </View>
                        }
                    </View>

                }
            </View>

        </SafeAreaView >


    )
}
const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 10,

    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    list: {

    },
    renderCategoriaMisLibros: {
        marginBottom: 20,
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginRight: 20,
        marginHorizontal: 30,
        marginTop: 20,
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
        marginLeft: 10,
        marginRight: 170,
        marginVertical: 30,
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },
    image: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
        height: 390,
        width: 250,
    },
    textImage: {
        marginTop: 10,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 15,

    },
});
export default NotificacionesScreen;