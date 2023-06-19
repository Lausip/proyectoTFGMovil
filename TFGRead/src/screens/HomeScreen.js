import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Modal,
  StatusBar, LogBox
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons, Foundation, Entypo, AntDesign } from '@expo/vector-icons';
import { getUserAuth } from "../hooks/Auth/Auth";
import LottieView from 'lottie-react-native';
import { getFotoPerfil, cargarUltimoLibro, cambiarUltimoLibroLeido, cargarFirebase } from "../hooks/Auth/Firestore";
import Carousel, { Pagination } from 'react-native-snap-carousel-expo-46-compatible';
import { cargarHotBook, cargarRecomendadoBook } from "../hooks/FirebaseLibros";
import { ScrollView } from "react-native-gesture-handler";


function HomeScreen() {
  const [fotoPerfil, setFotoPerfil] = React.useState("");
  const [newBooks, setNewBooks] = React.useState([]);


  const [capitulosLeido, setCapitulosLeido] = React.useState(4);
  const [recomendadoBooks, setRecomendadoBooks] = React.useState([]);
  const [ultimoLibro, setUltimoLibro] = React.useState({});


  const [email, setEmail] = React.useState();
  const [ultimoCapituloLeido, setUltimoCapituloLeido] = React.useState(4);
  const [hotBooks, setHotBooks] = React.useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [index, setIndex] = React.useState(1)
  //Para que reenderize al volver a esta página el ultimo libro
  const isFocused = useIsFocused();
  const isCarousel = React.useRef(null)
  useEffect(() => {
    isFocused && hacerCosas();
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
  }, [isFocused]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  },);


  const handleProfile = () => {
    navigation.navigate("profileScreen", {
      screen: "home",
    });
  }

  const handleNotificacion = () => {
    navigation.navigate("notificacionScreen", {
      screen: "home",
    });
  }

  const handleBook = (item) => {
    navigation.navigate("detailsBookScreen", {
      bookId: item.key,
    });
  }


  const hacerCosas = async () => {

    setModalVisible(true)
    //Coger usuario
    let e = await getUserAuth();
    setEmail(e);

    //Coger último libro
    let ultimo = await cargarUltimoLibro(e);
    setUltimoLibro(ultimo);
    //Ultimo Capitulo leido
    if (ultimo != "") {
      setUltimoCapituloLeido(ultimo.UltimoCapitulo)
      setCapitulosLeido(ultimo.NumCapitulos)

    }
    //Coger fotoPerfil
    setFotoPerfil(await getFotoPerfil(e));
    //Coger los libros 

    setNewBooks(await cargarFirebase());
   
    setHotBooks(await cargarHotBook());

    setRecomendadoBooks(await cargarRecomendadoBook(e));

    setModalVisible(false)
    //Hot Libros:

  }


  //Ir al capitulo escogido
  const handleLeerLibro = async () => {

    let capitulo;
    if (ultimoCapituloLeido == capitulosLeido) {
      capitulo = ultimoCapituloLeido;
    }
    else {
      capitulo = ultimoCapituloLeido + 1;
    }
    //Cambiar el ultimo capitulo
    await cambiarUltimoLibroLeido(ultimoLibro.key, email, capitulo);

    navigation.navigate("bookScreen", {
      bookId: ultimoLibro.key,
      capituloNumero: capitulo,
      screen: "home",
    });

  }
  function renderRecomendados(item, index) {
    return (
      <TouchableOpacity  testID="buttonBookRecomendado"onPress={() => handleBook(item)} >
        <View
          style={{

            marginVertical: 5,
            marginHorizontal: 20,
            width: 300,
            marginBottom: 10,
            flexDirection: "row", borderRadius: 8,
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
            source={{ uri: item.Portada }}
            style={{
              width: 90,
              height: 100,
              borderRadius: 15,
              overflow: "hidden",
              marginBottom: 10,
              marginLeft: 10,
              marginTop: 10,
              borderWidth: 1,
              borderColor: "black",
            }}
          ></ImageBackground>

          <View style={{ marginTop: 15, marginBottom: 10, backgroundColor: "white" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2B809C", marginLeft: 15, marginBottom: 5, }}>
              {item.Titulo}
            </Text>

            {/* Informacion capitulo*/}

            <Text style={{ width: 180, marginLeft: 5, fontSize: 12, color: "black" }}
              numberOfLines={3}>
              {item.Descripción}
            </Text>

          </View>

        </View>
      </TouchableOpacity>)
  }

  function renderNewBooks(item, index) {
    return (
      <View style={{ marginTop: 5, }}>
        {/* Imagenes Books nuevos blur */}
        <View
          style={{
            elevation: 12,
            position: "absolute",
            bottom: 35,
            left: 5,
            borderRadius: 15,
            overflow: "hidden",
            opacity: 0.3,
          }}
        >
          <Image
            blurRadius={15}
            style={{ width: 100, height: 40 }}
            source={{ uri: `${item.Portada}` }}
          />
        </View>
        {/* Imagenes Books nuevos */}
        <TouchableOpacity testID="buttonBook"
          style={{
            marginHorizontal: 10,
          }}
          onPress={() => handleBook(item)}
        >
          <ImageBackground
            source={{ uri: `${item.Portada}` }}
            style={{
              width: 90,
              height: 110,
              borderRadius: 15,
              overflow: "hidden",
            }}
          ></ImageBackground>
        </TouchableOpacity>

        <Text
          style={{
            marginLeft: 10,
            marginTop: 10,
            fontSize: 13,
            color: "black",
            fontWeight: "bold",
            width:100,
          }}
        >
          {item.Titulo}
        </Text>
      </View>
    );
  }

  function renderHotBook(item, index) {
    return (
      <TouchableOpacity
        style={{
          width: 200,
          height: 150,
        }}
        onPress={() => handleBook(item)}
      >
        <View style={{
          borderRadius: 10,
          position: 'absolute',
          top: 0,
          left: 5,
          right: 5,
          bottom: 9,
          shadowColor: "black",
          shadowOpacity: 0.78,
          shadowOffset: { width: 1, height: 9 },
          shadowRadius: 10,
          elevation: 6,
          backgroundColor: "white",
          overflow: "hidden",
        }} >

          <ImageBackground
            source={{ uri: item.Portada }}
            style={{
              overflow: "hidden",
              flex: 1,
            }}
          >
            <View style={{
              marginTop: "auto",
              paddingTop: 10,
              paddingBottom: 10,
              paddingHorizontal: 16,
              backgroundColor: 'white',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}>
              <Text
                style={{
                  color: "#2B809C",
                  fontSize: 13,
                  fontWeight: 'bold',
                }}>
                {item.Titulo}
              </Text>
              <Text
                style={{
                  marginTop: 2,
                  color: "#7F7F7F",
                  fontSize: 11,
                  fontStyle: 'italic'
                }}
                numberOfLines={2}
              >
                {item.Descripción}
              </Text>
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>



    );
  }

  const CardNuevos = () => {
    return (
      <View>
        <Text
          style={{
            marginTop: 15,
            fontSize: 20,
            color: "black",
            paddingHorizontal: 20,
            fontWeight: "bold",
          }}
        >
          Libros Nuevos!
        </Text>
        <View>
          <FlatList
            contentContainerStyle={{ paddingLeft: 5 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newBooks}
            renderItem={({ item, index }) => renderNewBooks(item, index)}
          ></FlatList>
        </View>
      </View>

    );
  }
  const CardUltimoLibro = () => {
    return (
      <View>
        <Text
          style={styles.ultimoLibroSigueLeyendo}>
          Sigue Leyendo
        </Text>

        <View style={styles.ultimoLibrocontainer}>
          {/*Foto del libro seguir leyendo*/}
          <View style={styles.fotodelLibrocontainer}>
            <View style={styles.fotodelLibrocontainer2}>
              <Image
                blurRadius={15}
                style={{ width: 120, height: 55 }}
                source={{ uri: `${ultimoLibro.Portada}` }}
              />
            </View>

            <ImageBackground
              source={{ uri: `${ultimoLibro.Portada}` }}
              style={styles.ultimoLibroImagen}
            ></ImageBackground>
          </View>
          {/*Cosas del libro seguir leyendo*/}
          <View style={{ justifyContent: "center", marginLeft: 20, }}>
            <View style={{ width: 130, height: 100, borderRadius: 15, }}>
              <View style={{ alignItems: "center", justifyContent: "center", }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#2B809C",
                    fontWeight: "bold",
                  }}
                >
                  {ultimoLibro.Titulo}
                </Text>

                <Text style={styles.ultimoLibroPorcentaje}>
                  {Math.round((ultimoLibro.UltimoCapitulo / ultimoLibro.NumCapitulos) * 100)}%
                  <Foundation name="page-multiple" size={15} color="#8EAF20" />
                </Text>
                <View style={styles.ultimoLibroviewPorcentaje}>
                  <View
                    style={{
                      position: "absolute",
                      width: (ultimoCapituloLeido / capitulosLeido) * 100,
                      height: 5,
                      backgroundColor: "#8EAF20",
                      borderRadius: 15,
                    }}
                  ></View>
                </View>
                <View style={{ marginTop: 10, }}>
                  {/* Botón Continuar seguir Leyendo */}
                  <TouchableOpacity
                    testID="buttonLeerLibro"
                    onPress={() => {
                      handleLeerLibro();
                    }}
                  >
                    <ImageBackground style={styles.ultimoLibroVieButton}>
                      <AntDesign name="arrowright" size={24} color="white" />
                    </ImageBackground>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.back}>
      <Modal
        animationType="fade"
        visible={isModalVisible}
        transparent>

        <View style={styles.modalView}>
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
      <View style={styles.head}>
        <View style={{ flexDirection: "row" }}>
          {/*Logo Imagen*/}
          <Image
            style={styles.image}
            source={require("../../assets/note.png")}
          />
          {/*nombre e inicio*/}
          <View>
            <Text style={{ fontSize: 13, color: "#2B809C", fontWeight: "bold", }}>Bookme </Text>
            <Text style={styles.fontIncioSesion}>Inicio </Text>
          </View>
        </View>
        {/*User*/}
        <TouchableOpacity testID="buttonProfile" onPressIn={() => handleProfile()}>
          <Image testID="imageProfile"
            source={{ uri: fotoPerfil != "" ? fotoPerfil : "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png" }}
            style={{ width: 50, height: 50, borderRadius: 50 / 2, marginTop: 10, left: 60 }}
          />

        </TouchableOpacity>
        {/*Notifications*/}
        <TouchableOpacity testID="buttonNotificacion" onPress={() => handleNotificacion()} style={{ marginTop: "auto", marginLeft: 10 }}>
          <Ionicons name="notifications" size={33} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/*Nuevos libros*/}
        <CardNuevos />
        {ultimoLibro != "" &&
          < CardUltimoLibro />
        }
        {/* Más popular */}
        <View>
          <Text
            style={{
              fontSize: 20,
              color: "black",
              paddingHorizontal: 20,
              fontWeight: "bold",
            }}
          >
            Más popular!
          </Text>

          <View style={{
            marginTop: 4, marginLeft: "auto", marginRight: "auto"
          }}>
            <Carousel
              firstItem={1}
              layout={'default'}
              ref={isCarousel}
              data={hotBooks}
              containerCustomStyle={{
                overflow: 'visible', //Poner para que no se corten las imagenes de despues y antes
              }}
              hasParallaxImages={true}
              sliderWidth={300}
              itemWidth={200}
              inactiveSlideScale={0.85}
              inactiveSlideOpacity={0.65}
              useScrollView={true}
              renderItem={({ item, index }) => renderHotBook(item, index)}
              onSnapToItem={(index) => setIndex(index)}
            />
          </View>

          {recomendadoBooks.length != 0 ?
            < View >
              < Text
                style={{
                  marginTop: 5,
                  fontSize: 20,
                  color: "black",
                  paddingHorizontal: 20,
                  fontWeight: "bold",
                }}
              >
                Recomendado para ti
              </Text>
              <FlatList
                contentContainerStyle={{ paddingLeft: 5 }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={recomendadoBooks}
                renderItem={({ item, index }) => renderRecomendados(item, index)}
              ></FlatList>
            </View> : <View />}

        </View>
      </ScrollView>

    </SafeAreaView >
  )
}
const styles = StyleSheet.create({
  back: {
    flex: 1,
    backgroundColor: "white",
  },
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
  fontIncioSesion: {
    fontWeight: "bold",
    color: "black",
    fontSize: 25,
  },
  image: {
    marginRight: 10,
    width: 37,
    height: 37,
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
  ultimoLibroSigueLeyendo: {
    marginTop: 15,
    marginHorizontal: 20,
    fontWeight: "bold", color: "black",
    marginBottom: 10,
    borderBottomColor: "#8EAF20",
    borderBottomWidth: 3,
    width: "60%",
    fontSize: 20,

  },
  ultimoLibrocontainer: {
    marginBottom: 10,
    marginTop: 5,
    marginLeft: 20,
    height: 150,
    flexDirection: "row",
    marginRight: 30,
    borderRadius: 8,
    shadowColor: "black",
    shadowOpacity: 0.78,
    shadowOffset: { width: 0, height: 9 },
    shadowRadius: 10,
    elevation: 6,
    backgroundColor: "white",
  },
  fotodelLibrocontainer: {
    justifyContent: "center",
    marginLeft: 10,
    marginBottom: 5,
  },
  fotodelLibrocontainer2: {

    elevation: 12,
    position: "absolute",
    top: 87,
    borderRadius: 25,
    overflow: "hidden",
    opacity: 0.3,
  },
  ultimoLibroImagen: {
    marginHorizontal: 10,
    width: 100,
    height: 120,
    borderRadius: 15,
    overflow: "hidden",
  },
  ultimoLibroAutor: {
    marginTop: 5,
    marginLeft: 10,
    fontSize: 13,
    color: "black",
  },
  ultimoLibroPorcentaje: {
    marginTop: 5,
    fontSize: 13,
    color: "black",
    fontWeight: "bold",
  },
  ultimoLibroviewPorcentaje: {
    marginTop: 5,
    width: 100,
    height: 5,
    backgroundColor: "#D8D8D8",
    borderRadius: 15,
  },
  ultimoLibroVieButton: {
    width: 90,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E39801",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default HomeScreen