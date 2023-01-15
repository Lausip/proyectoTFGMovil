import { View, LogBox, Text, BackHandler, ScrollView, SafeAreaView, StyleSheet, Modal, StatusBar, TouchableOpacity, Image, ImageBackground, TextInput, FlatList } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config/firebase';
import LottieView from 'lottie-react-native';
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { cargarDatosLibro, cambiarTitulo, cambiarDescripcion, publicarCapituloDelLibro, cambiarCategoria, cambiarPortadadeLibro, getCategoriasLibro, eliminarLibroFirebase, eliminarCapituloLibro, añadirEtiqueta, eliminarEtiqueta, cambiarFechaModificaciónLibro, cambiarEstado } from '../../hooks/FirebaseLibros';
import { crearLibroStorage } from '../../hooks/Storage';
import { getUserAuth } from "../../hooks/Auth/Auth";
import { pickImage } from "../../utils/ImagePicker";
import DropDownPicker from "react-native-dropdown-picker";
import { getCategorias } from "../../hooks/CategoriasFirebase";

function EditBookScreen({ route }) {

    const [email, setEmail] = useState("");
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [portada, setPortada] = useState("");
    const [capitulos, setCapitulos] = useState([]);
    const [libroActual, setLibroActual] = useState({});

    //ETIQUITAS
    const [textoEtiqueta, setTextoEtiqueta] = useState("");
    const [etiquetas, setEtiquetas] = useState([]);

    const [estadoOpen, setEstadoOpen] = useState(false);
    const [estadoValue, setEstadoValue] = useState(null);

    //CATEGORIAS:
    const [categoriaOpen, setCategoriaOpen] = useState(false);
    const [categoriasLibroFirebase, setCategoriasLibroFirebase] = useState([]);
    const [categoriasFirebase, setCategoriasFirebase] = useState([]);
    //MODALES:
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleBorrar, setModalVisibleBorrar] = useState(false);
    const [isModalVisibleCategoria, setModalVisibleCategoria] = useState(false);
    const [isModalVisibleTitulo, setModalVisibleTitulo] = useState(false);
    const [isModalVisibleDescripcion, setModalVisibleDescripcion] = useState(false);
    const navigation = useNavigation();
    const { bookId } = route.params;


    const [estado, setEstado] = useState([
        { label: "En Curso", value: "En Curso" },
        { label: "Finalizado", value: "Finalizado" },
        { label: "Discontinuado", value: "Discontinuado" },
    ]);
    useEffect(() => {

        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
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

    const cargarCategorias = async () => {
        setModalVisible(true)
        let cat=await getCategoriasLibro(bookId);
        let categorias=[];
        for(let i=0;i<cat.length;i++){
            categorias.push(cat[i].Nombre)
        }
        setCategoriasLibroFirebase(categorias);

        setCategoriasFirebase(await getCategorias())

        setModalVisible(false)
    }

    const cargarLibro = async () => {
        let e = await getUserAuth();
        setEmail(e);
        let data = await cargarDatosLibro(bookId)
        setLibroActual(data);
        setTexto(data.Descripción)
        setTitulo(data.Titulo)
        setPortada(data.Portada);
        if (data.Etiquetas != undefined) {
            setEtiquetas(data.Etiquetas);
        }

        cargarCategorias();
        setEstadoValue(data.Estado)
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
        if (!assertActualizarLibroTitulo()) {
            setModalVisible(true)
            await cambiarTitulo(bookId, titulo)
            setModalVisible(false)
        }
    }

    const eliminarLibro = async () => {
        setModalVisible(true);
        await eliminarLibroFirebase(bookId);
        setModalVisible(false);
        setModalVisibleBorrar(false);
        handleWrite();
    }

    const assertActualizarLibroTitulo = () => {

        if (titulo.length == 0 || titulo.trim().length == 0) {

            setModalVisibleTitulo(true);
            return true;
        }
        return false;
    }
    const assertActualizarLibroDescripcion = () => {
        console.log(texto)
        if (texto.length == 0 || texto.trim().length == 0) {
            setModalVisibleDescripcion(true);
            return true;
        }
        return false;
    }

    const contarPalabrasEtiqueta = (texto, length) => {
        if (texto.length < length) {
            setTextoEtiqueta(texto)
        }
    }

    const añadirEtiquetas = async (texto) => {
        if (texto.length != 0 || texto.trim().length != 0) {
            setModalVisible(true);
            etiquetas.push(
                texto
            );
            setTextoEtiqueta("");
            await añadirEtiqueta(bookId, texto);

            setModalVisible(false);
        }
    }

    const eliminarEtiquetas = async (texto) => {
        setModalVisible(true);
        console.log(texto)
        let e = etiquetas.filter(function (obj) {
            return obj !== texto;
        })
        setEtiquetas(e);
        await eliminarEtiqueta(bookId, texto);
        setModalVisible(false);
    }

    const actualizarDescripcion = async () => {
        if (!assertActualizarLibroDescripcion()) {
            setModalVisible(true)
            await cambiarDescripcion(bookId, texto)
            setModalVisible(false)
        }
    }
    const updateEstado = async () => {
        setModalVisible(true)
        await cambiarEstado(bookId, estadoValue);
        setModalVisible(false)
    }

    const updateCategoria = async () => {
        setModalVisible(true)
        let categoria = [];
        let i, j;
        for (i = 0; i < categoriasFirebase.length; i++) {
            for (j = 0; j < categoriasLibroFirebase.length; j++) {
                if (categoriasFirebase[i].value == categoriasLibroFirebase[j]) {
                    categoria.push({
                        Nombre: categoriasFirebase[i].value,
                        Color: categoriasFirebase[i].color,
                    });
                }
            }
        }
        await cambiarCategoria(bookId, categoria)
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
    function renderCategorias(item, index) {
        return (
            <View style={styles.viewCategorias}>
                <Text
                    style={{ fontSize: 13, color: "black", fontWeight: "bold" }}>
                    {item}
                </Text>
                <TouchableOpacity
                    style={{
                        marginLeft: 10,

                    }}
                    onPress={e => eliminarEtiquetas(item)}
                >
                    <AntDesign name="closecircleo" size={20} color="black" />
                </TouchableOpacity>
            </View>
        );
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
                transparent>
                <View style={styles.modalWait}>
                    <LottieView style={styles.lottieModalWait}
                        source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
                    <Text style={styles.textWait}>Cargando.....</Text>
                </View>
            </Modal>


            <Modal
                animationType="fade"
                visible={isModalVisibleTitulo}
                transparent>
                <View style={styles.modalAviso}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={styles.textoAviso}>
                        NO puedes dejar un libro sin titulo</Text>
                    <TouchableOpacity style={{
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
                        onPress={e => setModalVisibleTitulo(false)}>
                        <Text style={styles.textoAvisoButton}>
                            Aceptar
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>
            <Modal
                animationType="fade"
                visible={isModalVisibleDescripcion}
                transparent
            >
                <View style={styles.modalAviso}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={styles.textoAviso}>
                        NO puedes dejar un libro sin descripción</Text>
                    <TouchableOpacity style={{
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
                        onPress={e => setModalVisibleDescripcion(false)}>
                        <Text style={styles.textoAvisoButton}>
                            Aceptar
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>
            <Modal
                animationType="fade"
                visible={isModalVisibleBorrar}
                transparent
            >
                <View style={styles.modalWait}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={styles.textoAviso}>¿Seguro que quieres borrar {titulo} ?</Text>
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
                                backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#E39801",
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
                            <Text style={styles.textoAvisoButton}>
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
                                backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#B00020",

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
                            <Text style={styles.textoAvisoButton}>
                                Borrar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="fade"
                visible={isModalVisibleCategoria}
                transparent
            >

                <View style={styles.modalAviso}>
                    <AntDesign name="warning" size={35} color="#E39801" />
                    <Text style={{
                        marginVertical: 20,
                        marginHorizontal: 20,
                    }}>NO puedes dejar un libro sin categoría</Text>

                    <TouchableOpacity
                        style={{
                            width: "50%",
                            padding: 12,
                            borderRadius: 20,
                            alignItems: "center",
                            marginLeft: "auto",
                            marginRight: "auto",
                            backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#B00020",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.8,
                            shadowRadius: 6.00,
                            elevation: 15,
                        }}
                        onPress={e => setModalVisibleCategoria(!isModalVisibleCategoria)}
                    >
                        <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                            Aceptar
                        </Text>
                    </TouchableOpacity>

                </View>
            </Modal>
            {/* Head */}
            <StatusBar
                translucent={false}
                backgroundColor="white"
                barStyle="dark-content"
            />
            {/* Head Cosas */}
            <View style={styles.viewHead}>
                <TouchableOpacity onPress={() => handleWrite()}>
                    <Ionicons name="arrow-back" size={30} color="white" style={{ marginLeft: 20 }} />
                </TouchableOpacity>
                {/*nombre e inicio*/}
                <Text style={styles.fontTitulo}>Editar el libro</Text>
            </View>

            <View>
                <ScrollView style={{ flexGrow: 0, marginBottom: 70, }}>

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
                        <Text style={styles.tituloBorder}>
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
                                color: "black", backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#f8f8f8"
                            }}
                        ></TextInput>
                        <TouchableOpacity
                            style={{
                                width: "50%",
                                marginTop: 10,
                                backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#E39801",
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
                                marginHorizontal: 10,
                            }}
                            onPress={e => actualizarTexto()}
                        >
                            <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                                Actualizar
                            </Text>
                        </TouchableOpacity>
                        {/* Descripción del libro*/}
                        <Text style={styles.tituloBorder}>
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
                                color: "black", backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#f8f8f8",
                                textAlign: 'justify'
                            }}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        ></TextInput>
                        <TouchableOpacity
                            style={{
                                width: "50%",
                                marginTop: 10,
                                backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#E39801",
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
                                marginHorizontal: 10,
                            }}
                            onPress={e => actualizarDescripcion()}
                        >
                            <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                                Actualizar
                            </Text>
                        </TouchableOpacity>
                    </View >
                    {/* Categorías */}

                    <Text style={styles.tituloBorder}>
                        Categorías
                    </Text>
                    <DropDownPicker
                        style={{
                            borderColor: "#8EAF20",
                            height: 50,
                            marginLeft: 50,
                            width: "80%",
                            marginTop: 10, backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#f8f8f8"
                        }}
                        open={categoriaOpen}
                        value={categoriasLibroFirebase}
                        items={categoriasFirebase}
                        setOpen={setCategoriaOpen}
                        setValue={setCategoriasLibroFirebase}
                        setItems={setCategoriasFirebase}
                        placeholder="Seleccionar categorias"
                        placeholderStyle={styles.placeholderStyles}
                        dropDownContainerStyle={styles.dropDownContainerStyle}
                        zIndex={3000}
                        zIndexInverse={1000}
                        multiple={true}
                        min={1}
                        max={3}
                        mode="BADGE"

                    />
                    <TouchableOpacity
                        style={{
                            width: "40%",
                            marginTop: 10,
                            backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#E39801",
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
                            marginHorizontal: 10,
                        }}
                        onPress={e => updateCategoria()}
                    >
                        <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                            Actualizar
                        </Text>
                    </TouchableOpacity>
                    {/* Etiquetas */}
                    <View style={{ marginHorizontal: 40 }}>
                        <Text style={styles.tituloBorder}>
                            Etiquetas
                        </Text>

                        {/* Etiquetas explorar */}

                        <FlatList
                            contentContainerStyle={{ paddingTop: 5 }}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={etiquetas}
                            keyExtractor={(item, index) => {
                                return index.toString();
                            }}
                            renderItem={({ item, index }) => renderCategorias(item, index)}
                        ></FlatList>

                        <TextInput
                            placeholder="Título "
                            placeholderTextColor="black"
                            value={textoEtiqueta}
                            onChangeText={(text) => contarPalabrasEtiqueta(text, 50)}
                            style={{
                                marginRight: 20,
                                marginLeft: 20,
                                paddingHorizontal: 20,
                                paddingVertical: 5,
                                borderRadius: 10,
                                color: "#429EBD", backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#f8f8f8"
                            }}
                        ></TextInput>
                        <Text style={{
                            marginLeft: "80%"
                        }}> {textoEtiqueta.length}/50</Text>
                        <TouchableOpacity
                            style={{
                                width: "50%",
                                marginTop: 10,
                                backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#E39801",
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
                                marginHorizontal: 10,
                            }}
                            onPress={e => añadirEtiquetas(textoEtiqueta)}
                        >
                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                                Añadir etiqueta
                            </Text>
                        </TouchableOpacity>
                    </View>


                    {/* Estado de libros */}
                    <Text style={styles.tituloBorder}>
                        Estado
                    </Text>
                    <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                        {libroActual.Estado}
                    </Text>
                    <DropDownPicker
                        style={{
                            borderColor: "#8EAF20",
                            height: 50,
                            marginLeft: 50,
                            width: "80%",
                            marginTop: 10, backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#f8f8f8"
                        }}
                        open={estadoOpen}
                        value={estadoValue} //genderValue
                        items={estado}
                        setOpen={setEstadoOpen}
                        setValue={setEstadoValue}
                        setItems={setEstado}
                        placeholder={estadoValue}
                        placeholderStyle={styles.placeholderStyles}
                        dropDownContainerStyle={styles.dropDownContainerStyle}
                        scrollViewProps={{
                            decelerationRate: "fast"
                        }}
                        zIndex={3000}
                        zIndexInverse={1000}
                        onChangeValue={(value) => updateEstado()}

                    />

                    {/* Capitulos */}
                    <Text style={styles.tituloBorder}>
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
                            backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "white",
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
                            backgroundColor: isModalVisible || isModalVisibleBorrar || isModalVisibleDescripcion || isModalVisibleTitulo ? "#8D8D8D" : "#B00020",
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
                        onPress={e => setModalVisibleBorrar(true)}>
                        <Text style={{ fontSize: 15, color: "white", margin: "auto" }}>
                            Borrar libro
                        </Text>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </SafeAreaView >


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

    dropDownContainerStyle: {
        borderColor: "#8EAF20",
        width: "70%",
        marginHorizontal: 40,
    },
    placeholderStyles: {
        color: "grey",
    },
    modalWait: {
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
    modalAviso: {
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
    viewCategorias: {
        borderColor: "#8EAF20",
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
    },
    viewHead: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#429EBD",
        borderBottomRightRadius: 500,
        height: 70,
    },
    tituloBorder: {
        marginHorizontal: 40,
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginTop: 10,
        marginBottom: 10,
        borderBottomColor: "#8EAF20",
        borderBottomWidth: 3,
        width: "50%"
    },
    textoAviso: {
        marginVertical: 20,
        marginHorizontal: 20,
    },
    textoAvisoButton: {
        fontSize: 15,
        fontWeight: "bold",
        color: "white"
    }

});
export default EditBookScreen