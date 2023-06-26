import { View, Text, ScrollView, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, Image, ImageBackground, Modal, FlatList ,BackHandler} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign, Entypo } from '@expo/vector-icons';
import { handleAñadirLibroMeGustaFirebase, handleElLibroEstaEnMeGusta, handleEliminarLibroMeGustaFirebase, cambiarUltimoLibroLeido } from '../../hooks/Auth/Firestore';
import { cargarDatosLibro, getCategoriasLibro, getCapitulosDelLibro } from '../../hooks/FirebaseLibros';
import { getUserAuth } from "../../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import {
    Menu,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';

function DetailBookScreen({ route }) {
    const [email, setEmail] = useState("");

    const [portada, setPortada] = useState("");
    const [libroActual, setLibroActual] = useState({});
    const [megusta, setMeGusta] = useState(false);
    const [hayCapitulo, setHayCapitulo] = useState(true);
    const [capitulos, setCapitulos] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [etiquetas, setEtiquetas] = React.useState([]);

    const [isModalVisible, setModalVisible] = useState(false);


    const navigation = useNavigation();
    const [openMenu, setOpenMenu] = useState(false);

    const { bookId } = route.params;

    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleHome);
        const unsubscribe = navigation.addListener('focus', () => {

            hacerCosas();
            BackHandler.removeEventListener('hardwareBackPress', handleHome);
        });
        
        return unsubscribe;
    }, [email, portada, megusta]);


    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const hacerCosas = async () => {

        await cargarLibro()
    }

    const cargarLibro = async () => {

        let e = await getUserAuth();
        setEmail(e);
        setMeGusta(await handleElLibroEstaEnMeGusta(e, bookId));
        let data = await cargarDatosLibro(bookId)
        setLibroActual(data);
        setPortada(data.Portada)
        let ca = await getCategoriasLibro(bookId)
        setCategorias(ca)
        setEtiquetas(data.Etiquetas)
        let c = await getCapitulosDelLibro(bookId)
        setCapitulos(c);
        setHayCapitulo(c.length != 0)
    }

    const handleLeerLibro = async () => {
       
        if(hayCapitulo){
            setModalVisible(true)
        //Cambiar el ultimo libro leido:
        await cambiarUltimoLibroLeido(bookId, email, 1);
        setModalVisible(false)
        //Ir al capitulo 1
        navigation.navigate("bookScreen", {
            bookId: bookId,
            capituloNumero: 1,
            screen: "detailsBookScreen",
        });}
        
    }
    const goAutor = async (autorPulsado) => {
        navigation.replace("autorScreen", {
            autorElegido: autorPulsado,
            screen: "home",
        });
    }
    const reportarLibro = async () => {
        setOpenMenu(false);
        navigation.navigate("reportBookScreen", {
            bookId: bookId,
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
                    marginTop: 10,
                    borderColor: "#2B809C",
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
            <TouchableOpacity testID='buttonhandleLeerLibroCapitulo' key={libro.id} onPress={e => handleLeerLibroCapitulo(libro.Numero)}>
                <View style={{
                    marginTop: 5, borderBottomColor: "#8EAF20",
                    borderBottomWidth: 1,
                    borderBottomEndRadius: 1,
                    marginLeft: 10,

                    width: libro.Titulo?.length ? 150 : libro.Titulo?.length + 50
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
                backgroundColor: "#2B809C",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity testID='buttonGoHome' onPress={() => handleHome()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>{libroActual.Titulo}</Text>
                {/* Menu de acciones*/}
                <View style={{ alignItems: "flex-end", marginHorizontal: 30, }}>
                    <Menu  testID="buttonOnBackdropPress" onBackdropPress={() => setOpenMenu(false)} opened={openMenu}>
                        <MenuTrigger testID="buttonMenuTrigger" onPress={() => setOpenMenu(true)}>
                            <Entypo name="dots-three-vertical" size={24} color="white" />
                        </MenuTrigger>
                        <MenuOptions style={{

                            alignItems: "center",
                            borderRadius: 8,
                            shadowColor: "black",
                            shadowOpacity: 0.78,
                            shadowOffset: { width: 0, height: 9 },
                            shadowRadius: 10,
                            elevation: 11,
                            backgroundColor: isModalVisible ? "#A7A7A7" : "white",
                        }}>

                            <MenuTrigger style={{
                                marginBottom: 5, marginTop: 5
                            }} testID="buttonReportar" onPress={() => reportarLibro()}>
                                <Text style={{ color: '#B00020', fontSize: 15, padding: 10 }}>Reportar</Text>
                            </MenuTrigger>

                        </MenuOptions>
                    </Menu>
                </View>
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

                <View style={{ flexDirection: "row", justifyContent: "center" }}>

                    {/* Boton de leer */}
                    <TouchableOpacity testID='buttonLeer' disabled={!hayCapitulo} style={styles.buttonLeer} onPress={() => handleLeerLibro()}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                            Leer
                        </Text>
                    </TouchableOpacity>

                    {/* Boton de gustar */}
                    <TouchableOpacity testID='buttonMeGusta' style={{ marginTop: "auto", marginBottom: "auto", marginLeft: 15, marginRight: "auto" }} onPress={() => handleLibroMeGustaFirebase()}>
                        {megusta ? <AntDesign name="heart" size={30} color="#2B809C" /> : <AntDesign name="hearto" size={30} color="#2B809C" />}
                    </TouchableOpacity>

                </View>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#2B809C", marginLeft: "auto", marginRight: "auto", marginBottom: 10 }}>{libroActual.Estado}</Text>
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
                <View style={{ marginHorizontal: 40, marginBottom: 20, }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                        Descripción
                    </Text>

                    <ScrollView style={{ flexGrow: 0 }}>
                        <Text style={{ textAlign: 'justify' }}>
                            {libroActual.Descripción}
                        </Text>
                    </ScrollView>
                </View>
                {/* Capitulos */}
                <View style={{ marginHorizontal: 40,  }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                    Capítulos{":    "}

                    </Text>
                    {
                        capitulos.length != 0 ?
                            <View style={{ marginBottom: 10 }}>
                                {
                                    capitulos.map((item, index) => <RenderCapitulos libro={item} key={index} />)
                                }
                            </View>

                            : <View style={{ marginHorizontal: 30 }}  >
                                <Image
                                    resizeMode={'center'}
                                    source={require("../../../assets/NoLibrosWrite.png")}
                                    style={styles.image}
                                />
                                <Text style={styles.textImage}>No hay capítulos......</Text>
                            </View>
                    }
                </View>
                {/* Etiquetas */}
                {
                    etiquetas.length != 0 ?
                        <View style={{ marginHorizontal: 40, marginBottom: 20, }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 5, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                                Etiquetas
                            </Text>
                            {/* Etiquetas explorar */}
                            <FlatList
                                contentContainerStyle={{ paddingLeft: 5 }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                data={etiquetas}
                                renderItem={({ item, index }) => <RenderEtiquetas libro={item} key={index} />}
                            ></FlatList>
                        </View>
                        : <Text></Text>
                }

                <TouchableOpacity testID='buttonGoAutor' onPress={() => goAutor(libroActual.Autor)} style={{ marginHorizontal: 40, fontSize: 17 }}>
                    <Text>
                        Autor: {" "}
                        <Text style={{ fontSize: 15, color: "#2B809C" }}>
                            {libroActual.Autor.split("@")[0]}
                        </Text>
                    </Text>
                </TouchableOpacity>

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
        marginRight: "auto",
        marginVertical: 30,
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },
    buttonLeer: {
        marginLeft: "auto",
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
    image: {
        marginTop:"auto",
        marginBottom:"auto",
        marginLeft: "auto",
        marginRight: "auto",
        height: 100,
        width: 150,
    },
    textImage: {
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 15,
    },
});
export default DetailBookScreen