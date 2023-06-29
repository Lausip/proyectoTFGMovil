
import { Alert } from "react-native";
import { handleRegistroFirebase } from "../../hooks/Auth/Firestore"
import { getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, Timestamp, getDoc, doc, onSnapshot, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, query, orderBy, addDoc, limit, updateDoc, where, startAfter, setDoc } from "firebase/firestore"

export const handleIncioSesion = async (email, password) => {
  //1. Mirar si esta bloqueado:
  const db = getFirestore();
  const docRefEmail = doc(db, "usuarios", email);
  const docSnapEmail = await getDoc(docRefEmail);

  if (docSnapEmail.data() != undefined) {
    if (docSnapEmail.data().AutorBloqueado) {
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
        .catch(error => Alert.alert(
          'Error',
          'Contraseña incorrecta.Inténtalo de nuevo',
          [
            {
              text: 'Aceptar',
              style: 'destructive',
            },
          ],))
    }
  }
  else {
    Alert.alert(
      'Error',
      'El usuario no existe.Inténtalo de nuevo',
      [
        {
          text: 'Aceptar',
          style: 'destructive',
        },
      ],);
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
      ).catch(error => {
        if (error.code == "auth/invalid-email") {
          Alert.alert(
            'Error',
            'El formato de email no es válido',
            [
              {
                text: 'Aceptar',
                style: 'destructive',
              },
            ],);
        }
  
        if (error.code == "auth/email-already-in-use") {
          Alert.alert(
            'Error',
            "Ese email no está disponible",
            [
              {
                text: 'Aceptar',
                style: 'destructive',
              },
            ],);
        }
        if (error.code == "auth/weak-password") {
          Alert.alert(
            'Error',
            "La contraseña debe de tener más de 6 carácteres",
            [
              {
                text: 'Aceptar',
                style: 'destructive',
              },
            ],);
        }

      })
  }
  else {
    Alert.alert(
      'Error',
      'Las contraseñas no coinciden',
      [
        {
          text: 'Aceptar',
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
        'Por favor revisa tu correo para más información',
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
