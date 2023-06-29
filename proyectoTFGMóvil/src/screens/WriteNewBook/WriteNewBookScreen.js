import {
  SafeAreaView, StyleSheet, Text, View, BackHandler, TouchableOpacity, ImageBackground, Modal, StatusBar, ScrollView, Image, TextInput, FlatList, LogBox
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import LottieView from 'lottie-react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { crearLibroStorage } from "../../hooks/Storage";
import { cambiarPortadadeLibro, crearLibroFirebase } from "../../hooks/FirebaseLibros";
import { getCategorias } from "../../hooks/CategoriasFirebase";
import { getUserAuth } from "../../hooks/Auth/Auth";
import { pickImage } from "../../utils/ImagePicker";
import DropDownPicker from "react-native-dropdown-picker";

function WriteNewBookScreen() {
  //ETIQUETAS:
  const [etiquetas, setEtiquetas] = React.useState([]);
  const [value, setValue] = React.useState([]); // Multiple
  const [categoriasFirebase, setCategoriasFirebase] = React.useState([]); // Multiple
  const [textoEtiqueta, setTextoEtiqueta] = useState("");

  const navigation = useNavigation();
  const [image, setImage] = useState("https://leadershiftinsights.com/wp-content/uploads/2019/07/no-book-cover-available.jpg");
  const [email, setEmail] = useState("");
  const [tituloLibro, setTituloLibro] = useState("");
  const [descripcionLibro, setDescripcionLibro] = useState("");

  //CATEGORIAS:


  const [estadoOpen, setEstadoOpen] = useState(false);



  //MODALES
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisibleTitulo, setModalVisibleTitulo] = useState(false);
  const [isModalVisibleImagen, setModalVisibleImagen] = useState(false);
  const [isModalVisibleCategoria, setModalVisibleCategoria] = useState(false);
  const [isModalVisibleDescripcion, setModalVisibleDescripcion] = useState(false);

  useEffect(() => {
    setModalVisible(false);
    fetchData();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
    BackHandler.addEventListener('hardwareBackPress', goBack);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', goBack);
  }, [email]);


  const goBack = () => {
    navigation.replace("write");
  }

  const pickImageF = async () => {
    let image = await pickImage();
    if (image != undefined) {
      setImage(image);
    }
    else {
      setImage("https://leadershiftinsights.com/wp-content/uploads/2019/07/no-book-cover-available.jpg")
    }
  };

  const contarPalabrasDescipcion = (texto, length) => {
    if (texto.length < length) {
      setDescripcionLibro(texto)
    }
  }

  const contarPalabrasEtiqueta = (texto, length) => {
    if (texto.length < length) {
      setTextoEtiqueta(texto)
    }
  }

  const añadirEtiquetas = async (texto) => {
    if (texto.length != 0 && texto.trim().length != 0) {
      setModalVisible(true);
      setEtiquetas([...etiquetas, texto])
      setTextoEtiqueta("");

      setModalVisible(false);
    }
  }

  const eliminarEtiquetas = (texto) => {
    setModalVisible(true);

    for (let i = 0; i < etiquetas.length; i++) {
      if (etiquetas[i] === texto) {
        etiquetas.splice(i, 1);
      }
    }
    setModalVisible(false);
  }

  const assertCrearLibroTitulo = () => {
    if (tituloLibro.length == 0 || tituloLibro.trim().length == 0) {
      setModalVisibleTitulo(true);
      return true;
    }
    return false;
  }
  const assertCrearLibroDescripcion = () => {
    if (descripcionLibro.length == 0 && descripcionLibro.trim().length == 0) {
      setModalVisibleDescripcion(true);
      return true;
    } else {
      return false;
    }
  }


  const assertCrearLibroCategoria = () => {

    if (value.length == 0) {
      setModalVisibleCategoria(true);
      return true;
    } else {
      return false;
    }
  }

  const cambiarEstadosPorNombre = () => {
    let categoria = [];
    let i;
    let j;
    for (i = 0; i < categoriasFirebase.length; i++) {
      for (j = 0; j < value.length; j++) {
        if (categoriasFirebase[i].value == value[j]) {
          categoria.push({
            Nombre: categoriasFirebase[i].value,
            Color: categoriasFirebase[i].color,
          });
        }

      }
    }

    return categoria;
  }
  const crearLibro = async () => {

    setModalVisible(true);
    if (!assertCrearLibroTitulo() && !assertCrearLibroDescripcion() && !assertCrearLibroCategoria()) {
      let categoria = cambiarEstadosPorNombre();
      let id = await crearLibroFirebase(tituloLibro, descripcionLibro, email, etiquetas, categoria);
      let urlPortada = await crearLibroStorage(image, email, id)
      await cambiarPortadadeLibro(id, urlPortada)

      navigation.navigate("writeChapter", {
        bookId: id,
      });

    }
    setModalVisible(false)
  }
  const fetchData = async () => {
    setEmail(await getUserAuth());
    setCategoriasFirebase(await getCategorias());
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);



  function renderEtiquetas(item, index) {
    return (
      <View
        style={{
          borderColor: "#8EAF20",
          marginHorizontal: 5,
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderWidth: 1,
          borderRadius: 15,

          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
          flexDirection: "row",
          backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "white"
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "black",
            fontWeight: "bold",
          }}
        >
          {item}
        </Text>
        <TouchableOpacity
          testID="buttonEliminarEtiqueta"
          style={{
            marginLeft: 10,

          }}
          onPress={() => eliminarEtiquetas(item)}
        >
          <AntDesign name="closecircleo" size={20} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (

    <SafeAreaView style={{
      flex: 1,
      backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "white"
    }}>

      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent
      >
        <View style={styles.modalAviso}>
          <LottieView style={styles.lottieModalWait}
            source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
          <Text style={styles.textWait}>Creando libro.....</Text>
        </View>
      </Modal>
      {isModalVisibleTitulo &&

        <Modal
          animationType="fade"
          isVisible={isModalVisibleTitulo}
          transparent
        >
          <View style={styles.modalAviso}>
            <AntDesign name="warning" size={35} color="#E39801" />
            <Text style={{
              marginVertical: 20,
              marginHorizontal: 20,
            }}>NO puedes dejar un libro sin título</Text>

            <TouchableOpacity
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
              onPress={e => setModalVisibleTitulo(!isModalVisibleTitulo)}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                Aceptar
              </Text>
            </TouchableOpacity>

          </View>
        </Modal>
      }

      <Modal
        backdropColor={'green'}
        backdropOpacity={1}
        animationType="fade"
        visible={isModalVisibleDescripcion}
        transparent>

        <View style={styles.modalAviso}>
          <AntDesign name="warning" size={35} color="#E39801" />
          <Text style={{
            marginVertical: 20,
            marginHorizontal: 20,
          }}>NO puedes dejar un libro sin descripción</Text>

          <TouchableOpacity
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
            onPress={e => setModalVisibleDescripcion(!isModalVisibleDescripcion)}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Aceptar
            </Text>
          </TouchableOpacity>

        </View>
      </Modal>

      {isModalVisibleImagen &&

        <Modal
          backdropColor={'green'}
          backdropOpacity={1}
          animationType="fade"
          isVisible={isModalVisibleImagen}
          transparent
        >

          <View style={styles.modalAviso}>
            <AntDesign name="warning" size={35} color="#E39801" />
            <Text style={{
              marginVertical: 20,
              marginHorizontal: 20,
            }}>NO puedes dejar un libro sin caratula</Text>

            <TouchableOpacity
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
              onPress={e => setModalVisibleImagen(!isModalVisibleImagen)}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                Aceptar
              </Text>
            </TouchableOpacity>

          </View>
        </Modal>
      }

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
            onPress={e => setModalVisibleCategoria(!isModalVisibleCategoria)}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
              Aceptar
            </Text>
          </TouchableOpacity>

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
          <TouchableOpacity testID="buttonGoBack" onPress={() => goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" style={{ marginTop: "auto", marginRight: 10, marginLeft: 10, }} />
          </TouchableOpacity>
          {/*nombre e inicio*/}
          <View>
            <Text style={styles.fontTitulo}>Nuevo libro</Text>
          </View>
        </View>
      </View>

      {/* Contenedor Principal*/}
      <ScrollView style={{ flexGrow: 0 }}>
        <View
          style={{
            flex: 1,
            marginVertical: 20,
            marginHorizontal: 30
          }}
        >

          {/* Portada del libro */}
          <View style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "60%" }}>
              Portada del libro
            </Text>

            {/* Imagenes Books nuevos blur */}
            <View
              style={{
                elevation: 12,
                position: "absolute",
                top: 120,
                borderRadius: 15,
                overflow: "hidden",
                opacity: 0.3,
              }}
            >
              <Image
                blurRadius={15}
                style={{ width: 130, height: 80 }}
                source={{ uri: `${image}` }}
              />
            </View>
            {/* Imagenes Books nuevos */}
            <TouchableOpacity
              testID="buttonPickImage"
              style={{
                marginHorizontal: 10,
              }}
              onPress={e => pickImageF()}
            >
              <ImageBackground
                source={{ uri: `${image}` }}
                style={{
                  width: 110,
                  height: 150,
                  borderRadius: 15,
                  overflow: "hidden",
                }}
              ></ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Titulo del libro*/}
          <View style={{ marginTop: 10, }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
              Título del libro
            </Text>
            <TextInput
              placeholder="Título"
              placeholderTextColor="black"
              value={tituloLibro}
              onChangeText={(text) => setTituloLibro(text)}
              style={{
                marginRight: 20,
                marginLeft: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                color: "#2B809C", backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "#f8f8f8"
              }}
            ></TextInput>
          </View>
          {/* Descripción del libro */}
          <View style={{ marginTop: 10, }}>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 10, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
              Descripción del libro
            </Text>
            <TextInput
              placeholder="Descripción"
              placeholderTextColor="black"
              value={descripcionLibro}
              onChangeText={(text) => contarPalabrasDescipcion(text, 500)}
              style={{
                marginRight: 20,
                marginLeft: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 10,
                color: "#2B809C", backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "#f8f8f8"
              }}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            ></TextInput>
            <Text style={{
              marginLeft: "80%"
            }}> {descripcionLibro.length}/500</Text>
          </View>

          {/* Categorías */}
          <View>
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 5, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
              Categorías
            </Text>
            <DropDownPicker
              style={{
                borderColor: "#8EAF20",
                height: 50,
                marginLeft: 50,
                width: "80%",
                marginTop: 10, backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "#f8f8f8"
              }}
              open={estadoOpen}
              value={value}
              items={categoriasFirebase}
              setOpen={setEstadoOpen}
              setValue={setValue}
              setItems={setCategoriasFirebase}
              placeholder="Seleccionar categorias"
              placeholderStyle={styles.placeholderStyles}
              dropDownContainerStyle={styles.dropDownContainerStyle}
              listMode="SCROLLVIEW"
              zIndex={3000}
              zIndexInverse={1000}
              multiple={true}
              min={1}
              max={3}
              mode="BADGE"
            />
            {/* Etiquetas */}
            <View>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", marginTop: 10, marginBottom: 5, borderBottomColor: "#8EAF20", borderBottomWidth: 3, width: "50%" }}>
                Etiquetas
              </Text>

              {/* Etiquetas explorar */}

              <View>
                <FlatList
                  contentContainerStyle={{ paddingTop: 5 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={etiquetas}
                  keyExtractor={(item, index) => {
                    return index.toString();
                  }}
                  renderItem={({ item, index }) => renderEtiquetas(item, index)}
                ></FlatList>
              </View>

              <TextInput
                placeholder="Etiqueta"
                placeholderTextColor="black"
                value={textoEtiqueta}
                onChangeText={(text) => contarPalabrasEtiqueta(text, 50)}
                style={{
                  marginRight: 20,
                  marginLeft: 20,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                  borderRadius: 10,
                  color: "#2B809C", backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria ? "#8D8D8D" : "#f8f8f8"
                }}
              ></TextInput>
              <Text style={{
                marginLeft: "80%"
              }}> {textoEtiqueta.length}/50</Text>
              <TouchableOpacity
                testID="buttonAñadirEtiquetas"
                style={{
                  marginHorizontal: 10,
                  width: "50%",
                  borderRadius: 20,
                  alignItems: "center",
                  backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria  ? "#8D8D8D" : "#E39801",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 12,
                  },
                  shadowOpacity: 0.8,
                  shadowRadius: 6.00,
                  elevation: 5,
                }}
                onPress={() => añadirEtiquetas(textoEtiqueta)}
              >
                <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                  Añadir etiqueta
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              testID="buttonSiguiente"
              style={{
                width: "50%",
                marginTop: 25,
                padding: 12,
                borderRadius: 20,
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: isModalVisible || isModalVisibleDescripcion || isModalVisibleTitulo || isModalVisibleCategoria  ? "#8D8D8D" : "#E39801",

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 1,
                },
                shadowOpacity: 0.8,
                shadowRadius: 6.00,
                elevation: 5,
              }}
              onPress={e => crearLibro()}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold", color: "white" }}>
                Crear libro
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#2B809C",
    borderBottomRightRadius: 500,
    height: 70,

  },
  textWait: {
    marginBottom: 10,
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto"
  },
  lottieModalWait: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    height: '100%',
    width: '100%'
  },
  fontTitulo: {
    paddingTop: 10,
    fontWeight: "bold",
    color: "white",
    fontSize: 25,
  },
  containerPrincipal: {
    backgroundColor: "white",
  },
  modalContainer: {
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: 'center',
    height: '100%', width: '100%',
  },
  modalView: {
    flexDirection: 'row',
    justifyContent: 'center', alignItems: 'center',
    top: 100,
    width: '85%', height: 50,
    backgroundColor: 'white',
    borderRadius: 8
  },
  textStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 12,
    marginLeft: 20
  },
  dropdown: {
    borderColor: "#8EAF20",
    width: "80%",
  },
  dropDownContainerStyle: {
    borderColor: "#8EAF20",
    width: "70%",

  },
  placeholderStyles: {
    color: "grey",
  },
  viewEtiquetas: {

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
});
export default WriteNewBookScreen