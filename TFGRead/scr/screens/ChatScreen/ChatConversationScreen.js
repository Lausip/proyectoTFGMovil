import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground, Image,
    Modal, StatusBar, ScrollView, TextInput, RefreshControlBase
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import LottieView from 'lottie-react-native';
import { getFotoPerfil, anadirAAmigos } from "../../hooks/Auth/Firestore";
import { addMessage, getMessage, updateAmigosSala } from "../../hooks/ChatFirebase";
import { db, firebase } from '../../config/firebase';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import {
    GiftedChat,
    Bubble,
    Send,
    SystemMessage, Day, InputToolbar,Time
} from 'react-native-gifted-chat';


function ChatConversationScreen({ route }) {
    const navigation = useNavigation();
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [fotoPerfilAmigo, setFotoPerfilAmigo] = useState("");
    const [email, setEmail] = useState("");

    const [amigo, setAmigo] = useState("");
    const [messages, setMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const { sala, screen } = route.params;


    useEffect(() => {

        hacerCosas();
        cogerMensajes();

    }, [email]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    }, []);


    const hacerCosas = async () => {

        setModalVisible(true)
        if (sala.Usuario1 == email) {
            setAmigo(sala.Usuario2)
            setFotoPerfilAmigo(await getFotoPerfil(sala.Usuario2));
        } else {
            setAmigo(sala.Usuario1)
            setFotoPerfilAmigo(await getFotoPerfil(sala.Usuario1));
        }
        let e = await getUserAuth();
        setEmail(e);

        setFotoPerfil(await getFotoPerfil(e));
        setModalVisible(false)
    }

    const cogerMensajes = async () => {
        let m = await getMessage(sala.key);
        setMessages(m);
    }

    const handleChats = () => {
        navigation.replace(screen);
    }

    const añadirAAmigo = async () => {
        await anadirAAmigos(email, amigo);
        await anadirAAmigos(amigo, email);
        await updateAmigosSala(sala.key);


    }

    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        await addMessage(sala.key, messages[0], email)
    }, [])

    // CAMBIAR INTERFAZ DE LOS MENSAJES 
    function renderSend(props) {
        return (
            <Send {...props} containerStyle={{ borderWidth: 0 }}>
                <View style={styles.sendingContainer}>
                    <FontAwesome name="send" size={24} color="#E39801" />
                </View>
            </Send>
        );
    }
    function renderBubble(props) {
        return (
            <Bubble
                {...props}
                textStyle={{
                    right: {
                        color: 'white',
        
                    },
                    left: {
                        color: 'white',
                    },
                }}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#8EAF20',
                    },
                    left: {
                        backgroundColor: '#429EBD',
                    },

                }}
            />
        );
    }
    function renderDay(props) {
        return <Day {...props} textStyle={{ color: 'black', textDecorationLine: 'underline' }} />
    }
    function renderInputToolbar(props) {
        return <InputToolbar {...props} containerStyle={{
            marginHorizontal: 20,
            marginVertical: 20,
            borderWidth: 0.5,
            borderColor: '#8EAF20',
            borderRadius: 30,
            shadowColor: "black",
            shadowOpacity: 0.78,
            shadowOffset: { width: 0, height: 9 },
            shadowRadius: 10,
            elevation: 6,
        }}

        />
    }
    function renderTime(props) {
        return (
            <Time
             {...props}
             timeTextStyle={{
                    right: {
                        color: 'white',                  
                    },
                    left: {
                        color: "white",             
                    }
                }}
            />
        );
    }
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
                    borderColor: "#8EAF20",
                    borderRadius: 20,
                    borderWidth: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: "center",
                    shadowColor: "black",
                    shadowOpacity: 0.90,
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
            <View style={{ backgroundColor: 'white', borderBottomEndRadius: 30, borderBottomStartRadius: 30 }}>
                {/* Head Cosas */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#429EBD",
                    borderBottomRightRadius: 500,
                    height: 70,

                }}>
                    {/* Botón de goBack */}
                    <TouchableOpacity onPress={() => handleChats()} style={{ marginLeft: 20 }}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>
                    {/* Imagen de Amigo */}
                    <Image
                        source={{ uri: fotoPerfilAmigo != "" ? fotoPerfilAmigo : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                    />

                    {/*nombre del amigo*/}
                    <Text style={styles.fontTitulo}>{amigo.split("@")[0]}</Text>

                </View>
                {
                   !sala.Amigo && sala.Enviado==amigo ?

                        < View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 30,

                        }}>
                            <TouchableOpacity onPress={() => { añadirAAmigo() }}>
                                <Text>Añadir a amigos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { }} style={{ marginLeft: 20 }}>
                                <Text style={{ color: "#ff6961" }}>Bloquear</Text>
                            </TouchableOpacity>
                        </View>:<Text></Text>


                    }
         

            </View>
            <GiftedChat
                messages={messages}
                user={{
                    _id: email,
                    name: email.split("@")[0],
                    avatar: fotoPerfil
                }}
                renderBubble={renderBubble}
                renderTime={renderTime}
                renderChatFooter={() => <View style={{ marginBottom: 40 }} />}
                renderInputToolbar={renderInputToolbar}
                showUserAvatar
                onSend={messages => onSend(messages)}
                renderSend={renderSend}
                renderDay={renderDay}
                placeholder='Mensaje...'
                alwaysShowSend
                scrollToBottom
                listViewProps={{
                    style: {
                        backgroundColor: '#EDECED',
                    },
                }}
            />

        </SafeAreaView >
    )
}
const styles = StyleSheet.create({
    back: {
        flex: 1,
        backgroundColor: '#EDECED',
    },

    head: {
        paddingTop: 20,
        paddingBottom: 13,
        paddingHorizontal: 30,
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomColor: "#429EBD",
        borderBottomWidth: 3,
        borderRadius: 60,
    },
    fontTitulo: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: 20,
        marginRight: "auto",
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
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

    input: {
        color: "black",
    },
    sendingContainer: {
        marginBottom: 10,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
export default ChatConversationScreen