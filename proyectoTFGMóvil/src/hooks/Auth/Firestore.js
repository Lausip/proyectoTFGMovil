import { getFirestore, Timestamp, getDoc, doc, onSnapshot, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, query, orderBy, addDoc, limit, updateDoc, where, startAfter, setDoc } from "firebase/firestore"
/* istanbul ignore next */
export const handleRegistroFirebase = (email) => {
  const db = getFirestore();
  const docRefRegistro = doc(db, "usuarios", email);
  const dataRegistro = {
    Nombre: email,
    Foto: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    Rol: "Usuario",
    Amigos: [],
    Autores: [],
    Descripcion: "",
    UltimoLibroLeido: "",
    UltimoCapituloLeido: 0,
    Bloqueados: [],
    FechaCreacion: Timestamp.fromDate(new Date()),
    AutorBloqueado: false
  };
  setDoc(docRefRegistro, dataRegistro)
}
/* istanbul ignore next */
export const handleAñadirLibroMeGustaFirebaseCapitulo = (email, bookId, capitulo) => {
  const db = getFirestore();
  const dbRef = doc(db, "usuarios", email, "MeGusta", bookId)
  setDoc(dbRef, {
    Nombre: bookId,
    UltimoCapitulo: capitulo
  })

}
/* istanbul ignore next */
export const getFavoritosDelUsuario = async (email) => {

  const db = getFirestore();
  let data = [];
  const snap = await getDocs(collection(db, "usuarios", email, "MeGusta"));
  data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
    ...documentSnapshot.data(),
    key: documentSnapshot.id,
  })))

  return data;
}

/* istanbul ignore next */
export const handleAñadirLibroMeGustaFirebase = (email, bookId) => {

  const db = getFirestore();
  const dbRef = doc(db, "usuarios", email, "MeGusta", bookId)
  setDoc(dbRef, {
    Nombre: bookId,
    UltimoCapitulo: 0,
  })
}
/* istanbul ignore next */
export const handleAutoresEmail = async (email) => {
  const db = getFirestore();
  let autores = [];
  const snap = await getDocs(query(collection(db, "usuarios"), where("Nombre", '==', email)));
  autores = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
    Foto: documentSnapshot.data().Foto,
    Nombre: documentSnapshot.data().Nombre,

  })))

  return autores;
}
/* istanbul ignore next */
export const handleAutores = async () => {

  const db = getFirestore();
  let autores = [];
  const snap = await getDocs(collection(db, "usuarios"));
  autores = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
    Foto: documentSnapshot.data().Foto,
    Nombre: documentSnapshot.data().Nombre,

  })))

  return autores;
}
/* istanbul ignore next */
export const handleElLibroEstaEnMeGusta = async (email, bookId) => {
  let esta = false
  const db = getFirestore();

  const snap = await getDocs(query(collection(db, "usuarios", email, "MeGusta"), where("Nombre", '==', bookId)));
  snap.docs.map(async (documentSnapshot) => {
    esta = true;
  })
  return esta;


}
export const getEstaSeguido = async (emailTuyo, emailAutor) => {
  const db = getFirestore();

  const docRefDescripcion = doc(db, "usuarios", emailTuyo);
  const docSnapDescripcion = await getDoc(docRefDescripcion);
  let autores = docSnapDescripcion.data().Autores;

  let esta = false;

  for (let i = 0, len = autores.length; i < len; i++) {

    if (autores[i] == emailAutor)
      return true;
  }

  return esta;
}

export const seguirAutor = async (emailTuyo, emailAutor) => {
  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", emailTuyo);

  updateDoc(docRefAmigo, {
    Autores: arrayUnion(emailAutor),
  })
}

export const dejarSeguirAutor = async (emailTuyo, emailAutor) => {
  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", emailTuyo);

  updateDoc(docRefAmigo, {
    Autores: arrayRemove(emailAutor),
  })

}

export const getDescripcionUsuario = async (email) => {

  const db = getFirestore();
  const docRefDescripcion = doc(db, "usuarios", email);
  const docSnapDescripcion = await getDoc(docRefDescripcion);
  return docSnapDescripcion.data().Descripcion;

}
export const getFechaCreaciónUsuario = async (email) => {

  const db = getFirestore();
  const docRefDescripcion = doc(db, "usuarios", email);
  const docSnapDescripcion = await getDoc(docRefDescripcion);
  return docSnapDescripcion.data().FechaCreacion.toDate().toDateString();

}

//--------------------------------SEGUIDORES-----------------------------------
export const getNumSeguidores = async (email) => {

  const db = getFirestore();
  let numseguidores = 0;
  const snap = await getDocs(query(collection(db, "usuarios"), where("Autores", "array-contains", email)));

  snap.docs.map(async (documentSnapshot) => {

    numseguidores++;
  })
  return numseguidores;
}

export const getNumAutoresSeguidos = async (email) => {
  const db = getFirestore();
  const docRefDescripcion = doc(db, "usuarios", email);
  const docSnapDescripcion = await getDoc(docRefDescripcion);
  return docSnapDescripcion.data().Autores.length;
}
//--------------------------------PETICION-----------------------------------
export const enviarNotificacion = async (email, autorElegido, bookId, capituloId) => {
  const db = getFirestore();
  const docReMensajes = await collection(db, "usuarios", autorElegido, "Notificación");
  addDoc(docReMensajes, {
    Nombre: email,
    Libro: bookId,
    CapituloId: capituloId,
    FechaCreacion: Timestamp.fromDate(new Date()),

  })

}

export const eliminarPeticion = async (email, keyPeticion) => {
  const db = getFirestore();
  const snap2 = await getDoc(doc(db, "usuarios", email, "Peticiones", notificacionid));
  deleteDoc(snap2.ref)

}

export const getComentarios = async (email) => {
  let notificacion = [];
  if (email) {
    const db = getFirestore();
    const snap = await getDocs(query(collection(db, "usuarios", email, "Notificación"), orderBy("FechaCreacion", "asc")));
    notificacion = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
      ...documentSnapshot.data(),
      key: documentSnapshot.id,
    })))
  }

  return notificacion;

}

export const getPeticionesAmistad = async (email) => {
  let peticiones = [];
  if (email) {
    const db = getFirestore();
    const snap = await getDocs(query(collection(db, "usuarios", email, "Peticiones"), where("Estado", "==", "Pendiente")));
    snap.docs.map(async (documentSnapshot) => {
      if (documentSnapshot.data().Tipo == "Amistad") {
        peticiones.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,

        });
      }
    })
  }
  return peticiones;
}

//--------------------------------AMISTAD-----------------------------------
export const enviarPeticion = async (email, autorElegido, tipo) => {

  const db = getFirestore();
  const docReMensajes = await collection(db, "usuarios", autorElegido, "Peticiones");
  addDoc(docReMensajes, {
    Estado: "Pendiente",
    FechaCreacion: Timestamp.fromDate(new Date()),
    Nombre: email,
    Tipo: tipo

  })

}
export const mirarSiBloqueado = async (email, amigo) => {
  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", amigo);
  const docSnapAmigo = await getDoc(docRefAmigo);
  let bloqueados = docSnapAmigo.data().Bloqueados//MIRARRRRR
  return bloqueados.includes(email)
}


export const bloquearPersonaFirebase = async (email, personaAbloquear) => {
  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", email);

  updateDoc(docRefAmigo, {
    Bloqueados: arrayUnion(personaAbloquear),
  })



}



export const desbloquearPersonaFirebase = async (email, personaADesbloquear) => {
  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", email);

  updateDoc(docRefAmigo, {
    Bloqueados: arrayRemove(personaADesbloquear),
  })

}
export const cambiarEstadoPeticionAmistad = async (email, keyPeticion, tipo) => {

  const docRefAmigo = doc(db, "usuarios", email, "Peticiones", keyPeticion);
  updateDoc(docRefAmigo, {
    Estado: tipo
  })

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
  const docRefCategorias = doc(db, "usuarios", emailTuyo);
  const dataCategorias = { Amigos: arrayUnion(emailAmigo) };
  setDoc(docRefCategorias, dataCategorias)
}

export const getAmigos = async (email) => {

  const db = getFirestore();
  const docRefAmigo = doc(db, "usuarios", email);
  const docSnapAmigo = await getDoc(docRefAmigo);
  return docSnapAmigo.data().Amigos;

}

export const mirarSiSonAmigos = async (email, emailAmigo) => {

  let amigos = await getAmigos(email);
  let retorno = false;
  for (let i = 0, len = amigos.length; i < len; i++) {

    if (amigos[i] == emailAmigo) {

      retorno = true;
    }
  }

  return retorno;
}
//-------------------------NOTIFICACION CONVERSACION------------------

export const eliminarNotificacionConversacion = async (email, notificacionid) => {
  const db = getFirestore();
  const snap2 = await getDoc(doc(db, "usuarios", email, "Notificación", notificacionid));
  deleteDoc(snap2.ref)


}


export const getPeticionesConversacion = async (email) => {
  let peticiones = [];
  if (email) {
    const db = getFirestore();
    const snap = await getDocs(query(collection(db, "usuarios", email, "Peticiones"), where("Estado", "==", "Pendiente")));
    snap.docs.map(async (documentSnapshot) => {
      if (documentSnapshot.data().Tipo == "Conversacion") {
        peticiones.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id,

        });
      }
    })
  }
  return peticiones;

}

export const contarCapitulosDelLibro = async (bookId) => {

  const db = getFirestore();
  const docReCapLibros = collection(db, "libros", bookId, "Capitulos");
  const qSnapCap = getDocs(docReCapLibros)

  return (await qSnapCap).size;

}


//---------------------------------------------ULTIMO LIBRO---------------------------------------

//Cargar el Ultimo Libro leido del Usuario
export const cargarUltimoLibro = async (email) => {
  let idUltimoLibro;
  let ultimoLibro = "";
  let numCapitulos = 0;
  let UltimoCapituloLeido = 0;

  //Coger el ultimo libro

  //Coger el ID del ultimo libro

  const db = getFirestore();
  const docReIdUltimoLibroLeido = doc(db, "usuarios", email);
  const docSnapIdUltimoLibro = await getDoc(docReIdUltimoLibroLeido);
  idUltimoLibro = docSnapIdUltimoLibro.data().UltimoLibroLeido;

  if (idUltimoLibro != "") {
    //Coger datos del libro:
    const docReUltimoLibroLeido = doc(db, "libros", idUltimoLibro);
    const docSnapUltimoLibro = await getDoc(docReUltimoLibroLeido);
    //Contar los capitulos:
    numCapitulos = await contarCapitulosDelLibro(docSnapUltimoLibro.id);
    UltimoCapituloLeido = await cargarUltimoCapituloLeido(email);
    ultimoLibro = { Titulo: docSnapUltimoLibro.data().Titulo, Portada: docSnapUltimoLibro.data().Portada, Autor: docSnapUltimoLibro.data().Autor, NumCapitulos: numCapitulos, UltimoCapitulo: UltimoCapituloLeido, key: docSnapUltimoLibro.id };
    return ultimoLibro;
  }
  else {
    return "";
  }

}

export const cargarUltimoCapituloLeido = async (email) => {

  const db = getFirestore();
  const docReIdUltimoLibroLeido = doc(db, "usuarios", email);
  const docSnapIdUltimoLibro = await getDoc(docReIdUltimoLibroLeido);
  return docSnapIdUltimoLibro.data().UltimoCapituloLeido;

}

export const getNumeroLibrosUsuario = async (email) => {

  const db = getFirestore();
  let numLibros;
  const snap = await getDocs(query(collection(db, "libros"), where("Autor", '==', email)));
  numLibros = 0;
  snap.docs.map(async (documentSnapshot) => {

    numLibros++
  })
  return numLibros;
}

export const handleAutoresSeguidos = async (email) => {
  let autoresUsuario = [];
  let autores = [];
  const db = getFirestore();
  const docReAutores = doc(db, "usuarios", email);
  const docSnapAutores = await getDoc(docReAutores);
  autoresUsuario = docSnapAutores.data().Autores;

  for (let i = 0, len = autoresUsuario.length; i < len; i++) {

    const docReAutores2 = doc(db, "usuarios", autoresUsuario[i]);
    const docSnapAutores2 = await getDoc(docReAutores2);

    autores.push({ Foto: docSnapAutores2.data().Foto, Nombre: docSnapAutores2.data().Nombre });


  }

  return autores
}

export const handleEliminarLibroMeGustaFirebase = async (email, bookId) => {
  const db = getFirestore();
  const snap2 = await getDoc(doc(db, "usuarios", email, "MeGusta", bookId));
  deleteDoc(snap2.ref)
}

export const getFotoPerfil = async (email) => {

  const db = getFirestore();
  const docRef = doc(db, "usuarios", email);
  const docSnap = await getDoc(docRef);
  return docSnap.data().Foto;

}
//---------------------------------CAMBIAR-----------------------------
export const cambiarFotoPerfilFirebase = async (email, foto) => {

  const db = getFirestore();
  const docRef = doc(db, "usuarios", email);
  const data = {
    Foto: foto,
  };
  updateDoc(docRef, data)

}

export const cambiarDescripcion = async (email, texto) => {

  const db = getFirestore();
  const docRef = doc(db, "usuarios", email);
  const data = {
    Descripcion: texto,
  };
  updateDoc(docRef, data)

}
export const updateUltimoCapitulo = async (email, bookId, capituloNumero) => {
  const db = getFirestore();
  //mirar si está en megusta:
  let esta = await handleElLibroEstaEnMeGusta(email, bookId)
  const data = {
    UltimoCapitulo: capituloNumero
  }

  if (esta) {
    const docMegusta = doc(db, "usuarios", email, "MeGusta", bookId);
    updateDoc(docMegusta, data)
  }

}

export const cambiarUltimoLibroLeido = async (bookId, email, capitulo) => {

  const db = getFirestore();
  const docEmail = doc(db, "usuarios", email);
  const data = {
    UltimoLibroLeido: bookId,
    UltimoCapituloLeido: capitulo,
  };
  updateDoc(docEmail, data)

}

export const cargarFirebase = async () => {
  const books = [];
  //Coger el ID del ultimo libro
  const db = getFirestore();
  const q = query(collection(db, "libros"), orderBy('FechaCreación', "desc"), limit(5));
  onSnapshot(q, (querySnapshot) => {
    querySnapshot.forEach(documentSnapshot => {
      books.push({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
      });
    });

  });

  return books;

}