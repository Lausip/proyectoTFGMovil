import { View, ActivityIndicator, Text, FlatList, SafeAreaView, StyleSheet, StatusBar, TouchableOpacity, ScrollView, ImageBackground, Modal } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { getPeticionesAmistad,rechazarPeticionAmistad,aceptarPeticionAmistad } from "../hooks/Auth/Firestore";

function NotificacionesScreen({ route }) {
    const [email, setEmail] = useState("");
    const navigation = useNavigation();
    const { screen } = route.params;
    const [peticionAmistad, setPeticionAmistad] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        hacerCosas();
    }, [email])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const goBack = () => {
        navigation.replace(screen);
    }

    const aceptarAmistad = async(peticion,emailAceptado) => {
        aceptarPeticionAmistad(email,peticion,emailAceptado);
        let a = await getPeticionesAmistad(email);
        setPeticionAmistad(a);
    }

    const rechazarAmistad = async(peticion) => {
        rechazarPeticionAmistad(email,peticion);
        let a = await getPeticionesAmistad(email);
        setPeticionAmistad(a);
    }

    const hacerCosas = async () => {
        setModalVisible(true)
        let e = await getUserAuth()
        setEmail(e);
        let a = await getPeticionesAmistad(e);
        setPeticionAmistad(a);
        setModalVisible(false)
    }

    /* Peticiones de amistad */
    const CardAmistad = ({ peticion }) => {
        return (

            <View style={{
                marginVertical: 10,
                marginHorizontal: 30, marginBottom: 10, borderRadius: 8,
                shadowColor: "black", shadowOpacity: 0.88, shadowOffset: { width: 0, height: 9 }, shadowRadius: 10, elevation: 6,
                backgroundColor: "white", flexDirection: "row"

            }}>
                <View style={{
                    flexDirection: "row", marginHorizontal: 10,
                }} >

                    <Text style={{ marginVertical: 10, fontSize: 20, fontWeight: "bold", color: "#05668D", marginRight: 60, }}>
                        {peticion.Nombre.split("@")[0]}
                    </Text>
                    <TouchableOpacity onPress={() => aceptarAmistad(peticion.key,peticion.Nombre)}>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="checkcircleo" size={24} color="#679436" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() =>rechazarAmistad(peticion.key) }>
                        <AntDesign style={{
                            marginHorizontal: 15,
                            marginVertical: 10,
                        }} name="closecircleo" size={24} color="red" />
                    </TouchableOpacity>
                </View>

            </View>

        );
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: isModalVisible ? "#A7A7A7" : "white",
        }}>

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
                backgroundColor: "#679436",
                borderBottomRightRadius: 500,
                height: 70,

            }}>
                <TouchableOpacity onPress={() => goBack()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Notificaciones</Text>
            </View>
            <ScrollView contentContainerStyle={styles.contentContainer}>
                {
                    peticionAmistad.map((item, index) => <CardAmistad key={index} peticion={item} />)
                }

            </ScrollView>
        </SafeAreaView>


    )
}
const styles = StyleSheet.create({
    contentContainer: {
        paddingVertical: 10,

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

});
export default NotificacionesScreen;