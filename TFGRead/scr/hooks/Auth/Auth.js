import { auth } from '../../config/firebase';
import { Alert } from "react-native";
import { handleRegistroFirebase } from "../../hooks/Auth/Firestore"

export const handleIncioSesion = (email, password) => {
  auth
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);
    })
    .catch(error => alert(error.message))

}
function handleContraseñasIguales(password1, password2) {
  return password1 == password2;
}

export const signOut = async () => {
  auth
    .signOut()
    .then(() => console.log('User signed out!'));
}

export const handleRegistro = (email, password1, password2) => {

  if (handleContraseñasIguales(password1, password2)) {
    auth
      .createUserWithEmailAndPassword(email, password1)
      .then(userCredentials => {
        const user = userCredentials.user;
        handleRegistroFirebase(user.email)
        console.log('Logged in with:', user.email);
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
  auth
    .sendPasswordResetEmail(email)
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
  let email = "";
  await auth.onAuthStateChanged((user) => {
    if (user) {
      email = user.email;
    } 
  });
  return email;
}
