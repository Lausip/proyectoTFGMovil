import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal, StatusBar, ScrollView, FlatList, TouchableWithoutFeedback
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import LottieView from 'lottie-react-native';
import { getFotoPerfil, getAmigos } from "../../hooks/Auth/Firestore";
import { getUserAuth } from "../../hooks/Auth/Auth";
import { getSalas, existeSala, getFotoPerfilConversaciones, getUltimoMensajeConversacion, getUltimoMensaje, addSala, getSalaId } from "../../hooks/ChatFirebase";
import { db } from '../../config/firebase';
import { Ionicons, AntDesign } from '@expo/vector-icons';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

function ChatScreen({ route }) {
    const navigation = useNavigation();
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [salas, setSalas] = useState([]);
    const [amigos, setAmigos] = useState([]);
    const [isModalVisibleConversacion, setModalVisibleConversacion] = useState(false);

    useEffect(() => {

        cogerDatos();



    }, [email, route]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    }, []);

    //Coger los datos 
    const getTodasLasSalas = async () => {
        let salas = [];
        await db.collection("salas").orderBy("Tiempo", "asc")
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




    }
    //Coger los datos 
    const cogerDatos = async () => {
        setModalVisible(true)
        getEmail();
        getTodasLasSalas();
        setModalVisible(false)
    }

    //Coger todas los mensajes 
    const getUltimoMensaje = async (salas) => {
        let salasss = []
        for (let i = 0, len = salas.length; i < len; i++) {
            await db.collection("salas").doc(salas[i].key).collection("mensajes").orderBy("FechaCreacion", "desc").limit(1).onSnapshot(querySnapshot => {

                if (!querySnapshot.empty) {
                    querySnapshot.forEach((documentSnapshot) => {
           
                        salasss.push({...salas[i], UltimoMensaje: documentSnapshot.data().Texto });
                    });
                }
                else {
                    salasss.push({ ...salas[i], UltimoMensaje: "" });
                }
             
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
            sala: sala,
            screen:"chatScreen",
    
        });
    }

    const handleProfile = () => {
        navigation.navigate("profileScreen", {
            screen: "chatScreen",
        });
    }

    const cogerSala = async (usuarioa, usuariob) => {
        let salaaaaa=[];
        await db
            .collection('salas').doc(usuarioa + "-" + usuariob).get().then(documentSnapshot => {
                if (documentSnapshot.exists) {
                    console.log(documentSnapshot.data());
                    salaaaaa.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,

                    });
                    navigation.replace("chatConversationScreen", {
                        sala: salaaaaa[0],
                        screen:"chatScreen",
                    
                    });
                }
                return false;

            })


    }
    const añadirSala = async (amigo) => {

        //Mirar si ya hay sala
        if (!await existeSala(email, amigo)) {
            //Añadir Sala
            await addSala(email, amigo, true,"");
            setModalVisibleConversacion(false);
            await cogerSala(email, amigo);

        }
        else {
            setModalVisibleConversacion(false);
            let existe=false;
            existe = await cogerSala(email, amigo);
          
            if (!existe) {
                await cogerSala(amigo, email);
            }
     
        }


    }

    const modalAnadirSala = async () => {
        setModalVisibleConversacion(true);
        setAmigos(await getAmigos(email));
    }

    /* Chats nuevos */
    const CardAmigos = ({ amigo }) => {
        return (
            <TouchableOpacity onPress={() => añadirSala(amigo)}>
                <View style={{
                    marginVertical: 5,
                    marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                    shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                    backgroundColor: "white", flexDirection: "row"

                }}>

                    <Text style={{ fontSize: 15, color: "black", marginHorizontal: 30, marginVertical: 10, }}>
                        {amigo.split("@")[0]}
                    </Text>
                </View>


            </TouchableOpacity>
        );
    };

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
                            <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#429EBD" }}>
                                {sala.Usuario1.split("@")[0]}
                            </Text> :

                            <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#429EBD" }}>
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
            {/* Modal cargando*/}
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
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>

            {/* Modal añadir chat*/}

            <Modal
                animationType="fade"
                visible={isModalVisibleConversacion}
                transparent
                onRequestClose={() => {
                    setModalVisibleConversacion(false)
                }}>

                <TouchableWithoutFeedback onPress={() => {
                    setModalVisibleConversacion(false)
                }}>
                    <View style={{
                        maxHeight: 400,
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderColor: "#8EAF20",
                        borderRadius: 20,
                        borderWidth: 2, backgroundColor: 'white',
                        shadowColor: "black",
                        shadowOpacity: 0.89,
                        shadowOffset: { width: 0, height: 9 },
                        shadowRadius: 10,
                        elevation: 12,


                    }}
                    >
                        {/*                        <View style={{ alignItems: "flex-end", marginHorizontal: 10, marginTop: 10, }}>
                        <TouchableOpacity onPress={() => { setModalVisibleConversacion(false) }}>
                            <AntDesign style={{ alignItems: "flex-start" }} name="closecircleo" size={24} color="black" />
                        </TouchableOpacity >
                    </View>  */}

                        <View style={{

                            alignItems: 'center', justifyContent: "center"
                        }}>
                            <FlatList

                                data={amigos}
                                keyExtractor={(item) => item}
                                renderItem={({ item, index }) => (
                                    <CardAmigos key={index} amigo={item} />
                                )}
                            />

                        </View>
                    </View>
                </TouchableWithoutFeedback>
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
            <TouchableOpacity style={styles.containerNuevaConversacion} onPress={() => modalAnadirSala()}>
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
                                color: "#E39801",
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
    contentContainer2: {
        paddingVertical: 10,
        flexGrow: 1,

    },
    containerNuevaConversacion: {
        marginTop: 20,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 10,
        borderStyle: "dotted",
        borderWidth: 2,
        borderColor: "#E39801",
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
        borderBottomColor: "#8EAF20",
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
        borderColor: "#8EAF20",
        borderWidth: 3,
        alignItems: "center",

    },
});
export default ChatScreen