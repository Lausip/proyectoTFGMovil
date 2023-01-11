import { View, ActivityIndicator, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, BackHandler, FlatList, Alert, StatusBar, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { FontAwesome, Ionicons, Octicons } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { enviarNotificacion } from "../../hooks/Auth/Firestore";
import { getComentariosCapitulo, enviarComentarioCapitulo, getAutorLibro } from '../../hooks/FirebaseLibros';




function ChatCapituloScreen({ route }) {

    const [email, setEmail] = useState("");
    const [autor, setAutor] = useState("");
    const [comentario, setComentario] = useState("");
    const [comentarios, setComentarios] = useState([]);
    const navigation = useNavigation();
    const { bookId, capituloId, capituloNumero } = route.params;

    useEffect(() => {

        hacerCosas();
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', backAction);

    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const backAction = async () => {
        navigation.push("bookScreen", {
            bookId: bookId,
            capituloNumero: capituloNumero,
            screen: "home",
        });
    };
    const goback = async () => {
        navigation.push("bookScreen", {
            bookId: bookId,
            capituloNumero: capituloNumero,
            screen: "home",
        });
    };
    const hacerCosas = async () => {

        let e = await getUserAuth();
        setEmail(e);
        let com = await getComentariosCapitulo(bookId, capituloId);
        let a = await getAutorLibro(bookId);
        setAutor(a);
        setComentarios(com);

    }

    const enviarComentario = async () => {

        await enviarComentarioCapitulo(bookId, capituloId, comentario, email);
        let com = await getComentariosCapitulo(bookId, capituloId);
        await enviarNotificacion(email, autor, bookId, capituloId)
        setComentarios(com);
        setComentario("");

    }

    const reportarComentario = async (comentarioId, autor) => {
        Alert.alert('Espera', '¿Seguro que quieres reportar el comentario de ' + autor + ' ?', [
            {
                text: 'Cancelar',
                onPress: () => null,
                style: 'cancel',
            },
            {
                text: 'SI', onPress: () => { }
            },
        ]);

    }

    /* Comentarios */
    const RenderComentarios = (comentario) => {
        return (

            <View style={{
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "column",

            }}>
                <View style={{ flexDirection: "row", justifyContent: 'space-between', }}>
                    <Text style={{ marginHorizontal: 20, fontSize: 14, fontWeight: "bold", color: "#429EBD", justifyContent: "flex-start" }}>
                        {comentario.Autor.split("@")[0]}
                    </Text>
                    <TouchableOpacity onPress={() => reportarComentario(comentario.key, comentario.Autor.split("@")[0])}>
                        <Octicons name="report" size={15} color="#ff6961" style={{ marginHorizontal: 20, marginVertical: 2, }} />
                    </TouchableOpacity>
                </View>

                <Text style={{ marginHorizontal: 20, marginVertical: 5, fontSize: 13, color: "black" }}>
                    {comentario.Comentario}
                </Text>

            </View>

        );
    };
    return (


        <SafeAreaView style={styles.container}>
            {/* Pantalla normal*/}

            {/* Head */}
            <StatusBar
                translucent={false}
                backgroundColor="white"
                barStyle="dark-content"
            />
            <View style={{
                backgroundColor: 'white', borderBottomEndRadius: 30, borderBottomStartRadius: 30
            }}>
                {/* Head Cosas */}
                <View style={styles.head}>
                    {/* Botón de goBack */}
                    <TouchableOpacity onPress={() => goback()} style={{ marginLeft: 30, marginRight: 10 }}>
                        <Ionicons name="arrow-back" size={30} color="white" />
                    </TouchableOpacity>

                    {/*nombre del amigo*/}
                    <Text style={styles.fontTitulo}>Comentarios</Text>

                </View>
            </View>
            {/* Comentarios */}
            <FlatList
                contentContainerStyle={{}}
                vertical
                showsHorizontalScrollIndicator={false}
                data={comentarios}
                keyExtractor={(item, index) => {
                    return index.toString();
                }}
                renderItem={({ item }) => RenderComentarios(item)}
            ></FlatList>
            <View style={styles.inputContainerComentario}>
                <TextInput
                    placeholder="Escribe un comentario...."
                    placeholderTextColor="black"
                    value={comentario}
                    onChangeText={(text) => setComentario(text)}
                    style={styles.input}
                    multiline={true}
                    numberOfLines={2}

                ></TextInput>
                <TouchableOpacity onPress={() => enviarComentario()} style={{
                    marginTop: "auto", marginBottom: "auto",

                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    height: 50,
                    backgroundColor: '#E39801',
                    borderRadius: 50,
                }}>
                    <FontAwesome name="send" size={24} color="white" style={{ marginTop: "auto", marginBottom: "auto" }} />
                </TouchableOpacity>
            </View>


        </SafeAreaView >



    )
}
const styles = StyleSheet.create({
    head: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#429EBD",
        borderBottomRightRadius: 500,
        height: 70,
    },
    inputContainerComentario: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 20,
        borderTopWidth: 2,
        borderRadius: 20,
        borderColor: "#8EAF20",
    },
    input: {
        width: 250,
        backgroundColor: "#f8f8f8",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        marginVertical: 10,
        color: "black",
        shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,

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
    container: {
        flex: 1,
        backgroundColor: 'white',

    }, fontEscribir: {
        paddingTop: 10,
        fontWeight: "bold",
        color: "black",
        fontSize: 25,
    },
    textChapter: {
        marginLeft: "auto",
        marginRight: "auto",
        marginVertical: 30,
        fontSize: 20,
        color: "#429EBD",
        fontWeight: "bold",
    },

});
export default ChatCapituloScreen