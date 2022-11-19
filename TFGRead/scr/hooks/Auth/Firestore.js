import { db, firebase } from '../../config/firebase';

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
      Descripcion: "",
      Peticiones: [],

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

export const handleAutores = async () => {

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

export const handleElLibroEstaEnMeGusta = async (email, bookId) => {
  let esta = false

  let result = await db
    .collection('usuarios').doc(email).collection("MeGusta").where("Nombre", '==', bookId).get();
  result.forEach((queryDocumentSnapshot) => {
    esta = true;
  })

  return esta;

}
export const getEstaSeguido = async (emailTuyo, emailAutor, seguidos) => {

  let esta = false;
  for (let i = 0, len = seguidos.length; i < len; i++) {
    if (autores[i].Nombre == emailAutor)
      return true;
  }

  return esta;
}

export const seguirAutor = async (emailTuyo, emailAutor) => {
  await db
    .collection('usuarios').doc(emailTuyo)
    .update({
      Autores: firebase.firestore.FieldValue.arrayUnion(emailAutor),
    })
    .then(() => {
      console.log('Seguido');
    });
}

export const dejarSeguirAutor = async (emailTuyo, emailAutor) => {
  await db
    .collection('usuarios').doc(emailTuyo)
    .update({
      Autores: firebase.firestore.FieldValue.arrayRemove(emailAutor),
    })
    .then(() => {
      console.log('Dejado de seguir');
    });
}

export const getDescripcionUsuario = async (email) => {

  let descripcion = "";
  await db.collection("usuarios").doc(email).get().then(documentSnapshot => {
    descripcion = documentSnapshot.data().Descripcion

  })
  return descripcion;
}
//--------------------------------SEGUIDORES-----------------------------------
export const getNumSeguidores = async (email) => {

  let numseguidores = 0;
  await db.collection("usuarios").where("Autores", "array-contains", email).get().then(documentSnapshot => {
    numseguidores = documentSnapshot.size;
  })
  return numseguidores;
}

export const getNumAutoresSeguidos = async (email) => {

  let numseguidos = 0;
  await db.collection("usuarios").doc(email).get().then(documentSnapshot => {

    numseguidos = documentSnapshot.data().Autores.length;

  })
  return numseguidos;
}
//--------------------------------PETICION-----------------------------------
export const enviarNotificacion = async (email, autorElegido, bookId, capituloId) => {

  await db.collection("usuarios").doc(autorElegido).collection("Notificación").add({
    Nombre: email,
    Libro: bookId,
    CapituloId: capituloId,
    FechaCreacion: firebase.firestore.Timestamp.fromDate(new Date()),

  })
    .then(() => {
      console.log('Enviada notificación a ' + email);
    });


}

export const eliminarPeticion = async (email, keyPeticion) => {

  await db.collection("usuarios").doc(email).collection("Peticiones").doc(keyPeticion)
    .delete()
    .then(() => {
      console.log("Eliminado")
    });

}

export const getPeticionesAmistad = async (email) => {

  let peticiones = [];
  await db
    .collection('usuarios').doc(email).collection("Peticiones")
    .where("Estado", "==", "Pendiente").get().then(documentSnapshot => {
      documentSnapshot.forEach((queryDocumentSnapshot) => {
        if (queryDocumentSnapshot.data().Tipo == "Amistad") {
          peticiones.push({
            ...queryDocumentSnapshot.data(),
            key: queryDocumentSnapshot.id,

          });
        }
      })

    })

  return peticiones;

}
//--------------------------------AMISTAD-----------------------------------
export const cambiarEstadoPeticionAmistad = async (email, keyPeticion, estado) => {

  await db.collection("usuarios").doc(email).collection("Peticiones").doc(keyPeticion)
    .update({
      Estado: estado,
    })
    .then(() => {
      console.log("Peticion de amistad cambiada de estado")
    });

}


export const rechazarPeticionAmistad = async (email, keyPeticion) => {
  //Cambiar el estado a rechazado
  cambiarEstadoPeticionAmistad(email, keyPeticion, "Rechazado");

}

export const aceptarPeticionAmistad = async (email, keyPeticion, emailOtro) => {
  //Cambiar el estado a aceptado
  await cambiarEstadoPeticionAmistad(email, keyPeticion, "Aceptada");
  //Añadir a Amigos
  await anadirAAmigos(email, emailOtro);
  await anadirAAmigos(emailOtro, email);


}

export const anadirAAmigos = async (emailTuyo, emailAmigo) => {
  await db
    .collection('usuarios').doc(emailTuyo)
    .update({
      Amigos: firebase.firestore.FieldValue.arrayUnion(emailAmigo),
    })
    .then(() => {
      console.log('Añanido a amigo');
    });
}

export const getAmigos = async (email) => {

  let amigos = [];
  await db.collection("usuarios").doc(email).get().then(documentSnapshot => {

    amigos = documentSnapshot.data().Amigos

  })

  return amigos;

}
export const mirarSiSonAmigos = async (email, emailAmigo) => {

  let amigos = await getAmigos(email);

  for (let i = 0, len = amigos.length; i < len; i++) {
    if (amigos[i] == emailAmigo) {
      return true;
    }
  }
  return false;
}

export const getPeticionesConversacion = async (email) => {

  let peticiones = [];
  await db
    .collection('usuarios').doc(email).collection("Peticiones")
    .where("Estado", "==", "Pendiente").get().then(documentSnapshot => {
      documentSnapshot.forEach((queryDocumentSnapshot) => {
        if (queryDocumentSnapshot.data().Tipo == "Conversacion") {
          peticiones.push({
            ...queryDocumentSnapshot.data(),
            key: queryDocumentSnapshot.id,

          });
        }
      })

    })

  return peticiones;

}
export const getNumeroLibrosUsuario = async (email) => {

  let numLibros = 0;
  await db.collection("libros")
    .where("Autor", "==", email).get().then(documentSnapshot => {
      numLibros = documentSnapshot.size

    })
  return numLibros;
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

export const getFotoPerfil = async (email) => {

  return db
    .collection('usuarios').doc(email).get().then((documentSnapshot) => { return documentSnapshot.data().Foto; });

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

export const updateUltimoCapitulo = async (email, bookId, capituloNumero) => {
  //mirar si está en megusta:
  let esta = await handleElLibroEstaEnMeGusta(email, bookId)
  if (esta) {
    await db
      .collection('usuarios').doc(email).collection("MeGusta").doc(bookId)
      .update({
        UltimoCapitulo: capituloNumero
      })
      .then(() => {
        console.log('Update el ultimo capitulo' + capituloNumero);
      });
  }
}