import { db, firebase } from '../config/firebase';


export const getCategorias = async () => {
    const categorias = [];
    const snapshot = await db.collection('categorías').get();
    await snapshot.docs.map(async doc => {

        categorias.push({
            label: doc.data().Nombre,
            value: doc.data().Nombre,
            color: doc.data().Color,
        });

    });
    return categorias;
}

