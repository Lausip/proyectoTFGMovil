
import { getFotoPerfil } from "./Auth/Firestore";

import { getFirestore, getDoc, doc, getDocs, Timestamp, collection, query, orderBy, addDoc, limit, updateDoc, where, onSnapshot  } from "firebase/firestore"

export const addSala = async (usuario1, usuario2, esAmigo) => {
    const db = getFirestore();
    const docRefCategorias = doc(db, "salas", usuario1 + "-" + usuario2);
    const dataCategorias = {
        Tiempo: Timestamp.fromDate(new Date()),
        Usuario1: usuario1,
        Usuario2: usuario2,
        Amigo: esAmigo,
        Bloqueado: false,
        Enviado: usuario1,
    };
    setDoc(docRefCategorias, dataCategorias)

}

export const existeSala = async (usuario1, usuario2) => {
    const db = getFirestore();
    let existe = false;


    const snap = await getDoc(doc(db, "salas", usuario1 + "-" + usuario2));
    if (snap.exists) {
        existe = true;
    }

    const snap2 = await getDoc(doc(db, "salas", usuario2 + "-" + usuario1));

    if (snap2.exists) {
        existe = true;
    }


    return existe;
}

export const updateAmigosSala = async (salaKey) => {
    const db = getFirestore();
    const docRefAmigo = doc(db, "salas", salaKey);
    const dataAmigo = { Amigo: true };
    updateDoc(docRefAmigo, dataAmigo)


}

export const getSalasDelEmail = async (email) => {

    const db = getFirestore();
    let salas = [];
    const snap = await getDocs(query(collection(db, "salas"), orderBy("Tiempo", "asc")));
    snap.docs.map((documentSnapshot) => {
        if (documentSnapshot.data().Usuario1 == email || documentSnapshot.data().Usuario2 == email) {
            salas.push({
                ...documentSnapshot.data(),
                key: documentSnapshot.id,
            });
        }
    })
    return salas;
}


export const getFotoPerfilConversaciones = async (salas, email) => {

    let salasss = []

    for (let i = 0, len = salas.length; i < len; i++) {

        if (salas[i].Usuario1 != email) {
            let foto = await getFotoPerfil(salas[i].Usuario1);
            salasss.push({ ...salas[i], FotoPerfil: foto });
        }

        else if (salas[i].Usuario2 != email) {
            let foto = await getFotoPerfil(salas[i].Usuario2);

            salasss.push({ ...salas[i], FotoPerfil: foto });
        }
    }

    return salasss;
}
export const getUltimoMensaje = async (salas,email) => {

    const db = getFirestore();
    let salasss = [];
    let i;

    for (i = 0; i < salas.length; i++) {
        console.log(salas[i].key)
        const snap = await getDocs(query(collection(db, "salas", salas[i].key, "mensajes"), orderBy("createdAt", "desc"), limit(1)));
        if (snap.docs.length == 0) {
            salasss.push({ ...salas[i], UltimoMensaje: "" });
        } else {
            snap.docs.map(async (documentSnapshot) => { 
                salasss.push({ ...salas[i], UltimoMensaje: documentSnapshot.data().texto });
            })
        }
    }
    return salasss;

}


export const cogerSala = async (usuarioa, usuariob) => {
    const db = getFirestore();
    let caps = {};
    const snap = await getDoc(doc(db, "salas", usuarioa + "-" + usuariob));
    caps = {
        ...snap.data(),
        key: snap.id,
    }

    return caps;
}

export const addMessage = async (salaId, message) => {
    const db = getFirestore();
    const dbRef = await collection(db, "salas", salaId, 'mensajes')
    await addDoc(dbRef, {
        _id: message._id,
        createdAt: message.createdAt,
        texto: message.text,
        usuario: message.user,
    })
    await updateTiempoSalas(salaId, message);
}

export const updateTiempoSalas = async (salaId, message) => {
    const db = getFirestore();
    const docRefAmigo = doc(db, "salas", salaId);
    updateDoc(docRefAmigo, {
        Tiempo: message.createdAt
    })
}
export const bloquearPersonaSala = async (salaId, bloqueado) => {
    const db = getFirestore();
    const docRefAmigo = doc(db, "salas", salaId);
    updateDoc(docRefAmigo, {
        Bloqueado: bloqueado
    })

}


export const getMessage = async (salaId) => {
    const db = getFirestore();
    const mensajes = [];
    const querySnapshot = query(collection(db, "salas", salaId, "mensajes"), orderBy("createdAt", "desc"), limit(4));
    await onSnapshot(querySnapshot, async (querySnapshot2) => {
        await querySnapshot2.forEach((doc) => {
        
            mensajes.push({
                _id: doc.data()._id,
                text: doc.data().texto,
                createdAt: doc.data().createdAt.toDate(),
                user:{
                    _id:doc.data().usuario._id,
                    avatar:doc.data().usuario.avatar,
                    name:doc.data().usuario.name,
                }

            });
           
        });
     
    })

  
    return mensajes;
}