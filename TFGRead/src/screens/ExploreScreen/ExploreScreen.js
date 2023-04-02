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
import { getFotoPerfil, handleAutores } from "../../hooks/Auth/Firestore";
import { getUserAuth } from "../../hooks/Auth/Auth";
import { cargarDatosLibros, cargarDatosLibrosFiltro } from "../../hooks/FirebaseLibros";
import { getCategorias } from "../../hooks/CategoriasFirebase";

function ExploreScreen({ route }) {

  const navigation = useNavigation();

  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [categoriasFiltro, setCategoriasFiltro] = useState([]);
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [textoBusqueda2, setTextoBusqueda2] = useState("");
  const [email, setEmail] = useState("");
  const [tag, setTag] = useState("Titulo");
  const [categoriaPulsada, setCategoriaPulsada] = useState("");

  const [isModalTagsVisible, setModalTagsVisible] = useState(false);
  const [isModalTagsCategoriaVisible, setModalTagsCategoriaVisible] = useState(false);
  const [isModalTagsCategoriaVisibleSeleccionada, setModalTagsCategoriaVisibleSeleccionada] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);


  const [lastItemId, setLastItemId] = useState("");

  const [lastItemIdEtiqueta, setLastItemIdEtiqueta] = useState("");
  const [lastItemIdCategoria, setLastItemIdCategoria] = useState("");
  const [lastItemIdTitulo, setLastItemIdTitulo] = useState("");
  const categorias = ["Libros", "Autores"];
  const filtros = ["Titulo", "Etiqueta", "Categoría"];


  const [seleccionadoCategoriaIndex, setSeleccionadoCategoriaIndex] = useState(0);

  useEffect(() => {

    const unsubscribe = navigation.addListener('focus', () => {
      hacerCosas();
    });
    return unsubscribe;
  }, [email, route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });

  }, []);

  const goAutorProfile = (autorPulsado) => {
    navigation.replace("autorScreen", {
      autorElegido: autorPulsado,
      screen: "explore",
    });
  }

  const handleProfile = () => {
    navigation.navigate("profileScreen", {
      screen: "explore",
    });
  }

  const cargarCategorias = async (index) => {

    setModalVisible(true)
    setSeleccionadoCategoriaIndex(index);
    if (index == 0) {
      await cargarLibros("");
      setAutores([]);
    }
    else {
      await cargarAutores();
      setLibros([]);
    }
    setModalVisible(false)
  };

  const cargarMasLibros = async () => {

    if (textoBusqueda2 != "") {
      setModalVisible(true)
      if (tag == "Etiqueta") {
        let array = await cargarDatosLibrosFiltroFunction(textoBusqueda2, lastItemIdEtiqueta, "Etiqueta");
        if (array[1] != "") {
          setLastItemIdEtiqueta(array[1]);
          let booksFinal = [...libros, ...array[0]];
          setLibros(booksFinal);
          setLastItemId("");
          setLastItemIdTitulo("");
          setLastItemIdCategoria("")
        }
      }
      if (tag == "Titulo") {
        let array = await cargarDatosLibrosFiltroFunction(textoBusqueda2, lastItemIdTitulo, "Titulo");
        if (array[1] != "") {
          setLastItemIdTitulo(array[1]);
          let booksFinal = [...libros, ...array[0]];
          setLibros(booksFinal);
          setLastItemId("");
          setLastItemIdEtiqueta("");
          setLastItemIdCategoria("")
        }

      }
      else {
        let array = await cargarDatosLibrosFiltroFunction(textoBusqueda2, lastItemIdEtiqueta, "Categoría");
        if (array[1] != "") {
          setLastItemIdEtiqueta(array[1]);
          let booksFinal = [...libros, ...array[0]];
          setLibros(booksFinal);
          setLastItemId("");
          setLastItemIdTitulo("");

        }
      }
      setModalVisible(false)
    }

    if (textoBusqueda2 == "" ) {
      await cargarLibros(lastItemId);
    }
   


  }

  const cargarLibros = async (lastItem) => {

    setModalVisible(true)

    let array = await cargarDatosLibros(lastItem);
    if (lastItem != "") {
      let booksFinal = [...libros, ...array[0]];
      setLastItemId(array[1]);
      setLibros(booksFinal);
      setLastItemIdTitulo("");
      setLastItemIdEtiqueta("");
      setLastItemIdCategoria("")
    } else {
      setLastItemId(array[1]);
      setLibros(array[0]);
      setLastItemIdTitulo("");
      setLastItemIdEtiqueta("");
      setLastItemIdCategoria("")
    }
    setModalVisible(false)
  };

  const cargarDatosLibrosFiltroFunction = async (textoBusqueda, lastItem, filtro) => {
    if (filtro == "Etiqueta") {
      return await cargarDatosLibrosFiltro(textoBusqueda, lastItem, "Etiqueta");
    }
    if (filtro == "Titulo") {
      return await cargarDatosLibrosFiltro(textoBusqueda, lastItem, "Titulo");

    }
    if (filtro == "Categoría") {
      return await cargarDatosLibrosFiltro(categoriaPulsada, lastItem, "Categoría");

    }
  };

  const cargarAutores = async () => {
    let autoresT = await handleAutores();
    setAutores(autoresT);
  };

  const getTags = () => {
    if (tag == "Categoría") {
      setModalTagsCategoriaVisibleSeleccionada(true)
      setModalTagsCategoriaVisible(true)
    }
    else {
      setModalTagsCategoriaVisibleSeleccionada(false)
      setModalTagsCategoriaVisible(false)
    }
    setModalTagsVisible(!isModalTagsVisible)
  }

  //FILTRAR
  const getFiltrado = async () => {
    let textoB = textoBusqueda;
    setTextoBusqueda2(textoB)
    //Buscar vacío
    if (textoB != "") {
      if (seleccionadoCategoriaIndex == 0) {
        setModalVisible(true)
        //Buscar por título
        if (tag == "Titulo") {
          let array = cargarDatosLibrosFiltro(textoB, "", "Titulo");
          setLastItemIdTitulo(array[1]);
          setLibros(array[0]);
          setLastItemId("");
          setLastItemIdEtiqueta("");
          setLastItemIdCategoria("");
        }
        //Buscar por etiqueta
        if (tag == "Etiqueta") {

          let array = cargarDatosLibrosFiltro(textoB, "", "Etiqueta");
          setLastItemIdEtiqueta(array[1]);
          setLibros(array[0]);
          setLastItemId("");
          setLastItemIdTitulo("");
          setLastItemIdCategoria("")
        }
        setModalVisible(false)
      }
      //Buscar por Autor
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


  const hacerCosas = async () => {
    setModalVisible(true)
    setLibros([])
    setTag("Titulo");
    setTextoBusqueda("");
    setCategoriaPulsada("")
    setTextoBusqueda2("");
    setModalTagsCategoriaVisible(false)
    setModalTagsCategoriaVisibleSeleccionada(false)
    setCategoriasFiltro(await getCategorias())
    let e = await getUserAuth();
    setEmail(e);
    let perfil = await getFotoPerfil(e);
    setFotoPerfil(perfil);
    cargarCategorias(0);

  }

  const clickTag = (item) => {

    if (item == "Categoría") {
      setModalTagsCategoriaVisible(true);
    }
    else {
      setModalTagsCategoriaVisible(false);
      setModalTagsCategoriaVisibleSeleccionada(false)
      setCategoriaPulsada("")
    }

    setTag(item)
    setModalTagsVisible(false)
  }

  const clickCategoriaFiltro = async (item) => {
    setModalVisible(true)
    setCategoriaPulsada(item)
    setModalTagsCategoriaVisibleSeleccionada(true)
    setModalTagsCategoriaVisible(false)
    setModalTagsVisible(false)
    let array = await cargarDatosLibrosFiltro(item, "", "Categoría");
    setLastItemIdCategoria(array[1]);
    setLibros(array[0]);
    setLastItemId("");
    setLastItemIdTitulo("");
    setLastItemIdEtiqueta("")

    setModalVisible(false)


  }
  const RenderCategoriaPulsada = () => {
    return (
      <View
        style={{
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 15,
          backgroundColor: `${categoriaPulsada.color}`,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginRight: 5,
          marginLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#f8f8f8",
            fontWeight: "bold",
          }}
        >
          {categoriaPulsada.label}
        </Text>

      </View>
    );
  }
  const RenderEtiquetaPulsada = () => {
    return (
      <View
        style={{
          borderColor: "#429EBD",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 15,
          backgroundColor: "#429EBD",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          marginRight: 5,
          marginLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: 13,
            color: "#f8f8f8",
            fontWeight: "bold",
          }}
        >
          {tag}
        </Text>

      </View>
    );
  }

  const RenderCategoriaFiltro = () => {
    return (
      <View>
        <FlatList
          contentContainerStyle={{ marginTop: 20, marginHorizontal: 5 }}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categoriasFiltro}
          keyExtractor={(item, index) => {
            return index.toString();
          }}
          renderItem={({ item, index }) => <RenderCategoriaFiltro2 categoria={item} key={index} />}
        ></FlatList>
      </View>
    );
  }
  const RenderTags = () => {
    return (
      <View style={{
        marginTop: 10,
        marginHorizontal: 20,
      }}>
        <View style={{
          justifyContent: "center",
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          <FlatList
            contentContainerStyle={{ paddingLeft: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={filtros}
            renderItem={({ item, index }) =>
              <TouchableOpacity
                testID="buttonclickTag"
                disabled={item == tag}
                style={{
                  marginTop: 10,
                  borderColor: "#429EBD",
                  marginHorizontal: 5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderRadius: 15,
                  backgroundColor: item == tag ? "#429EBD" : "#f8f8f8",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 10,
                  flexDirection: "row"
                }}
                onPress={() => clickTag(item)}
              >
                <Text
                  style={{
                    fontSize: 13,
                    color: item == tag ? "#f8f8f8" : "black",
                    fontWeight: "bold",
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            }

          ></FlatList>
        </View>
      </View>
    );
  }
  const RenderCategoriaFiltro2 = ({ categoria }) => {
    return (
      <TouchableOpacity testID="buttonclickCategoriaFiltro" onPress={() => clickCategoriaFiltro(categoria)} style={{
        marginHorizontal: 5
      }}>

        {/* Imagenes Categorias*/}

        <ImageBackground
          style={{
            width: 95,
            height: 35,
            borderRadius: 15,
            overflow: "hidden",
            backgroundColor: `${categoria.color}`,
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
            {categoria.label}
          </Text>
        </ImageBackground>

      </TouchableOpacity>
    );
  };

  const RenderCategorias = () => {
    return (
      <View style={styles.renderCategoriaMisLibros}>
        {categorias.map((item, index) => (
          <TouchableOpacity
            testID="buttonCargarCategorias"
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

  function RenderCategoria(item, index) {
    return (
      <View style={{
        marginLeft: 2
      }}>
        {/* Imagenes Categorias*/}

        <ImageBackground
          style={{
            width: 60,
            height: 25,
            borderRadius: 15,
            overflow: "hidden",
            backgroundColor: `${item.Color}`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: "white",
              fontWeight: "bold",
            }}
          >
            {item.Nombre}
          </Text>
        </ImageBackground>

      </View>
    );
  }
  /* Autores */
  const CardAutores = ({ autor }) => {
    return (
      <TouchableOpacity testID="buttonGoAutorProfile"
        onPress={() => { goAutorProfile(autor.Nombre) }}
      >
        <View style={{
          marginVertical: 5,
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
        </View>
      </TouchableOpacity>
    );
  };

  const handleBook = (item) => {
    navigation.navigate("detailsBookScreen", {
      bookId: item.key,
    });
  }

  /* Books nuevos */
  const CardLibros = ({ libro }) => {
    return (
      <TouchableOpacity onPress={() => handleBook(libro)}>
        <View
          style={{
            marginVertical: 5,
            marginHorizontal: 20, marginBottom: 10, flexDirection: "row", borderRadius: 8,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.8,
            shadowRadius: 6.00,
            elevation: 15,

            backgroundColor: "white"
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

          <View style={{ marginTop: 15, marginBottom: 15, width: 230, alignItems: "center", backgroundColor: "white" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#429EBD" }}>
              {libro.Titulo}
            </Text>

            {/* Informacion capitulo*/}
            <View style={{
              flexDirection: "row", marginTop: 15, marginBottom: 20, alignItems: "center",

            }}>
              <Foundation name="page-multiple" size={20} color="#8EAF20" />
              <Text style={{ marginLeft: 5, fontSize: 12, color: "black" }}>
                {libro.NumCapitulo}
              </Text>

              <Entypo name="eye" size={20} color="black" style={{ marginLeft: 10, }} />
              <Text style={{ marginLeft: 5, fontSize: 12, color: "black" }}>
                {libro.NumSeguidores}
              </Text>

            </View>
            {/* Categorias explorar */}
            <FlatList
              contentContainerStyle={{}}
              horizontal
              showsHorizontalScrollIndicator={false}
              data={libro.Categorias}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              renderItem={({ item, index }) => RenderCategoria(item, index)}
            ></FlatList>

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
            source={require('../../../assets/animations/waitFunction.json')} autoPlay loop />
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
            <Text style={styles.fontEscribir}>Explorar</Text>
          </View>
        </View>
        {/*User*/}
        <TouchableOpacity testID="buttonHandleProfile" onPress={() => { handleProfile() }}>
          <Image
            source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
            style={{ width: 40, height: 40, borderRadius: 40 / 2, marginTop: 10 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainerBusqueda}>
        {/*Texto buqueda*/}
        <View style={styles.inputContainerTextBusqueda}>
          {/*Etiqueta puesta*/}
          {seleccionadoCategoriaIndex == 0 ?
            <RenderEtiquetaPulsada /> : <View></View>
          }
          {seleccionadoCategoriaIndex == 0 && isModalTagsCategoriaVisibleSeleccionada ?
            <RenderCategoriaPulsada /> : <View></View>
          }

          <TextInput
            placeholder={!(isModalTagsCategoriaVisibleSeleccionada || isModalTagsCategoriaVisible) ? "Busca historias,personas..." : ""}
            placeholderTextColor="black"
            value={textoBusqueda}
            editable={!(isModalTagsCategoriaVisibleSeleccionada || isModalTagsCategoriaVisible)}
            onChangeText={(text) => setTextoBusqueda(text)}
            style={styles.input}
          ></TextInput>
        </View>


        <TouchableOpacity testID="buttonFiltrado" style={{
          marginRight: "auto", right: 4, marginTop: "auto", padding: 11, borderRadius: 18, borderColor: "#E39801", shadowColor: "#000", shadowOffset: { width: 0, height: 12, }, shadowOpacity: 0.8, shadowRadius: 6.00, elevation: 15, borderWidth: 3, alignItems: "center", backgroundColor: isModalTagsCategoriaVisibleSeleccionada || isModalTagsCategoriaVisible ? "#EDEDED" : "white",
        }} disabled={isModalTagsCategoriaVisibleSeleccionada || isModalTagsCategoriaVisible} onPress={() => getFiltrado()}>
          <Entypo name="magnifying-glass" size={24} color="black" />
        </TouchableOpacity>


        {/* Botón Tag*/}
        {seleccionadoCategoriaIndex == 0 && isModalTagsVisible ?
          <TouchableOpacity testID="buttongetTagsPulsado" style={styles.buttonTagsPulsado} onPress={() => getTags()}>
            <AntDesign name="tags" size={24} color="white" />
          </TouchableOpacity> : <View></View>
        }

        {seleccionadoCategoriaIndex == 0 && !isModalTagsVisible ?
          <TouchableOpacity testID="buttongetTagsNoPulsado" style={styles.buttonTagsNoPulsado} onPress={() => getTags()}>
            <AntDesign name="tags" size={24} color="black" />
          </TouchableOpacity> : <View></View>
        }


      </View>
      {/* Apartado Tags */}
      {isModalTagsVisible &&
        <RenderTags />
      }
      {/*Etiqueta puesta*/}
      {seleccionadoCategoriaIndex == 0 && isModalTagsCategoriaVisible ?
        <RenderCategoriaFiltro /> : <View></View>
      }

      {/* Apartado Categorias */}
      <RenderCategorias />

      {
        libros.length == 0 && seleccionadoCategoriaIndex == 0 ?
          <View style={{ marginHorizontal: 30 }}  >
            <Image
              resizeMode={'center'}
              source={require("../../../assets/NoLibros.png")}
              style={styles.image}
            />
            <Text style={styles.textImage}>No se han encontrado libros......</Text>
          </View> : <View></View>
      }


      {seleccionadoCategoriaIndex == 0 &&

        <FlatList
          testID="flatlistbooks"
          style={{ backgroundColor: "white", marginHorizontal: 5, borderRadius: 20, }}
          keyExtractor={(item, index) => index}
          data={libros}
          renderItem={({ item, index }) => (
            <CardLibros key={index} libro={item} />
          )}
          onEndReached={() => cargarMasLibros()}
          onEndReachedThreshold={0.1}
        />

        || seleccionadoCategoriaIndex == 1 &&

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
                  source={require("../../../assets/NoAuthor.png")}
                  style={styles.image}
                />
                <Text style={styles.textImage}>No hay autores......</Text>
              </View>
          }
        </View>
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
    marginHorizontal: 20
  },
  inputContainerTextBusqueda: {
    marginTop: 20,
    marginLeft: "auto",
    marginRight: "auto",
    justifyContent: "center",
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    width: 230,
    height: 50,
    flexDirection: "row"
  },
  input: {
    color: "black",
  },

  buttonTagsNoPulsado: {
    marginRight: "auto",
    marginTop: "auto",
    backgroundColor: "white",
    padding: 7,
    borderRadius: 16,
    borderColor: "#E39801",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.00,
    elevation: 15,
    borderWidth: 3,
    alignItems: "center",
  },
  buttonTagsPulsado: {
    marginRight: "auto",
    marginTop: "auto",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#E39801",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6.00,
    elevation: 15,
    alignItems: "center",
  },
  categoriaText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  image: {
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 30,
    height: 200,
    width: 280,
  },
  textImage: {
    marginTop: 30,
    marginLeft: "auto",
    marginRight: "auto",
    fontSize: 15,

  },
});
export default ExploreScreen;