import { getFirestore, Timestamp, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, query, orderBy, addDoc, limit, updateDoc, where, startAfter, setDoc } from "firebase/firestore"
import { handleAutores, contarCapitulosDelLibro } from "./Auth/Firestore";
import { compressArray } from "../utils/functions";

export const cargarNuevosLibros = async (lastItemId) => {

    const db = getFirestore();

    let snapshot;
    if (lastItemId == "") {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc"), limit(4)));
    }
    else {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc"), startAfter(lastItemId), limit(4)));
    }
    let data = await Promise.all(snapshot.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        NumCapitulo: await contarCapitulosDelLibro(documentSnapshot.id),
        NumSeguidores: await getNumSeguidoresLibro(documentSnapshot.id),
        Categorias: await getCategoriasLibro(documentSnapshot.id),
        doc: documentSnapshot,
    })))
    
    return data;

}


export const cargarNuevosLibrosFiltroTitulo = async (lastItemId, filtro) => {
    const db = getFirestore();
    let books = [];
    let snapshot;
    let lastI = "";
    if (lastItemId == "") {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("Titulo"), orderBy("FechaModificación", "desc"), where("Titulo", ">", filtro), limit(4)));
    }
    else {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("Titulo"), orderBy("FechaModificación", "desc"), where("Titulo", ">", filtro), startAfter(lastItemId), limit(4)));
    }
    books = await Promise.all(snapshot.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        doc: documentSnapshot

    })))
    if (books.length != 0)
        lastI = books[books.length - 1].doc;

    return [books, lastI];

}
export const cargarNuevosLibrosFiltroEtiqueta = async (lastItemId, filtro) => {
    const db = getFirestore();
    let books = [];
    let snapshot;
    let lastI = "";
    if (lastItemId == "") {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("Etiquetas", "desc"), where("Etiquetas", "array-contains", filtro), orderBy("FechaModificación", "desc"), limit(4)));
    }
    else {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("Etiquetas", "desc"), where("Etiquetas", "array-contains", filtro), orderBy("FechaModificación", "desc"), startAfter(lastItemId), limit(4)));

    }

    books = await Promise.all(snapshot.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        doc: documentSnapshot

    })))
    if (books.length != 0)
        lastI = books[books.length - 1].doc;

    return [books, lastI];

}

export const cargarNuevosLibrosFiltroCategoria = async (lastItemId, filtro) => {
    const books = [];
    let lastI = "";
    let snapshot;
    let snapshot2;
    let i = 0;
    const db = getFirestore();
    if (lastItemId == "") {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc")));
        let doc;
        for (doc of snapshot.docs) {
            snapshot2 = await getDocs(query(collection(db, "libros", doc.id, "Categorias"), where("Nombre", "==", filtro.value)));
            if (!snapshot2.empty) {
                books.push({
                    ...doc.data(),
                    key: doc.id,
                });
                lastI = doc;
                i++;
                if (i == 4) {
                    break;
                }
            }
        };
    }
    else {
        snapshot = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc"), startAfter(lastItemId)));

        let doc;
        for (doc of snapshot.docs) {
            snapshot2 = await getDocs(query(collection(db, "libros", doc.id, "Categorias"), where("Nombre", "==", filtro.value)));
            if (!snapshot2.empty) {

                books.push({
                    ...doc.data(),
                    key: doc.id,
                });
                lastI = doc;
                i++;

                if (i == 4) {
                    break;
                }
            }
        };

    }



    return [books, lastI];

}

export const cargarDatosLibrosFiltro = async (filtro, lastItemId, tipoFiltro) => {
    let array;

    if (tipoFiltro == "Etiqueta") {
        array = await cargarNuevosLibrosFiltroEtiqueta(lastItemId, filtro);
    }
    if (tipoFiltro == "Título") {
        array = await cargarNuevosLibrosFiltroTitulo(lastItemId, filtro);
    }
    if (tipoFiltro == "Categoría") {
        array = await cargarNuevosLibrosFiltroCategoria(lastItemId, filtro);

    }
    let librosInformacion = [];
    let lasItem = "";
    if (array[1] != "") {
        let libros = array[0];
        lasItem = array[1];

        for (let i = 0, len = libros.length; i < len; i++) {

            let numCapitulos = await contarCapitulosDelLibro(libros[i].key);
            let numSeguidores = await getNumSeguidoresLibro(libros[i].key);
            let categorias = await getCategoriasLibro(libros[i].key);

            librosInformacion.push({
                ...libros[i],
                NumCapitulo: numCapitulos,
                NumSeguidores: numSeguidores,
                Categorias: categorias,

            });

        }
    }
    return [librosInformacion, lasItem];
}
export const cargarHotBook = async () => {
    const db = getFirestore();

    //Coger 4 populares
    let snapshot = await getDocs(collection(db, "libros"));
    //Más popular:
    let data = await Promise.all(snapshot.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        Categorias: await getCategoriasLibro(documentSnapshot.id),
        NumSeguidores :await getNumSeguidoresLibro(documentSnapshot.id)

    })))
    let d = data.slice().sort((a, b) => { return b.NumSeguidores - a.NumSeguidores }).slice(0, 4);

    return d
}
export const cargarRecomendadoBook = async (email) => {
    const db = getFirestore();
    let categorias = [];
    let books = [];

    //Coger los libros favoritos:
    let snapshot = await getDocs(collection(db, "usuarios", email, "MeGusta"));
    if(!snapshot.empty){
    //Coger libros que tengan esa id
    await Promise.all(snapshot.docs.map(async (documentSnapshot) => {
        let snap = await getDocs(collection(db, "libros", documentSnapshot.data().Nombre, "Categorias"));
        //Contar categorias
        await snap.docs.map(async (documentSnapshot2) => {
            categorias.push(documentSnapshot2.data().Nombre);
        })

    }))

    //Coger cuantas veces está cada categoría
    let categoriasRepetidas = compressArray(categorias);

    //Coger el top 3 de categorías:
    let topCategorias = categoriasRepetidas.slice().sort((a, b) => { return b.count - a.count }).slice(0, 2);

    //Mirar si alguno tiene esos 2 categorías
    let number = 0;
    let snapshotTodosLibros = await getDocs(collection(db, "libros"));
    let d = [];
    await Promise.all(snapshotTodosLibros.docs.map(async (documentSnapshot7) => {
            let snapCategorias = await getDocs(collection(db, "libros", documentSnapshot7.id, "Categorias"));
            let cat = 0;
            await Promise.all(snapCategorias.docs.map(async (documentSnapshot2) => {

                if (documentSnapshot2.data().Nombre == topCategorias[0].value || documentSnapshot2.data().Nombre == topCategorias[1].value) {
                    cat = cat + 1;
                }
                if (cat == 2) {
                    number++;
                    d.push({
                        ...documentSnapshot7.data(),
                        key: documentSnapshot7.id,
                        NumSeguidores :await getNumSeguidoresLibro(documentSnapshot7.id),
                        Categorias: await getCategoriasLibro(documentSnapshot7.id)
                    })
                    return;
                };

            }))
    }))
    books = d.slice().sort((a, b) => { return b.NumSeguidores - a.NumSeguidores }).slice(0, 3);
    }
    return books;
}


export const cargarDatosLibros = async (lastItemId) => {
    let lasItem = "";
    let librosInformacion = await cargarNuevosLibros(lastItemId);
    if (librosInformacion.length != 0)
        lasItem = librosInformacion[librosInformacion.length - 1].doc

    return [librosInformacion, lasItem];
}

export const getNumSeguidoresLibro = async (idbook) => {
    const db = getFirestore();
    let numSeguidores = 0;
    let snapshot;

    let autores = await handleAutores();
    for (let i = 0, len = autores.length; i < len; i++) {

        snapshot = await getDocs(query(collection(db, "usuarios", autores[i].Nombre, "MeGusta"), where("Nombre", "==", idbook)));
    
        snapshot.docs.map(async (documentSnapshot) => {
            numSeguidores = numSeguidores + 1
        })

    }

    return numSeguidores;

}

export const getCategoriasLibro = async (bookId) => {

    const db = getFirestore();
    let data = [];
    const snap = await getDocs(collection(db, "libros", bookId, "Categorias"));
    data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        Nombre: documentSnapshot.data().Nombre,
        Color: documentSnapshot.data().Color
    })))
    return data;
}
export const getPortadaLibro = async (bookId) => {

    const db = getFirestore();
    const docRefPortada = doc(db, "libros", bookId);
    const docSnap = await getDoc(docRefPortada);
    return docSnap.data().Portada;

}

export const getFavoritos = async (favoritosUsuario) => {
    const db = getFirestore();
    let favoritos = [];
    for (let i = 0, len = favoritosUsuario.length; i < len; i++) {

        let snap = await getDoc(doc(db, "libros", favoritosUsuario[i].Nombre));

        let numCapitulos = await contarCapitulosDelLibro(snap.id);

        favoritos.push({ ...snap.data(), NumCapitulos: numCapitulos, UltimoCapitulo: favoritosUsuario[i].UltimoCapitulo, key: snap.id });

    }

    return favoritos

}


export const crearLibroFirebase = async (titulo, descripción, email, etiquetas, categorias) => {
    let id = "";
    const db = getFirestore();
    const data = {
        Autor: email,
        Titulo: titulo,
        Descripción: descripción,
        Portada: "",
        FechaCreación: Timestamp.fromDate(new Date()),
        FechaModificación: Timestamp.fromDate(new Date()),
        borrador: false,
        Estado: "En curso",
        Etiquetas: etiquetas,
    };
    const dbRef = await collection(db, "libros")
    await addDoc(dbRef, data).then(docRef => { id = docRef.id; }).catch(error => { console.log(error); })

    let i = 0;
    for (i; i < categorias.length; i++) {

        const docRefCategorias = doc(db, "libros", id, "Categorias", categorias[i].Nombre);
        const dataCategorias = { Nombre: categorias[i].Nombre, Color: categorias[i].Color };
        setDoc(docRefCategorias, dataCategorias)


    }

    return id;
}

//---------------------------------------------------CAMBIAR---------------------------------------------------
export const cambiarPortadadeLibro = async (id, image) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", id)
    updateDoc(dbRef, {
        Portada: image,
    })
}

export const cambiarTitulo = async (bookId, titulo) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        Titulo: "" + titulo,
    })
}

export const cambiarTituloCapitulo = async (bookId, chapterId, titulo) => {
    const db = getFirestore();
    const dbRef = await getDoc(doc(db, "libros", bookId, "Capitulos", chapterId))
    updateDoc(dbRef.ref, {
        Titulo: "" + titulo,
    })
}

export const cambiarContenidoCapitulo = async (bookId, chapterId, contenido) => {
    const db = getFirestore();
    const dbRef = await getDoc(doc(db, "libros", bookId, "Capitulos", chapterId))
    updateDoc(dbRef.ref, {
        Contenido: "" + contenido,
    })
}

export const cambiarDescripcion = async (bookId, descripcion) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        Descripción: "" + descripcion,
    })
}
export const cambiarFechaModificaciónLibro = async (bookId) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        FechaModificación: Timestamp.fromDate(new Date()),
    })
}
export const cambiarEstado = async (bookId, estado) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        Estado: estado,
    })
}

export const cambiarCategoria = async (bookId, categorias) => {
    const db = getFirestore();
    //Eliminar todos las categoriaS
    const snap = await getDocs(collection(db, "libros", bookId, "Categorias"));

    snap.docs.map((documentSnapshot) => {

        deleteDoc(documentSnapshot.ref)
            .then(() => {
                console.log("Entire Document has been deleted successfully.")
            })
    })
    //Añadir las nuevas categorias
    let i = 0;
    for (i; i < categorias.length; i++) {
        const docRefCategorias = doc(db, "libros", bookId, "Categorias", categorias[i].Nombre);
        const dataCategorias = { Nombre: categorias[i].Nombre, Color: categorias[i].Color };
        setDoc(docRefCategorias, dataCategorias)
    }
}

//---------------------------------------------------CARGAR---------------------------------------------------
export const cargarBooks = async () => {
    const db = getFirestore();
    let data = [];
    const snap = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc"), limit(4)));
    data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        nCapitulos: await contarCapitulosDelLibro(documentSnapshot.id)
    })))
    return data;
}

export const getCapitulosDelLibro = async (idBook) => {
    const db = getFirestore();
    let data = [];
    const snap = await getDocs(query(collection(db, "libros", idBook, "Capitulos"), orderBy("Numero", "asc")));
    data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
    })))
    return data;
}

export const getCapitulo = async (idBook, numero) => {
    const db = getFirestore();
    let data = "";
    const snap = await getDocs(query(collection(db, "libros", idBook, "Capitulos",), where("Numero", "==", numero)));
    data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
    })))

    return data[0];
}


export const getAutorLibro = async (bookId) => {

    const db = getFirestore();
    const docRefPortada = doc(db, "libros", bookId);
    const docSnap = await getDoc(docRefPortada);
    return docSnap.data().Autor;

}
export const cargarBooksAutorPerfil = async (email) => {
    const db = getFirestore();
    let data = [];
    const snap = await getDocs(query(collection(db, "libros"), where("Autor", "==", email), orderBy("FechaModificación", "desc")));

    data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
        nCapitulos: await contarCapitulosDelLibro(documentSnapshot.id),
        doc: documentSnapshot,

    })))
    return data
}

export const cargarBooksAutor = async (email, lastItemId) => {
    const db = getFirestore();
    let data = [];

    if (lastItemId == "") {
        const snap = await getDocs(query(collection(db, "libros"), where("Autor", "==", email), orderBy("FechaModificación", "desc"), limit(4)));

        data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            nCapitulos: await contarCapitulosDelLibro(documentSnapshot.id),
            doc: documentSnapshot,

        })))

    }
    else {

        const snap = await getDocs(query(collection(db, "libros"), orderBy("FechaModificación", "desc"), where("Autor", "==", email), startAfter(lastItemId), limit(4)));
        data = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
            nCapitulos: await contarCapitulosDelLibro(documentSnapshot.id),
            doc: documentSnapshot,
        })))

    }

    return data
}
export const cargarDatosLibro = async (bookId) => {
    const db = getFirestore();
    const docRef = doc(db, "libros", bookId);
    const docSnap = await getDoc(docRef);

    return docSnap.data();;
}


export const getComentariosCapitulo = async (bookId, capituloId) => {
    const db = getFirestore();

    const snap = await getDocs(query(collection(db, "libros", bookId, "Capitulos", capituloId, "Mensajes"), orderBy("FechaCreación", "desc")));
    let comentarios = [];
    comentarios = await Promise.all(snap.docs.map(async (documentSnapshot) => ({

        Autor: documentSnapshot.data().Autor,
        Comentario: documentSnapshot.data().Comentario,
        FechaCreacion: documentSnapshot.data().FechaCreación?.toDate().toDateString(),
        key: documentSnapshot.id,
    })))

    return comentarios
}
//--------------------------------CAPITULOS------------------------------
export const uploadCapitulo = async (bookId, numeroCapitulo, titulo, contenido, borrador) => {
    const db = getFirestore();

    const docRefCapitulos = collection(db, "libros", bookId, "Capitulos");
    const datafCapitulos = {
        Titulo: titulo,
        Contenido: contenido,
        FechaCreación: Timestamp.fromDate(new Date()),
        borrador: borrador,
        Numero: numeroCapitulo,
    };
    addDoc(docRefCapitulos, datafCapitulos)
}

export const publicarCapituloDelLibro = async (bookId, chapterId) => {
    const db = getFirestore();
    await db.collection('libros').doc(bookId).collection("Capitulos").doc(chapterId)
        .update({
            borrador: true
        })
}
export const enviarComentarioCapitulo = async (bookId, capituloId, texto, autor,) => {
    const db = getFirestore();

    const docReMensajes = await collection(db, "libros", bookId, "Capitulos", capituloId, "Mensajes");

    addDoc(docReMensajes, {
        Autor: autor,
        Comentario: texto,
        FechaCreación: Timestamp.fromDate(new Date()),
    })
}

export const getCapituloId = async (bookId, numeroCapitulo) => {

    let a = await getCapitulo(bookId, numeroCapitulo)
    return a.key;

}

export const getNumeroCapitulo = async (bookId, capituloId) => {
    const db = getFirestore();
    const docRef = doc(db, "libros", bookId, "Capitulos", capituloId);
    const docSnap = await getDoc(docRef);

    return docSnap.data().Numero;

}



export const mirarSiTieneOtrosCapitulos = async (bookId, titulo, contenido, borrador) => {
    let numberCapitulos = 0;
    const db = getFirestore();
    const dbRef = await getDocs(collection(db, "libros", bookId, "Capitulos"))
    dbRef.docs.map(() => {
        numberCapitulos = numberCapitulos + 1
    })


    await uploadCapitulo(bookId, numberCapitulos + 1, titulo, contenido, borrador);

}




//------------------------------------ELIMINAR---------------------------------------
export const eliminarCapituloLibro = async (bookId, chapterId, n) => {
    const db = getFirestore();
    let i;
    let caps = await cogerCapitulosConNumeroMayor(bookId, n);
    //A cada uno restarle uno el numero de capitulo
    for (i = 0; i < caps.length; i++) {

        const snap = await getDoc(doc(db, "libros", bookId, "Capitulos", caps[i].key));

        updateDoc(snap.ref, {
            Numero: caps[i].Numero - 1
        })
    }

    /*Eliminar el capitulo */
    const snap2 = await getDoc(doc(db, "libros", bookId, "Capitulos", chapterId));
    deleteDoc(snap2.ref)


}

export const eliminarEtiqueta = async (bookId, etiqueta) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        Etiquetas: arrayRemove(etiqueta),
    })

}
export const cogerCapitulosConNumeroMayor = async (bookId, n) => {
    const db = getFirestore();
    const snap = await getDocs(query(collection(db, "libros", bookId, "Capitulos"), where("Numero", ">", n)));
    let caps = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        ...documentSnapshot.data(),
        key: documentSnapshot.id,
    })))

    return caps;
}

export const eliminarLibroFirebase = async (bookId) => {
    const db = getFirestore();

    /*Eliminar los megusta de las personas que tienen megusta en ese libro*/

    const snap = await getDocs(collection(db, "usuarios"));
    snap.docs.map(async (documentSnapshot) => {
        const snap = await getDoc(doc(db, "usuarios", documentSnapshot.id, "MeGusta", bookId));
        deleteDoc(snap.ref)

    })

    /*Eliminar todos los capitulos*/
    const snap2 = await getDocs(collection(db, "libros", bookId, "Capitulos"));
    snap2.docs.map(async (documentSnapshot) => {
        const snap2 = await getDoc(doc(db, "libros", bookId, "Capitulos", documentSnapshot.id));
        deleteDoc(snap2.ref)
    })
    /*Eliminar todos las categorias*/
    const snap3 = await getDocs(collection(db, "libros", bookId, "Categorias"));
    snap3.docs.map(async (documentSnapshot) => {
        const snap3 = await getDoc(doc(db, "libros", bookId, "Categorias", documentSnapshot.id));
        deleteDoc(snap3.ref)
    })

    /*Eliminar el libro*/
    const dbRef = await doc(db, "libros", bookId)
    deleteDoc(dbRef)
    


}

export const añadirEtiqueta = async (bookId, etiqueta) => {
    const db = getFirestore();
    const dbRef = await doc(db, "libros", bookId)
    updateDoc(dbRef, {
        Etiquetas: arrayUnion(etiqueta),
    })

}