import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal, StatusBar, ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import LottieView from 'lottie-react-native';
import { getFotoPerfil } from "../../hooks/Auth/Firestore";
import { getUserAuth } from "../../hooks/Auth/Auth";
import { getSalas, getFotoPerfilConversaciones, getUltimoMensajeConversacion, getUltimoMensaje } from "../../hooks/ChatFirebase";
import { db } from '../../config/firebase';
import { Ionicons } from '@expo/vector-icons';

function ChatScreen() {
    const navigation = useNavigation();
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [salas, setSalas] = useState([]);

    useEffect(() => {

        cogerDatos();


    }, [email]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    }, []);

    //Coger los datos 
    const getTodasLasSalas = async () => {
        let salas = [];
        await db.collection("salas").orderBy("Tiempo","asc")
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach((documentSnapshot) => {
                    if (documentSnapshot.data().Usuario1 == email || documentSnapshot.data().Usuario2 == email) {
                        salas.push({
                            ...documentSnapshot.data(),
                            key: documentSnapshot.id,

                        });
                    }
                })
                getSalasFotoPerfil(salas);
            })

        setModalVisible(false)


    }
    //Coger los datos 
    const cogerDatos = async () => {

        setModalVisible(true)
        getEmail();
        getTodasLasSalas();

    }

    //Coger todas los mensajes 
    const getUltimoMensaje = async (salas) => {
        let salasss = []
        for (let i = 0, len = salas.length; i < len; i++) {

            await db.collection("salas").doc(salas[i].key).collection("mensajes").orderBy("FechaCreacion", "desc").limit(1).onSnapshot(querySnapshot => {
                querySnapshot.forEach((documentSnapshot) => {

                    salasss.push({ Tiempo: salas[i].Tiempo, Usuario1: salas[i].Usuario1, Usuario2: salas[i].Usuario2, key: salas[i].key, FotoPerfil: salas[i].FotoPerfil, UltimoMensaje: documentSnapshot.data().Texto });
                    console.log(salasss[i])
                });
                setSalas(salasss)
            })
        }



    }

    //Coger Fotos de perfil 
    const getSalasFotoPerfil = async (salas) => {
        getUltimoMensaje(await getFotoPerfilConversaciones(salas, email));

    }

    //Coger el email y foto de perfil
    const getEmail = async () => {

        let e = await getUserAuth()
        setEmail(e);
        setFotoPerfil(await getFotoPerfil(e));

    }

    const enterChat = async (sala) => {
        navigation.replace("chatConversationScreen", {
            sala: sala
        });
    }
    const handleProfile = () => {
        navigation.navigate("profileScreen", {
            screen: "chatScreen",
        });
    }
    /* Chats nuevos */
    const Card = ({ sala }) => {
        return (
            <TouchableOpacity onPress={() => enterChat(sala)}>
                <View style={{
                    marginVertical: 10,
                    marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                    shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                    backgroundColor: "white", flexDirection: "row"

                }}>

                    <Image
                        source={{ uri: sala.FotoPerfil != "" ? sala.FotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 50, height: 50, borderRadius: 50 / 2, marginTop: 10, marginHorizontal: 30 }}
                    />
                    <View style={{
                        flexDirection: "column",
                    }} >
                        {sala.Usuario2 == email ?
                            <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#05668D" }}>
                                {sala.Usuario1.split("@")[0]}
                            </Text> :

                            <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#05668D" }}>
                                {sala.Usuario2.split("@")[0]}
                            </Text>
                        }

                        <Text style={{ fontSize: 12, color: "black", marginBottom: 15, }}>
                            {sala.UltimoMensaje}
                        </Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.back}>
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
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>

            {/* Pantalla normal*/}
            {/* Head */}
            <StatusBar
                translucent={false}
                backgroundColor="white"
                barStyle="dark-content"
            />
            {/* Head Cosas */}
            <View style={styles.head}>
                <View style={{ flexDirection: "row" }}>
                    {/*nombre e inicio*/}
                    <View>
                        <Text style={styles.fontEscribir}>Chats</Text>
                    </View>
                </View>
                {/*User*/}
                <TouchableOpacity onPress={() => { handleProfile() }}>
                    <Image
                        source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10 }}
                    />
                </TouchableOpacity>
            </View>
            {/* Contenedor Botón escribir nuevo libro  */}
            <TouchableOpacity style={styles.containerNuevaConversacion} onPress={() => addNewConversation()}>
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginVertical: 5,
                    }}
                >
                    <Ionicons name="add-circle-outline" size={24} color="black" style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 14, color: "black" }}>
                        Añade una {""}
                        <Text
                            style={{
                                fontSize: 14,
                                fontWeight: "bold",
                                color: "#437C90",
                                marginLeft: 10,
                            }}
                        >
                            nueva {""}
                        </Text>
                        <Text style={{ fontSize: 14, color: "black" }}>
                            conversación</Text>
                    </Text>
                </View>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {
                    salas.map((item, index) => <Card key={index} sala={item} />)
                }

            </ScrollView>


        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    back: {
        flex: 1,
        backgroundColor: "white",
    },

    contentContainer: {
        paddingVertical: 10,

    },
    containerNuevaConversacion: {
        marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 10,
        borderStyle: "dotted",
        borderWidth: 2,
        borderColor: "#679436",
        flexDirection: "row",
        borderRadius: 8,
        shadowColor: "black",
        shadowOpacity: 0.78,
        shadowOffset: { width: 0, height: 9 },
        shadowRadius: 10,
        elevation: 6,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center",

    },

    head: {
        paddingTop: 20,
        paddingBottom: 13,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#679436",
        borderBottomWidth: 3,
        borderRadius: 60,
    },
    fontEscribir: {
        paddingTop: 10,
        fontWeight: "bold",
        color: "black",
        fontSize: 25,
    },


    modalView: {
        flex: 1,
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
    inputContainerBusqueda: {
        flexDirection: "row",
    },
    inputContainerTextBusqueda: {
        marginTop: 20,
        marginLeft: "auto",
        marginRight: "auto",
        justifyContent: "center",
        borderRadius: 10,
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        width: 250,
        height: 40,
    },
    input: {
        color: "black",
    },
    buttonLeer: {
        marginRight: "auto",
        marginTop: "auto",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 20,
        borderColor: "#679436",
        borderWidth: 3,
        alignItems: "center",

    },
});
export default ChatScreen