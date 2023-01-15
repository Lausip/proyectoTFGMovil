import { View, Text, ScrollView, SafeAreaView, StyleSheet, StatusBar, BackHandler, TouchableOpacity, Image, ImageBackground, Modal, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import { handleAñadirLibroMeGustaFirebase, handleElLibroEstaEnMeGusta, handleEliminarLibroMeGustaFirebase, cambiarUltimoLibroLeido } from '../../hooks/Auth/Firestore';
import { cargarDatosLibro, getCategoriasLibro } from '../../hooks/FirebaseLibros';
import { getUserAuth } from "../../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';

function DetailBookScreen({ route }) {
    const [email, setEmail] = useState("");

    const [portada, setPortada] = useState("");
    const [libroActual, setLibroActual] = useState({});
    const [megusta, setMeGusta] = useState(false);
    const [capitulos, setCapitulos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [etiquetas, setEtiquetas] = useState([]);

    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    const { bookId } = route.params;

    useFocusEffect(
        React.useCallback(() => {
            hacerCosas();
        }, [email, portada, megusta])
    )






    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });
    const backAction = async () => {
        navigation.navigate("home", {

        });

    };

    const hacerCosas = async () => {

        await cargarLibro()
    }

    const cargarLibro = async () => {
   
        let e = await getUserAuth();
        setEmail(e);
        setMeGusta(await handleElLibroEstaEnMeGusta(e, bookId));
        //Error el render no espera a la imagen,se rendera primero y luego coe la imagen
        let data = await cargarDatosLibro(bookId)
        setLibroActual(data);
        setPortada(data.Portada)
        setCategorias(await getCategoriasLibro(bookId))
        setEtiquetas(data.Etiquetas)
 
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

    const handleLeerLibro = async () => {
        setModalVisible(true)
        //Cambiar el ultimo libro leido:
        await cambiarUltimoLibroLeido(bookId, email, 1);
        setModalVisible(false)
        //Ir al capitulo 1
        navigation.navigate("bookScreen", {
            bookId: bookId,
            capituloNumero: 1,
            screen: "detailsBookScreen",
        });
    }

    const handleLeerLibroCapitulo = async (capituloNumero) => {
        setModalVisible(true)
        //Cambiar el ultimo libro leido:
        await cambiarUltimoLibroLeido(bookId, email, capituloNumero);
        setModalVisible(false)
        //Ir al capitulo escogido
        navigation.navigate("bookScreen", {
            bookId: bookId,
            capituloNumero: capituloNumero,
            screen: "detailsBookScreen",
        });
    }
    const handleHome = async () => {
        navigation.navigate("home")
    }
    const handleLibroMeGustaFirebase = async () => {
        if (!megusta) {
            setMeGusta(true);
            await handleAñadirLibroMeGustaFirebase(email, bookId)
        }
        else {
            setMeGusta(false);
            await handleEliminarLibroMeGustaFirebase(email, bookId)
        }
    }
    const RenderEtiquetas = ({ libro }) => {
        return (
            <View
                style={{
                    marginTop:10,
                    borderColor: "#429EBD",
                    marginHorizontal: 5,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderRadius: 15,
                    backgroundColor: `white`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                    flexDirection: "row"
                }}
            >
                <Text
                    style={{
                        fontSize: 13,
                        color: "black",
                        fontWeight: "bold",
                    }}
                >
                    {libro}
                </Text>
            </View>
        );
    };
    const RenderCategorias = (item, index) => {
        return (
            <View style={{
                marginRight: 8,

            }}>
                {/* Imagenes Categorias*/}

                <View
                    style={{
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 5,
                        paddingTop: 5,
                        borderRadius: 15,
                        overflow: "hidden",
                        backgroundColor: `${item.Color}`,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        {item.Nombre}
                    </Text>
                </View>

            </View>
        );
    };
    const RenderCapitulos = ({ libro }) => {
        return (
            <TouchableOpacity key={libro.id} onPress={e => handleLeerLibroCapitulo(libro.Numero)}>
                <View style={{
                    marginTop: 5, borderBottomColor: "#8EAF20",
                    borderBottomWidth: 1,
                    borderBottomEndRadius: 1,
                    marginLeft: 10,

                    width: libro.Titulo.length ? 150 : libro.Titulo.length + 50
                }}>
                    <Text style={{ marginTop: 10, fontSize: 15, color: "black", }}>
                        {libro.Titulo}
                    </Text>
                </View>
            </TouchableOpacity >
        );
    }

    return (

        <SafeAreaView style={styles.container}>

            <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent>

                <View style={styles.modalView}>
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
            <View style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#429EBD",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity onPress={() => handleHome()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>{libroActual.Titulo}</Text>
            </View>
            <ScrollView style={{ flexGrow: 0 }}>

                {/* Portada del libro */}
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

                <View style={{  flexDirection: "row", justifyContent: "center"}}>

                    {/* Boton de leer */}
                    <TouchableOpacity style={styles.buttonLeer} onPress={e => handleLeerLibro()}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                            Leer
                        </Text>
                    </TouchableOpacity>

                    {/* Boton de gustar */}
                    <TouchableOpacity style={{ marginTop: "auto", marginBottom: "auto",marginLeft:15,marginRight:"auto" }} onPress={e => handleLibroMeGustaFirebase()}>
                        {megusta ? <AntDesign name="heart" size={30} color="#429EBD" /> : <AntDesign name="hearto" size={30} color="#429EBD" />}
                    </TouchableOpacity>

                </View>
                {/* Categorias explorar */}
                <FlatList
                    contentContainerStyle={{ marginLeft: "auto", marginRight: "auto" }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={categorias}
                    keyExtractor={(item, index) => {
                        return index.toString();
                    }}
                    renderItem={({ item, index }) => RenderCategorias(item, index)}
                ></FlatList>

                {/* Descripción del libro*/}
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginHorizontal: 40, marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                    Descripción
                </Text>

                <ScrollView style={{ marginHorizontal: 40, flexGrow: 0 }}>
                    <Text style={{ textAlign: 'justify' }}>
                        {libroActual.Descripción}
                    </Text>
                </ScrollView>

                {/* Capitulos */}
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginHorizontal: 40, borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                    Capitulos{":    "}
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "#429EBD" }}>{libroActual.Estado}</Text>
                </Text>
                {
                    capitulos.length != 0 ?
                        <View style={{ marginHorizontal: 40, marginBottom: 10, }}>
                            {
                                capitulos.map((item, index) => <RenderCapitulos libro={item} key={index} />)
                            }
                        </View>

                        : <View></View>
                }
                {/* Etiquetas */}
                {       
                        etiquetas.length != 0 ?
                            <View style={{ marginHorizontal: 40, marginBottom: 30, }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 3, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                                    Etiquetas
                                </Text>
                                {/* Etiquetas explorar */}
                                <FlatList
                                    contentContainerStyle={{ paddingLeft: 5 }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    data={etiquetas}
                                    renderItem={({ item, index }) =>  <RenderEtiquetas libro={item} key={index} />}
                                ></FlatList>
                            </View> 
                        : <Text></Text>
                }

            </ScrollView>

        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerView: {
        backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 30,
    },
    text: {
        fontSize: 14,
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
        marginLeft:"auto",
        width: "35%",
        marginTop: 20,
        backgroundColor: "#E39801",
        padding: 7,
        borderRadius: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6.00,
        elevation: 15,

        alignItems: "center",
        marginBottom: 20,
    },
});
export default DetailBookScreen