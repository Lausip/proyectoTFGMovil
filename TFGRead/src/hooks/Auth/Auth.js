
import { Alert } from "react-native";
import { handleRegistroFirebase } from "../../hooks/Auth/Firestore"
import { getAuth,signOut,onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

export const handleIncioSesion = (email, password) => {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredentials => {

      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
    })
    .catch(error => alert(error.message))

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
  return  auth.currentUser.email;
}
