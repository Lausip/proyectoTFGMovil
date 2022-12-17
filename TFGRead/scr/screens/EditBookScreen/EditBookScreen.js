import { View, ActivityIndicator, Text, BackHandler, ScrollView, SafeAreaView, StyleSheet, Modal, StatusBar, TouchableOpacity, Image, ImageBackground, TextInput } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import LottieView from 'lottie-react-native';
import { MaterialIcons,AntDesign } from '@expo/vector-icons';
import { cargarDatosLibro, cambiarTitulo, cambiarDescripcion, publicarCapituloDelLibro, cambiarPortadadeLibro, eliminarLibroFirebase,eliminarCapituloLibro,cambiarFechaModificaciónLibro } from '../../hooks/FirebaseLibros';
import { crearLibroStorage } from '../../hooks/Storage';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { pickImage } from "../../utils/ImagePicker";

function EditBookScreen({ route }) {
    const [email, setEmail] = useState("");
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [portada, setPortada] = useState("");
    const [capitulos, setCapitulos] = useState([]);
    //MODALES:
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleBorrar, setModalVisibleBorrar] = useState(false);

    const navigation = useNavigation();
    const { bookId } = route.params;

    useEffect(() => {
        hacerCosas();
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', backAction);
     
    }, [email, portada])

    const backAction = async () => {
        navigation.push("write", {
     
        });
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });
    const handleWriteChapter = () => {
        navigation.replace("writeChapter", {
            bookId: bookId,
        });
    }
    const handleWrite = () => {
        navigation.replace("write");
    }

    const hacerCosas = async () => {
        await cargarLibro()
    }

    const handleEditarCapitulo = (numero, chapterId) => {
   
        navigation.replace("editChapter", {
            bookId: bookId,
            capituloNumero: numero,
            chapterId: chapterId,
        });
    }

    const handlePublicarCapitulo = async (chapterId) => {
        setModalVisible(true)
        await publicarCapituloDelLibro(bookId, chapterId);
        setModalVisible(false)
    }

    const handleEliminarCapitulo = async (numero, chapterId) => {
        setModalVisible(true)
        await eliminarCapituloLibro(bookId, chapterId, numero);
        await cambiarFechaModificaciónLibro(bookId);
        setModalVisible(false)
    }

    const cargarLibro = async () => {
        let e = await getUserAuth();
        setEmail(e);
        let data = await cargarDatosLibro(bookId)
        setTexto(data.Descripción)
        setTitulo(data.Titulo)
        setPortada(data.Portada)
        await db.collection("libros").doc(bookId).collection("Capitulos").orderBy("Numero", "asc").onSnapshot(querySnapshot => {
            const caps = [];
            querySnapshot.forEach(documentSnapshot => {
                caps.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            });
            setCapitulos(caps);
        });

    }
    const actualizarTexto = async () => {
        setModalVisible(true)
        await cambiarTitulo(bookId, titulo)
        setModalVisible(false)
    }


    const eliminarLibro = async () => {
        setModalVisible(true);
        await eliminarLibroFirebase(bookId);
        setModalVisible(false);
        setModalVisibleBorrar(false);
    }
    
    const actualizarDescripcion = async () => {
        setModalVisible(true)
        await cambiarDescripcion(bookId, texto)
        setModalVisible(false)
    }

    const actualizarImage = async () => {
        let image = await pickImage();
        setModalVisible(true)
        if (!result.canceled) {
            let urlPortada = await crearLibroStorage(image, email, bookId)
            setPortada(urlPortada);
            await cambiarPortadadeLibro(bookId, urlPortada)
        }
        setModalVisible(false)

    }

    const RenderCapitulos = ({ libro }) => {
        return (

            <View key={libro.key} style={styles.viewRenderCapitulos}>

                <Text style={styles.tituloRenderCapitulos}>
                    {libro.Titulo}
                </Text>

                {/* Botones del opcion */}
                <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                    <TouchableOpacity style={{ marginTop: 10, marginRight: 20 }} onPress={e => handleEditarCapitulo(libro.Numero, libro.key)}>
                        <AntDesign name="edit" size={20} color="#E39801" />
                    </TouchableOpacity >
                    {libro.borrador ? <TouchableOpacity style={{ marginTop: 10, marginRight: 20 }} onPress={e => handlePublicarCapitulo(libro.key)}>
                        <Text>Publicar</Text>
                    </TouchableOpacity > : <Text></Text>}
                    <TouchableOpacity style={{ marginTop: 8, marginRight: 20 }} onPress={e => handleEliminarCapitulo(libro.Numero, libro.key)}>
                        <MaterialIcons name="delete" size={24} color="#B00020" />
                    </TouchableOpacity >
                </View>

            </View >
        );
    }

    return (

        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isModalVisible || isModalVisibleBorrar ? "#A7A7A7" : "white",
        }}>
            <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent
            >
                <View style={styles.modalWait}>
                    <LottieView style={styles.lottieModalWait}
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>

            <Modal
                animationType="fade"
                visible={isModalVisibleBorrar}
                transparent
            >
                <View style={styles.modalWait}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: 20,
                    }}>¿Seguro que quieres borrar {titulo} ?</Text>
                    <View style={{
                        flexDirection: "row"
                    }}>
                        <TouchableOpacity
                            style={{
                                width: "25%",
                                marginRight: 10,
                                padding: 12,
                                borderRadius: 20,
                                alignItems: "center",
                                backgroundColor: isModalVisible ? "#8D8D8D" : "#E39801",
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 6.00,
                                elevation: 15,
                            }}
                            onPress={e => setModalVisibleBorrar(false)}
                        >
                            <Text  style={styles.modalBorrarText}>
                                Cancelar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                width: "25%",
                                padding: 12,
                                borderRadius: 20,
                                alignItems: "center",
                                marginLeft: "auto",
                                marginRight: "auto",
                                backgroundColor: isModalVisible ? "#8D8D8D" : "#B00020",

                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 12,
                                },
                                shadowOpacity: 0.8,
                                shadowRadius: 6.00,
                                elevation: 15,
                            }}
                            onPress={e => eliminarLibro()}
                        >
                            <Text style={styles.modalBorrarText}>
                                Borrar
                            </Text>
                        </TouchableOpacity>
                    </View>
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
                backgroundColor: "#429EBD",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity onPress={() => handleWrite()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Editar el libro</Text>
            </View>
            <ScrollView style={{ flexGrow: 0 }}>

                {/* Portada del libro */}
                <TouchableOpacity onPress={() => actualizarImage()}>
                    <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", height: 200, marginTop: 10, }}>

                        {/* Imagenes Books nuevos blur */}
                        <View style={{ elevation: 12, position: "absolute", top: 120, borderRadius: 15, overflow: "hidden", opacity: 0.3, }}>
                            <Image
                                blurRadius={15}
                                style={{ width: 180, height: 90 }}
                                source={{ uri: portada != "" ? portada : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }} />
                        </View>

                        {/* Imagenes Books nuevos */}
                        <ImageBackground
                            source={{ uri: portada != "" ? portada : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                            style={{ width: 150, height: 190, borderRadius: 15, overflow: "hidden", marginHorizontal: 10, }}
                        ></ImageBackground>

                    </View>
                </TouchableOpacity>

                <View style={{ marginTop: 30, marginHorizontal: 40 }}>
                    {/* Titulo del libro*/}
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                        Título
                    </Text>
                    <TextInput
                        placeholder="Título "
                        placeholderTextColor="black"
                        value={titulo}
                        onChangeText={(text) => setTitulo(text)}
                        style={{
                            marginRight: 20,
                            marginLeft: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 10,
                            color: "black", backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "#f8f8f8"
                        }}
                    ></TextInput>
                    <TouchableOpacity
                        style={{
                            width: "70%",
                            marginTop: 10,
                            backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "#E39801",
                            padding: 4,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginBottom: 10,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 6.00,
                            elevation: 15,
                        }}
                        onPress={e => actualizarTexto()}
                    >
                        <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                            Actualizar
                        </Text>
                    </TouchableOpacity>
                    {/* Descripción del libro*/}
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                        Descripción
                    </Text>
                    <TextInput
                        placeholder="Título "
                        placeholderTextColor="black"
                        value={texto}
                        onChangeText={(text) => setTexto(text)}
                        style={{
                            marginRight: 20,
                            marginLeft: 20,
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            borderRadius: 10,
                            color: "black", backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "#f8f8f8",
                            textAlign: 'justify'
                        }}
                        multiline={true}
                        numberOfLines={4}
                        textAlignVertical="top"
                    ></TextInput>
                    <TouchableOpacity
                        style={{
                            width: "70%",
                            marginTop: 10,
                            backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "#E39801",
                            padding: 4,
                            borderRadius: 20,
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                            marginBottom: 10,

                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 6.00,
                            elevation: 15,
                        }}
                        onPress={e => actualizarDescripcion()}
                    >
                        <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                            Actualizar
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Capitulos */}
                <Text style={{ marginHorizontal: 40, fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                    Capitulos
                </Text>

                <View style={{ marginHorizontal: 40, marginBottom: 10, }}>
                    {
                        capitulos.map((item, index) => <RenderCapitulos key={index} libro={item} />)
                    }

                    {/* Contenedor Botón escribir nuevo capitulo  */}
                    <TouchableOpacity style={{
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
                        backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "white",
                        alignItems: "center",
                        justifyContent: "center",
                    }} onPress={() => handleWriteChapter()}>
                        <View
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                marginVertical: 5,
                            }}
                        >
                            <AntDesign name="book" size={24} color="black" style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 14, color: "black" }}>
                                Escribe un {""}
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        color: "#E39801",
                                        marginLeft: 10,
                                    }}
                                >
                                    nuevo {""}
                                </Text>
                                <Text style={{ fontSize: 14, color: "black" }}>
                                    capitulo</Text>
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={{
                        width: "40%",
                        backgroundColor: isModalVisible || isModalVisibleBorrar ? "#8D8D8D" : "#B00020",
                        padding: 4,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 20,

                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 12,
                        },
                        shadowOpacity: 0.8,
                        shadowRadius: 6.00,
                        elevation: 15,
                    }}
                    onPress={e =>   setModalVisibleBorrar(true)}>
                    <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                        Borrar libro
                    </Text>
                </TouchableOpacity>

            </ScrollView>

        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
    text: {
        fontSize: 14,
    },
    lottieModalWait: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        height: '100%',
        width: '100%'
    },
    modalWait:{
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
    modalBorrarText:{
        fontSize: 15, 
        fontWeight: "bold",
         color: "white"
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
    buttonLeer: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "30%",
        marginTop: 20,
        backgroundColor: "#E39801",
        padding: 12,
        borderRadius: 20,
        alignItems: "center",
        marginBottom: 10,
    },
    viewRenderCapitulos: {
        marginTop: 5, borderBottomColor: "#8EAF20",
        borderBottomWidth: 1,
        borderBottomEndRadius: 1,
        flexDirection: "row"
    },
    tituloRenderCapitulos: {
        marginLeft: 10, 
        marginTop: 10, 
        fontSize: 15, 
        color: "black", 
        marginRight: 20
    },

});
export default EditBookScreen