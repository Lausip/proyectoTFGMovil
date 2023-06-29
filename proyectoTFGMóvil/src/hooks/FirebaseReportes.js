import { getFirestore, Timestamp, getDoc, doc, deleteDoc, arrayUnion, arrayRemove, getDocs, collection, query, orderBy, addDoc, limit, updateDoc, where, startAfter, setDoc } from "firebase/firestore"
export const enviarReporteLibro = async (email, tipo, tipoMotivo, selectedOptionMini, motivo,idLibro) => {

    const db = getFirestore();
    const data = {
        Autor: email,
        Tipo: tipo,
        Motivo:tipoMotivo,
		FechaEnviado: Timestamp.fromDate(new Date()),
        Motivo2:selectedOptionMini,
        Texto:motivo,
        Libro:idLibro
    };
    const dbRef = await collection(db, "Reportes")
    await addDoc(dbRef, data)

}

export const enviarReporteComentario = async (email, tipo, tipoMotivo, selectedOptionMini, motivo,idLibro,idComentario,idCapitulo) => {

    const db = getFirestore();
    const data = {
        Autor: email,
        Tipo: tipo,
        Motivo:tipoMotivo,
        Motivo2:selectedOptionMini,
        Texto:motivo,
        Libro:idLibro,
	    Capitulo:idCapitulo,
		FechaEnviado: Timestamp.fromDate(new Date()),
        Comentario:idComentario
    };
    const dbRef = await collection(db, "Reportes")
    await addDoc(dbRef, data)

}
export const enviarReporteAutor = async (email, tipo, tipoMotivo, selectedOptionMini, motivo,autorElegido) => {

    const db = getFirestore();
    const data = {
        Autor: email,
        Tipo: tipo,
        Motivo:tipoMotivo,
        Motivo2:selectedOptionMini,
        Texto:motivo,
        AutorReportado:autorElegido,
		FechaEnviado: Timestamp.fromDate(new Date()),
  
    };
    const dbRef = await collection(db, "Reportes")
    await addDoc(dbRef, data)

}