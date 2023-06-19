import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity, Image,
    Modal, StatusBar, BackHandler,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState, useCallback } from "react";
import LottieView from 'lottie-react-native';
import { getFotoPerfil, anadirAAmigos, bloquearPersonaFirebase, desbloquearPersonaFirebase, mirarSiBloqueado } from "../../hooks/Auth/Firestore";
import { addMessage, getMessage, updateAmigosSala, bloquearPersonaSala } from "../../hooks/ChatFirebase";
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import {
    GiftedChat,
    Bubble,
    Send,
    Day, InputToolbar, Time, Avatar
} from 'react-native-gifted-chat';


function ChatConversationScreen({ route }) {
    const navigation = useNavigation();
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [fotoPerfilAmigo, setFotoPerfilAmigo] = useState("");
    const [email, setEmail] = useState("");

    const [amigo, setAmigo] = useState("");
    const [messages, setMessages] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [desbloquear, setDesbloquear] = useState(false);
    const [estasBloqueado, setEstasBloqueado] = useState(false);
    const [ponerAmigo, setPonerAmigo] = useState(false);

    const { sala, screen } = route.params;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        hacerCosas();

        BackHandler.addEventListener('hardwareBackPress', handleChats);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', handleChats);

    }, []);


    /* istanbul ignore next */
    const hacerCosas = async () => {
        setModalVisible(true)
        let e = await getUserAuth();
        if (sala.Usuario1 == e) {
            setAmigo(sala.Usuario2)
            setFotoPerfilAmigo(await getFotoPerfil(sala.Usuario2));
            setEstasBloqueado(await mirarSiBloqueado(e, sala.Usuario2));
        } else {
            setAmigo(sala.Usuario1)
            setFotoPerfilAmigo(await getFotoPerfil(sala.Usuario1));
            setEstasBloqueado(await mirarSiBloqueado(e, sala.Usuario1));
        }
        setEmail(e);
        cogerMensajes();
        setDesbloquear(sala.Bloqueado);
        setPonerAmigo(sala.Amigo);
        setFotoPerfil(await getFotoPerfil(e));

        setModalVisible(false)


    }
    /* istanbul ignore next */
    const cogerMensajes = async () => {
        let m = await getMessage(sala.key);
        setMessages(m);
    }
    /* istanbul ignore next */
    const handleChats = () => {
        navigation.replace("chatScreen");
    }
    /* istanbul ignore next */
    const añadirAAmigo = async () => {

        await anadirAAmigos(email, amigo);
        await anadirAAmigos(amigo, email);
        await updateAmigosSala(sala.key);
        setPonerAmigo(true);

    }
    /* istanbul ignore next */
    const bloquearPersona = async () => {
        //Añadir a lista de bloqueados
        await bloquearPersonaFirebase(email, amigo);
        //Sala poner true a sala
        await bloquearPersonaSala(sala.key, true);
        setDesbloquear(true)

    }
    /* istanbul ignore next */
    const desbloquearPersona = async () => {
        //Quitar a lista de bloqueados
        await desbloquearPersonaFirebase(email, amigo);
        //Sala poner false a sala
        await bloquearPersonaSala(sala.key, false);
        setDesbloquear(false)
    }
    /* istanbul ignore next */
    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        await addMessage(sala.key, messages[0], email)
    }, [])

    /* istanbul ignore next */
    function renderSend(props) {
        return (
            <Send {...props} containerStyle={{ borderWidth: 0 }}>
                <View style={styles.sendingContainer}>
                    <FontAwesome name="send" size={24} color="#E39801" />
                </View>
            </Send>
        );
    }
    /* istanbul ignore next */
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
                        backgroundColor: '#2B809C',
                    },

                }}
            />
        );
    }
    /* istanbul ignore next */
    function renderDay(props) {
        return <Day {...props} textStyle={{ color: 'black', textDecorationLine: 'underline' }} />
    }
    /* istanbul ignore next */
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
            backgroundColor: (!sala.Amigo && sala.Enviado == amigo) || sala.Bloqueado ? "#ECECEC" : "#FFFF"
        }}

        />
    }
    /* istanbul ignore next */
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
    /* istanbul ignore next */
    function renderAvatar(props) {

        return null;
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
            <View style={{ backgroundColor: 'white', borderBottomEndRadius: 30, }}>
                {/* Head Cosas */}
                <View style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#2B809C",
                    borderBottomRightRadius: 500,
                    height: 70,

                }}>
                    {/* Botón de goBack */}
                    <TouchableOpacity testID="buttonGoBack" onPress={() => handleChats()} style={{ marginLeft: 20, marginRight: 20 }}>
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
                    !ponerAmigo && sala.Enviado == amigo && !desbloquear ?
                        /* istanbul ignore next */
                        < View style={{

                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: 5,
                            marginBottom: 5
                        }}>
                          
                            <TouchableOpacity testID="buttonAñadirAmigo" onPress={/* istanbul ignore next */() => { añadirAAmigo() }}>
                                <Text style={{ fontSize: 17 }}>Añadir a amigos</Text>
                            </TouchableOpacity>
                    
                            <TouchableOpacity onPress={/* istanbul ignore next */() => { bloquearPersona() }} style={{ marginLeft: 20 }}>
                                <Text style={{ color: "#B00020", fontSize: 17 }}>Bloquear</Text>
                            </TouchableOpacity>
                        </View> : <View></View>


                }

                {
                    !sala.Amigo && desbloquear && !estasBloqueado ?
                /* istanbul ignore next */
                        < View style={{
                            flexDirection: "row",
                            justifyContent: "center",
                        }}>

                            <TouchableOpacity testID="buttonDesbloquear" onPress={/* istanbul ignore next */() => desbloquearPersona()} style={{}}>
                                <Text style={{
                                    color: "#B00020", fontSize: 20, marginTop: 5,
                                    marginBottom: 5
                                }}>Desbloquear</Text>
                            </TouchableOpacity>
                        </View> : <View></View>


                }
                {
                    estasBloqueado ?
                  
                        < View style={{

                            flexDirection: "row",
                            justifyContent: "center",
                        }}>

                            <Text style={{ color: "#B00020", fontSize: 20 }}>Estas bloqueado</Text>

                        </View> : <View></View>


                }


            </View>
            <GiftedChat

                messages={messages}
                user={{
                    _id: email,
                    name: email,

                }}
                renderAvatar={renderAvatar}
                disableComposer={(!sala.Amigo && sala.Enviado == amigo) || sala.Bloqueado}
                renderBubble={renderBubble}
                renderTime={renderTime}
                renderChatFooter={() => <View style={{ marginBottom: 40 }} />}
                renderInputToolbar={renderInputToolbar}
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
        borderBottomColor: "#2B809C",
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