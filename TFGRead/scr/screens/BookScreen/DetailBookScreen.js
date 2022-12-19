import { View, Text, ScrollView, SafeAreaView, StyleSheet, StatusBar, BackHandler,TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import { handleAñadirLibroMeGustaFirebase, handleElLibroEstaEnMeGusta, handleEliminarLibroMeGustaFirebase,cambiarUltimoLibroLeido } from '../../hooks/Auth/Firestore';
import { cargarDatosLibro } from '../../hooks/FirebaseLibros';
import { getUserAuth } from "../../hooks/Auth/Auth";

function DetailBookScreen({ route }) {
    const [email, setEmail] = useState("");
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [portada, setPortada] = useState("");
    const [megusta, setMeGusta] = useState(false);
    const [capitulos, setCapitulos] = useState([]);

    const navigation = useNavigation();
    const { bookId } = route.params;

    useEffect(() => {
        hacerCosas();
        BackHandler.addEventListener('hardwareBackPress', backAction);

        return () =>
          BackHandler.removeEventListener('hardwareBackPress', backAction);
    }, [email, portada])

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

    const handleLeerLibro = async () => {
        //Cambiar el ultimo libro leido:
        await cambiarUltimoLibroLeido(bookId, email,1);
        //Ir al capitulo 1
        navigation.navigate("bookScreen", {
            bookId: bookId,
            capituloNumero: 1,
            screen: "detailsBookScreen",
        });
    }

    const handleLeerLibroCapitulo = async (capituloNumero) => {
        //Cambiar el ultimo libro leido:
        await cambiarUltimoLibroLeido(bookId, email,capituloNumero);
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

    const RenderCapitulos = ({ libro }) => {
        return (
            <TouchableOpacity key={libro.id} onPress={e => handleLeerLibroCapitulo(libro.Numero)}>
                <View style={{
                    marginTop: 5, borderBottomColor: "#8EAF20",
                    borderBottomWidth: 1,
                    borderBottomEndRadius: 1,

                    width: libro.Titulo.length ? 150 : libro.Titulo.length + 50
                }}>
                    <Text style={{ marginLeft: 10, marginTop: 10, fontSize: 15, color: "black", }}>
                        {libro.Titulo}
                    </Text>
                </View>
            </TouchableOpacity >
        );
    }

    return (

        <SafeAreaView style={styles.container}>
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
                <Text style={styles.fontTitulo}>{titulo}</Text>
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

                <View style={{ flexDirection: "row" }}>

                    {/* Boton de leer */}
                    <TouchableOpacity style={styles.buttonLeer} onPress={e => handleLeerLibro()}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                            Leer
                        </Text>
                    </TouchableOpacity>

                    {/* Boton de gustar */}
                    <TouchableOpacity style={{ marginTop: "auto", marginBottom: "auto", right: 55 }} onPress={e => handleLibroMeGustaFirebase()}>
                        {megusta ? <AntDesign name="heart" size={30} color="#429EBD" /> : <AntDesign name="hearto" size={30} color="#429EBD" />}
                    </TouchableOpacity>

                </View>

                {/* Descripción del libro*/}
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginHorizontal: 40, marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                    Descripción
                </Text>

                <ScrollView style={{ marginHorizontal: 40, flexGrow: 0 }}>
                    <Text style={{ textAlign: 'justify' }}>
                        {texto}
                    </Text>
                </ScrollView>

                {/* Capitulos */}
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "black", marginHorizontal: 40, borderBottomColor: "#8EAF20", borderBottomWidth: 3, }}>
                    Capitulos
                </Text>
                <View style={{ marginHorizontal: 40, marginBottom: 30, }}>
                    {
                        capitulos.map((item, index) => <RenderCapitulos key={index} libro={item} />)
                    }
                </View>
            </ScrollView>

        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
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
        marginLeft: "auto",
        marginRight: "auto",
        width: "50%",
        marginTop: 20,
        backgroundColor: "#E39801",
        padding: 12,
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
        marginBottom: 10,
    },
});
export default DetailBookScreen