import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground, Image,
    Modal, StatusBar, ScrollView, TextInput, FlatList
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { Entypo, Foundation, AntDesign } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { getFotoPerfil, handleAutoresSeguidos, cambiarUltimoLibroLeido, getFavoritosDelUsuario } from "../hooks/Auth/Firestore";
import { getUserAuth } from "../hooks/Auth/Auth";
import { getFavoritos } from "../hooks/FirebaseLibros";



function BibliotecaScreen() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);
    const [autores, setAutores] = useState([]);
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleNoHayCapitulo, setModalVisibleNoHayCapitulo] = useState(false);
    const categorias = ["Favoritos", "Autores"];

    const [seleccionadoCategoriaIndex, setSeleccionadoCategoriaIndex] =
        useState(0);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            hacerCosas();
        });
        return unsubscribe;
    }, [email]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    }, []);

    const handleProfile = () => {
        navigation.navigate("profileScreen", {
            screen: "home",
        });
    }

    const cargarCategorias = async (index) => {
        setSeleccionadoCategoriaIndex(index);
        if (index == 0) {
            cargarFavoritos();
            setAutores([]);
        }
        else {
            cargarAutoresSeguido();
            setFavoritos([]);
        }
    };

    const cargarFavoritos = async () => {
        let e = await getUserAuth();
        setModalVisible(true);
        let favoritosUsuario = await getFavoritosDelUsuario(e);

        setFavoritos(await getFavoritos(favoritosUsuario));

        setModalVisible(false);


    };

    const cargarAutoresSeguido = async () => {
        setModalVisible(true);
        let autores = await handleAutoresSeguidos(email);
        setAutores(autores);
        setModalVisible(false);
    };

    const getFiltrado = async () => {
        if (textoBusqueda.length != 0 && textoBusqueda.trim().length != 0) {
            if (seleccionadoCategoriaIndex == 0) {

                let favoritosFiltro = favoritos.filter((a) => {

                    return a.Titulo.toLowerCase().startsWith(textoBusqueda.toLowerCase())
                });
                setFavoritos(favoritosFiltro)

            }
            else {
                let autoresFiltro = autores.filter((a) => {

                    return a.Nombre.toLowerCase().startsWith(textoBusqueda.toLowerCase())
                });
                setAutores(autoresFiltro);
            }
        }
        else {
            await cargarCategorias(seleccionadoCategoriaIndex);

        }

    }

    const handleLeerLibroCapitulo = async (item) => {
        if (item.NumCapitulos != 0) {
            //Ir al ultimo capitulo 
            let numcapitulo = item.UltimoCapitulo;

            if (item.UltimoCapitulo == 0) {
                numcapitulo = 1;
            }
            //Cambiar el ultimo libro leido:
            await cambiarUltimoLibroLeido(item.key, email, numcapitulo);

            navigation.navigate("bookScreen", {
                bookId: item.key,
                capituloNumero: numcapitulo,
                screen: "biblioteca",
            });
        } else {
            setModalVisibleNoHayCapitulo(true);
        }
    }

    const hacerCosas = async () => {

        let e = await getUserAuth();
        setEmail(e);
        setFotoPerfil(await getFotoPerfil(e));
        cargarCategorias(0);

    }

    const goAutorProfile = (autorPulsado) => {
        navigation.replace("autorScreen", {
            autorElegido: autorPulsado,
            screen: "explore",
        });
    }
    const RenderCategorias = (item) => {
        return (
            <View style={styles.renderCategoriaMisLibros}>
                {categorias.map((item, index) => (
                    <TouchableOpacity
                        testID="buttoncargarCategorias"
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
                                        backgroundColor: "#8EAF20",
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
    /* Autores */
    const CardAutores = ({ autor }) => {
        return (

            <TouchableOpacity testID="buttongoAutorProfile " onPress={() => goAutorProfile(autor.Nombre)} style={{
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "row",

            }}>

                <Image
                    source={{ uri: autor.Foto != "" ? autor.Foto : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                    style={{ width: 50, height: 50, borderRadius: 50 / 2, marginHorizontal: 30, marginVertical: 10 }}

                />
                <Text style={{ marginTop: "auto", marginBottom: "auto", fontSize: 20, fontWeight: "bold", color: "#429EBD" }}>
                    {autor.Nombre.split("@")[0]}
                </Text>
            </TouchableOpacity>

        );
    };
    /* Books nuevos */
    const CardFavoritos = ({ libro }) => {

        return (
            <TouchableOpacity
                testID="buttonhandleLeerLibroCapitulo"
                style={{
                    marginHorizontal: 10,
                }}
                onPress={() => handleLeerLibroCapitulo(libro)}
            >
                <View
                    style={{
                        marginVertical: 10,
                        marginHorizontal: 30, marginBottom: 10, flexDirection: "row", borderRadius: 8,
                        shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                        backgroundColor: "white",
                    }}>
                    <ImageBackground
                        source={{ uri: libro.Portada }}
                        style={{
                            width: 100,
                            height: 120,
                            borderRadius: 15,
                            overflow: "hidden",
                            marginBottom: 10,
                            marginLeft: 10,
                            marginTop: 10,
                            borderWidth: 1,
                            borderColor: "black",
                        }}
                    ></ImageBackground>
                    <View style={{ marginTop: 15, width: 180, marginLeft: 10, alignItems: "center", justifyContent: "flex-start" }}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#429EBD" }}>
                            {libro.Titulo}
                        </Text>
                        <Text style={{ fontSize: 10, marginTop: 10, color: "black" }}>
                            {libro.Autor}
                        </Text>
                        <Text
                            style={{
                                marginTop: 5,
                                fontSize: 13,
                                color: "black",
                                fontWeight: "bold",
                            }}
                        >
                            {libro.NumCapitulos != 0 ? Math.round((libro.UltimoCapitulo / libro.NumCapitulos) * 100) : 0}%
                            <Foundation name="page-multiple" size={15} color="#8EAF20" />
                        </Text>
                        <View
                            style={{
                                marginTop: 5,
                                width: 100,
                                height: 5,
                                backgroundColor: "#D8D8D8",
                                borderRadius: 15,
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    width: libro.NumCapitulos != 0 ? (libro.UltimoCapitulo / libro.NumCapitulos) * 100 : 0,
                                    height: 5,
                                    backgroundColor: "#8EAF20",
                                    borderRadius: 15,
                                }}
                            ></View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <SafeAreaView style={styles.back}>



            <Modal
                animationType="fade"
                visible={isModalVisibleNoHayCapitulo}
                transparent
            >

                <View style={{
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                    height: 200,
                    borderColor: "#8EAF20",
                    borderRadius: 20,
                    borderWidth: 2, backgroundColor: 'white', alignItems: 'center', justifyContent: "center",
                    shadowColor: "black",
                    shadowOpacity: 0.89,
                    shadowOffset: { width: 0, height: 9 },
                    shadowRadius: 10,
                    elevation: 12,
                }}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: 20,
                    }}>Lo siento! El libro no tiene capítulos demomento</Text>

                    <TouchableOpacity
                        testID="buttonsetModalVisibleNoHayCapitulo"
                        style={{
                            width: "50%",
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
                        onPress={() => setModalVisibleNoHayCapitulo(!isModalVisibleNoHayCapitulo)}
                    >
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                            Aceptar
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>


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
                        source={require('../../assets/animations/waitFunction.json')} autoPlay loop />
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
                        <Text style={styles.fontEscribir}>Biblioteca</Text>
                    </View>
                </View>
                {/*User*/}
                <TouchableOpacity testID="buttonhandleProfile" onPress={() => { handleProfile() }}>
                    <Image
                        source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10 }}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainerBusqueda}>
                {/*Texto buqueda*/}
                <View style={styles.inputContainerTextBusqueda}>
                    <TextInput
                        placeholder="Busca un libro, persona..."
                        placeholderTextColor="black"
                        value={textoBusqueda}
                        onChangeText={(text) => setTextoBusqueda(text)}
                        style={styles.input}
                    ></TextInput>
                </View>
                {/* Boton de filtrar */}
                <TouchableOpacity testID="buttonFiltrar" style={styles.buttonFiltrar} onPress={() => getFiltrado()}>
                    <Entypo name="magnifying-glass" size={24} color="black" />
                </TouchableOpacity>
            </View>

            <RenderCategorias />

            {seleccionadoCategoriaIndex == 0 ?
                <View>
                    {
                        favoritos.length != 0 ?
                        <View  style={{height: '90%'}}>
                        <FlatList
                        testID="flatlistbooks"
                        contentContainerStyle={{backgroundColor: "white",  borderRadius: 20,paddingBottom:70 }}
                          keyExtractor={(item, index) => index}
                          data={favoritos}
                          renderItem={({ item, index }) => (
                            <CardFavoritos key={index} libro={item} />
                          )}
                      
                          onEndReachedThreshold={0.01}
                        /></View>
                             :

                            <View style={{ marginHorizontal: 30 }}  >
                                <Image
                                    resizeMode={'center'}
                                    source={require("../../assets/BibliotecaVacia.png")}
                                    style={styles.image}
                                />
                                <Text style={styles.textImage}>Biblioteca vacía......</Text>
                            </View>

                    }
                </View>
                :
                <View>
                    {
                        autores.length != 0 ?
                            <FlatList
                                testID="flatlistbooks"
                                contentContainerStyle={{ paddingBottom: 60, }}
                                keyExtractor={(item, index) => index}
                                data={autores}
                                renderItem={({ item, index }) => (
                                    <CardAutores key={index} autor={item} />
                                )}

                            />
                            :
                            <View style={{ marginHorizontal: 30 }}  >
                                <Image
                                    resizeMode={'center'}
                                    source={require("../../assets/NoAuthor.png")}
                                    style={styles.image}
                                />
                                <Text style={styles.textImage}>No hay autores......</Text>
                            </View>
                    }
                </View>
            }
        </SafeAreaView >
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
    renderCategoriaMisLibros: {
        marginBottom: 10,
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginRight: 20,
        marginHorizontal: 30,
        marginTop: 20,
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
        width: 260,
        height: 50,
    },
    input: {
        color: "black",
    },
    buttonFiltrar: {
        marginRight: "auto",
        marginTop: "auto",
        backgroundColor: "white",
        padding: 12,
        borderRadius: 20,
        borderColor: "#E39801",
        borderWidth: 3,
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6.00,
        elevation: 15,

    }, categoriaText: {
        fontSize: 15,
        fontWeight: "bold",
    },
    image: {
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 60,
        height: 200,
        width: 270,
    },
    textImage: {
        marginTop: 30,
        marginLeft: "auto",
        marginRight: "auto",
        fontSize: 15,

    },
});
export default BibliotecaScreen