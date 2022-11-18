import { View, ActivityIndicator, Text, FlatList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, ScrollView, ImageBackground, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { getPeticionesAmistad, rechazarPeticionAmistad, aceptarPeticionAmistad, getPeticionesConversacion,eliminarPeticion } from "../hooks/Auth/Firestore";
import { db } from '../config/firebase';

function NotificacionesScreen({ route }) {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const { screen } = route.params;
    const [peticionAmistad, setPeticionAmistad] = useState([]);
    const [peticionConversacion, setPeticionConversacion] = useState([]);

    const categorias = ["Amistades", "Conversaciones"];

    const [isModalVisible, setModalVisible] = useState(false);


    const [seleccionadoCategoriaIndex, setSeleccionadoCategoriaIndex] =
        useState(0);

    useEffect(() => {
        hacerCosas();
    }, [email])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const goBack = () => {
        navigation.replace(screen);
    }

    const aceptarAmistad = async (peticion, emailAceptado) => {
        aceptarPeticionAmistad(email, peticion, emailAceptado);
        let a = await getPeticionesAmistad(email);
        setPeticionAmistad(a);

    }

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
        }
        if (index == 1) {
            let a = await getPeticionesConversacion(email);
            setPeticionConversacion(a);
            setPeticionAmistad([]);


        }
        setModalVisible(false);
    };

    const irALaConversacion = async (emailQueLoEnvia,keyPeticion) => {
        //Eliminar la notificacion:
       await  eliminarPeticion(email,keyPeticion);
        //Ir a la sala de la conversacion
        await cogerSala(emailQueLoEnvia, email);
   
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
                        screen: "home",
       
                    });
                }
                return false;

            })


    }
    const hacerCosas = async () => {
        setModalVisible(true)
        let e = await getUserAuth()
        setEmail(e);

        cargarCategorias(0);
        setModalVisible(false)
    }
    const RenderCategorias = () => {
        return (
            <View style={styles.renderCategoriaMisLibros}>
                {categorias.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() => cargarCategorias(index)}
                    >
                        <View>
                            <Text
                                style={{
                                    ...styles.categoriaText,
                                    color:
                                        seleccionadoCategoriaIndex == index ? "#000" : "#D8D8D8",
                                }}
                            >
                                {item}
                            </Text>
                            {seleccionadoCategoriaIndex == index && (
                                <View
                                    style={{
                                        height: 2,
                                        width: 40,
                                        backgroundColor: "#679436",
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
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "row"

            }}>
                <View style={{
                    flexDirection: "row", marginHorizontal: 10,
                }} >

                    <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#05668D", marginRight: 60, }}>
                        {peticion.Nombre.split("@")[0]}
                    </Text>
                    <TouchableOpacity onPress={() => aceptarAmistad(peticion.key, peticion.Nombre)}>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="checkcircleo" size={24} color="#679436" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => rechazarAmistad(peticion.key)}>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="closecircleo" size={24} color="red" />
                    </TouchableOpacity>
                </View>

            </View>

        );
    };
    /* Peticiones de amistad */
    const CardConversacion = ({ peticion }) => {
        return (

            <View style={{
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "row"

            }}>
                <View style={{
                    flexDirection: "row", marginHorizontal: 10,
                }} >

                    <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#05668D", marginRight: 60, }}>
                        {peticion.Nombre.split("@")[0]}
                    </Text>
                    <TouchableOpacity onPress={() => irALaConversacion(peticion.Nombre,peticion.key)}>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="rightcircleo" size={24} color="black" />
                    </TouchableOpacity>

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
                <TouchableOpacity onPress={() => goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Notificaciones</Text>
            </View>

            <RenderCategorias />
            {seleccionadoCategoriaIndex == 0 ?

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {
                        peticionAmistad.map((item, index) => <CardAmistad key={index} peticion={item} />)
                    }

                </ScrollView> :

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {
                        peticionConversacion.map((item, index) => <CardConversacion key={index} peticion={item} />)
                    }

                </ScrollView>
            }

        </SafeAreaView>


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
    renderCategoriaMisLibros: {
        marginBottom: 10,
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
        marginLeft: "auto",
        marginRight: 170,
        marginVertical: 30,
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },

});
export default NotificacionesScreen;