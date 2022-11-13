import { View, ActivityIndicator, TextInput, ScrollView, SafeAreaView, StyleSheet, StatusBar, Text, Modal, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';
import { cambiarContenidoCapitulo, cambiarTituloCapitulo } from '../../hooks/FirebaseLibros';
import React, { useLayoutEffect, useState, useEffect } from "react";
import { db } from '../../config/firebase';

function EditChapterScreen({ route }) {
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const navigation = useNavigation();
    const { bookId, capituloNumero, chapterId } = route.params;
    const [isModalVisible, setModalVisible] = useState(false);
    useEffect(() => {
        cargarCapituloLibros();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, []);

    const handleEdit = () => {
        navigation.replace("editBook", {
            bookId: bookId
        });
    }
    const handleWrite = () => {
        navigation.replace("write");
    }

    const cargarCapituloLibros = async () => {
        console.log(bookId)
        let querySnapshot = await db.collection("libros").doc(bookId).collection("Capitulos")
            .where("Numero", "==", capituloNumero).get()
        querySnapshot.forEach((queryDocumentSnapshot) => {
            setTexto(queryDocumentSnapshot.data().Contenido)
            setTitulo(queryDocumentSnapshot.data().Titulo)
        })
    }

    const actualizarCapituloLibro = async () => {
        setModalVisible(true)
        await cambiarTituloCapitulo(bookId, chapterId, titulo)
        await cambiarContenidoCapitulo(bookId, chapterId, texto)
        setModalVisible(false)
        handleWrite();
    }

    return (

        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isModalVisible ? "#A7A7A7" : "white",
        }}>
            <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent>

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

            {/* Head */}
            <StatusBar
                translucent={false}
                backgroundColor="white"
                barStyle="dark-content"
            />
            {/* Head Cosas */}
            <View style={styles.head}>

                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => handleEdit()}>
                        <Ionicons name="arrow-back" size={24} color="black" style={{ marginTop: 15, marginRight: 10, }} />
                    </TouchableOpacity>
                    {/*nombre e inicio*/}
                    <View>
                        <Text style={styles.fontTitulo}>Editar Capítulo</Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: isModalVisible ? "#8D8D8D" : "white",
                            padding: 12,
                            borderRadius: 20,
                            borderColor: "#679436",
                            borderWidth: 3,
                            alignItems: "center",
                            marginLeft: 35,
                        }}
                        onPress={() => actualizarCapituloLibro()}
                    >
                        <Text style={{
                            fontWeight: "bold",
                            color: "black",
                            fontSize: 13,
                        }}>Actualizar</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>

                <View style={{
                    backgroundColor: isModalVisible ? "#A7A7A7" : "white",
                    marginHorizontal: 30,
                    marginTop: 10,
                }}>
                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10 }}>
                        Título
                    </Text>
                    <TextInput
                        placeholder="Título "
                        placeholderTextColor="#05668D"
                        value={titulo}
                        onChangeText={(text) => setTitulo(text)}
                        style={{
                            marginBottom: 10,
                            marginRight: 20,
                            marginLeft: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 10,
                            color: "#05668D", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8"
                        }}
                        multiline={true}
                        scrollEnabled={true}
                    ></TextInput>

                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10 }}>Descripción</Text>
                    <KeyboardAvoidingView behavior="padding">
                        <TextInput
                            placeholder="Título "
                            placeholderTextColor="#05668D"
                            value={texto}
                            onChangeText={(text) => setTexto(text)}
                            style={{
                                paddingHorizontal: 10,
                                borderRadius: 10,
                                color: "#05668D", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8",
                                textAlign: 'justify'
                            }}
                            multiline={true}
                            scrollEnabled={true}
                        ></TextInput>

                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </SafeAreaView>


    )
}
const styles = StyleSheet.create({

    fontTitulo: {
        paddingTop: 10,
        fontWeight: "bold",
        color: "black",
        fontSize: 25,
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
});
export default EditChapterScreen