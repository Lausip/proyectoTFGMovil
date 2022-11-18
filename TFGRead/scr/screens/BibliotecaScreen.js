import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground, Image,
    Modal, StatusBar, ScrollView, TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { Entypo,Foundation } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { getFotoPerfil, handleAutoresSeguidos } from "../hooks/Auth/Firestore";
import { getUserAuth } from "../hooks/Auth/Auth";
import { getFavoritos } from "../hooks/FirebaseLibros";
import { db } from '../config/firebase';

function BibliotecaScreen() {
    const navigation = useNavigation();
    const [favoritos, setFavoritos] = useState([]);
    const [autores, setAutores] = useState([]);
    const [fotoPerfil, setFotoPerfil] = useState("");
    const [textoBusqueda, setTextoBusqueda] = useState("");
    const [email, setEmail] = useState("");
    const [isModalVisible, setModalVisible] = useState(false);
    const categorias = ["Reciente", "Favoritos", "Autores"];
    const  [porcentaje, setPorcentaje] = useState(0);
    const  [numCapitulos, setNumCapitulos] = useState(0);
    const [seleccionadoCategoriaIndex, setSeleccionadoCategoriaIndex] =
        useState(0);

    useEffect(() => {
        hacerCosas();
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
        setModalVisible(true);
        setSeleccionadoCategoriaIndex(index);
        if (index == 1) {

            await cargarFavoritos(email);

            setAutores([]);
        }

        else if (index == 2) {

            await cargarAutoresSeguido();
            setFavoritos([]);
        }

        setModalVisible(false);
    };

    const cargarFavoritos = async (email2) => {
        //ARREGLAR
        await db.collection("usuarios").doc(email2).collection("MeGusta")
            .onSnapshot(async querySnapshot => {
                let favoritosUsuario = [];
                await querySnapshot.forEach( async documentSnapshot => {
                           
                    favoritosUsuario.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,
                 
                    });
                })       
                setFavoritos(await getFavoritos(favoritosUsuario));
            })




    };

    const cargarAutoresSeguido = async () => {

        let autores = await handleAutoresSeguidos(email);
        setAutores(autores);
    };

    const getFiltrado = async () => {
        if (textoBusqueda != "") {
            if (seleccionadoCategoriaIndex == 1) {

                let favoritosFiltro = favoritos.filter((a) => {

                    return a.Titulo.toLowerCase().startsWith(textoBusqueda.toLowerCase())
                });
                setFavoritos(favoritosFiltro)

            }
            if (seleccionadoCategoriaIndex == 2) {
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
        let numcapitulo=item.UltimoCapitulo;

        if(item.UltimoCapitulo==0){
            numcapitulo=1;
        }

        navigation.navigate("bookScreen", {
            bookId: item.key,
            capituloNumero: numcapitulo
        });
    }

    const hacerCosas = async () => {

        setModalVisible(true)
        let e = await getUserAuth();
        setEmail(e);
        setFotoPerfil(await getFotoPerfil(e));
        //NO VA BN NO SE PORQ al ser la primera vez que lo habrp
        cargarCategorias(1);
        setModalVisible(false)
    }


    const RenderCategorias = () => {
        return (
            <View style={styles.renderCategoriaMisLibros}>
                {categorias.map((item, index) => (
                    <TouchableOpacity
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
                                        backgroundColor: "#679436",
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

            <View style={{
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "row",

            }}>

                <Image
                    source={{ uri: autor.Foto != "" ? autor.Foto : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
                    style={{ width: 50, height: 50, borderRadius: 50 / 2, marginHorizontal: 30, marginVertical: 10 }}

                />
                <Text style={{ marginTop: "auto", marginBottom: "auto", fontSize: 20, fontWeight: "bold", color: "#05668D" }}>
                    {autor.Nombre.split("@")[0]}
                </Text>
            </View>

        );
    };
    /* Books nuevos */
    const CardFavoritos = ({ libro }) => {

        return (
            <TouchableOpacity
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
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "#05668D" }}>
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
              {(libro.UltimoCapitulo/libro.NumCapitulos)*100}%
                <Foundation name="page-multiple" size={15} color="#679436" />
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
                    width: (libro.UltimoCapitulo/libro.NumCapitulos)*100,
                    height: 5,
                    backgroundColor: "#679436",
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
                <TouchableOpacity onPress={() => { handleProfile() }}>
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
                <TouchableOpacity style={styles.buttonFiltrar} onPress={() => getFiltrado()}>
                    <Entypo name="magnifying-glass" size={24} color="black" />
                </TouchableOpacity>
            </View>


            <RenderCategorias />
            {seleccionadoCategoriaIndex == 1 ?
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {
                        favoritos.map((item, index) => <CardFavoritos key={index} libro={item} />)
                    }

                </ScrollView> :

                <ScrollView contentContainerStyle={styles.contentContainer}>
                    {
                        autores.map((item, index) => <CardAutores key={index} autor={item} />)
                    }

                </ScrollView>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    back: {
        flex: 1,
        backgroundColor: "white",
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
        borderColor: "#679436",
        borderWidth: 3,
        alignItems: "center",

    }, categoriaText: {
        fontSize: 15,
        fontWeight: "bold",
    },
});
export default BibliotecaScreen