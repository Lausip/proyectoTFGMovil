import { getStorage, ref, uploadBytes,getDownloadURL } from "firebase/storage";


export const crearLibroStorage = async (image, email, id) => {
    let urlPortada = "";
    let imageFile = await fetch(image)
    const imageBlob = await imageFile.blob();
    const storage = getStorage();
    const refi = ref(storage, `Portadas/${email}/${id}`);
    await uploadBytes(refi, imageBlob).then((snapshot) => {

    }
    ).then(async () => {
        await getDownloadURL(ref(storage, `Portadas/${email}/${id}`)).then((url) => {
            urlPortada = url;

        })
    })
    return urlPortada;
}

export const crearFotoPerfilStorage = async (image, email) => {

    let urlPerfil = "";
    let imageFile = await fetch(image)
    const imageBlob = await imageFile.blob();
    const storage = getStorage();
    const refi = ref(storage, `Perfil/${email}/Foto`);
    await uploadBytes(refi, imageBlob).then((snapshot) => {
 
    }
    ).then(async () => {
        await getDownloadURL(ref(storage, `Perfil/${email}/Foto`)).then((url) => {
            urlPerfil = url;
        })
    })
    return urlPerfil;
}