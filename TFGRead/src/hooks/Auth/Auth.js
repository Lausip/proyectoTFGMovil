
import { Alert } from "react-native";
import { handleRegistroFirebase } from "../../hooks/Auth/Firestore"
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, Timestamp, getDoc, doc, onSnapshot, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, query, orderBy, addDoc, limit, updateDoc, where, startAfter, setDoc } from "firebase/firestore"

export const handleIncioSesion = async (email, password) => {
  //1. Mirar si esta bloqueado:
  const db = getFirestore();
  const docRefEmail = doc(db, "usuarios", email);
  const docSnapEmail = await getDoc(docRefEmail);
  let autorBloqueado = docSnapEmail.data().AutorBloqueado;
  if (autorBloqueado) {
    Alert.alert(
      'Aviso',
      'El usuario ha sido bloqueado',
      [
        {
          text: 'Ok',
          style: 'destructive',
        },
      ],);
  }
  else {
    //2. Mirar si existe:
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {

        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
      })
      .catch(error => alert(error.message))
  }
}
function handleContraseñasIguales(password1, password2) {
  return password1 == password2;
}

export const handleRegistro = (email, password1, password2) => {

  if (handleContraseñasIguales(password1, password2)) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password1)
      .then(userCredentials => {
        const user = userCredentials.user;
        handleRegistroFirebase(user.email)
      }
      ).catch(error => alert(error.message))
  }
  else {
    Alert.alert(
      'Aviso',
      'Las contraseñas no coinciden',
      [
        {
          text: 'Ok',
          style: 'destructive',
        },
      ],);
  }
};

export const handleReset = (email) => {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Reset password of:", email);
      Alert.alert(
        'Aviso',
        'Porfavor revisa tu correo para más información',
        [
          {
            text: 'Ok',
            onPress: () => navigation.navigate("login"),
            style: 'destructive',
          },
        ],);

    })
    .catch((error) => alert(error.message));
};

export const getUserAuth = async () => {
  const auth = getAuth();
  return auth.currentUser.email;
}
