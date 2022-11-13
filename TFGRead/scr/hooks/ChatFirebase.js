import { db} from '../config/firebase';
import { getFotoPerfil } from "./Auth/Firestore";




export const getSalas = async (email) => {

    let salas = [];
    await db.collection("salas")
        .onSnapshot(querySnapshot => {
            querySnapshot.forEach((documentSnapshot) => {
                if (documentSnapshot.data().Usuario1 == email || documentSnapshot.data().Usuario2 == email) {
                    salas.push({
                        ...documentSnapshot.data(),
                        key: documentSnapshot.id,

                    });
                }
            })
            return salas;
        })


}

export const getUltimoMensajeConversacion = async (salas) => {

    let salasss = []
    for (let i = 0, len = salas.length; i < len; i++) {
        await db.collection("salas").doc(salas[i].key).collection("mensajes").orderBy("FechaCreacion", "asc").limit(1).onSnapshot(async querySnapshot => {
            await querySnapshot.forEach(async (documentSnapshot) => {
                salasss.push({ Tiempo: salas[i].Tiempo, Usuario1: salas[i].Usuario1, Usuario2: salas[i].Usuario2, key: salas[i].key, FotoPerfil: salas[i].FotoPerfil, UltimoMensaje: documentSnapshot.data().Texto });

            });
        });

    }

    return salasss;
}

export const getFotoPerfilConversaciones = async (salas, email) => {

    let salasss = []
    for (let i = 0, len = salas.length; i < len; i++) {
        if (salas[i].Usuario1 != email) {
            let foto = await getFotoPerfil(salas[i].Usuario1);
            salasss.push({ Tiempo: salas[i].Tiempo, Usuario1: salas[i].Usuario1, Usuario2: salas[i].Usuario2, key: salas[i].key, FotoPerfil: foto });
        }

        else if (salas[i].Usuario2 != email) {
            let foto = await getFotoPerfil(salas[i].Usuario2);
            salasss.push({ Tiempo: salas[i].Tiempo, Usuario1: salas[i].Usuario1, Usuario2: salas[i].Usuario2, key: salas[i].key, FotoPerfil: foto });
        }
    }

    return salasss;
}



export const addMessage = async (salaId, message) => {
    await db.collection('salas').doc(salaId).collection('mensajes')
        .add({
            FechaCreacion: message.createdAt,
            Texto: message.text,
            Usuario: message.user,
        })
    await updateTiempoSalas(salaId, message);
}

export const updateTiempoSalas = async (salaId, message) => {
    await db.collection('salas').doc(salaId)
        .update({
            Tiempo: message.createdAt

        })
}

export const getMessage = async (salaId) => {

    let mensajes = [];
    await db.collection('salas').doc(salaId).collection("mensajes").orderBy("FechaCreacion", "desc")
        .onSnapshot(querySnapshot => {

            querySnapshot.forEach(documentSnapshot => {
                mensajes.push({
                    _id: documentSnapshot.id,
                    createdAt: documentSnapshot.data().FechaCreacion.toDate(),
                    text: documentSnapshot.data().Texto,
                    user: documentSnapshot.data().Usuario,
                    key: documentSnapshot.id,

                });

            })

        });
    return mensajes;



}