import { db } from '../../config/firebase';

export const handleRegistroFirebase = (email) => {
  db
    .collection('usuarios').doc(email)
    .set({
      Nombre: email,
      Foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      Rol: "Usuario",
      MeGusta: [],
      Amigos: [],
      Autores: [],
    })
    .then(() => {
      console.log('User added!');
    });
}

export const handleAñadirLibroMeGustaFirebase = (email, bookId) => {
  db
    .collection('usuarios').doc(email).collection("MeGusta").doc(bookId)
    .set({
      Nombre: bookId,
      UltimoCapitulo: 0,
    })
    .then(() => {
      console.log('Añadido a me gusta');
    });
}

export const handleAutores = async (email) => {

  let autores = [];
  await db.collection("usuarios").get().then(querySnapshot => {

      querySnapshot.forEach((documentSnapshot) => {
      
        autores.push({
          Foto: documentSnapshot.data().Foto,
          Nombre: documentSnapshot.data().Nombre,

        });
       
      })
   
    })
    return autores;
}

export const handleAutoresSeguidos = async (email) => {
  let autoresUsuario = [];
  let autores = [];
  await db.collection("usuarios").doc(email).get().then(documentSnapshot => {
    autoresUsuario = documentSnapshot.data().Autores

  })

  for (let i = 0, len = autoresUsuario.length; i < len; i++) {
    await db.collection("usuarios").doc(autoresUsuario[i]).get().then(documentSnapshot => {

      autores.push({ Foto: documentSnapshot.data().Foto, Nombre: documentSnapshot.data().Nombre });

    })

  }
  return autores
}

export const handleEliminarLibroMeGustaFirebase = async (email, bookId) => {
  await db
    .collection('usuarios').doc(email).collection("MeGusta").doc(bookId)
    .delete()
    .then(() => {
      console.log('Eliminado de me gusta');
    });
}

export const handleElLibroEstaEnMeGusta = async (email, bookId) => {
  let esta = false

  let result = await db
    .collection('usuarios').doc(email).collection("MeGusta").where("Nombre", '==', bookId).get();
  result.forEach((queryDocumentSnapshot) => {
    esta = true;
  })

  return esta;

}
export const getFotoPerfil = async (email) => {

  return  db
    .collection('usuarios').doc(email).get().then((documentSnapshot)=>{  return documentSnapshot.data().Foto;});



}

export const cambiarFotoPerfilFirebase = async (email, foto) => {
  await db
    .collection('usuarios').doc(email)
    .update({
      Foto: foto,
    })
    .then(() => {

    });
}