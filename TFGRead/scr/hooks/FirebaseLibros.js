import { db, firebase } from '../config/firebase';

export const cargarNuevosLibros = async () => {
    const books = [];
    await db.collection("libros")
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                books.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });
            })
        })
    return books

}
export const getFavoritos = async (favoritosUsuario) => {
 
    let favoritos = [];
    for (let i = 0, len = favoritosUsuario.length; i < len; i++) {
        await db.collection("libros").doc(favoritosUsuario[i].Nombre).get().then(documentSnapshot => {
            favoritos.push({ Autor: documentSnapshot.data().Autor, Portada: documentSnapshot.data().Portada, Titulo: documentSnapshot.data().Titulo,});
          
         })    
    }
    
    return favoritos 

}
export const cargarDatosLibro = async (bookId) => {
    let data = "";
    await db.collection("libros").doc(bookId).get().then(documentSnapshot => {
        data = documentSnapshot.data();
    })
    return data;
}

export const crearLibroFirebase = async (titulo, descripción, email) => {
    let id = "";
    await db
        .collection('libros')
        .add({
            Autor: email,
            Titulo: titulo,
            Descripción: descripción,
            Portada: "",
            FechaCreación: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleDateString(),
            borrador: false,
        })
        .then(function (docRef) {
            id = docRef.id;
        });

    return id;
}

export const publicarCapituloDelLibro = async (bookId, chapterId) => {
    await db.collection('libros').doc(bookId).collection("Capitulos").doc(chapterId)
        .update({
            borrador: true
        })
}

export const cambiarPortadadeLibro = async (id, image) => {
    await db.collection('libros').doc(id)
        .update({
            Portada: "" + image
        })
}

export const cambiarTitulo = async (bookId, titulo) => {
    await db.collection('libros').doc(bookId)
        .update({
            Titulo: "" + titulo,
        })
}

export const cambiarTituloCapitulo = async (bookId,chapterId, titulo) => {
    await db.collection('libros').doc(bookId).collection("Capitulos").doc(chapterId)
        .update({
            Titulo: "" + titulo,
        })
}

export const cambiarContenidoCapitulo = async (bookId,chapterId, contenido) => {
    await db.collection('libros').doc(bookId).collection("Capitulos").doc(chapterId)
        .update({
            Contenido: "" + contenido,
        })
}

export const cambiarDescripcion = async (bookId, descripcion) => {
    await db.collection('libros').doc(bookId)
        .update({
            Descripción: "" + descripcion,
        })
}

export const uploadCapitulo = async (bookId, numeroCapitulo, titulo, contenido, borrador) => {
    console.log(numeroCapitulo)
    await db.collection('libros').doc(bookId).collection('Capitulos')
        .add({
            Titulo: titulo,
            Contenido: contenido,
            FechaCreación: new Date(firebase.firestore.Timestamp.now().seconds * 1000).toLocaleDateString(),
            borrador: borrador,
            Numero: numeroCapitulo,
        })
}

export const mirarSiTieneOtrosCapitulos = async (bookId, titulo, contenido, borrador) => {
    let numberCapitulos = 0;
    await db.collection('libros').doc(bookId).collection('Capitulos').get().then(snap => {
        numberCapitulos = snap.size
    });
    await uploadCapitulo(bookId, numberCapitulos + 1, titulo, contenido, borrador);
}

export const contarCapitulosDelLibro = async (bookId) => {
    let numberCapitulos = 0;
    await db.collection('libros').doc(bookId).collection('Capitulos').get().then(snap => {
        numberCapitulos = snap.size
    });
    return numberCapitulos;
}

export const cargarBooksAutor = async (email) => {
    const books = [];
    const snapshot = await db.collection('libros').get();
    await snapshot.docs.map(async doc => {
        if (doc.data().Autor == email) {
            books.push({
                ...doc.data(),
                key: doc.id,
            });
        }
    });
    return books;
}
export const cargarBooks = async () => {
    const books = [];
    const snapshot = await db.collection('libros').get();
    await snapshot.docs.map(async doc => {
            books.push({
                ...doc.data(),
                key: doc.id,
            });
        
    });
    return books;
}

export const cargarCapitulosLibro = async (bookId) => {
    const caps = [];
    await db.collection("libros").doc(bookId).collection("Capitulos")
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach(documentSnapshot => {
                caps.push({
                    ...documentSnapshot.data(),
                    key: documentSnapshot.id,
                });

            })
            return caps;
        })

}

export const eliminarCapituloLibro = async (bookId, chapterId, n) => {
    console.log(n)
    /*Cambiar el numero de los anteriores */
    await db.collection("libros").doc(bookId).collection("Capitulos").where("Numero", ">", n)
        .onSnapshot(async querySnapshot => {
           await querySnapshot.forEach(async documentSnapshot => {
                await db.collection('libros').doc(bookId).collection("Capitulos").doc(documentSnapshot.id)
                    .update({
                        Numero: documentSnapshot.data().Numero - 1
                    })
            })
        })
    /*Eliminar el capitulo */
    await db.collection("libros").doc(bookId).collection("Capitulos").doc(chapterId).delete()

}