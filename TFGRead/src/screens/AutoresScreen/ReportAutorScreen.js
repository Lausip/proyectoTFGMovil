import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Modal, StatusBar, BackHandler,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { List, Checkbox } from 'react-native-paper';
import { enviarReporteAutor } from "../../hooks/FirebaseReportes"


function ReportarAutorScreen({ route }) {
    const [selectedOption1, setSelectedOption1] = useState(false);

    const [selectedOptionMini, setSelectedOptionMini] = useState('');
    const [email, setEmail] = useState("");
    const [motivo, setMotivo] = useState('');

    const handleOption1Change = (value) => {
        setSelectedOption1(value);
    }


    const handleOptionMiniChange = (value) => {
        setSelectedOptionMini(value);
    }
    const [isModalVisible, setModalVisible] = useState(false);

    const navigation = useNavigation();
    const { autorElegido } = route.params;

    useEffect(() => {
        hacerCosas();
        BackHandler.addEventListener('hardwareBackPress', handleAutor);

        return () =>
            BackHandler.removeEventListener('hardwareBackPress', handleAutor);


    }, []);

    const hacerCosas = async () => {

        let e = await getUserAuth();
        setEmail(e);

    }
    const enviarReporte = async () => {
        setModalVisible(true)
        await enviarReporteAutor(email, "Persona", "Contenido inapropiado", selectedOptionMini, motivo, autorElegido);
        setModalVisible(false);
        handleAutor();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

    });

    const handleAutor = async () => {
        navigation.replace("autorScreen", {
            autorElegido: autorElegido,
            screen: "home",
        });

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
                    <Text style={styles.textWait}>Enviando reporte...</Text>
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
                <TouchableOpacity testID='buttonGoHome' onPress={() => handleAutor()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}> Reportar {autorElegido.split("@")[0]}</Text>
            </View>

            <ScrollView style={{

                marginHorizontal: 20,
                backgroundColor: isModalVisible ? "#A7A7A7" : "white",
            }}>
                <Text style={{ backgroundColor: isModalVisible ? "#A7A7A7" : "white", fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 5, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                    Motivo
                </Text>

                <List.Accordion
                    title="Contenido inapropiado"
                    titleStyle={{ color: "black", fontWeight: "bold", backgroundColor: isModalVisible ? "#A7A7A7" : "white", }}
                    expanded={selectedOption1}
                    onPress={() => handleOption1Change(!selectedOption1)}>
                    <View >
                        <Checkbox.Item
                            label="Divulgación de Información personal"
                            status={selectedOptionMini === 'Divulgación de Información personal' ? 'checked' : 'unchecked'}
                            onPress={() => handleOptionMiniChange('Divulgación de Información personal')}
                            color="#429EBD"
                        />
                        <Checkbox.Item
                            label="Spam"
                            status={selectedOptionMini === 'Spam' ? 'checked' : 'unchecked'}
                            onPress={() => handleOptionMiniChange('Spam')}
                            color="#429EBD"
                        />
                        <Checkbox.Item
                            label="Odio y Acoso"
                            status={selectedOptionMini === 'Odio y Acoso' ? 'checked' : 'unchecked'}
                            onPress={() => handleOptionMiniChange('Odio y Acoso')}
                            color="#429EBD"
                        />
                    </View>
                </List.Accordion>

                {selectedOptionMini != "" ?
                    <View>
                        <Text style={{ flexDirection: "row", fontSize: 20, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 5, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                            Escribe el motivo <Text style={{ color: "red" }}>
                                *
                            </Text>
                        </Text>

                        <View>
                            < Text style={{ marginHorizontal: 20, marginVertical: 10, color: "#909090" }}>
                                Por favor escribe tantos detalles como sean posible.
                            </Text>
                            <TextInput
                                placeholderTextColor="black"
                                value={motivo}
                                onChangeText={(text) => setMotivo(text)}
                                style={{
                                    marginRight: 20,
                                    marginLeft: 20,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 10,
                                    color: "#000", backgroundColor: isModalVisible ? "#8D8D8D" : "#f8f8f8"
                                }}
                                numberOfLines={2}
                                multiline={true}
                            ></TextInput></View>

                        <View
                            style={{
                                display: "flex",
                                backgroundColor: "white",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <TouchableOpacity
                                testID="buttonEnviar"
                                style={styles.buttonEnviar}
                                onPress={() => enviarReporte()}
                                disabled={(motivo.length == 0 || motivo.trim().length == 0)}
                            >
                                <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                                    Enviar
                                </Text>
                            </TouchableOpacity>
                        </View></View> : <View></View>
                }
            </ScrollView>

        </SafeAreaView >


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
    }, fontTitulo: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        marginVertical: 30,
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    buttonEnviar: {

        width: "50%",
        marginTop: 10,
        backgroundColor: "#E39801",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.8,
        shadowRadius: 6.00,
        elevation: 15,

        padding: 12,
        borderRadius: 20,
        alignItems: "center",
        marginBottom: 15,

    }

});
export default ReportarAutorScreen