import { getFirestore, getDoc, doc, getDocs, collection, query, orderBy, onSnapshot, limit, updateDoc, where, startAfter } from "firebase/firestore"



export const getCategorias = async () => {
    const db = getFirestore();
    let categorias = [];
    const snap = await getDocs(collection(db, "categorías"));
    categorias = await Promise.all(snap.docs.map(async (documentSnapshot) => ({
        label: documentSnapshot.data().Nombre,
        value: documentSnapshot.data().Nombre,
        color: documentSnapshot.data().Color,
    })))

    return categorias;
}

